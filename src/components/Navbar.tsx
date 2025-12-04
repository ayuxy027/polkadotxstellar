import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-rose-50/95 backdrop-blur-sm border-b border-rose-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-900 rounded-lg flex items-center justify-center">
              <span className="text-rose-50 font-bold text-sm">CR</span>
            </div>
            <span className="font-semibold text-rose-900 tracking-tight">ChainRepute</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm text-rose-700 transition-colors duration-300 ease-out hover:text-rose-900">
              Home
            </Link>
            <Link to="/features" className="text-sm text-rose-700 transition-colors duration-300 ease-out hover:text-rose-900">
              Features
            </Link>
            <Link to="/reputation" className="text-sm text-rose-700 transition-colors duration-300 ease-out hover:text-rose-900">
              Check Reputation
            </Link>
            <Link to="/about" className="text-sm text-rose-700 transition-colors duration-300 ease-out hover:text-rose-900">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm text-rose-700 transition-colors duration-300 ease-out hover:text-rose-900"
            >
              Sign in
            </Link>
            <Link
              to="/dashboard"
              className="text-sm px-4 py-2 bg-rose-900 text-rose-50 rounded-lg transition-all duration-300 ease-out hover:bg-rose-800"
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