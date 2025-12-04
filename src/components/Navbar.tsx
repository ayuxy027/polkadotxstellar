import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between bg-gradient-to-r from-rose-50/95 via-pink-50/95 to-rose-50/95 backdrop-blur-md border border-rose-200/50 rounded-full px-4 py-2 shadow-lg shadow-rose-200/20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-900 to-pink-900 rounded-full flex items-center justify-center group-hover:from-rose-800 group-hover:to-pink-800 transition-all duration-300">
              <span className="text-rose-50 font-bold text-sm">CR</span>
            </div>
            <span className="font-semibold text-rose-900 tracking-tight hidden sm:block group-hover:text-rose-950 transition-colors">ChainRepute</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className="text-sm text-rose-700 px-3 py-1.5 rounded-full transition-all duration-300 ease-out hover:bg-rose-100/50 hover:text-rose-900"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-sm text-rose-700 px-3 py-1.5 rounded-full transition-all duration-300 ease-out hover:bg-rose-100/50 hover:text-rose-900"
            >
              Features
            </Link>
            <Link
              to="/reputation"
              className="text-sm text-rose-700 px-3 py-1.5 rounded-full transition-all duration-300 ease-out hover:bg-rose-100/50 hover:text-rose-900 hidden md:block"
            >
              Reputation
            </Link>
            <Link
              to="/about"
              className="text-sm text-rose-700 px-3 py-1.5 rounded-full transition-all duration-300 ease-out hover:bg-rose-100/50 hover:text-rose-900 hidden md:block"
            >
              About
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            to="/dashboard"
            className="text-sm px-4 py-2 bg-gradient-to-r from-rose-900 to-pink-900 text-rose-50 rounded-full transition-all duration-300 ease-out hover:from-rose-800 hover:to-pink-800 hover:shadow-lg hover:shadow-rose-900/30 hover:-translate-y-0.5"
          >
            Connect Wallet
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;