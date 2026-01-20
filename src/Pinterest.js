import React, { useState, useEffect } from 'react';

const MOCK_PINS = [
  { id: 1, size: 'small', url: 'https://picsum.photos/400/300?random=1' },
  { id: 2, size: 'medium', url: 'https://picsum.photos/400/500?random=2' },
  { id: 3, size: 'large', url: 'https://picsum.photos/400/700?random=3' },
  { id: 4, size: 'medium', url: 'https://picsum.photos/400/550?random=4' },
  { id: 5, size: 'small', url: 'https://picsum.photos/400/310?random=5' },
  { id: 6, size: 'large', url: 'https://picsum.photos/400/720?random=6' },
  { id: 7, size: 'medium', url: 'https://picsum.photos/400/480?random=7' },
  { id: 8, size: 'small', url: 'https://picsum.photos/400/320?random=8' },
];

const Pin = ({ url, size }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const heightClass = { small: 'h-64', medium: 'h-80', large: 'h-[450px]' }[size];

  return (
    <div className="break-inside-avoid mb-4 group relative cursor-zoom-in">
      <div className={`${heightClass} w-full bg-gray-100 rounded-2xl overflow-hidden`}>
        <img
          src={url}
          alt="Pin"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4">
          <div className="flex justify-end"><button className="bg-red-600 text-white px-5 py-2 rounded-full font-bold">Save</button></div>
        </div>
      </div>
    </div>
  );
};

export default function Pinterest() {
  const [pins, setPins] = useState(MOCK_PINS);

  // Simple Infinite Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        setPins(prev => [...prev, ...MOCK_PINS.map(p => ({...p, id: Math.random()}))]);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white h-20 flex items-center px-4 gap-4 z-50 shadow-sm">
        <div className="text-red-600 p-2"><svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.63-.13-1.58.03-2.27.14-.62.92-3.87.92-3.87s-.24-.48-.24-1.18c0-1.1.64-1.92 1.44-1.92.68 0 1 .5 1 1.12 0 .68-.43 1.7-.66 2.63-.18.8.4 1.45 1.18 1.45 1.42 0 2.51-1.5 2.51-3.66 0-1.91-1.37-3.25-3.33-3.25-2.27 0-3.6 1.7-3.6 3.46 0 .68.26 1.42.59 1.82a.23.23 0 0 1 .05.21c-.06.24-.18.73-.2 0.83a.18.18 0 0 1-.16.12c-1.07-.5-1.74-2.05-1.74-3.3 0-2.68 1.95-5.15 5.62-5.15 2.95 0 5.24 2.1 5.24 4.9 0 2.93-1.85 5.28-4.41 5.28-.86 0-1.67-.45-1.95-.97l-.53 2.02c-.19.74-.71 1.66-1.05 2.23A12 12 0 1 0 12 0z"/></svg></div>
        <div className="bg-gray-100 flex-1 h-12 rounded-full px-4 flex items-center"><input type="text" placeholder="Search" className="bg-transparent w-full outline-none px-2" /></div>
        <div className="flex gap-4 px-2 font-semibold"><span>Home</span><span>Explore</span></div>
      </nav>
      <main className="pt-24 px-4 pb-10">
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 mx-auto max-w-[1800px]">
          {pins.map((pin) => (
            <Pin key={pin.id} url={pin.url} size={pin.size} />
          ))}
        </div>
      </main>
    </div>
  );
}