import React, { useEffect, useState } from 'react'

const MOCK = [
  { id:1, title:'Starry Night', artist:'Van Gogh', price:1500, image:'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop' },
  { id:2, title:'Abstract Paint', artist:'Jane Doe', price:2500, image:'https://plus.unsplash.com/premium_photo-1664438942574-e56510dc5ce5?q=80&w=1400&auto=format&fit=crop' },
  { id:3, title:'The Scream', artist:'Munch', price:700, image:'https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?q=80&w=1400&auto=format&fit=crop' },
  { id:4, title:'Color Study', artist:'Kandinsky', price:1200, image:'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1400&auto=format&fit=crop' },
]

export default function Gallery(){
  const [items, setItems] = useState([])
  const [selected,setSelected] = useState(null)

  useEffect(()=>{ setItems(MOCK) },[])

  return (
    <section className="section py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="h2">Gallery</h2>
          <p className="text-black/60">Browse and preview artworks</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(it=>(
          <article key={it.id} className="bg-white rounded-xl overflow-hidden shadow-card" data-animate="zoom-in">
            <button onClick={()=>setSelected(it)} className="block w-full">
              <img src={it.image} alt={it.title} className="w-full h-64 object-cover"/>
            </button>
            <div className="p-4">
              <h3 className="font-semibold">{it.title}</h3>
              <p className="text-sm text-black/60">by {it.artist}</p>
              <p className="mt-2 font-semibold">₹ {it.price}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-card max-w-3xl w-full overflow-hidden" onClick={e=>e.stopPropagation()} data-animate="zoom-in">
            <img src={selected.image} alt="" className="w-full max-h-[70vh] object-cover"/>
            <div className="p-5 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl">{selected.title}</h3>
                <p className="text-black/60">by {selected.artist}</p>
              </div>
              <button className="btn btn-primary">Buy / Enquire</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
