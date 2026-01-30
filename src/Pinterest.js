import React, { useState, useEffect, useMemo } from 'react';

// 1. Diverse Mock Data with specific categories
const MOCK_PINS = [
  { id: 1, height: 'h-72', title: 'Mountain Cabin Escapes', category: 'Nature', url: 'https://picsum.photos/400/500?nature' },
  { id: 2, height: 'h-96', title: 'Minimalist Interior Design', category: 'Home', url: 'https://picsum.photos/400/700?interior' },
  { id: 3, height: 'h-[450px]', title: 'Urban Photography Tips', category: 'City', url: 'https://picsum.photos/400/800?city' },
  { id: 4, height: 'h-80', title: 'Healthy Breakfast Ideas', category: 'Food', url: 'https://picsum.photos/400/600?food' },
  { id: 5, height: 'h-64', title: 'Abstract Art Inspiration', category: 'Art', url: 'https://picsum.photos/400/400?art' },
  { id: 6, height: 'h-[500px]', title: 'Vintage Fashion Trends', category: 'Fashion', url: 'https://picsum.photos/400/850?fashion' },
  { id: 7, height: 'h-72', title: 'Dreamy Sunset Views', category: 'Nature', url: 'https://picsum.photos/400/510?sunset' },
  { id: 8, height: 'h-96', title: 'Modern Workspace Setup', category: 'Home', url: 'https://picsum.photos/400/710?tech' },
  { id: 9, height: 'h-[400px]', title: 'Hidden Gems in Italy', category: 'Travel', url: 'https://picsum.photos/400/550?italy' },
  { id: 10, height: 'h-64', title: 'Cozy Reading Nooks', category: 'Home', url: 'https://picsum.photos/400/420?reading' },
];

const CATEGORIES = ["All", "Nature", "Home", "City", "Food", "Art", "Fashion", "Travel"];

const Pin = ({ url, height, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Legit Download Logic: Fetches the image as a blob to trigger a real file download
  const handleDownload = async (e) => {
    e.stopPropagation(); // Prevents clicking the pin itself
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <div className="break-inside-avoid mb-6 group cursor-zoom-in">
      <div className={`${height} w-full bg-gray-100 rounded-2xl overflow-hidden relative shadow-sm transition-all duration-300 hover:shadow-xl`}>
        {/* Image Scaling on Hover */}
        <img
          src={url}
          alt={title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-90 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Tailwind group-hover */}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
          <div className="flex justify-end">
            <button className="bg-[#E60023] hover:bg-[#ad001a] text-white px-5 py-3 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform">
              Save
            </button>
          </div>
          <div className="flex justify-between items-center">
            <button 
              onClick={handleDownload}
              className="bg-white/90 hover:bg-white p-2 rounded-full text-black shadow-lg transition-all"
              title="Download Image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
            <div className="bg-white/90 p-2 rounded-full shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/></svg>
            </div>
          </div>
        </div>
      </div>
      {/* Captions */}
      <div className="mt-2 px-2">
        <h3 className="text-sm font-bold text-gray-800 truncate leading-tight">{title}</h3>
        <p className="text-xs text-gray-500 mt-1 font-medium">Inspiration Board</p>
      </div>
    </div>
  );
};

export default function Pinterest() {
  const [pins, setPins] = useState([...MOCK_PINS]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter Logic: Filters by both category pill and search bar input
  const filteredPins = useMemo(() => {
    return pins.filter(pin => {
      const matchesSearch = pin.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || pin.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, pins]);

  // Infinite Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
        const morePins = MOCK_PINS.map(p => ({...p, id: Math.random()}));
        setPins(prev => [...prev, ...morePins]);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md h-20 flex items-center px-4 md:px-8 gap-4 z-[100] border-b border-gray-100">
        <div className="text-[#E60023] hover:bg-gray-100 p-2 rounded-full cursor-pointer transition-colors">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.63-.13-1.58.03-2.27.14-.62.92-3.87.92-3.87s-.24-.48-.24-1.18c0-1.1.64-1.92 1.44-1.92.68 0 1 .5 1 1.12 0 .68-.43 1.7-.66 2.63-.18.8.4 1.45 1.18 1.45 1.42 0 2.51-1.5 2.51-3.66 0-1.91-1.37-3.25-3.33-3.25-2.27 0-3.6 1.7-3.6 3.46 0 .68.26 1.42.59 1.82a.23.23 0 0 1 .05.21c-.06.24-.18.73-.2 0.83a.18.18 0 0 1-.16.12c-1.07-.5-1.74-2.05-1.74-3.3 0-2.68 1.95-5.15 5.62-5.15 2.95 0 5.24 2.1 5.24 4.9 0 2.93-1.85 5.28-4.41 5.28-.86 0-1.67-.45-1.95-.97l-.53 2.02c-.19.74-.71 1.66-1.05 2.23A12 12 0 1 0 12 0z"/></svg>
        </div>
        
        <div className="flex-1 bg-[#efefef] hover:bg-[#e1e1e1] h-12 rounded-full px-5 flex items-center transition-all focus-within:ring-4 focus-within:ring-blue-100">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search for inspiration..." 
            className="bg-transparent w-full outline-none px-3 text-gray-700 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4 items-center">
           <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-700 cursor-pointer">A</div>
        </div>
      </nav>

      <main className="pt-24 pb-12">
        {/* Category Pills */}
        <div className="flex justify-center gap-3 mb-8 px-4 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Masonry Grid */}
        <div className="px-4 md:px-8 max-w-[2400px] mx-auto columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-7 2xl:columns-8 gap-5">
          {filteredPins.map((pin, idx) => (
            <Pin key={`${pin.id}-${idx}`} {...pin} />
          ))}
        </div>
        
        {/* Simple Footer/Loader */}
        {filteredPins.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl font-medium">No pins found for "{searchTerm}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
