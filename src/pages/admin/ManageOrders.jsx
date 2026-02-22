import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../../store/orderSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const statusColors = {
    Pending: 'bg-amber-100 text-amber-700',
    Preparing: 'bg-blue-100 text-blue-700',
    'Out for Delivery': 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
};

const statuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function ManageOrders() {
    const dispatch = useDispatch();
    const { items: orders, loading } = useSelector((state) => state.orders);
    const [expandedMap, setExpandedMap] = useState(null);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleStatusChange = (id, status) => {
        dispatch(updateOrderStatus({ id, status }));
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Orders ({orders.length})</h2>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <span className="text-5xl block mb-4">📦</span>
                    <p className="text-gray-400 text-lg">No orders yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => {
                        const hasLocation = order.deliveryLocation?.lat && order.deliveryLocation?.lng;
                        const isMapExpanded = expandedMap === order._id;

                        return (
                            <div key={order._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-gray-800">#{order._id.slice(-8).toUpperCase()}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium focus:border-red-500 outline-none transition-all"
                                        >
                                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-400 text-xs font-medium uppercase mb-1">Customer</p>
                                        <p className="font-semibold text-gray-700">{order.customerName}</p>
                                        <p className="text-gray-400">{order.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-medium uppercase mb-1">Delivery</p>
                                        <p className="text-gray-600">{order.deliveryAddress}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-medium uppercase mb-1">Payment</p>
                                        <p className="font-semibold text-gray-700">{order.paymentMethod}</p>
                                        <p className="text-xl font-extrabold text-red-600 mt-1">₹{order.totalAmount}</p>
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-medium text-gray-400 uppercase mb-2">Items</p>
                                    <div className="flex flex-wrap gap-2">
                                        {order.items.map((item, i) => (
                                            <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                                                {item.name} × {item.quantity} {item.unit}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {order.notes && (
                                    <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-700">
                                        📝 {order.notes}
                                    </div>
                                )}

                                {/* Google Maps + Map toggle */}
                                {hasLocation && (
                                    <div className="mt-4 flex flex-col gap-3">
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&origin=Attiguppe+Metro+Station,+Bangalore&destination=${order.deliveryLocation.lat},${order.deliveryLocation.lng}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all w-fit"
                                        >
                                            🗺️ Navigate in Google Maps
                                        </a>
                                        <button
                                            onClick={() => setExpandedMap(isMapExpanded ? null : order._id)}
                                            className="text-sm font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                                        >
                                            📍 {isMapExpanded ? 'Hide Map' : 'View on Map'}
                                        </button>
                                        {isMapExpanded && (
                                            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '250px' }}>
                                                <MapContainer
                                                    center={[order.deliveryLocation.lat, order.deliveryLocation.lng]}
                                                    zoom={15}
                                                    scrollWheelZoom={false}
                                                    style={{ height: '100%', width: '100%' }}
                                                >
                                                    <TileLayer
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    />
                                                    <Marker position={[order.deliveryLocation.lat, order.deliveryLocation.lng]}>
                                                        <Popup>
                                                            <strong>{order.customerName}</strong><br />
                                                            {order.deliveryAddress}<br />
                                                            📞 {order.phone}
                                                        </Popup>
                                                    </Marker>
                                                </MapContainer>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
