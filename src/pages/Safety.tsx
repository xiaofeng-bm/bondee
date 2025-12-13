import React from 'react';

export const Safety: React.FC = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black text-center mb-12">
          Your Safety Matters
        </h1>

        <div className="space-y-12">
          <section className="bg-blue-50 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">🔒</span> Data Privacy & Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Bondee is committed to protecting your privacy. We have established independent data centers in 
              <strong> Singapore, Japan, and the USA</strong> to ensure maximum data security and compliance with regional regulations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We implement strict access controls and data encryption to safeguard your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold mb-2">Do you collect credit card information?</h3>
                <p className="text-gray-600">
                  No. We want to assure our users that Metadream does not currently collect users’ credit card information 
                  or any other financial information. Any rumors suggesting otherwise are false.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-bold mb-2">What permissions does the app need?</h3>
                <p className="text-gray-600 mb-2">Bondee requests permissions only for specific features:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li><strong>Camera/Photos:</strong> To take photos, scan QR codes, and save memories.</li>
                  <li><strong>Microphone:</strong> For sending voice messages or recording videos.</li>
                  <li><strong>Location:</strong> Optional. Only to discover nearby users in the plaza.</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="text-center mt-12">
             <a href="#" className="text-blue-600 hover:text-blue-800 font-medium underline">
               Read our full Privacy Policy
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};
