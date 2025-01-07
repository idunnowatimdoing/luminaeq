import React from "react";

export const FounderMessage = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-r from-lumina-yellow via-lumina-teal to-lumina-blue rounded-full blur-3xl opacity-5 -top-20 -right-20" />
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="backdrop-blur-lg bg-lumina-dark/80 rounded-2xl shadow-lg p-12 border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 text-white">Message from the Founder</h2>
          <h3 className="text-3xl font-bold mb-8 text-lumina-teal">"Why We Created Lumina"</h3>
          <p className="text-xl leading-relaxed mb-8 italic text-white">
            "Lumina wasn't originally meant to be shared with the world—it started as a personal tool to help me better understand and navigate my own emotions. Over time, I realized something powerful: Lumina doesn't tell you how to feel or what to do—it gently shows you patterns you might not notice on your own."
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lumina-teal font-semibold">Dedrick Burns</span>
            <span className="text-lumina-neutral">Founder of Lumina</span>
          </div>
        </div>
      </div>
    </section>
  );
};