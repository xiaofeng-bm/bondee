import React from "react";

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FFD700]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FF69B4] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#87CEEB] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-64 h-64 bg-[#90EE90] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              Live with your12 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                best friends
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-800 mb-10 max-w-2xl font-medium">
              Define Your Digital Path, Break Barriers, and Lead the Way. A new virtual world to express your true self.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-xl">
                <img
                  src="https://gslb.bondee.net/prod/website-pc/static3/resource/main/Apple.svg"
                  alt="Apple"
                  className="w-6 h-6"
                />
                <span>App Store</span>
              </button>
              <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
                <img
                  src="https://gslb.bondee.net/prod/website-pc/static3/resource/main/Google.svg"
                  alt="Google"
                  className="w-6 h-6"
                />
                <span>Google Play</span>
              </button>
            </div>
          </div>

          {/* Right Video Content */}
          <div className="flex-1 w-full max-w-[600px]">
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 bg-white/30 backdrop-blur-sm rotate-3 hover:rotate-0 transition-transform duration-500">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                <source src="https://gslb.bondee.net/prod/website-pc/static3/assets/video/NFT-8.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Floating Elements */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center gap-4 animate-bounce">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">👾</div>
                <div>
                  <div className="font-bold text-gray-900">Join the Party</div>
                  <div className="text-sm text-gray-500">24k+ friends online</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
