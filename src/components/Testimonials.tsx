import React from 'react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      user: "Sarah K.",
      role: "Digital Artist",
      content: "Bondee is exactly what I've been waiting for. It's not just a chat app; it's a living, breathing space where I can truly express myself.",
      avatar: "👩‍🎨"
    },
    {
      user: "Mike R.",
      role: "Student",
      content: "I love the 'floating' feature! It's so relaxing to just drift on the ocean and leave messages in bottles. Made some cool friends this way.",
      avatar: "🎓"
    },
    {
      user: "Jessica L.",
      role: "Fashion Blogger",
      content: "The avatar customization is next level. The clothes are trendy, and I can match my OOTD in real life with my Bondee avatar!",
      avatar: "👗"
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-black text-center mb-16">
          Loved by the <span className="text-blue-600">Community</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-6">{review.avatar}</div>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed italic">
                "{review.content}"
              </p>
              <div>
                <div className="font-bold text-gray-900">{review.user}</div>
                <div className="text-sm text-gray-500">{review.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
