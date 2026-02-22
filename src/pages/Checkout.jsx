import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { selectCartItems, selectCartTotal, clearCart } from '../store/cartSlice';
import { createOrder } from '../store/orderSlice';

export default function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const { user } = useSelector((state) => state.auth);
    const { loading, error } = useSelector((state) => state.orders);
    const isAdmin = user?.role === 'admin';

    // Admin cannot place orders
    if (isAdmin) return <Navigate to="/admin" replace />;

    const [form, setForm] = useState({
        customerName: user?.name || '',
        phone: user?.phone || '',
        deliveryAddress: user?.address || '',
        paymentMethod: 'Cash on Delivery',
        notes: '',
    });
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [locStatus, setLocStatus] = useState('idle'); // idle | loading | success | error

    // Auto-detect user location
    useEffect(() => {
        if ('geolocation' in navigator) {
            setLocStatus('loading');
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setLocStatus('success');
                },
                () => {
                    setLocStatus('error');
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (items.length === 0) return;

        // For UPI, redirect to WhatsApp with order details
        if (form.paymentMethod === 'UPI') {
            const itemsText = items.map(i => `${i.name} x ${i.quantity}${i.unit} = ₹${(i.price * i.quantity).toFixed(0)}`).join('\n');
            const message = `🐔 *New Order - Goutham Fresh Chicken*\n\n*Customer:* ${form.customerName}\n*Phone:* ${form.phone}\n*Address:* ${form.deliveryAddress}\n\n*Items:*\n${itemsText}\n\n*Total: ₹${total.toFixed(0)}*\n*Payment: UPI*\n\n${form.notes ? `*Notes:* ${form.notes}` : ''}`;
            window.open(`https://wa.me/917349729767?text=${encodeURIComponent(message)}`, '_blank');
            return;
        }

        const orderData = {
            customerName: form.customerName,
            phone: form.phone,
            deliveryAddress: form.deliveryAddress,
            deliveryLocation: location.lat ? location : undefined,
            paymentMethod: form.paymentMethod,
            notes: form.notes,
            totalAmount: total,
            items: items.map(i => ({
                product: i._id,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                unit: i.unit,
            })),
        };

        const result = await dispatch(createOrder(orderData));
        if (createOrder.fulfilled.match(result)) {
            dispatch(clearCart());
            navigate('/order-confirmation');
        }
    };

    // Require login before checkout
    if (!user) {
        navigate('/login?redirect=/checkout');
        return null;
    }

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="pt-[72px] min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-5 py-10">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-5">Delivery Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name *</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={form.customerName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Delivery Address *</label>
                                    <textarea
                                        name="deliveryAddress"
                                        value={form.deliveryAddress}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all resize-none"
                                        placeholder="Enter your full delivery address"
                                    />
                                    {/* Location status */}
                                    <div className="mt-2 flex items-center gap-2 text-xs">
                                        {locStatus === 'loading' && (
                                            <span className="text-amber-600 flex items-center gap-1">
                                                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                                                Detecting your location...
                                            </span>
                                        )}
                                        {locStatus === 'success' && (
                                            <span className="text-green-600 flex items-center gap-1">
                                                ✅ Location detected — delivery will be shown on map
                                            </span>
                                        )}
                                        {locStatus === 'error' && (
                                            <span className="text-gray-400">
                                                📍 Location not available — we'll use your address text
                                            </span>
                                        )}
                                        {locStatus === 'idle' && (
                                            <span className="text-amber-600">📍 We deliver within 5 km of Goutham</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Special Instructions</label>
                                    <input
                                        type="text"
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                        placeholder="e.g., Extra cleaning, specific cut size"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-5">Payment Method</h2>
                            <div className="space-y-3">
                                {[
                                    { value: 'Cash on Delivery', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when you receive your order' },
                                    { value: 'UPI', icon: '📱', label: 'UPI Payment', desc: 'Pay via UPI — will redirect to WhatsApp' },
                                    { value: 'Online Payment', icon: '💳', label: 'Online Payment', desc: 'Coming soon' },
                                ].map(opt => (
                                    <label
                                        key={opt.value}
                                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMethod === opt.value
                                            ? 'border-emerald-500 bg-emerald-50'
                                            : 'border-gray-200 hover:border-emerald-300'
                                            } ${opt.value === 'Online Payment' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={opt.value}
                                            checked={form.paymentMethod === opt.value}
                                            onChange={handleChange}
                                            disabled={opt.value === 'Online Payment'}
                                            className="w-4 h-4 accent-emerald-600"
                                        />
                                        <span className="text-2xl">{opt.icon}</span>
                                        <div>
                                            <p className="font-semibold text-gray-800">{opt.label}</p>
                                            <p className="text-xs text-gray-400">{opt.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl text-lg hover:bg-emerald-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? 'Placing Order...' : `Place Order — ₹${total.toFixed(0)}`}
                        </button>
                    </form>

                    {/* Order Summary sidebar */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-[90px]">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-4">
                                {items.map(item => (
                                    <div key={item._id} className="flex justify-between text-sm">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-700 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400">{item.quantity} {item.unit} × ₹{item.price}</p>
                                        </div>
                                        <span className="font-semibold text-gray-800 ml-2">₹{(item.price * item.quantity).toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{total.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Delivery</span>
                                    <span className="text-green-600 font-semibold">FREE</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between">
                                    <span className="text-lg font-extrabold text-gray-800">Total</span>
                                    <span className="text-lg font-extrabold text-emerald-600">₹{total.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
