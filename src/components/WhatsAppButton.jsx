export default function WhatsAppButton({ message = "Hi! I'd like to order fresh chicken from Goutham Fresh Chicken." }) {
    const phone = '917349729767';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="fixed bottom-6 left-6 z-[9999] bg-[#25D366] w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_6px_24px_rgba(37,211,102,0.5)] transition-all duration-300 animate-pulse-soft group"
            aria-label="Order via WhatsApp"
        >
            <svg viewBox="0 0 32 32" width="28" height="28" fill="white">
                <path d="M16.004 0h-.008C7.174 0 .002 7.174.002 16c0 3.5 1.128 6.744 3.046 9.378L1.06 31.29l6.166-1.96A15.89 15.89 0 0016.004 32C24.826 32 32 24.826 32 16S24.826 0 16.004 0zm9.31 22.6c-.39 1.1-1.932 2.014-3.164 2.28-.844.18-1.946.322-5.656-1.216-4.748-1.966-7.8-6.792-8.036-7.108-.228-.316-1.87-2.492-1.87-4.754 0-2.262 1.184-3.374 1.604-3.834.39-.426 1.036-.622 1.654-.622.2 0 .38.01.542.018.46.02.692.048.996.77.38.898 1.306 3.18 1.42 3.412.116.232.228.542.084.858-.136.316-.256.516-.488.79-.232.274-.45.484-.682.778-.214.258-.456.534-.196.996.26.46 1.156 1.908 2.484 3.09 1.706 1.52 3.144 1.99 3.592 2.212.348.172.762.136 1.036-.166.348-.386.778-.996 1.216-1.598.314-.43.71-.486 1.094-.33.39.148 2.462 1.162 2.882 1.374.42.212.7.316.802.49.102.172.102.996-.288 2.096z" />
            </svg>
            <span className="absolute left-[72px] bg-gray-800 text-white px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                Order on WhatsApp
            </span>
        </a>
    );
}
