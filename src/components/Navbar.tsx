import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center">
              <span className="text-stone-50 font-bold text-sm">CR</span>
            </div>
            <span className="font-semibold text-stone-800 tracking-tight">ChainRepute</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm text-stone-600 transition-colors duration-300 ease-out">
              Home
            </Link>
            <Link to="/features" className="text-sm text-stone-600 transition-colors duration-300 ease-out">
              Features
            </Link>
            <Link to="/reputation" className="text-sm text-stone-600 transition-colors duration-300 ease-out">
              Check Reputation
            </Link>
            <Link to="/about" className="text-sm text-stone-600 transition-colors duration-300 ease-out">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-stone-600 transition-colors duration-300 ease-out"
            >
              Sign in
            </Link>
            <Link
              to="/dashboard"
              className="text-sm px-4 py-2 bg-stone-800 text-stone-50 rounded-lg transition-all duration-300 ease-out"
            >
              Connect Wallet
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;