import React, { useState, useMemo } from 'react'

const Card = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-card">{title && <h3 className="font-semibold mb-3">{title}</h3>}{children}</div>
)

export default function Curator(){
  const [exhibitions,setExhibitions] = useState([
    { id:'e1', title:'Modern Abstractions', status:'Published' },
    { id:'e2', title:'Light & Form', status:'Draft' },
  ])
  const [sessions,setSessions] = useState([
    { id:'s1', title:'Opening Reception', time:'6:00 PM', room:'Main Hall' },
    { id:'s2', title:'Artist Talk', time:'7:30 PM', room:'Room 201' },
  ])
  const [newTitle,setNewTitle] = useState(''); const [newTime,setNewTime] = useState(''); const [newRoom,setNewRoom] = useState('')

  const publishedCount = useMemo(()=>exhibitions.filter(x=>x.status==='Published').length,[exhibitions])

  const addSession = ()=>{
    if(!newTitle || !newTime || !newRoom) return;
    setSessions(prev=>[...prev,{id:Date.now().toString(), title:newTitle, time:newTime, room:newRoom}])
    setNewTitle(''); setNewTime(''); setNewRoom('');
  }

  return (
    <section className="section py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="h2">Curator Dashboard</h2>
          <p className="text-black/60">Create exhibitions and manage events</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white rounded-xl shadow-card px-4 py-2 text-sm">Exhibitions: {exhibitions.length}</div>
          <div className="bg-white rounded-xl shadow-card px-4 py-2 text-sm">Published: {publishedCount}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Event Schedule">
          <ul className="space-y-2 max-h-60 overflow-auto pr-2">
            {sessions.map(s=>(
              <li key={s.id} className="p-3 bg-[#f4f1ea] rounded-lg border-l-4 border-gallery-gold">
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-black/60">{s.time} · {s.room}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t">
            <p className="font-semibold mb-2">Add New Session</p>
            <input className="w-full p-2 border rounded mb-2" placeholder="Title" value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
            <div className="flex gap-2">
              <input className="w-1/2 p-2 border rounded" placeholder="Time" value={newTime} onChange={e=>setNewTime(e.target.value)} />
              <input className="w-1/2 p-2 border rounded" placeholder="Room" value={newRoom} onChange={e=>setNewRoom(e.target.value)} />
            </div>
            <button className="btn btn-primary w-full mt-3" onClick={addSession}>Add Session</button>
          </div>
        </Card>

        <Card title="Exhibitions" >
          <ul className="space-y-2">
            {exhibitions.map(ex=>(
              <li key={ex.id} className="p-3 bg-white rounded-lg border shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold">{ex.title}</p>
                  <p className={`text-sm ${ex.status==='Published'?'text-green-600':'text-yellow-600'}`}>Status: {ex.status}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-secondary" onClick={()=>{
                    setExhibitions(list=>list.map(x=>x.id===ex.id?{...x,status:x.status==='Published'?'Draft':'Published'}:x))
                  }}>{ex.status==='Published'?'Unpublish':'Publish'}</button>
                  <button className="btn btn-secondary" onClick={()=>{
                    setExhibitions(list=>list.filter(x=>x.id!==ex.id))
                  }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Quick Tips">
          <ul className="list-disc pl-5 text-sm text-black/70 space-y-2">
            <li>Publish exhibitions when artworks and schedule are ready.</li>
            <li>Use the event schedule for talks, guided tours, and auctions.</li>
            <li>Promote via the home spotlight section.</li>
          </ul>
        </Card>
      </div>
    </section>
  )
}
