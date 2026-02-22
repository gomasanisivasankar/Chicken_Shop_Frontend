import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity, selectCartItems } from '../store/cartSlice';

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const cartItem = cartItems.find(i => i._id === product._id);

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={product.image || 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400'}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {product.isSpecial && (
                    <span className="absolute top-3 left-3 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                        ⭐ Today's Special
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-red-600 mb-1">{product.category}</span>
                <h3 className="text-base font-bold text-gray-800 leading-snug mb-1">{product.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-3">{product.description}</p>

                <div className="flex items-center justify-between gap-3">
                    {/* Price */}
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-extrabold text-red-600">₹{product.price}</span>
                        <span className="text-sm text-gray-400 font-medium">/{product.unit}</span>
                    </div>

                    {/* Cart controls */}
                    {cartItem ? (
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-700 font-semibold text-lg flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                                onClick={() =>
                                    cartItem.quantity <= 0.5
                                        ? dispatch(removeFromCart(product._id))
                                        : dispatch(updateQuantity({ productId: product._id, quantity: cartItem.quantity - 0.5 }))
                                }
                            >
                                −
                            </button>
                            <span className="text-sm font-semibold min-w-[50px] text-center text-gray-700">
                                {cartItem.quantity} {product.unit}
                            </span>
                            <button
                                className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-700 font-semibold text-lg flex items-center justify-center hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                                onClick={() => dispatch(updateQuantity({ productId: product._id, quantity: cartItem.quantity + 0.5 }))}
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 hover:-translate-y-0.5 transition-all shadow-sm"
                            onClick={() => dispatch(addToCart({ product }))}
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
