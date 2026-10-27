import{defineConfig}from'vite';import react from'@vitejs/plugin-react';import tailwindcss from'@tailwindcss/vite';import{fileURLToPath}from'node:url';
export default defineConfig({base:'/demos/procurement-agent/',plugins:[react(),tailwindcss()],resolve:{alias:{'@':fileURLToPath(new URL('./src/product',import.meta.url))}},build:{outDir:'../../public/demos/procurement-agent',emptyOutDir:true}});
