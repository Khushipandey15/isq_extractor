/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // Trust-building blue - blue-600
        'secondary': '#64748B', // Sophisticated slate - slate-500
        'accent': '#0EA5E9', // Lighter blue variant - sky-500
        
        // Background Colors
        'background': '#FFFFFF', // Pure white foundation - white
        'surface': '#F8FAFC', // Subtle off-white - slate-50
        
        // Text Colors
        'text-primary': '#0F172A', // Near-black with blue undertone - slate-900
        'text-secondary': '#475569', // Medium gray - slate-600
        
        // Status Colors
        'success': '#059669', // Professional green - emerald-600
        'warning': '#D97706', // Amber for attention - amber-600
        'error': '#DC2626', // Clear red for errors - red-600
        
        // Border Colors
        'border': '#E2E8F0', // Neutral gray border - slate-200
        'border-accent': '#2563EB', // Primary blue for active states - blue-600
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'], // Modern sans-serif for headings
        'body': ['Inter', 'system-ui', 'sans-serif'], // Consistent font family for body
        'caption': ['Inter', 'system-ui', 'sans-serif'], // Maintaining consistency for captions
        'data': ['JetBrains Mono', 'Consolas', 'monospace'], // Monospace for data tables
      },
      fontWeight: {
        'heading-regular': '400',
        'heading-medium': '500',
        'heading-semibold': '600',
        'body-regular': '400',
        'body-medium': '500',
        'data-regular': '400',
      },
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem', // 352px
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 200ms ease-out',
        'slide-down': 'slideDown 300ms ease-in-out',
        'fade-in': 'fadeIn 150ms ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      zIndex: {
        'header': '1000',
        'dropdown': '1100',
        'sidebar': '1200',
        'modal': '1300',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}