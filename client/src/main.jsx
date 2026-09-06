import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import auraLogo from './assets/aura-logo.svg';
import './styles.css';
import './mvp.css';
import './logo.css';
import './avatar.css';

const API_URL = 'http://localhost:5000/api';

function Avatar({ item }) {
  const category = (item?.category || 'outfit').toLowerCase();
  const bodyClass = category === 'dress' ? 'avatar-body avatar-body-dress' : category === 'ethnic wear' ? 'avatar-body avatar-body-ethnic' : 'avatar-body';
  return <div className={`avatar-2d ${category === 'dress' ? 'avatar-look-dress' : ''}`}>
    <div className="avatar-hair" />
    <div className="avatar-head" />
    <div className={bodyClass} />
    <div className="avatar-arms avatar-arm-left" />
    <div className="avatar-arms avatar-arm-right" />
    <div className="avatar-legs avatar-leg-left" />
    <div className="avatar-legs avatar-leg-right" />
    {item?.imageUrl ? <img src={item.imageUrl} alt={item.name} className="avatar-outfit" /> : <div className="avatar-empty">Select an outfit to preview it here</div>}
  </div>;
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
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      name: form.get('name'), category: form.get('category'), color: form.get('color'), imageUrl: form.get('imageUrl'),
      tags: form.get('tags').split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean),
    };
    try {
      const response = await fetch(`${API_URL}/wardrobe`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not add this outfit.');
      setItems((current) => [data, ...current]); formElement.reset();
    } catch (err) { setError(err.message); }
  };

  return <div className="app"><aside><div className="brand"><img src={auraLogo} alt="Aura" /><span>AURA</span></div><p>YOUR PERSONAL<br />STYLE UNIVERSE</p>{[['stylist', '✦', 'AI Stylist'], ['wardrobe', '◫', 'My Wardrobe'], ['avatar', '♙', 'My Avatar'], ['style', '♡', 'My Style']].map(([id, icon, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}><i>{icon}</i>{label}</button>)}<div className="side-footer">WARDROBE MVP<br /><small>Real clothes. Your style.</small></div></aside><main>
    {error && <div className="notice error">{error}</div>}
    {page === 'stylist' && <><header><span>AI STYLIST / TODAY</span><h1>What are you <em>dressing</em> for?</h1><p>Recommendations use only outfits stored in your personal wardrobe.</p></header><section className="stylist-grid"><div className="prompt-card"><label>OCCASION</label><select value={occasion} onChange={(event) => setOccasion(event.target.value)}>{['presentation', 'college', 'party', 'casual', 'formal', 'day', 'evening'].map((value) => <option key={value}>{value}</option>)}</select><label>YOUR REQUEST</label><textarea value={request} onChange={(event) => setRequest(event.target.value)} /><button className="primary" onClick={recommend}>Create my looks <span>→</span></button></div><div className="avatar-card"><div className="avatar-label">LIVE OUTFIT PREVIEW <span>●</span></div><Avatar item={selected} /><div className="avatar-hint">Drag to rotate your fashion avatar</div></div></section>
      {looks.length > 0 && <section className="looks"><div className="section-head"><div><span>{message}</span><h2>Your wardrobe matches</h2></div><button onClick={recommend}>↻ Refresh looks</button></div><div className="look-grid">{looks.map((look) => <article className={selected?._id === look.item._id ? 'chosen' : ''} key={look.item._id} onClick={() => setSelected(look.item)}>{look.item.imageUrl && <img className="outfit-image" src={look.item.imageUrl} alt={look.item.name} />}<span>{look.label} · {look.title}</span><h3>{look.item.name}</h3><p>Tags: {(look.item.tags || []).join(', ') || 'none'}</p><div className="actions"><button onClick={(event) => { event.stopPropagation(); setSelected(look.item); }}>Preview on avatar</button></div></article>)}</div></section>}</>}
    {page === 'wardrobe' && <section className="page"><span>YOUR REAL WARDROBE</span><h1>My wardrobe</h1><p>Add individual Cloudinary image URLs here, or seed the four outfits already configured for your collection.</p><form className="add-form wardrobe-form" onSubmit={addItem}><input required name="name" placeholder="Outfit name" /><select name="category"><option value="outfit">Outfit</option><option value="dress">Dress</option><option value="ethnic wear">Ethnic wear</option></select><input required name="color" placeholder="Colour, e.g. black" /><input required name="tags" placeholder="Tags, e.g. college, casual, day" /><input required name="imageUrl" type="url" placeholder="Your Cloudinary image URL" /><button className="primary">Add outfit</button></form>{loading ? <p>Loading your wardrobe…</p> : <div className="wardrobe-grid">{items.map((item) => <article key={item._id} onClick={() => setSelected(item)}>{item.imageUrl ? <img className="wardrobe-image" src={item.imageUrl} alt={item.name} /> : <div className="swatch" style={{ background: item.color }} />}<small>{item.category.toUpperCase()}</small><h3>{item.name}</h3><p>{item.color} · {(item.tags || []).join(', ')}</p></article>)}</div>}{!loading && !items.length && <p>No outfits yet. Seed your Cloudinary URLs into MongoDB, then reload this page.</p>}</section>}
    {page === 'avatar' && <section className="page avatar-page"><span>YOUR VIRTUAL FASHION CHARACTER</span><h1>My avatar</h1><div className="large-avatar"><Avatar item={selected} /></div><p>{selected ? `${selected.name} is shown on your avatar using its Cloudinary outfit image.` : 'Select a recommended or wardrobe outfit to dress your avatar.'}</p></section>}
    {page === 'style' && <section className="page"><span>CORE MVP</span><h1>My style</h1><p className="insight">Aura currently matches your own outfit tags—such as college, casual, formal, party, day, and evening—to your request. Personalisation and AI learning are intentionally outside this simple core version.</p></section>}
    <footer>Made by Malini</footer>
  </main></div>;
}

createRoot(document.getElementById('root')).render(<App />);
