import React from 'react';

export const Features: React.FC = () => {
  const features = [
    {
      title: "Dress Up & Express",
      description: "Say goodbye to appearance anxiety! In Bondee, your Avatar is whatever you imagine yourself to be. Pick from a huge variety of trendy outfits.",
      video: "https://gslb.bondee.net/prod/website-pc/static3/assets/video/dance2.mov",
      bgColor: "bg-[#FFE5F1]"
    },
    {
      title: "Interact with Friends",
      description: "Double tap to 'Boop' your friends! Interact, chat, and express yourself in ways that text just can't capture.",
      video: "https://gslb.bondee.net/prod/website-pc/static3/assets/video/hit2.mov",
      bgColor: "bg-[#E0F7FA]"
    },
    {
      title: "Virtual Party",
      description: "Hang out with your besties in your virtual space. Cheers, dance, and make memories together in the metaverse.",
      video: "https://gslb.bondee.net/prod/website-pc/static3/assets/video/cheers2.mov",
      bgColor: "bg-[#FFF9C4]"
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-black text-center mb-4">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Bondee World</span>
        </h1>
        <p className="text-center text-xl text-gray-500 mb-20 max-w-2xl mx-auto">
          Discover a new way to live, play, and bond with your friends.
        </p>
        
        <div className="space-y-32">
          {features.map((feature, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}>
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase ${feature.bgColor} bg-opacity-50 text-gray-800`}>
                  Feature {index + 1}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  {feature.title}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Video Display */}
              <div className="flex-1 w-full">
                <div className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl ${feature.bgColor} p-4 transform transition-transform hover:scale-[1.02] duration-500`}>
                  <div className="rounded-[2rem] overflow-hidden bg-white aspect-[3/4] md:aspect-square relative">
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={feature.video} type="video/mp4" />
                      <source src={feature.video} type="video/quicktime" />
                    </video>
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Section */}
        <div className="mt-32 relative rounded-3xl overflow-hidden bg-black text-white p-12 text-center">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to start your journey?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Join millions of users creating their digital selves and making real connections.
            </p>
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors">
              Download Bondee Now
            </button>
          </div>
          
          {/* Background Image */}
          <div className="absolute inset-0 opacity-30">
            <img 
              src="https://gslb.bondee.net/prod/website-pc/static3/resource/language/en/banner.png" 
              alt="Background" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
