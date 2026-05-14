import { Link } from "react-router-dom";

const cardLink =
  "glass-card hover-lift block rounded-3xl p-6 premium-shadow no-underline text-inherit text-center animate-fade-in";
export function OrderNowPage({ categories }) {
  return (
    <section className="animate-fade-in space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-black text-kk-dark">Our Full <span className="text-kk-red">Menu</span></h2>
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
              {cat.includes('Thali') ? '🍱' : cat === 'Punjabi' ? '🍲' : cat === 'Kathiyavadi' ? '🥣' : cat === 'South Indian' ? '🍛' : cat === 'Pizza' ? '🍕' : cat === 'Burger' ? '🍔' : cat === 'Lasagna' ? '🥘' : cat === 'Tacos' ? '🌮' : cat === 'Sizzlers' ? '🔥' : cat === 'Snacks' ? '🍟' : cat === 'Biryani' ? '🍛' : '🍽️'}
            </div>
            <div>
              <h3 className="m-0 text-xl font-bold text-kk-dark group-hover:text-kk-red transition-colors">{cat}</h3>
              <p className="m-0 mt-2 text-xs font-bold text-kk-red uppercase tracking-widest opacity-60">View Variety</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
