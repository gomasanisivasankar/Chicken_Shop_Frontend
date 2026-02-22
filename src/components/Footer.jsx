import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 mt-16">
            <div className="max-w-7xl mx-auto px-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-gray-700">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">🐔</span>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">Goutham Fresh Chicken</h3>
                                <p className="text-xs text-amber-400">Fresh, Hygienic & Same-Day Delivery</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Delivering fresh, hygienic chicken right to your doorstep in the Goutham area.
                            Quality you can trust, prices you'll love!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
                        <div className="flex flex-col gap-2.5">
                            <Link to="/" className="text-sm text-gray-400 hover:text-amber-400 hover:pl-1 transition-all">Home</Link>
                            <Link to="/menu" className="text-sm text-gray-400 hover:text-amber-400 hover:pl-1 transition-all">Menu</Link>
                            <Link to="/cart" className="text-sm text-gray-400 hover:text-amber-400 hover:pl-1 transition-all">Cart</Link>
                            <Link to="/login" className="text-sm text-gray-400 hover:text-amber-400 hover:pl-1 transition-all">Login</Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h4>
                        <div className="flex flex-col gap-2.5 text-sm text-gray-400">
                            <a href="tel:+917349729767" className="hover:text-amber-400 transition-colors">📞 +91 73497 29767</a>
                            <a href="https://wa.me/917349729767" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition-colors">💬 WhatsApp</a>
                            <p>📍 Attiguppe Metro Station, Bangalore, India</p>
                            <p>⏰ 7:00 AM - 8:00 PM</p>
                        </div>
                    </div>
                </div>

                <div className="py-6 text-center text-sm text-gray-500">
                    <p>© 2026 Goutham Fresh Chicken. All rights reserved.</p>
                    <p className="mt-1 text-xs text-gray-600">Made with ❤️ for fresh chicken lovers</p>
                </div>
            </div>
        </footer>
    );
}
