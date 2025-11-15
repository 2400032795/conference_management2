import React from 'react'
export default function Footer(){
  return (
    <footer className="mt-20 border-t border-black/10">
      <div className="section py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-black/60">&copy; {new Date().getFullYear()} ArtConnect</p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
