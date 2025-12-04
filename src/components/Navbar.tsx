import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between bg-rose-50/95 backdrop-blur-sm border border-rose-200 rounded-full px-4 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-900 rounded-full flex items-center justify-center">
              <span className="text-rose-50 font-bold text-sm">CR</span>
            </div>
            <span className="font-semibold text-rose-900 tracking-tight hidden sm:block">ChainRepute</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link 
              to="/" 
              className="text-sm text-rose-700 px-3 py-1.5 rounded-full transition-colors duration-300 ease-out"
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="text-sm text-rose-700 px-3 py-1.5 rounded-full transition-colors duration-300 ease-out"
            >
              Features
            </Link>
            <Link 
              to="/reputation" 
              className="text-sm text-rose-700 px-3 py-1.5 rounded-full transition-colors duration-300 ease-out hidden md:block"
            >
              Reputation
            </Link>
            <Link 
              to="/about" 
              className="text-sm text-rose-700 px-3 py-1.5 rounded-full transition-colors duration-300 ease-out hidden md:block"
            >
              About
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            to="/dashboard"
            className="text-sm px-4 py-2 bg-rose-900 text-rose-50 rounded-full transition-all duration-300 ease-out"
          >
            Connect Wallet
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;