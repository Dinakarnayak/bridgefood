import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingBag, Clock3, Star, MapPin, Plus, Minus, ArrowRight, Leaf, Utensils } from "lucide-react";

type Item = { id:number; name:string; description:string; price:number; category:string; vegetarian:boolean };
type Restaurant = { id:number; name:string; cuisine:string; description:string; rating:number; delivery_minutes:string; delivery_fee:number; image:string; tags:string[]; menu:Item[] };
type CartLine = { item:Item; restaurant:Restaurant; qty:number };
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [restaurants,setRestaurants] = useState<Restaurant[]>([]);
  const [selected,setSelected] = useState<Restaurant|null>(null);
  const [cart,setCart] = useState<CartLine[]>([]);
  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("All");
  const [notice,setNotice] = useState("");
  const [loading,setLoading] = useState(true);

  useEffect(() => { fetch(`${API}/api/restaurants`).then(r=>r.json()).then(setRestaurants).catch(()=>setNotice("Could not reach the API. Start the FastAPI server and refresh.")).finally(()=>setLoading(false)); }, []);
  const visible = useMemo(()=>restaurants.filter(r=>(filter==="All"||r.cuisine===filter)&&(`${r.name} ${r.cuisine} ${r.description}`.toLowerCase().includes(search.toLowerCase()))),[restaurants,filter,search]);
  const count = cart.reduce((n,l)=>n+l.qty,0);
  const total = cart.reduce((n,l)=>n+l.item.price*l.qty,0);
  function add(item:Item, restaurant:Restaurant) {
    setCart(old=>{ const found=old.find(l=>l.item.id===item.id); return found ? old.map(l=>l.item.id===item.id?{...l,qty:l.qty+1}:l) : [...old,{item,restaurant,qty:1}]; });
    setNotice(`${item.name} added to your bag`);
  }
  function change(id:number,delta:number) { setCart(old=>old.map(l=>l.item.id===id?{...l,qty:l.qty+delta}:l).filter(l=>l.qty>0)); }
  async function checkout() {
    const result=await fetch(`${API}/api/orders/simulate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:cart.map(l=>({id:l.item.id,quantity:l.qty}))})}).then(r=>r.json());
    setNotice(`Demo order ${result.order_id} created — no payment or delivery took place.`); setCart([]);
  }

  return <div className="app">
    <header className="topbar"><a className="brand" href="#"><span className="brandmark">B</span>bridge<span>food</span></a><div className="location"><MapPin size={16}/><span>Delivering to</span><b>Leicester, UK</b></div><button className="bag" onClick={()=>document.getElementById("cart")?.scrollIntoView({behavior:"smooth"})}><ShoppingBag size={18}/> Your bag <i>{count}</i></button></header>
    <main>
      <section className="hero"><div className="hero-copy"><span className="eyebrow">A LITTLE TASTE OF HOME</span><h1>Your favourite Indian food.<br/><em>Right around the corner.</em></h1><p>Discover the flavours you love, from local favourites to the dishes that feel like home.</p><div className="search"><Search size={19}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search dishes, restaurants or cuisines"/><button onClick={()=>setSearch("")}>Clear</button></div></div><div className="hero-image"><img src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=1200" alt="Indian curry spread"/><div className="floating-note"><span>✦</span><div><b>Made for your cravings</b><small>Explore Leicester's demo kitchens</small></div></div></div></section>
      <section className="section-head"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Explore restaurants</h2><p>Fictional restaurants and sample menus for this prototype.</p></div><span className="demo-pill">DEMO EXPERIENCE</span></section>
      <div className="filters">{["All","North Indian","South Indian","Indian"].map(f=><button className={filter===f?"active":""} onClick={()=>setFilter(f)} key={f}>{f}</button>)}</div>
      {loading?<p className="muted">Finding your favourites…</p>:<div className="restaurant-grid">{visible.map(r=><article className="restaurant-card" key={r.id} onClick={()=>setSelected(r)}><div className="restaurant-photo"><img src={r.image} alt={r.name}/><span>{r.tags[0]}</span></div><div className="restaurant-info"><div className="restaurant-title"><h3>{r.name}</h3><span><Star size={14} fill="currentColor"/> {r.rating}</span></div><p>{r.cuisine} · {r.description}</p><div className="meta"><span><Clock3 size={14}/>{r.delivery_minutes}</span><span>£{r.delivery_fee.toFixed(2)} delivery</span></div><button className="text-action">View menu <ArrowRight size={15}/></button></div></article>)}</div>}
      {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="menu-modal" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setSelected(null)}>×</button><img className="menu-cover" src={selected.image} alt=""/><div className="menu-content"><span className="eyebrow">{selected.cuisine}</span><h2>{selected.name}</h2><p>{selected.description}</p>{selected.menu.map(item=><div className="menu-item" key={item.id}><div><b>{item.vegetarian&&<Leaf size={14}/>} {item.name}</b><p>{item.description}</p><strong>£{item.price.toFixed(2)}</strong></div><button onClick={()=>add(item,selected)}><Plus size={16}/> Add</button></div>)}</div></div></div>}
      <section className="cart-section" id="cart"><div><span className="eyebrow">YOUR ORDER</span><h2>Your bag <span className="count">{count}</span></h2></div>{cart.length===0?<p className="muted">Your bag is empty. Pick something delicious to get started.</p>:<><div className="cart-lines">{cart.map(l=><div className="cart-line" key={l.item.id}><div><b>{l.item.name}</b><small>{l.restaurant.name}</small></div><div className="quantity"><button onClick={()=>change(l.item.id,-1)}><Minus size={14}/></button>{l.qty}<button onClick={()=>change(l.item.id,1)}><Plus size={14}/></button></div><strong>£{(l.item.price*l.qty).toFixed(2)}</strong></div>)}</div><div className="cart-total"><span>Demo subtotal</span><b>£{total.toFixed(2)}</b></div><button className="checkout" onClick={checkout}>Place simulated order <ArrowRight size={17}/></button></>}</section>
      {notice&&<div className="toast" onClick={()=>setNotice("")}>{notice} <b>×</b></div>}
    </main>
    <footer><a className="brand" href="#"><span className="brandmark">B</span>bridge<span>food</span></a><p>Built as a non-commercial prototype · Fictional restaurants · No real orders or payments</p></footer>
  </div>;
}
