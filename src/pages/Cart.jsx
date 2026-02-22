import { useSelector, useDispatch } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart, selectCartItems, selectCartTotal } from '../store/cartSlice';


export default function Cart() {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const { user } = useSelector((state) => state.auth);
    const isAdmin = user?.role === 'admin';

    // Admin cannot place orders
    if (isAdmin) return <Navigate to="/admin" replace />;

    if (items.length === 0) {
        return (
            <div className="pt-[72px] min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-5">
                <span className="text-7xl mb-6">🛒</span>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-400 mb-6">Add some delicious fresh chicken from our menu!</p>
                <Link to="/menu" className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all">
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-[72px] min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-5 py-10">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Your Cart</h1>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                    {items.map((item, idx) => (
                        <div key={item._id} className={`p-4 ${idx !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            {/* Top row: image, name, remove */}
                            <div className="flex items-start gap-3">
                                <img
                                    src={item.image || 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400'}
                                    alt={item.name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{item.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-400">{item.category}</p>
                                    <p className="text-red-600 font-bold text-sm">₹{item.price}/{item.unit}</p>
                                </div>
                                <button
                                    onClick={() => dispatch(removeFromCart(item._id))}
                                    className="text-gray-300 hover:text-red-500 transition-colors text-lg flex-shrink-0 p-1"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Bottom row: quantity + total */}
                            <div className="flex items-center justify-between mt-3 ml-[62px] sm:ml-[76px]">
                                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                                    <button
                                        className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-700 font-semibold flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                                        onClick={() =>
                                            item.quantity <= 0.5
                                                ? dispatch(removeFromCart(item._id))
                                                : dispatch(updateQuantity({ productId: item._id, quantity: item.quantity - 0.5 }))
                                        }
                                    >
                                        −
                                    </button>
                                    <span className="text-sm font-semibold min-w-[40px] text-center">{item.quantity}</span>
                                    <button
                                        className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-700 font-semibold flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                                        onClick={() => dispatch(updateQuantity({ productId: item._id, quantity: item.quantity + 0.5 }))}
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="font-bold text-gray-800 text-base">₹{(item.price * item.quantity).toFixed(0)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500">Subtotal ({items.length} items)</span>
                        <span className="font-bold text-lg">₹{total.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500">Delivery</span>
                        <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                        <span className="text-xl font-extrabold text-gray-800">Total</span>
                        <span className="text-2xl font-extrabold text-red-600">₹{total.toFixed(0)}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        {user ? (
                            <Link
                                to="/checkout"
                                className="flex-1 px-6 py-3.5 bg-emerald-600 text-white text-center font-bold rounded-xl hover:bg-emerald-700 hover:-translate-y-0.5 transition-all text-lg shadow-md"
                            >
                                Proceed to Checkout
                            </Link>
                        ) : (
                            <Link
                                to="/login?redirect=/checkout"
                                className="flex-1 px-6 py-3.5 bg-emerald-600 text-white text-center font-bold rounded-xl hover:bg-emerald-700 hover:-translate-y-0.5 transition-all text-lg shadow-md"
                            >
                                🔒 Login to Checkout
                            </Link>
                        )}
                        <button
                            onClick={() => dispatch(clearCart())}
                            className="px-6 py-3.5 border-2 border-gray-300 text-gray-500 font-semibold rounded-xl hover:border-red-300 hover:text-red-500 transition-all"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
