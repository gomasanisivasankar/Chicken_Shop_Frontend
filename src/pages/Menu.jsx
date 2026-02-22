import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/productSlice';
import { selectCartItems } from '../store/cartSlice';
import ProductCard from '../components/ProductCard';

const categories = [
    'All',
    'Whole Chicken',
    'Chicken Curry Cut',
    'Boneless Chicken',
    'Chicken Wings',
    'Chicken Liver & Gizzard',
];

export default function Menu() {
    const dispatch = useDispatch();
    const { items: products, loading } = useSelector((state) => state.products);
    const cartItems = useSelector(selectCartItems);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const filtered = activeCategory === 'All'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="pt-[72px] min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 to-red-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-5 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Our Fresh Chicken Menu</h1>
                    <p className="text-red-100 text-lg">Choose from our premium selection — priced per kg</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-5 py-10">
                {/* Category tabs */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === cat
                                ? 'bg-red-600 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="text-5xl block mb-4">🐔</span>
                        <p className="text-gray-400 text-lg">No products available in this category right now.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Go to Cart button */}
            {cartItems.length > 0 && (
                <Link
                    to="/cart"
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-full shadow-lg hover:bg-emerald-700 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-bounce-in"
                >
                    🛒 Go to Cart
                    <span className="bg-white text-emerald-700 text-sm font-extrabold w-6 h-6 rounded-full flex items-center justify-center">
                        {cartItems.length}
                    </span>
                </Link>
            )}
        </div>
    );
}
