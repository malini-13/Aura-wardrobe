import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import './styles.css';
import './mvp.css';

const API_URL = 'http://localhost:5000/api';

function avatarColors(item) {
  const details = `${item?.color || ''} ${(item?.tags || []).join(' ')}`.toLowerCase();
  const top = details.includes('white') ? '#f6f0ea' : details.includes('black') ? '#242328' : details.includes('blue') ? '#55738e' : details.includes('pink') ? '#d78aa8' : details.includes('green') ? '#738b72' : details.includes('beige') ? '#cfb89b' : '#e8d7c3';
  const bottom = details.includes('jeans') || details.includes('blue') ? '#55738e' : details.includes('formal') || details.includes('black') ? '#29272e' : '#596f83';
  return { top, bottom };
}

function Avatar({ item }) {
  const { top, bottom } = avatarColors(item);
  return <Canvas camera={{ position: [0, 1.7, 5], fov: 40 }}>
    <color attach="background" args={['#272247']} /><ambientLight intensity={1.7} /><directionalLight position={[3, 5, 4]} intensity={2} /><Environment preset="city" />
    <Float speed={1.5} rotationIntensity={.14} floatIntensity={.32}><group position={[0, -1.6, 0]}>
      <mesh position={[0, 3.05, 0]}><sphereGeometry args={[.58, 32, 32]} /><meshStandardMaterial color="#bb6d3e" /></mesh>
      <mesh position={[0, 3.65, 0]}><sphereGeometry args={[.64, 16, 16, 0, Math.PI * 2, 0, 1.6]} /><meshStandardMaterial color="#4c2c23" roughness={.8} /></mesh>
      <mesh position={[0, 2.35, 0]}><boxGeometry args={[1.35, 1.35, .55]} /><meshStandardMaterial color={top} /></mesh>
      <mesh position={[-.38, 1.1, 0]}><boxGeometry args={[.58, 1.2, .58]} /><meshStandardMaterial color={bottom} /></mesh>
      <mesh position={[.38, 1.1, 0]}><boxGeometry args={[.58, 1.2, .58]} /><meshStandardMaterial color={bottom} /></mesh>
      <mesh position={[-.38, .38, .05]}><boxGeometry args={[.65, .22, .75]} /><meshStandardMaterial color="#fffdf7" /></mesh>
      <mesh position={[.38, .38, .05]}><boxGeometry args={[.65, .22, .75]} /><meshStandardMaterial color="#fffdf7" /></mesh>
      <mesh position={[-1.02, 2.35, 0]} rotation={[0, 0, .15]}><boxGeometry args={[.42, 1.25, .42]} /><meshStandardMaterial color="#bb6d3e" /></mesh>
      <mesh position={[1.02, 2.35, 0]} rotation={[0, 0, -.15]}><boxGeometry args={[.42, 1.25, .42]} /><meshStandardMaterial color="#bb6d3e" /></mesh>
    </group></Float><OrbitControls enablePan={false} minDistance={3.5} maxDistance={7} />
  </Canvas>;
}

function App() {
  const [page, setPage] = useState('stylist');
  const [items, setItems] = useState([]);
  const [occasion, setOccasion] = useState('presentation');
  const [request, setRequest] = useState('I want to look professional but still comfortable.');
  const [looks, setLooks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadWardrobe = async () => {
    setLoading(true); setError('');
    try {
      const response = await fetch(`${API_URL}/wardrobe`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load your wardrobe.');
      setItems(data);
      if (!selected && data.length) setSelected(data[0]);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { loadWardrobe(); }, []);

  const recommend = async () => {
    setError(''); setMessage('');
    try {
      const response = await fetch(`${API_URL}/stylist/recommend`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion, request }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create recommendations.');
      setLooks(data.looks); setMessage(data.message);
      if (data.looks[0]) setSelected(data.looks[0].item);
    } catch (err) { setError(err.message); }
  };

  const addItem = async (event) => {
    event.preventDefault(); setError('');
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get('name'), category: form.get('category'), color: form.get('color'), imageUrl: form.get('imageUrl'),
      tags: form.get('tags').split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean),
    };
    try {
      const response = await fetch(`${API_URL}/wardrobe`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not add this outfit.');
      setItems((current) => [data, ...current]); event.currentTarget.reset();
    } catch (err) { setError(err.message); }
  };

  return <div className="app"><aside><div className="brand"><span>✦</span> AURA</div><p>YOUR PERSONAL<br />STYLE UNIVERSE</p>{[['stylist', '✦', 'AI Stylist'], ['wardrobe', '◫', 'My Wardrobe'], ['avatar', '♙', 'My Avatar'], ['style', '♡', 'My Style']].map(([id, icon, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}><i>{icon}</i>{label}</button>)}<div className="side-footer">WARDROBE MVP<br /><small>Real clothes. Your style.</small></div></aside><main>
    {error && <div className="notice error">{error}</div>}
    {page === 'stylist' && <><header><span>AI STYLIST / TODAY</span><h1>What are you <em>dressing</em> for?</h1><p>Recommendations use only outfits stored in your personal wardrobe.</p></header><section className="stylist-grid"><div className="prompt-card"><label>OCCASION</label><select value={occasion} onChange={(event) => setOccasion(event.target.value)}>{['presentation', 'college', 'party', 'casual', 'formal', 'day', 'evening'].map((value) => <option key={value}>{value}</option>)}</select><label>YOUR REQUEST</label><textarea value={request} onChange={(event) => setRequest(event.target.value)} /><button className="primary" onClick={recommend}>Create my looks <span>→</span></button></div><div className="avatar-card"><div className="avatar-label">LIVE OUTFIT PREVIEW <span>●</span></div><Avatar item={selected} /><div className="avatar-hint">Drag to rotate your fashion avatar</div></div></section>
      {looks.length > 0 && <section className="looks"><div className="section-head"><div><span>{message}</span><h2>Your wardrobe matches</h2></div><button onClick={recommend}>↻ Refresh looks</button></div><div className="look-grid">{looks.map((look) => <article className={selected?._id === look.item._id ? 'chosen' : ''} key={look.item._id} onClick={() => setSelected(look.item)}>{look.item.imageUrl && <img className="outfit-image" src={look.item.imageUrl} alt={look.item.name} />}<span>{look.label} · {look.title}</span><h3>{look.item.name}</h3><p>Tags: {(look.item.tags || []).join(', ') || 'none'}</p><div className="actions"><button onClick={(event) => { event.stopPropagation(); setSelected(look.item); }}>Preview on avatar</button></div></article>)}</div></section>}</>}
    {page === 'wardrobe' && <section className="page"><span>YOUR REAL WARDROBE</span><h1>My wardrobe</h1><p>Add individual Cloudinary image URLs here, or use the seven-outfit seed file for a faster initial setup.</p><form className="add-form wardrobe-form" onSubmit={addItem}><input required name="name" placeholder="Outfit name" /><select name="category"><option value="outfit">Outfit</option><option value="dress">Dress</option><option value="ethnic wear">Ethnic wear</option></select><input required name="color" placeholder="Colour, e.g. black" /><input required name="tags" placeholder="Tags, e.g. college, casual, day" /><input required name="imageUrl" type="url" placeholder="Your Cloudinary image URL" /><button className="primary">Add outfit</button></form>{loading ? <p>Loading your wardrobe…</p> : <div className="wardrobe-grid">{items.map((item) => <article key={item._id} onClick={() => setSelected(item)}>{item.imageUrl ? <img className="wardrobe-image" src={item.imageUrl} alt={item.name} /> : <div className="swatch" style={{ background: item.color }} />}<small>{item.category.toUpperCase()}</small><h3>{item.name}</h3><p>{item.color} · {(item.tags || []).join(', ')}</p></article>)}</div>}{!loading && !items.length && <p>No outfits yet. Paste your Cloudinary URLs into the seed file, seed MongoDB, then reload this page.</p>}</section>}
    {page === 'avatar' && <section className="page avatar-page"><span>YOUR VIRTUAL FASHION CHARACTER</span><h1>My avatar</h1><div className="large-avatar"><Avatar item={selected} /></div><p>{selected ? `${selected.name} is shown as a simple ${selected.color || 'neutral'} outfit approximation. Your Cloudinary photo remains the source of truth.` : 'Select a recommended or wardrobe outfit to preview its simple colour approximation.'}</p></section>}
    {page === 'style' && <section className="page"><span>CORE MVP</span><h1>My style</h1><p className="insight">Aura currently matches your own outfit tags—such as college, casual, formal, party, day, and evening—to your request. Personalisation and AI learning are intentionally outside this simple core version.</p></section>}
    <footer>Made by Malini</footer>
  </main></div>;
}

createRoot(document.getElementById('root')).render(<App />);
