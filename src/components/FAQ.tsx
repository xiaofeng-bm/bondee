import React from 'react';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "Is Bondee free to play?",
      answer: "Yes! Bondee is free to download and play. You can customize your avatar, decorate your room, and interact with friends without spending a dime."
    },
    {
      question: "How many friends can I add?",
      answer: "Currently, you can add up to 50 friends. We believe in quality over quantity—Bondee is designed for your closest circle."
    },
    {
      question: "Is my data safe?",
      answer: "Absolutely. We prioritize user privacy and security. Your data is encrypted and stored in secure data centers in Singapore, Japan, and the USA."
    },
    {
      question: "Can I customize my room?",
      answer: "Yes! You have a personal space that you can decorate with furniture, photos, and posters. It's your own little corner of the metaverse."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-4xl font-black text-center mb-16">
          Frequently Asked <span className="text-purple-600">Questions</span>
        </h2>
        
        <div className="grid gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors cursor-pointer">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                <span className="text-purple-600">Q.</span> {faq.question}
              </h3>
              <p className="text-gray-600 ml-8 text-lg">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};