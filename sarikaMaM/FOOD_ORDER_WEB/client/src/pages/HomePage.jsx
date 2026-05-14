import { Link } from "react-router-dom";

const cardLink =
  "glass-card hover-lift block rounded-3xl p-6 premium-shadow no-underline text-inherit text-center animate-fade-in";

export function HomePage({ categories }) {
  return (
    <section className="space-y-12">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#1d1d1f] p-12 text-white premium-shadow">
        <div className="relative z-10 max-w-2xl">
          <h2 className="mt-0 text-4xl font-bold leading-tight sm:text-5xl">
            Exquisite Vegetarian <span className="text-kk-red">Flavors</span>
          </h2>
          <p className="mt-6 text-lg text-white/70 leading-relaxed">
            Experience the finest collection of pure vegetarian delights. From smoky pizzas to sizzling Chinese, we bring the gourmet kitchen to your doorstep.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link className="btn-gradient px-8 py-3 text-lg" to="/order">Explore Menu</Link>
            <Link className="rounded-xl border-2 border-white/20 bg-white/10 px-8 py-3 font-semibold text-white no-underline backdrop-blur-md transition hover:bg-white/20" to="/book">Book Table</Link>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[-10%] h-[120%] w-[50%] bg-gradient-to-l from-kk-red/20 to-transparent blur-3xl"></div>
      </div>

      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-kk-dark mb-4">Our <span className="text-kk-red">Special Dishes</span></h2>
          <p className="text-kk-dark/60 max-w-2xl mx-auto font-medium">Experience the authentic taste of India with our hand-picked traditional specialties.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: "Punjabi Dish", cat: "Punjabi", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80", desc: "Butter Masala, Dal Makhani & more" },
            { name: "Kathiyavadi Dish", cat: "Kathiyavadi", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80", desc: "Vagharelo Rotlo, Sev Tameta" },
            { name: "Gujarati Thali", cat: "Gujarati Thali", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc9?auto=format&fit=crop&w=800&q=80", desc: "Complete traditional meal" },
            { name: "South Thali", cat: "South Indian", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", desc: "Authentic Sambar & Rasam" },
            { name: "Exotic Sizzlers", cat: "Sizzlers", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80", desc: "Smoky, Sizzling, Delicious" },
            { name: "Mexican Tacos", cat: "Tacos", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80", desc: "Spicy Paneer & Bean Fusion" },
            { name: "Classic Lasagna", cat: "Lasagna", img: "https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=800&q=80", desc: "Layers of cheesy goodness" },
            { name: "Special Biryani", cat: "Biryani", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80", desc: "Aromatic Hyderabadi flavor" }
          ].map((item) => (
            <Link 
              key={item.name} 
              to={`/category/${item.cat}`}
              className="group relative overflow-hidden rounded-[2.5rem] glass-card premium-shadow border-0 no-underline transition-all hover:-translate-y-2"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img src={item.img} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-kk-dark/90 via-kk-dark/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 p-8 w-full">
                <h3 className="text-2xl font-black text-white m-0 mb-2">{item.name}</h3>
                <p className="text-white/70 text-sm m-0 font-medium">{item.desc}</p>
                <div className="mt-4 flex items-center text-kk-red font-bold text-sm">
                  Explore Menu <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
