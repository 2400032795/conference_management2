import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="section py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div data-animate="zoom-in">
              <h1 className="h1 text-black mb-4">Where Art & Connection Flourish</h1>
              <p className="text-lg text-black/70 max-w-xl mb-6">
                Discover curated expressions, connect with artists, and explore exhibitions that speak to the soul.
              </p>
              <div className="flex gap-3">
                <Link to="/gallery" className="btn btn-primary">Explore Gallery</Link>
                <Link to="/curator" className="btn btn-secondary">Curate</Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-card" data-animate="fade-up">
              <img
                alt="exhibition"
                src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Exhibition Spotlight */}
      <section className="section py-14" data-animate="fade-up">
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <img className="rounded-xl" src="https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=1600&auto=format&fit=crop" alt="spotlight"/>
            <div>
              <h2 className="h2 mb-2">Featured Exhibition</h2>
              <p className="text-black/70 mb-5">“Echoes of Stillness” — a curated journey through contemporary abstract expression.</p>
              <Link to="/gallery" className="btn btn-primary">View Exhibition</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
