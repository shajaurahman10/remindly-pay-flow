
import type { Config } from "tailwindcss";

export default {
	darkMode: 'class',
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#8B5CF6',
					foreground: '#FFFFFF',
					50: '#F3F0FF',
					100: '#E9E2FF',
					500: '#8B5CF6',
					600: '#7C3AED',
					700: '#6D28D9',
				},
				secondary: {
					DEFAULT: '#1F2937',
					foreground: '#F9FAFB'
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#374151',
					foreground: '#D1D5DB'
				},
				accent: {
					DEFAULT: '#4F46E5',
					foreground: '#FFFFFF'
				},
				popover: {
					DEFAULT: '#1F2937',
					foreground: '#F9FAFB'
				},
				card: {
					DEFAULT: '#1F2937',
					foreground: '#F9FAFB'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'sans': ['Inter', 'system-ui', 'sans-serif'],
				'display': ['Poppins', 'system-ui', 'sans-serif'],
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
