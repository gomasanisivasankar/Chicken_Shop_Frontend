import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productSlice';
import ProductCard from '../components/ProductCard';

const testimonials = [
    { name: 'Rajesh K.', text: 'Best chicken quality in Goutham! Always fresh and on time delivery. My family loves it.', rating: 5 },
    { name: 'Priya M.', text: 'Very hygienic and clean chicken. Prices are also very reasonable. Highly recommended!', rating: 5 },
    { name: 'Suresh B.', text: 'I order every week for my restaurant. Consistent quality and great customer service.', rating: 5 },
];

export default function Home() {
    const dispatch = useDispatch();
    const { items: products } = useSelector((state) => state.products);
    const specials = products.filter(p => p.isSpecial);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    return (
        <div className="pt-[72px]">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=1200')] bg-cover bg-center opacity-15"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/80 to-red-700/60"></div>

                {/* Decorative elements */}
                <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl"></div>

                <div className="relative max-w-7xl mx-auto px-5 py-20 md:py-28 flex flex-col md:flex-row items-center gap-10">
                    {/* Left: Text */}
                    <div className="flex-1 text-center md:text-left">
                        <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in-up">
                            🐔 Goutham's Favourite Chicken Shop
                        </span>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Fresh, Hygienic &<br />
                            <span className="text-yellow-400">Same-Day Delivery</span>
                        </h1>

                        <p className="text-lg md:text-xl text-red-100 max-w-xl mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Order premium quality chicken from the comfort of your home.
                            Cleaned, cut & delivered fresh within hours in the Goutham area.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up justify-center md:justify-start" style={{ animationDelay: '0.3s' }}>
                            <Link to="/menu" className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-xl text-lg hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                                🍗 Order Now
                            </Link>
                            <a href="https://wa.me/917349729767" target="_blank" rel="noreferrer" className="px-8 py-4 bg-white/15 backdrop-blur-sm text-white font-bold rounded-xl text-lg border-2 border-white/30 hover:bg-white/25 hover:-translate-y-1 transition-all duration-300">
                                💬 WhatsApp Us
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            {[
                                { label: 'Happy Customers', value: '2,000+' },
                                { label: 'Daily Orders', value: '100+' },
                                { label: 'Years Serving', value: '5+' },
                            ].map(s => (
                                <div key={s.label} className="text-center md:text-left">
                                    <div className="text-2xl md:text-3xl font-black text-yellow-400">{s.value}</div>
                                    <div className="text-xs md:text-sm text-red-200 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Live Hen Image */}
                    <div className="flex-1 relative flex justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <div className="absolute w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        <img
                            src="/broiler-chicken.png"
                            alt="Broiler Chicken"
                            className="relative w-72 md:w-96 h-72 md:h-96 object-cover rounded-3xl shadow-2xl border-4 border-white/20 hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-5">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-3">Why Choose Us?</h2>
                    <p className="text-center text-gray-500 mb-12 text-lg">Quality and freshness you can trust</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '🥩', title: 'Farm Fresh', desc: 'Sourced directly from local farms every morning' },
                            { icon: '🧼', title: '100% Hygienic', desc: 'Cleaned and processed in hygienic conditions' },
                            { icon: '🚚', title: 'Fast Delivery', desc: 'Delivered to your doorstep within 2 hours' },
                            { icon: '💰', title: 'Best Prices', desc: 'Wholesale rates directly to your home' },
                        ].map(f => (
                            <div key={f.title} className="bg-white p-8 rounded-xl border border-gray-200 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">{f.icon}</span>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-500">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Today's Specials */}
            {specials.length > 0 && (
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-5">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-3">🔥 Today's Special Offers</h2>
                        <p className="text-center text-gray-500 mb-12 text-lg">Grab today's best deals before they're gone!</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {specials.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        <div className="text-center mt-10">
                            <Link to="/menu" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                View Full Menu →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Testimonials */}
            <section className="py-20 bg-gradient-to-br from-red-50 to-amber-50">
                <div className="max-w-7xl mx-auto px-5">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-3">What Our Customers Say</h2>
                    <p className="text-center text-gray-500 mb-12 text-lg">Trusted by thousands of families in Goutham</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                                <div className="text-yellow-400 text-xl mb-4">{'⭐'.repeat(t.rating)}</div>
                                <p className="text-gray-600 italic leading-relaxed mb-6">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center">
                                        {t.name[0]}
                                    </div>
                                    <span className="font-semibold text-gray-800">{t.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gray-900 text-white text-center">
                <div className="max-w-3xl mx-auto px-5">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Order Fresh Chicken?</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Place your order now and get same-day delivery to your doorstep in the Goutham area.
                    </p>
                    <Link to="/menu" className="inline-flex px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-xl text-lg hover:bg-yellow-300 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                        🍗 Browse Menu & Order
                    </Link>
                </div>
            </section>
        </div>
    );
}
