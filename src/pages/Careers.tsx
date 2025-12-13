import React from 'react';

export const Careers: React.FC = () => {
  const jobs = [
    {
      role: "Senior Unity Developer",
      location: "Singapore",
      type: "Full-time",
      department: "Engineering"
    },
    {
      role: "Product Manager (Social)",
      location: "Tokyo, Japan",
      type: "Full-time",
      department: "Product"
    },
    {
      role: "Backend Engineer (Go/Rust)",
      location: "Seoul, South Korea",
      type: "Full-time",
      department: "Engineering"
    },
    {
      role: "3D Artist",
      location: "Remote / USA",
      type: "Contract",
      department: "Art"
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-6">Join Metadream</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us build the next generation of social connection. We are looking for dreamers, creators, and builders.
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {jobs.map((job, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center justify-between group">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {job.role}
                </h3>
                <div className="text-gray-500 mt-1 space-x-4">
                  <span>📍 {job.location}</span>
                  <span>💼 {job.department}</span>
                  <span>⏰ {job.type}</span>
                </div>
              </div>
              <button className="px-6 py-2 border-2 border-black rounded-full font-bold hover:bg-black hover:text-white transition-colors">
                Apply Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Don't see a perfect fit?</h2>
          <p className="text-gray-600 mb-8">
            We are always looking for talent. Send your portfolio to careers@metadream.com
          </p>
        </div>
      </div>
    </div>
  );
};
