import React from 'react'
import { NavLink, Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-black/10">
      <div className="section flex items-center justify-between py-4">
        <Link to="/" className="font-serif text-2xl font-bold">ArtConnect</Link>
        <nav className="flex items-center gap-6">
          {[
            ['/', 'Home'],
            ['/gallery', 'Gallery'],
            ['/curator', 'Curator'],
            ['/artist', 'Artist'],
            ['/contact', 'Contact'],
          ].map(([to,label])=>(
            <NavLink key={to} to={to} className={({isActive})=>
              `text-sm font-semibold ${isActive?'text-black':'text-black/60 hover:text-black'}`
            }>{label}</NavLink>
          ))}
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </nav>
      </div>
    </header>
  )
}
