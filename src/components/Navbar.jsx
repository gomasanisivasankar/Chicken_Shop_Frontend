import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { selectCartCount } from '../store/cartSlice';

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const cartCount = useSelector(selectCartCount);
    const [menuOpen, setMenuOpen] = useState(false);
    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setMenuOpen(false);
    };

    const close = () => setMenuOpen(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 h-[72px]">
            <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-full">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2.5 no-underline" onClick={close}>
                    <span className="text-3xl animate-float">🐔</span>
                    <div className="flex flex-col leading-tight">
                        <span className="text-lg font-extrabold text-red-600 tracking-tight">Goutham</span>
                        <span className="text-[0.7rem] font-medium text-gray-400 uppercase tracking-widest">Fresh Chicken</span>
                    </div>
                </Link>

                {/* Hamburger toggle */}
                <button
                    className="md:hidden flex flex-col justify-center items-center w-9 h-9 bg-transparent"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-gray-700 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-gray-700 rounded mt-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-gray-700 rounded mt-1 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></span>
                </button>

                {/* Nav links */}
                <div className={`
          flex items-center gap-2
          md:flex
          ${menuOpen
                        ? 'flex flex-col absolute top-[72px] left-0 right-0 bg-white p-5 border-b border-gray-200 shadow-lg gap-2 z-50'
                        : 'hidden md:flex'
                    }
        `}>
                    <Link to="/" className="px-4 py-2 font-medium text-gray-700 rounded-lg hover:text-red-600 hover:bg-red-50 transition-all w-full md:w-auto text-center" onClick={close}>Home</Link>
                    <Link to="/menu" className="px-4 py-2 font-medium text-gray-700 rounded-lg hover:text-red-600 hover:bg-red-50 transition-all w-full md:w-auto text-center" onClick={close}>Menu</Link>
                    {!isAdmin && (
                        <Link to="/cart" className="relative px-4 py-2 font-medium text-gray-700 rounded-lg hover:text-red-600 hover:bg-red-50 transition-all w-full md:w-auto text-center" onClick={close}>
                            🛒 Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 md:top-0 md:right-0 bg-red-600 text-white text-[0.65rem] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {user ? (
                        <>
                            {!isAdmin && (
                                <Link to="/my-orders" className="px-4 py-2 font-medium text-gray-700 rounded-lg hover:text-emerald-600 hover:bg-emerald-50 transition-all w-full md:w-auto text-center" onClick={close}>
                                    📦 My Orders
                                </Link>
                            )}
                            {isAdmin && (
                                <Link to="/admin" className="px-4 py-2 font-medium text-amber-600 rounded-lg hover:bg-amber-50 transition-all w-full md:w-auto text-center" onClick={close}>
                                    ⚙️ Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="px-3 py-1.5 text-sm font-semibold border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all md:ml-2">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all text-sm w-full md:w-auto text-center" onClick={close}>
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
