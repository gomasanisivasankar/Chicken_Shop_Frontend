import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderById, cancelOrder } from '../store/orderSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue in Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const steps = [
    { key: 'Pending', label: 'Order Placed', icon: '📋', desc: 'Your order has been received' },
    { key: 'Preparing', label: 'Preparing', icon: '🍳', desc: 'Your chicken is being freshly cut & cleaned' },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: '🚴', desc: 'Rider is on the way to you' },
    { key: 'Delivered', label: 'Delivered', icon: '✅', desc: 'Order has been delivered!' },
];

function getStepIndex(status) {
    if (status === 'Cancelled') return -1;
    return steps.findIndex(s => s.key === status);
}

export default function OrderTracking() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { trackingOrder: order, loading, error } = useSelector((state) => state.orders);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    useEffect(() => {
        dispatch(fetchOrderById(id));
    }, [dispatch, id]);

    const handleCancel = async () => {
        await dispatch(cancelOrder(order._id));
        setShowCancelConfirm(false);
    };

    if (loading) {
        return (
            <div className="pt-[72px] min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="pt-[72px] min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <span className="text-5xl block mb-4">❌</span>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{error || 'Order not found'}</h2>
                    <Link to="/my-orders" className="text-emerald-600 font-semibold hover:underline">← Back to Orders</Link>
                </div>
            </div>
        );
    }

    const currentStep = getStepIndex(order.status);
    const isCancelled = order.status === 'Cancelled';
    const canCancel = ['Pending', 'Preparing'].includes(order.status);
    const hasLocation = order.deliveryLocation?.lat && order.deliveryLocation?.lng;

    return (
        <div className="pt-[72px] min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-5 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link to="/my-orders" className="text-sm text-emerald-600 font-semibold hover:underline mb-2 block">← Back to Orders</Link>
                        <h1 className="text-2xl font-extrabold text-gray-800">Order #{order._id.slice(-8).toUpperCase()}</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-extrabold text-gray-800">₹{order.totalAmount}</p>
                        <p className="text-xs text-gray-400">{order.paymentMethod}</p>
                    </div>
                </div>

                {/* Cancelled banner */}
                {isCancelled && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <span className="text-2xl">❌</span>
                        <div>
                            <p className="font-bold text-red-700">Order Cancelled</p>
                            <p className="text-sm text-red-500">This order has been cancelled</p>
                        </div>
                    </div>
                )}

                {/* Status Stepper */}
                {!isCancelled && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-6">Order Status</h2>
                        <div className="relative">
                            {/* Progress line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            <div
                                className="absolute left-6 top-0 w-0.5 bg-emerald-500 transition-all duration-700"
                                style={{ height: `${Math.max(0, currentStep) * 33.33}%` }}
                            ></div>

                            <div className="space-y-8">
                                {steps.map((step, i) => {
                                    const isDone = i <= currentStep;
                                    const isCurrent = i === currentStep;
                                    return (
                                        <div key={step.key} className="relative flex items-start gap-5 pl-0">
                                            <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${isDone
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                                                : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                                                } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}>
                                                {step.icon}
                                            </div>
                                            <div className="pt-1">
                                                <h3 className={`font-bold text-base ${isDone ? 'text-gray-800' : 'text-gray-400'}`}>
                                                    {step.label}
                                                    {isCurrent && (
                                                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                            Current
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className={`text-sm mt-0.5 ${isDone ? 'text-gray-500' : 'text-gray-300'}`}>{step.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancel Order Button */}
                {canCancel && !isCancelled && (
                    <div className="mb-6">
                        {showCancelConfirm ? (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                    <p className="font-bold text-red-700">Are you sure you want to cancel this order?</p>
                                    <p className="text-sm text-red-500">This action cannot be undone.</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Cancelling...' : 'Yes, Cancel Order'}
                                    </button>
                                    <button
                                        onClick={() => setShowCancelConfirm(false)}
                                        className="px-5 py-2.5 border-2 border-gray-300 text-gray-600 font-semibold rounded-lg hover:border-gray-400 transition-all"
                                    >
                                        Keep Order
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowCancelConfirm(true)}
                                className="w-full py-3 border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all"
                            >
                                ❌ Cancel Order
                            </button>
                        )}
                    </div>
                )}


                {/* Order details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">🛒 Order Items</h2>
                        <div className="space-y-3">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="font-medium text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-400">{item.quantity} {item.unit} × ₹{item.price}</p>
                                    </div>
                                    <span className="font-bold text-gray-700">₹{(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                            <span className="font-bold text-gray-800">Total</span>
                            <span className="font-extrabold text-emerald-600 text-lg">₹{order.totalAmount}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Details</h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-medium">Customer</p>
                                <p className="font-semibold text-gray-700">{order.customerName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-medium">Phone</p>
                                <p className="font-semibold text-gray-700">{order.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-medium">Address</p>
                                <p className="text-gray-600">{order.deliveryAddress}</p>
                            </div>
                            {order.notes && (
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-medium">Notes</p>
                                    <p className="text-gray-600">{order.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
