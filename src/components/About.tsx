import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              Connect, Create, <br />
              <span className="text-blue-600">Bond Together</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-600">
              <p>
                Bondee is an innovation by the tech startup company Metadream, headquartered in Singapore. 
                Metadream has established product, R&D, and operation bases around the globe, ensuring maximum data security.
              </p>
              <p>
                Bondee aims to connect users, merge virtual and real, and weave together past, present, and future, 
                creating new social, expressive, and life experiences, unleashing boundless creativity and exploration of oneself and the world.
              </p>
            </div>
            
            <div className="mt-8">
              <img 
                src="https://gslb.bondee.net/prod/website-pc/static3/resource/language/en/banner.png" 
                alt="Bondee World" 
                className="rounded-2xl shadow-xl w-full object-cover h-64 hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-gray-100 rounded-3xl overflow-hidden h-64 transform translate-y-8 relative group">
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                   <source src="https://gslb.bondee.net/prod/website-pc/static3/assets/video/dance2.mov" type="video/mp4" />
                   <source src="https://gslb.bondee.net/prod/website-pc/static3/assets/video/dance2.mov" type="video/quicktime" />
                </video>
                <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/50 to-transparent w-full">
                  <h3 className="text-xl font-bold text-white">Dress Up</h3>
                </div>
             </div>
             
             <div className="bg-blue-50 rounded-3xl overflow-hidden h-64 relative group">
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                   <source src="https://gslb.bondee.net/prod/website-pc/static3/assets/video/hit2.mov" type="video/mp4" />
                   <source src="https://gslb.bondee.net/prod/website-pc/static3/assets/video/hit2.mov" type="video/quicktime" />
                </video>
                <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/50 to-transparent w-full">
                  <h3 className="text-xl font-bold text-white">Interact</h3>
                </div>
             </div>
             
             <div className="bg-pink-50 rounded-3xl overflow-hidden h-64 transform translate-y-8 relative group">
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                   <source src="https://gslb.bondee.net/prod/website-pc/static3/assets/video/cheers2.mov" type="video/mp4" />
                   <source src="https://gslb.bondee.net/prod/website-pc/static3/assets/video/cheers2.mov" type="video/quicktime" />
                </video>
                <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/50 to-transparent w-full">
                  <h3 className="text-xl font-bold text-white">Party</h3>
                </div>
             </div>
             
             <div className="bg-yellow-50 rounded-3xl overflow-hidden h-64 relative group">
                {/* Fallback to image for this one since we ran out of unique videos found, or reuse one */}
                <div className="absolute inset-0 bg-[#FFD700] flex items-center justify-center text-6xl">
                  🌊
                </div>
                <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/20 to-transparent w-full">
                  <h3 className="text-xl font-bold text-white">Sailing</h3>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
