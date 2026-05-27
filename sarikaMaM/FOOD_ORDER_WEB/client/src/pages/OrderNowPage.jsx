import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  withCredentials: true,
});

export function OrderNowPage({ categories }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data } = await api.get("/api/foods/featured");
        setFeatured(data.foods || []);
      } catch (err) {
        console.error("Failed to fetch featured foods", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <section className="animate-fade-in space-y-16">
      {/* Categories Section */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-kk-dark">Browse by <span className="text-kk-red">Category</span></h2>
          <p className="text-kk-dark/60 mt-2 font-medium">From traditional Indian Thalis to global favorites.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link 
              key={cat} 
              to={`/category/${encodeURIComponent(cat)}`} 
              className="glass-card group flex flex-col items-center gap-4 rounded-[2.5rem] p-10 text-center no-underline transition-all hover:-translate-y-2 hover:bg-kk-red/5"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-kk-dark/5 text-4xl group-hover:scale-110 transition-transform">
                {cat.includes('Thali') ? '🍱' : cat === 'Punjabi' ? '🍲' : cat === 'Kathiyavadi' ? '🥣' : cat === 'South Indian' ? '🍛' : cat === 'Pizza' ? '🍕' : cat === 'Burger' ? '🍔' : cat === 'Lasagna' ? '🥘' : cat === 'Tacos' ? '🌮' : cat === 'Sizzlers' ? '🔥' : cat === 'Snacks' ? '🍟' : cat === 'Biryani' ? '🍛' : 'Chinese' ? '🍜' : '🍽️'}
              </div>
              <div>
                <h3 className="m-0 text-xl font-bold text-kk-dark group-hover:text-kk-red transition-colors">{cat}</h3>
                <p className="m-0 mt-2 text-xs font-bold text-kk-red uppercase tracking-widest opacity-60">View Variety</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Foods Section */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-kk-dark">Our <span className="text-kk-red">Specialties</span></h2>
          <p className="text-kk-dark/60 mt-2 font-medium">Handpicked favorites from across our menu.</p>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading featured foods...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((food) => (
              <article key={food._id} className="glass-card hover-lift rounded-[2rem] overflow-hidden premium-shadow transition-all hover:-translate-y-2">
                {food.imageUrl && (
                  <div className="h-40 w-full overflow-hidden">
                    <img src={food.imageUrl} alt={food.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="m-0 text-lg font-black text-kk-dark mb-2 line-clamp-2">{food.name}</h3>
                  <p className="text-xs font-bold text-kk-red/60 uppercase tracking-wider mb-3">{food.category}</p>
                  <p className="text-sm font-medium text-kk-dark/70 leading-relaxed mb-4 line-clamp-2">{food.description}</p>
                  <div className="flex items-center justify-between border-t border-kk-dark/5 pt-3">
                    <div>
                      <p className="m-0 text-xs font-bold uppercase tracking-widest text-kk-dark/50">Price</p>
                      <p className="m-0 font-bold text-kk-dark">Rs {food.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="m-0 text-xs font-bold uppercase tracking-widest text-kk-dark/50">Prep</p>
                      <p className="m-0 font-medium text-kk-dark/80">{food.prepMinutes}m</p>
                    </div>
                  </div>
                  <Link to={`/category/${encodeURIComponent(food.category)}`} className="btn-gradient mt-4 w-full inline-block text-center no-underline">
                    View Category
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

