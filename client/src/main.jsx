import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import './styles.css';

const seedItems = [
  { id:'top_001', name:'White fitted shirt', category:'Top', color:'#f6f0ea', style:'Smart casual', formality:4, comfort:4, occasions:['College','Presentation','Work'], avatar:'shirt' },
  { id:'top_002', name:'Red floral corset top', category:'Top', color:'#b5243f', style:'Party', formality:3, comfort:3, occasions:['Party','Date'], avatar:'corset' },
  { id:'bottom_001', name:'Black wide-leg trousers', category:'Bottom', color:'#242328', style:'Smart casual', formality:4, comfort:5, occasions:['College','Presentation','Work'], avatar:'trousers' },
  { id:'bottom_002', name:'Blue relaxed jeans', category:'Bottom', color:'#59758d', style:'Casual', formality:2, comfort:5, occasions:['College','Casual','Date'], avatar:'jeans' },
  { id:'shoe_001', name:'White platform sneakers', category:'Shoes', color:'#f8f8f2', style:'Casual', formality:2, comfort:5, occasions:['College','Casual','Presentation'], avatar:'sneakers' },
  { id:'bag_001', name:'Black shoulder bag', category:'Bag', color:'#232125', style:'Minimal', formality:4, comfort:4, occasions:['College','Presentation','Party'], avatar:'bag' },
  { id:'jewellery_001', name:'Silver butterfly earrings', category:'Jewellery', color:'#c2c9d1', style:'Cute', formality:3, comfort:5, occasions:['College','Party','Date'], avatar:'earrings' },
  { id:'jewellery_002', name:'Silver heart necklace', category:'Jewellery', color:'#c2c9d1', style:'Minimal', formality:3, comfort:5, occasions:['College','Presentation','Date'], avatar:'necklace' }
];

function Avatar({ outfit }) {
  const top = outfit?.items?.find(x => x.category === 'Top');
  const bottom = outfit?.items?.find(x => x.category === 'Bottom');
  const hasBag = outfit?.items?.some(x => x.category === 'Bag');
  const hasJewellery = outfit?.items?.some(x => x.category === 'Jewellery');
  return <Canvas camera={{position:[0,1.7,5], fov:40}}>
    <color attach="background" args={['#272247']} /><ambientLight intensity={1.7}/><directionalLight position={[3,5,4]} intensity={2}/><Environment preset="city" />
    <Float speed={1.5} rotationIntensity={.14} floatIntensity={.32}><group position={[0,-1.6,0]}>
      <mesh position={[0,3.05,0]}><sphereGeometry args={[.58,32,32]}/><meshStandardMaterial color="#bb6d3e"/></mesh>
      <mesh position={[0,3.65,0]}><sphereGeometry args={[.64,16,16,0,Math.PI*2,0,1.6]}/><meshStandardMaterial color="#4c2c23" roughness={.8}/></mesh>
      <mesh position={[0,2.35,0]}><boxGeometry args={[1.35,1.35,.55]}/><meshStandardMaterial color={top?.color || '#e8d7c3'}/></mesh>
      <mesh position={[-.38,1.1,0]}><boxGeometry args={[.58,1.2,.58]}/><meshStandardMaterial color={bottom?.color || '#596f83'}/></mesh>
      <mesh position={[.38,1.1,0]}><boxGeometry args={[.58,1.2,.58]}/><meshStandardMaterial color={bottom?.color || '#596f83'}/></mesh>
      <mesh position={[-.38,.38,.05]}><boxGeometry args={[.65,.22,.75]}/><meshStandardMaterial color="#fffdf7"/></mesh><mesh position={[.38,.38,.05]}><boxGeometry args={[.65,.22,.75]}/><meshStandardMaterial color="#fffdf7"/></mesh>
      <mesh position={[-1.02,2.35,0]} rotation={[0,0,.15]}><boxGeometry args={[.42,1.25,.42]}/><meshStandardMaterial color="#bb6d3e"/></mesh><mesh position={[1.02,2.35,0]} rotation={[0,0,-.15]}><boxGeometry args={[.42,1.25,.42]}/><meshStandardMaterial color="#bb6d3e"/></mesh>
      {hasBag && <mesh position={[1.05,1.85,.18]}><boxGeometry args={[.55,.7,.25]}/><meshStandardMaterial color="#26232a"/></mesh>}
      {hasJewellery && <mesh position={[0,2.75,.55]}><sphereGeometry args={[.1,16,16]}/><meshStandardMaterial color="#d9dee7" metalness={.8}/></mesh>}
    </group></Float><OrbitControls enablePan={false} minDistance={3.5} maxDistance={7}/>
  </Canvas>;
}

function App(){
 const [page,setPage]=useState('stylist'), [items,setItems]=useState(seedItems), [occasion,setOccasion]=useState('Presentation'), [mood,setMood]=useState('Smart & cute'), [looks,setLooks]=useState([]), [selected,setSelected]=useState(null), [feedback,setFeedback]=useState({black:95, sneakers:90, silver:85, oversized:78});
 const makeLooks=()=>{ const top=items.find(x=>x.id==='top_001')||items[0], bottom=items.find(x=>x.id==='bottom_001')||items[2], shoe=items.find(x=>x.category==='Shoes'), bag=items.find(x=>x.category==='Bag'), jew=items.filter(x=>x.category==='Jewellery'); const alternatives=[{label:'LOOK 01',title:'Safest Choice',items:[top,bottom,shoe,bag,...jew],reason:'The structured shirt and trousers feel presentation-ready, while sneakers and silver details keep it youthful and comfortable.'},{label:'LOOK 02',title:'Stylish Choice',items:[items.find(x=>x.id==='top_002')||top,items.find(x=>x.id==='bottom_002')||bottom,shoe,bag,jew[0]],reason:'A more expressive colour-led look that still uses relaxed denim and familiar accessories.'},{label:'LOOK 03',title:'Experimental Choice',items:[top,items.find(x=>x.id==='bottom_002')||bottom,shoe,bag,jew[1]],reason:'Mixes your polished shirt with relaxed denim for a fresh smart-casual silhouette.'}]; setLooks(alternatives); setSelected(alternatives[0]); };
 const addItem=(e)=>{e.preventDefault(); const data=new FormData(e.currentTarget); setItems([...items,{id:`item_${Date.now()}`,name:data.get('name'),category:data.get('category'),color:data.get('color'),style:'Personal',formality:3,comfort:4,occasions:['Casual']}]); e.currentTarget.reset();};
 const react=(key)=>{setFeedback(f=>({...f,[key]:Math.min(100,(f[key]||50)+3)}));};
 return <div className="app"><aside><div className="brand"><span>✦</span> AURA</div><p>YOUR PERSONAL<br/>STYLE UNIVERSE</p>{[['stylist','✦','AI Stylist'],['wardrobe','◫','My Wardrobe'],['avatar','♙','My Avatar'],['style','♡','My Style']].map(([id,icon,label])=><button key={id} className={page===id?'active':''} onClick={()=>setPage(id)}><i>{icon}</i>{label}</button>)}<div className="side-footer">WARDROBE MVP<br/><small>Real clothes. Your style.</small></div></aside><main>
 {page==='stylist'&&<><header><span>AI STYLIST / TODAY</span><h1>What are you <em>dressing</em> for?</h1><p>Tell Aura the moment, and it will style only what you own.</p></header><section className="stylist-grid"><div className="prompt-card"><label>OCCASION</label><select value={occasion} onChange={e=>setOccasion(e.target.value)}>{['Presentation','College','Party','Date','Casual outing','Work'].map(x=><option key={x}>{x}</option>)}</select><label>MOOD & STYLE</label><input value={mood} onChange={e=>setMood(e.target.value)}/><label>DESCRIBE YOUR LOOK</label><textarea defaultValue="I want to look professional but still cute and comfortable."/><button className="primary" onClick={makeLooks}>Create my looks <span>→</span></button></div><div className="avatar-card"><div className="avatar-label">LIVE OUTFIT PREVIEW <span>●</span></div><Avatar outfit={selected}/><div className="avatar-hint">Drag to rotate your fashion avatar</div></div></section>
 {looks.length>0&&<section className="looks"><div className="section-head"><div><span>PERSONALISED FOR YOU</span><h2>Your edit for {occasion}</h2></div><button onClick={makeLooks}>↻ Refresh looks</button></div><div className="look-grid">{looks.map(l=><article className={selected===l?'chosen':''} key={l.label} onClick={()=>setSelected(l)}><span>{l.label} · {l.title}</span><h3>{l.items.filter(Boolean).map(x=>x.name).join(' + ')}</h3><p>{l.reason}</p><div className="actions"><button onClick={(e)=>{e.stopPropagation();react('silver')}}>♡ Love it</button><button onClick={(e)=>{e.stopPropagation();setSelected(l)}}>Preview</button></div></article>)}</div></section>}</>}
 {page==='wardrobe'&&<section className="page"><span>YOUR REAL WARDROBE</span><h1>My wardrobe</h1><form className="add-form" onSubmit={addItem}><input required name="name" placeholder="Item name, e.g. Black blazer"/><select name="category">{['Top','Bottom','Shoes','Bag','Jewellery'].map(x=><option key={x}>{x}</option>)}</select><input name="color" type="color" defaultValue="#8b5cf6"/><button className="primary">Add item</button></form><div className="wardrobe-grid">{items.map(x=><article key={x.id}><div className="swatch" style={{background:x.color}}></div><small>{x.category.toUpperCase()}</small><h3>{x.name}</h3><p>{x.style} · {x.occasions?.join(', ')}</p></article>)}</div></section>}
 {page==='avatar'&&<section className="page avatar-page"><span>YOUR VIRTUAL FASHION CHARACTER</span><h1>My avatar</h1><div className="large-avatar"><Avatar outfit={selected}/></div><p>Your stylised, game-like avatar is modular: clothing, shoes, bags, and jewellery are applied from each selected outfit. Replace the geometric placeholder with licensed GLB fashion assets as your asset library grows.</p></section>}
 {page==='style'&&<section className="page"><span>LEARNED FROM YOUR FEEDBACK</span><h1>My style DNA</h1><div className="scores">{Object.entries(feedback).map(([k,v])=><div key={k}><div><b>{k}</b><b>{v}%</b></div><progress value={v} max="100"/></div>)}</div><p className="insight">Aura prioritises polished dark neutrals, comfortable shoes, and silver accessories. Each ❤️, save, rejection, and worn look adjusts these preferences.</p></section>}
 </main></div> }
createRoot(document.getElementById('root')).render(<App/>);
