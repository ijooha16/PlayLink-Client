import { bg } from 'date-fns/locale';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shares/**/*.{js,ts,jsa,tsx,mdx}',
    './src/features/**/*.{js,ts,jsa,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        'title-1': ['24px', { lineHeight: '130%', letterSpacing: '-2%', fontWeight: '700' }],
        'title-2': ['20px', { lineHeight: '140%', letterSpacing: '-2%', fontWeight: '700' }],
        'title-3': ['18px', { lineHeight: '140%', letterSpacing: '-2%', fontWeight: '700' }],
        'title-4': ['16px', { lineHeight: '140%', letterSpacing: '-2%', fontWeight: '600' }],
        'body-1': ['20px', { lineHeight: '140%', letterSpacing: '-2.5%', fontWeight: '400' }],
        'body-2': ['16px', { lineHeight: '140%', letterSpacing: '-2.5%', fontWeight: '400' }],
        'body-3': ['16px', { lineHeight: '140%', letterSpacing: '-2.5%', fontWeight: '500' }],
        'body-4': ['14px', { lineHeight: '150%', letterSpacing: '-3%', fontWeight: '400' }],
        'body-5': ['14px', { lineHeight: '140%', letterSpacing: '-3%', fontWeight: '600' }],
        'sub': ['13px', { lineHeight: '130%', letterSpacing: '-3%', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '130%', letterSpacing: '-3%', fontWeight: '500' }],
      },
      keyframes: {
        fadeInBottom: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInTop: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeOutRight: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(30px)' },
        },
        fadeOutLeft: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-30px)' },
        },
      },
      animation: {
        fadeInOnce: 'fadeInBottom 0.5s ease-out forwards',
        'fade-in-top': 'fadeInTop 0.7s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.4s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.4s ease-out forwards',
        'fade-out-right': 'fadeOutRight 0.4s ease-in forwards',
        'fade-out-left': 'fadeOutLeft 0.4s ease-in forwards',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        black: 'var(--color-black)',
        white: 'var(--color-white)',
        red: 'var(--color-red)',
        green: 'var(--color-green)',

        primary: 'var(--color-primary)',
        sub01: 'var(--color-sub-01)',
        sub02: 'var(--color-sub-02)',

        bg01: 'var(--color-bg-sel)',

        grey01: 'var(--color-grey-01)',
        grey02: 'var(--color-grey-02)',
        grey03: 'var(--color-grey-03)',
        grey04: 'var(--color-grey-04)',
        grey05: 'var(--color-grey-05)',

        toast: 'var(--color-toast)',
      },
    },
  },
  plugins: [],
};
export default config;
