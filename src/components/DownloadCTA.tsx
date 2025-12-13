import React from 'react';

export const DownloadCTA: React.FC = () => {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600 rounded-full filter blur-[100px] animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-600 rounded-full filter blur-[100px] animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
          Ready to enter the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Bondee Metaverse?</span>
        </h2>
        
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Join millions of users worldwide. Create your avatar, design your space, and start living with your best friends today.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105">
            <img src="/assets/images/app-store.svg" alt="App Store" className="w-6 h-6" />
            <div className="text-left">
              <div className="text-xs font-medium">Download on the</div>
              <div className="text-lg leading-none">App Store</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all hover:scale-105">
            <img src="/assets/images/google-play.svg" alt="Google Play" className="w-6 h-6" />
            <div className="text-left">
              <div className="text-xs font-medium">Get it on</div>
              <div className="text-lg leading-none">Google Play</div>
            </div>
          </button>
        </div>

        <div className="mt-16 flex justify-center gap-8 text-gray-500 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Free to play
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Secure Data
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Global Community
          </div>
        </div>
      </div>
    </section>
  );
};
