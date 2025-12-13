import React from 'react';

export const Contact: React.FC = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h1 className="text-5xl font-black mb-8">Get in Touch</h1>
            <p className="text-xl text-gray-600 mb-12">
              Have questions about Bondee? We'd love to hear from you.
            </p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">General Inquiries</h3>
                <p className="text-blue-600 text-lg">bondee_official@bondee.com</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Headquarters</h3>
                <p className="text-gray-600">
                  Metadream Tech Pte. Ltd.<br />
                  3 Fraser Street, #04-23A<br />
                  Duo Tower, Singapore 189352
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Global Offices</h3>
                <p className="text-gray-600">
                  Singapore • Tokyo • Seoul • USA
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="hello@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="How can we help?"
                ></textarea>
              </div>

              <button className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
