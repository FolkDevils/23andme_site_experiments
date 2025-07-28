/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			rialta: [
  				'Rialta',
  				'sans-serif'
  			]
  		},
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			'brand-red': 'var(--color-brand-red)',
  			'brand-orange': 'var(--color-brand-orange)',
  			'text-primary': 'var(--color-text-primary)',
  			'text-secondary': 'var(--color-text-secondary)',
  			'text-muted': 'var(--color-text-muted)',
  			'background-light': 'var(--color-background-light)',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontSize: {
        'button-text': [`var(--font-size-button-text-desktop)`, { lineHeight: `var(--line-height-button-text)` }],
        'body-copy': [`var(--font-size-body-copy)`, { lineHeight: `var(--line-height-body-copy)` }],
        'caption-text': [`var(--font-size-caption-text)`, { lineHeight: `var(--line-height-caption-text)` }],
        'card-eyebrow': [`var(--font-size-card-eyebrow)`, { lineHeight: `var(--line-height-card-eyebrow)` }],
        'card-header': [`var(--font-size-card-header)`, { lineHeight: `var(--line-height-card-header)` }],
        'eyebrow-text': [`var(--font-size-eyebrow-text)`, { lineHeight: `var(--line-height-eyebrow-text)` }],
        'heading-1': [`var(--font-size-heading-1)`, { lineHeight: `var(--line-height-heading-1)` }],
        'price-text': [`var(--font-size-price-text)`, { lineHeight: `var(--line-height-price-text)` }],
        'price-small': [`var(--font-size-price-small)`, { lineHeight: `var(--line-height-price-small)` }],
        'totalhealth-text': [`var(--font-size-totalhealth-text)`, { lineHeight: `var(--line-height-totalhealth-text)` }],
      },
  		spacing: {
  			'4.5': '1.125rem'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    plugin(function({ addBase, theme }) {
      addBase({
        ':root': {
          '--color-primary': '#D50F67',
          '--color-brand-red': '#D12F11',
          '--color-brand-orange': '#FF6D19',
          '--color-text-primary': '#282828',
          '--color-text-secondary': '#555555',
          '--color-text-muted': '#939393',
          '--color-background-light': '#f2f5f7',
        }
      })
    }),
    plugin(function({ addUtilities }) {
      addUtilities({
        '.text-hero-header': {
          'font-size': 'var(--font-size-hero-header-mobile, 2.5rem)',
          'line-height': 'var(--line-height-hero-header, 1)',
          '@media (min-width: 768px)': {
            'font-size': 'var(--font-size-hero-header-tablet, 3.75rem)',
          },
          '@media (min-width: 1024px)': {
            'font-size': 'var(--font-size-hero-header-desktop, 5rem)',
          },
        },
        '.text-hero-pills': {
          'font-size': 'var(--font-size-hero-pills-mobile, 1.875rem)',
          'line-height': 'var(--line-height-hero-pills, 1)',
          '@media (min-width: 768px)': {
            'font-size': 'var(--font-size-hero-pills-tablet, 2.8125rem)',
          },
          '@media (min-width: 1024px)': {
            'font-size': 'var(--font-size-hero-pills-desktop, 3.75rem)',
          },
        },
        '.text-kit-header': {
          'font-size': 'var(--font-size-kit-header-mobile, 1.5rem)',
          'line-height': 'var(--line-height-kit-header, 1.1)',
          '@media (min-width: 768px)': {
            'font-size': 'var(--font-size-kit-header-tablet, 1.875rem)',
          },
          '@media (min-width: 1024px)': {
            'font-size': 'var(--font-size-kit-header-desktop, 2.25rem)',
          },
        },
        '.text-kit-pills': {
          'font-size': 'var(--font-size-kit-pills-mobile, 1.2rem)',
          'line-height': 'var(--line-height-kit-pills, 1)',
          '@media (min-width: 768px)': {
            'font-size': 'var(--font-size-kit-pills-tablet, 1.375rem)',
          },
          '@media (min-width: 1024px)': {
            'font-size': 'var(--font-size-kit-pills-desktop, 1.75rem)',
          },
        },
        '.text-quote-text': {
          'font-size': 'var(--font-size-quote-text-mobile, 1.5rem)',
          'line-height': 'var(--line-height-quote-text, 1.2)',
          '@media (min-width: 768px)': {
            'font-size': 'var(--font-size-quote-text-tablet, 2rem)',
          },
          '@media (min-width: 1024px)': {
            'font-size': 'var(--font-size-quote-text-desktop, 2.5rem)',
          },
        },
        '.text-story-link': {
          'font-size': 'var(--font-size-story-link-mobile, 0.875rem)',
          'line-height': 'var(--line-height-story-link, 1.5)',
          '@media (min-width: 768px)': {
            'font-size': 'var(--font-size-story-link-tablet, 0.9375rem)',
          },
          '@media (min-width: 1024px)': {
            'font-size': 'var(--font-size-story-link-desktop, 1rem)',
          },
        },
        '.text-button-text': {
          'font-size': 'var(--font-size-button-text-mobile)',
          'line-height': 'var(--line-height-button-text)',
          '@media (min-width: 768px)': {
            'font-size': 'var(--font-size-button-text-tablet)',
          },
          '@media (min-width: 1024px)': {
            'font-size': 'var(--font-size-button-text-desktop)',
          },
        },
      })
    }),
    require("tailwindcss-animate")
],
} 