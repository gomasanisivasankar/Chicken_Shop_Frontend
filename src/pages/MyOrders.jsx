import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, cancelOrder } from '../store/orderSlice';

const statusColors = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Preparing: 'bg-blue-100 text-blue-700 border-blue-200',
    'Out for Delivery': 'bg-purple-100 text-purple-700 border-purple-200',
    Delivered: 'bg-green-100 text-green-700 border-green-200',
    Cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const statusIcons = {
    Pending: '⏳',
    Preparing: '🍳',
    'Out for Delivery': '🚴',
    Delivered: '✅',
    Cancelled: '❌',
};

export default function MyOrders() {
    const dispatch = useDispatch();
    const { items: orders, loading } = useSelector((state) => state.orders);
    const { user } = useSelector((state) => state.auth);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        if (user) dispatch(fetchOrders());
    }, [dispatch, user]);

    const handleCancel = async (id) => {
        await dispatch(cancelOrder(id));
        setCancellingId(null);
    };

    if (!user) {
        return (
            <div className="pt-[72px] min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <span className="text-5xl block mb-4">🔒</span>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Please login to view your orders</h2>
                    <Link to="/login" className="text-emerald-600 font-semibold hover:underline">Login →</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-[72px] min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-5 py-10">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-2">My Orders</h1>
                <p className="text-gray-400 mb-8">Track and manage your chicken orders</p>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <span className="text-6xl block mb-4">🛒</span>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
                        <p className="text-gray-400 mb-6">You haven't placed any orders yet</p>
                        <Link to="/menu" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all">
                            Browse Menu
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => {
                            const canCancel = ['Pending', 'Preparing'].includes(order.status);
                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{statusIcons[order.status] || '📦'}</span>
                                            <div>
                                                <h3 className="font-bold text-gray-800">
                                                    Order #{order._id.slice(-8).toUpperCase()}
                                                </h3>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                            <span className="text-lg font-extrabold text-gray-800">₹{order.totalAmount}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {order.items.map((item, i) => (
                                            <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-500">
                                                {item.name} × {item.quantity}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-sm text-gray-400">{order.paymentMethod}</span>
                                        <div className="flex items-center gap-3">
                                            {canCancel && (
                                                cancellingId === order._id ? (
                                                    <span className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleCancel(order._id)}
                                                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all"
                                                        >
                                                            Yes, Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => setCancellingId(null)}
                                                            className="px-3 py-1.5 text-gray-500 text-xs font-bold hover:text-gray-700 transition-all"
                                                        >
                                                            Keep
                                                        </button>
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => setCancellingId(order._id)}
                                                        className="px-3 py-1.5 border border-red-200 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-50 transition-all"
                                                    >
                                                        ❌ Cancel
                                                    </button>
                                                )
                                            )}
                                            <Link
                                                to={`/orders/${order._id}`}
                                                className="text-sm text-emerald-600 font-semibold hover:underline"
                                            >
                                                Track Order →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
