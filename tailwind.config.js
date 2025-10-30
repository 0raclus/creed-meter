/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        akide: '#8B5CF6',
        fiqh_usul: '#3B82F6',
        fiqh_amel: '#10B981',
        tasavvuf: '#F59E0B',
        siyaset: '#EF4444',
        modernite: '#6366F1',
      }
    },
  },
  plugins: [],
}

