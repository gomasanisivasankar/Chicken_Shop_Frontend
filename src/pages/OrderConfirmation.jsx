import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function OrderConfirmation() {
    const { currentOrder } = useSelector((state) => state.orders);

    return (
        <div className="pt-[72px] min-h-screen bg-gray-50 flex items-center justify-center px-5">
            <div className="max-w-lg w-full bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-lg animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">✅</span>
                </div>

                <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Order Placed Successfully!</h1>
                <p className="text-gray-500 mb-6">
                    Thank you for your order. We'll prepare your fresh chicken and deliver it soon!
                </p>

                {currentOrder && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Order ID</span>
                            <span className="font-mono font-semibold text-gray-700">{currentOrder._id?.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Amount</span>
                            <span className="font-bold text-emerald-600">₹{currentOrder.totalAmount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Payment</span>
                            <span className="font-medium text-gray-700">{currentOrder.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Status</span>
                            <span className="inline-flex px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">
                                {currentOrder.status}
                            </span>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {currentOrder && (
                        <Link to={`/orders/${currentOrder._id}`} className="block w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all">
                            📍 Track Order
                        </Link>
                    )}
                    <Link to="/my-orders" className="block w-full py-3 border-2 border-emerald-200 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all">
                        📦 View All Orders
                    </Link>
                    <Link to="/menu" className="block w-full py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-gray-300 transition-all">
                        Order More
                    </Link>
                </div>

                <p className="mt-6 text-xs text-gray-400">
                    💬 Have questions? <a href="https://wa.me/917349729767" target="_blank" rel="noreferrer" className="text-green-600 font-medium hover:underline">WhatsApp us</a>
                </p>
            </div>
        </div>
    );
}
