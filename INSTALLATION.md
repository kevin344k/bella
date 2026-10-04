Installation & Run (Prototype)

1. Install dependencies

   npm install

   (If you prefer yarn: yarn)

2. Run development server

   npm run dev

3. Replace placeholder assets in /public

   - public/model-natural.jpg -> natural model image
   - public/model-makeup.jpg -> makeup version (must be same crop/size as natural)
   - sample-catalog.pdf -> place a PDF to test the PDF viewer
   - furniture images: public/furn-1.jpg, furn-2.jpg, etc.
   - brand logos: public/brands/yanbal.svg, public/brands/cyzone.svg, public/brands/avon.svg

4. Install optional extras used in the spec

   - shadcn/ui: follow https://ui.shadcn.com/docs/primitives/installation
   - react-pdf: already in dependencies; if errors, ensure PDF.js worker path is available
   - Swiper: included; import CSS in components as needed
   - Zustand, React Query: included in package.json

Notes
- Update PHONE constant in components/WhatsAppButton.tsx to your number with country code.
- This prototype focuses on UI/UX building blocks (Hero effect, PDF viewer stub, showroom carousel, WhatsApp button). Further work required for a production-ready backend, authentication, analytics, image optimization pipeline, and accessibility tuning.
