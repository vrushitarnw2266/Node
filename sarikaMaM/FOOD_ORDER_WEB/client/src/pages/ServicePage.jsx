export function ServicePage() {
  const services = [
    { title: "Fast Delivery", desc: "Track your order from the kitchen to your door. See prep ETA and live location.", icon: "🛵" },
    { title: "100% Vegetarian", desc: "A curated menu of pizzas, burgers, biryanis, and Chinese — all strictly vegetarian.", icon: "🌱" },
    { title: "Dine-in Booking", desc: "Reserve a table easily for family dinners or special celebrations.", icon: "🍽️" },
    { title: "Live Tracking", desc: "Real-time updates on kitchen progress and delivery status.", icon: "🕒" },
  ];

  return (
    <div className="space-y-20 animate-fade-in">
      <section className="text-center max-w-3xl mx-auto pt-10">
        <span className="text-kk-red font-black uppercase tracking-[0.3em] text-sm mb-4 block">Experience Excellence</span>
        <h2 className="text-5xl font-black text-kk-dark mb-6">Our <span className="text-kk-red">Premium</span> Services</h2>
        <p className="text-xl text-kk-dark/60 font-medium leading-relaxed">
          At Veggie Toing, we've reimagined the vegetarian dining experience, combining culinary mastery with cutting-edge technology.
        </p>
      </section>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Lightning Delivery", desc: "Our specialized fleet ensures your food reaches you piping hot, every single time.", icon: "🛵", color: "bg-blue-500/10 text-blue-500" },
          { title: "Pure Veg Kitchen", desc: "A strictly 100% vegetarian facility with separate handling for organic produce.", icon: "🌱", color: "bg-green-500/10 text-green-500" },
          { title: "Table Reservation", desc: "Skip the queue. Book your favorite corner for family dinners or corporate meets.", icon: "🍽️", color: "bg-orange-500/10 text-orange-500" },
          { title: "Live Tracking", desc: "Know exactly when your meal is being prepared and when it leaves the kitchen.", icon: "🛰️", color: "bg-purple-500/10 text-purple-500" },
        ].map((s, idx) => (
          <div key={idx} className="glass-card premium-shadow rounded-[2.5rem] p-10 flex flex-col items-center text-center hover-lift group border-0">
            <div className={`text-5xl mb-8 w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-110 ${s.color}`}>
              {s.icon}
            </div>
            <h3 className="m-0 text-2xl font-black text-kk-dark group-hover:text-kk-red transition-colors">{s.title}</h3>
            <p className="mt-4 text-kk-dark/60 font-medium leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <section className="glass-card rounded-[3rem] p-12 md:p-20 premium-shadow border-0 flex flex-col md:flex-row items-center gap-12 bg-white">
        <div className="md:w-1/2">
          <img 
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80" 
            alt="Chef at work" 
            className="rounded-[2rem] shadow-2xl w-full"
          />
        </div>
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl font-black text-kk-dark">Why Choose <span className="text-kk-red">Veggie Toing?</span></h2>
          <div className="space-y-4">
            {[
              "Authentic Kathiyavadi & Punjabi Recipes",
              "Advanced Hygiene Protocols",
              "Eco-friendly Biodegradable Packaging",
              "Exclusive Loyalty Rewards for Regulars"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-lg font-medium text-kk-dark/80">
                <div className="w-6 h-6 rounded-full bg-kk-red/10 flex items-center justify-center text-kk-red text-xs">✓</div>
                {item}
              </div>
            ))}
          </div>
          <Link className="btn-gradient inline-block mt-8" to="/book">Book Your Experience</Link>
        </div>
      </section>
    </div>
  );
}
