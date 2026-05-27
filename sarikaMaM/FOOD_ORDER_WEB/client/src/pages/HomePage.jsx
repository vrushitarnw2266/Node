import { Link } from "react-router-dom";

const cardLink =
  "glass-card hover-lift block rounded-3xl p-6 premium-shadow no-underline text-inherit text-center animate-fade-in";

export function HomePage({ categories }) {
  const specialDishes = [
    { name: "Punjabi Dish", cat: "Punjabi", img: "https://images.unsplash.com/photo-1645495141857-e49b6b5f8dd5?auto=format&fit=crop&w=800&q=80", desc: "Butter Masala, Dal Makhani & more" },
    { name: "Kathiyavadi Dish", cat: "Kathiyavadi", img: "https://images.unsplash.com/photo-1633024477408-f8b7f94f53a5?auto=format&fit=crop&w=800&q=80", desc: "Vagharelo Rotlo, Sev Tameta" },
    { name: "Gujarati Thali", cat: "Gujarati Thali", img: "https://images.unsplash.com/photo-1621996346565-431f63602f41?auto=format&fit=crop&w=800&q=80", desc: "Complete traditional meal" },
    { name: "South Indian", cat: "South Indian", img: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80", desc: "Authentic Sambar & Rasam" },
    { name: "Sizzlers", cat: "Sizzlers", img: "https://images.unsplash.com/photo-1626082563009-c0a54f9d2f5f?auto=format&fit=crop&w=800&q=80", desc: "Smoky, Sizzling, Delicious" },
    { name: "Chinese", cat: "Chinese", img: "https://images.unsplash.com/photo-1609329374519-6c7c09b54d71?auto=format&fit=crop&w=800&q=80", desc: "Noodles & Manchurian" },
    { name: "Pastas", cat: "Pastas", img: "https://images.unsplash.com/photo-1645112481338-30115ed71597?auto=format&fit=crop&w=800&q=80", desc: "Italian Favorites" },
    { name: "Biryani", cat: "Biryani", img: "https://images.unsplash.com/photo-1633024477408-f8b7f94f53a5?auto=format&fit=crop&w=800&q=80", desc: "Aromatic Rice Dishes" },
  ];

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
            <Link className="btn-gradient px-8 py-3 text-lg no-underline" to="/order">Explore Menu</Link>
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
          {specialDishes.map((item) => (
            <Link 
              key={item.name} 
              to={`/category/${encodeURIComponent(item.cat)}`}
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

      <section className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-kk-dark mb-2">Browse All <span className="text-kk-red">Categories</span></h2>
          <p className="text-kk-dark/60">13 different cuisines to choose from</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat) => (
            <Link 
              key={cat} 
              to={`/category/${encodeURIComponent(cat)}`}
              className="glass-card p-6 rounded-2xl text-center no-underline transition-all hover:bg-kk-red/5 hover:-translate-y-1"
            >
              <div className="text-3xl mb-2">
                {cat.includes('Thali') ? '🍱' : cat === 'Punjabi' ? '🍲' : cat === 'Kathiyavadi' ? '🥣' : cat === 'South Indian' ? '🍛' : cat === 'Pizza' ? '🍕' : cat === 'Burger' ? '🍔' : cat === 'Lasagna' ? '🥘' : cat === 'Tacos' ? '🌮' : cat === 'Sizzlers' ? '🔥' : cat === 'Snacks' ? '🍟' : cat === 'Biryani' ? '🍛' : cat === 'Chinese' ? '🍜' : cat === 'Pastas' ? '🍝' : '🍽️'}
              </div>
              <h4 className="m-0 font-bold text-kk-dark">{cat}</h4>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-kk-red/10 to-kk-red-dark/10 rounded-[2rem] p-12 text-center">
        <h2 className="text-3xl font-black text-kk-dark mb-4">Why Choose My Vaggie?</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="space-y-2">
            <div className="text-4xl">🌱</div>
            <h3 className="font-bold">100% Vegetarian</h3>
            <p className="text-kk-dark/60">Pure veg kitchen with authentic recipes</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">⚡</div>
            <h3 className="font-bold">Fast Delivery</h3>
            <p className="text-kk-dark/60">Hot meals delivered in 30-45 minutes</p>
          </div>
          <div className="space-y-2">
            <div className="text-4xl">🏆</div>
            <h3 className="font-bold">Premium Quality</h3>
            <p className="text-kk-dark/60">Best ingredients & master chefs</p>
          </div>
        </div>
      </section>
    </section>
  );
}
