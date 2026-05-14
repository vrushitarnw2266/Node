import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <div className="space-y-20 animate-fade-in">
      {/* Hero Section */}
      <section className="glass-card rounded-[3rem] overflow-hidden premium-shadow border-0">
        <div className="grid lg:grid-cols-2">
          <div className="p-12 md:p-20 flex flex-col justify-center">
            <span className="text-kk-red font-black uppercase tracking-[0.3em] text-sm mb-4">Our Story</span>
            <h2 className="text-5xl font-black text-kk-dark leading-none mb-8">
              Pure Vegetarian.<br/>
              <span className="text-kk-red">Pure Love.</span>
            </h2>
            <p className="text-xl leading-relaxed text-kk-dark/70 mb-10 font-medium">
              Veggie Toing was born from a simple idea: that vegetarian food should be more than just an option — it should be a celebration of flavor, health, and creativity.
            </p>
            <div className="flex gap-4">
              <Link className="btn-gradient px-10 py-4 text-lg" to="/order">Explore Menu</Link>
            </div>
          </div>
          <div className="h-[400px] lg:h-auto overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1200&q=80" 
              alt="Fresh vegetables" 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Farm Fresh", icon: "🌱", desc: "Every vegetable is sourced daily from local organic farms to ensure maximum nutrition." },
          { title: "Global Flavors", icon: "🌍", desc: "From Kathiyavadi spices to Italian herbs, we bring the world's best vegetarian dishes to you." },
          { title: "Pure Promise", icon: "✨", desc: "100% vegetarian kitchen. We maintain the highest standards of hygiene and authenticity." }
        ].map((item) => (
          <div key={item.title} className="glass-card p-10 rounded-[2.5rem] text-center premium-shadow transition-transform hover:-translate-y-2">
            <div className="text-5xl mb-6">{item.icon}</div>
            <h3 className="text-2xl font-bold text-kk-dark mb-4">{item.title}</h3>
            <p className="text-kk-dark/60 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Quality Section */}
      <section className="glass-card rounded-[3rem] p-12 md:p-20 premium-shadow bg-gradient-to-br from-kk-dark to-kk-dark/90 text-white border-0 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-black mb-8">Our Quality Commitment</h2>
          <p className="text-lg opacity-80 leading-relaxed mb-10 font-medium">
            We believe that great food starts with great ingredients. That's why we never compromise. Our chefs treat every order with the same care they would for their own family.
          </p>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-4xl font-black text-kk-red mb-1">50+</p>
              <p className="text-xs uppercase tracking-widest opacity-60 font-bold">Varieties</p>
            </div>
            <div>
              <p className="text-4xl font-black text-kk-red mb-1">100%</p>
              <p className="text-xs uppercase tracking-widest opacity-60 font-bold">Vegetarian</p>
            </div>
            <div>
              <p className="text-4xl font-black text-kk-red mb-1">24/7</p>
              <p className="text-xs uppercase tracking-widest opacity-60 font-bold">Support</p>
            </div>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[120%] bg-kk-red/20 blur-3xl rounded-full"></div>
      </section>
    </div>
  );
}
