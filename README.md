# Aura — Personal AI Wardrobe & Virtual Styling Assistant

Aura is a student-project MVP for a personal wardrobe system: the user stores real clothing, shoes, bags, and jewellery; receives complete occasion-aware looks; gives feedback; and previews the selected look on a non-photorealistic, stylised 3D fashion-game avatar.

## Included now

- MongoDB-backed wardrobe items with actual Cloudinary image URLs
- Deterministic tag matching for college, formal, party, casual, presentation, day, and evening requests
- React/Vite AI Stylist, Wardrobe, Avatar, and My Style pages
- Interactive Three.js blocky fashion avatar with simple outfit-colour approximation
- Editable seven-outfit seed configuration and a safe upsert seed command

## Add your seven real Cloudinary outfits

1. Open [server/src/data/wardrobeSeed.js](server/src/data/wardrobeSeed.js).
2. Replace each `PASTE_CLOUDINARY_URL_*_HERE` value with one of your real Cloudinary image URLs.
3. Edit each outfit's `name`, `color`, and `tags`. Tags are lowercase words such as `college`, `casual`, `formal`, `party`, `presentation`, `day`, and `evening`.
4. Run the seed command. It refuses to write anything until all seven URLs are real HTTP(S) URLs.

```powershell
cd server
npm run seed:wardrobe
```

## Run the frontend demo

```powershell
cd client
npm install
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`). The frontend reads the wardrobe and recommendations from the Express API at `http://localhost:5000`.

## Run the API

```powershell
cd server
npm install
npm run dev
```

## Explicit MVP limitation

The avatar is intentionally an original geometric, stylised placeholder—not a copy of the provided Roblox-like reference and not a realistic person. It is a colour/category approximation only. Your Cloudinary outfit image is the source of truth.
