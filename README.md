# Aura — Personal AI Wardrobe & Virtual Styling Assistant

Aura is a student-project MVP for a personal wardrobe system: the user stores real clothing, shoes, bags, and jewellery; receives complete occasion-aware looks; gives feedback; and previews the selected look on a non-photorealistic, stylised 3D fashion-game avatar.

## Included now

- React/Vite fashion UI with AI Stylist, Wardrobe, Avatar, and Style DNA pages
- Editable in-browser wardrobe and three complete outfit recommendations
- Feedback-aware preference demo
- Interactive Three.js blocky fashion avatar (rotate/zoom, outfit colour and bag/jewellery changes)
- Express API starter with wardrobe, feedback, health, and recommendation routes
- FastAPI starter with style-request parsing and clothing-analysis endpoints

## Run the frontend demo

```powershell
cd client
npm install
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`). The React demo deliberately uses seed wardrobe data while the API/database integration is completed.

## Run the API

```powershell
cd server
Copy-Item .env.example .env
npm install
npm run dev
```

## Run the AI service

Install Python 3.11+ first, then:

```powershell
py -m pip install -r ai-service/requirements.txt
py -m uvicorn main:app --reload --app-dir ai-service
```

## Production implementation sequence

1. Add MongoDB Atlas credentials to `server/.env` and replace the temporary in-memory `wardrobe` array with Mongoose models.
2. Add Cloudinary signed upload support and store `imageUrl` per wardrobe item.
3. Call FastAPI after upload; show its attributes as editable suggestions.
4. Extract recommendation scoring into `server/src/services/recommendationService.js` and persist feedback/style scores.
5. Replace geometric avatar meshes with original or properly licensed modular GLB assets. Map each wardrobe item to an `avatarAssetKey`.
6. Add animation clips and planner/weather only after the core loop is stable.

## Explicit MVP limitation

The avatar is intentionally an original geometric, stylised placeholder—not a copy of the provided Roblox-like reference and not a realistic person. The real wardrobe is represented through structured item metadata and modular virtual assets, rather than pixel-perfect garment reconstruction.
