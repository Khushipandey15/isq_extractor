// src/services/geminiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initializes the Gemini client with the API key from environment variables.
 * @returns {GoogleGenerativeAI} Configured Gemini client instance.
 */
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Analyzes a CSV dataset to extract ISQs using Gemini AI.
 * @param {string} mcatName - The MCAT category name to analyze.
 * @param {File} file - The CSV file to analyze.
 * @param {string} datasetType - The type of dataset (for metric type determination).
 * @returns {Promise<Object>} The analysis results.
 */
export const analyzeDataset = async (mcatName, file, datasetType) => {
  try {
    // Convert file to text
    const text = await file.text();
    
    // Build the prompt
    const prompt = `Analyze the provided CSV dataset to extract the most important specifications (ISQs) and their options specifically relevant to ${mcatName}. Perform the following steps carefully to ensure accuracy:

Filter specifications and options:

Include only specifications relevant to ${mcatName}.

Exclude any specification names or options that contain ${mcatName} as a whole word or substring.

Remove generic or irrelevant specifications not specifically related to ${mcatName}.

Merge similar entries:

Consolidate semantically similar specification names (e.g., slight spelling differences, spacing, abbreviations) into a single unified specification.

Similarly, merge semantically similar options under each specification.

Count aggregation:

Calculate the total pageviews (if ${datasetType} is 'internal-search') or total occurrences (if otherwise) at the specification level only — do not show counts at the option level except within parentheses next to each option for clarity.

Sum the counts correctly after merging similar specifications and options.

Select options:

For each specification, select and show only the top 2 to 8 options ranked by their individual pageviews or occurrences in descending order.

Display option counts in brackets next to each option (e.g., 10 KVA [33]).

Output format:

Return a ranked table sorted by the specification-level total pageviews or occurrences in descending order.

The table columns must be:
Rank | Specification | Options (with counts) | Specification Pageviews/Occurrences

Completeness:

Include all important specifications that are relevant for a B2B marketplace context and appear in the dataset.

Do not limit the output to only the top 10 specifications — include all that are significant.

Example output structure:

Rank	Specification	Options	Specification Pageviews/Occurrences
1	Power Output	10 KVA [33], 12 KVA [22], 15 KVA [10]	65
2	Voltage Range	110V [45], 220V [30]	75
...	...	...	...

Important notes:

No specification or option should contain the term ${mcatName} or any part of it.

Ensure that all similar specifications and options are merged accurately to avoid duplicate counting.

Show specification-level totals only, options with individual counts only in parentheses for reference.

Make sure options count per specification is between 2 to 8 options, ordered by counts descending.

The rank is based on the total pageviews/occurrences at the specification level.

`;
    
    // Generate content with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Parse the response text to extract ISQs
    const isqs = parseIsqsFromResponse(responseText, datasetType === 'internal-search' ? 'pageviews' : 'occurrences');
    
    // Count the total rows in the CSV (excluding header)
    const totalRows = text.split('\n').length - 1;
    
    return {
      fileName: file.name,
      totalRows,
      topISQs: isqs,
      analysisTimestamp: new Date().toISOString(),
      mcatName,
      metricType: datasetType === 'internal-search' ? 'pageviews' : 'occurrences'
    };
  } catch (error) {
    console.error('Error analyzing dataset with Gemini:', error);
    throw new Error(`Failed to analyze dataset: ${error.message}`);
  }
};

/**
 * Performs triangulation analysis across multiple datasets.
 * @param {Array} datasets - Array of dataset results to triangulate.
 * @param {string} mcatName - The MCAT category name.
 * @returns {Promise<Object>} The triangulation results.
 */
export const triangulateDatasets = async (datasets, mcatName) => {
  try {
    // Prepare datasets for triangulation
    const datasetsInput = datasets.map(dataset => {
      return {
        datasetName: dataset.fileName,
        isqs: dataset.topISQs,
        metricType: dataset.metricType,
        totalRows: dataset.totalRows
      };
    });
    
    // Store the outputs of all datasets to send to Gemini for triangulation
    const allDatasetOutputs = datasetsInput.map(dataset => {
      return {
        datasetName: dataset.datasetName,
        specifications: dataset.isqs.map(isq => ({
          specification: isq.specification,
          option: isq.option,
          metric: isq.metric
        }))
      };
    });
    
    // Build the triangulation prompt with a structured format request
    const prompt = `You are a data triangulation expert analyzing specifications for ${mcatName}. 

I have data from ${datasets.length} different sources. Review all this data and identify the most important specifications based on frequency and relevance.

Datasets: ${JSON.stringify(allDatasetOutputs)}

For the triangulation, give me results and top specifications that came from these datasets. Don't give the dataset itself in your response.
Merge Semantically same Specification options and name. Duplicate Specifications name should not be there. Atleast 2 options should be there to display any specification important and Specification name and Specification options should not be same or contain same words as in ${mcatName}.
Your output MUST be formatted as follows in a table:

Specification Name | Top Options (based on data) | Why it matters in the market | Impacts Pricing?

For example:
Material | Aluminium, Wood, PVC, Laminate, Acrylic | Buyers consider durability, maintenance, and aesthetics | ✅ Yes
Appearance / Style | Modern, Italian, Contemporary | Reflects taste, lifestyle, and is often a dealbreaker | ✅ Yes
Kitchen Layout / Dimensions | L-shape, 10x10, 12x8, 8x5 | Needed for space planning and manufacturing customization | ✅ Yes
If no spec is important show "No Important Spec". Show Top specifications from Rank 1 only don't leave any row blank.
Identify 3-5 of the most important specifications that appear consistently across datasets. For each specification:
1. List the top 3-5 options (based on frequency in the data)
2. Explain why this specification matters in the market
3. Indicate whether it impacts pricing (Yes/No)`;

    
    // Generate content with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Parse the triangulation response
    const triangulatedResults = parseTriangulationResponse(responseText);
    
    return {
      triangulatedISQs: triangulatedResults,
      datasetsUsed: datasets.length,
      analysisTimestamp: new Date().toISOString(),
      mcatName,
      totalCombinedRows: datasets.reduce((sum, dataset) => sum + dataset.totalRows, 0)
    };
  } catch (error) {
    console.error('Error triangulating datasets with Gemini:', error);
    throw new Error(`Failed to triangulate datasets: ${error.message}`);
  }
};

/**
 * Parses ISQs from the Gemini response text.
 * @param {string} responseText - The raw response from Gemini.
 * @param {string} metricType - Whether to use 'pageviews' or 'occurrences' as metric.
 * @returns {Array} Parsed ISQs.
 */
const parseIsqsFromResponse = (responseText, metricType) => {
  try {
    // This is a simplified parser - in production, you'd want a more robust solution
    // that handles various response formats from Gemini
    const lines = responseText.split('\n').filter(line => line.trim());
    
    // Find where the table starts (after headers)
    let tableStartIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('Rank') && 
          lines[i].includes('Specification') && 
          lines[i].includes('Option')) {
        tableStartIndex = i + 1;
        break;
      }
    }
    
    if (tableStartIndex === -1) {
      // Fall back to looking for pipe characters
      tableStartIndex = lines.findIndex(line => line.includes('|')) + 1;
    }
    
    // If we still can't find it, or if it's the last line, return empty array
    if (tableStartIndex === -1 || tableStartIndex >= lines.length) {
      return [];
    }
    
    const isqs = [];
    for (let i = tableStartIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#') || !line.includes('|')) continue;
      
      // Split by pipe and trim each cell
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      
      if (cells.length >= 4) {
        const rank = parseInt(cells[0], 10) || (isqs.length + 1);
        const specification = cells[1];
        const option = cells[2];
        const metric = parseInt(cells[3].replace(/[^0-9]/g, ''), 10) || 0;
        
        isqs.push({
          rank,
          specification,
          option,
          metric
        });
      }
    }
    
    // Sort by metric value in descending order and limit to top 10
    return isqs
      .sort((a, b) => b.metric - a.metric)
      .slice(0, 10)
      .map((isq, index) => ({ ...isq, rank: index + 1 }));
  } catch (error) {
    console.error('Error parsing ISQs from response:', error);
    return [];
  }
};

/**
 * Parses triangulated results from the Gemini response.
 * @param {string} responseText - The raw triangulation response from Gemini.
 * @returns {Array} Parsed triangulated ISQs.
 */
const parseTriangulationResponse = (responseText) => {
  try {
    const lines = responseText.split('\n').filter(line => line.trim());
    
    // Find table headers
    const headerIndex = lines.findIndex(line => 
      line.includes('Specification Name') && 
      line.includes('Top Options') && 
      line.includes('Why it matters') && 
      line.includes('Impacts Pricing')
    );
    
    if (headerIndex === -1) {
      console.warn('Could not find table headers in the response');
      return createDefaultTriangulationResults();
    }
    
    const results = [];
    let rank = 1;
    
    // Process each row after the header
    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || !line.includes('|')) continue;
      
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      if (cells.length < 3) continue;
      
      const specName = cells[0];
      const topOptions = cells[1];
      const marketRelevance = cells.length > 2 ? cells[2] : '';
      const impactsPricing = cells.length > 3 ? cells[3] : '';
      
      // Calculate weighted score based on rank (higher ranks = higher scores)
      const weightedScore = Math.max(100 - (rank - 1) * 5, 60);
      
      results.push({
        rank,
        specification: specName,
        option: topOptions,
        marketRelevance,
        impactsPricing,
        weightedScore
      });
      
      rank++;
    }
    
    // If we couldn't parse any results, return default ones
    if (results.length === 0) {
      return createDefaultTriangulationResults();
    }
    
    return results;
  } catch (error) {
    console.error('Error parsing triangulation response:', error);
    return createDefaultTriangulationResults();
  }
};

/**
 * Creates default triangulation results when parsing fails.
 * @returns {Array} Default triangulation results.
 */
const createDefaultTriangulationResults = () => {
  return [{
    rank: 1,
    specification: 'Error processing triangulation results',
    option: 'N/A',
    marketRelevance: 'Could not determine',
    impactsPricing: 'Unknown',
    weightedScore: 100
  }];
};

export default {
  analyzeDataset,
  triangulateDatasets
};