import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderStats } from '../../store/orderSlice';

const navItems = [
    { to: '/admin', label: '📊 Dashboard', exact: true },
    { to: '/admin/products', label: '🥩 Products' },
    { to: '/admin/orders', label: '📦 Orders' },
];

export default function Dashboard() {
    const dispatch = useDispatch();
    const location = useLocation();
    const { stats } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrderStats());
    }, [dispatch]);

    const isExactAdmin = location.pathname === '/admin';

    return (
        <div className="pt-[72px] min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-5 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-800">Admin Panel</h1>
                        <p className="text-gray-400 text-sm">Manage your products, orders, and more</p>
                    </div>
                    <Link to="/" className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
                        ← Back to Store
                    </Link>
                </div>

                {/* Nav tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {navItems.map(item => {
                        const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${isActive
                                    ? 'bg-red-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Dashboard content or nested route */}
                {isExactAdmin ? (
                    <div>
                        {/* Stats cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: "Today's Orders", value: stats?.todayOrders || 0, icon: '📦', color: 'bg-blue-50 text-blue-700' },
                                { label: 'Pending', value: stats?.pendingOrders || 0, icon: '⏳', color: 'bg-amber-50 text-amber-700' },
                                { label: 'Preparing', value: stats?.preparingOrders || 0, icon: '🍳', color: 'bg-purple-50 text-purple-700' },
                                { label: 'Delivered', value: stats?.deliveredOrders || 0, icon: '✅', color: 'bg-green-50 text-green-700' },
                            ].map(stat => (
                                <div key={stat.label} className={`${stat.color} rounded-xl p-5 border transition-all hover:shadow-md`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl">{stat.icon}</span>
                                    </div>
                                    <p className="text-3xl font-extrabold">{stat.value}</p>
                                    <p className="text-sm font-medium opacity-70">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Revenue card */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white mb-8">
                            <p className="text-sm font-medium text-red-100 mb-1">Total Revenue</p>
                            <p className="text-4xl font-black">₹{(stats?.totalRevenue || 0).toLocaleString()}</p>
                            <p className="text-sm text-red-200 mt-2">{stats?.totalOrders || 0} total orders</p>
                        </div>

                        {/* Quick links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link to="/admin/products" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group">
                                <span className="text-3xl block mb-3">🥩</span>
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">Manage Products</h3>
                                <p className="text-sm text-gray-400 mt-1">Add, edit, or remove products and update prices</p>
                            </Link>
                            <Link to="/admin/orders" className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all group">
                                <span className="text-3xl block mb-3">📦</span>
                                <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">Manage Orders</h3>
                                <p className="text-sm text-gray-400 mt-1">View and update order statuses</p>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <Outlet />
                )}
            </div>
        </div>
    );
}
