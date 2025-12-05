import { useState } from "react";
import { Link } from "react-router-dom";
import { useWallet, truncateAddress, EVMWalletModal } from "../wallet/WalletContext";

// ============================================
// Logo Components
// ============================================

const TrustWalletLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="currentColor">
    <path d="M16 2L4 8v8c0 7.732 5.12 14.96 12 17 6.88-2.04 12-9.268 12-17V8L16 2zm0 3.5l9 4.5v6.5c0 5.938-3.84 11.484-9 13.25-5.16-1.766-9-7.312-9-13.25V10l9-4.5z" />
    <path d="M16 8l-7 3.5v5c0 4.5 2.8 8.5 7 10 4.2-1.5 7-5.5 7-10v-5L16 8z" opacity="0.4" />
  </svg>
);

const PolkadotLogo = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="currentColor">
    <circle cx="16" cy="6" r="4" />
    <circle cx="16" cy="26" r="4" />
    <circle cx="6" cy="11" r="4" />
    <circle cx="26" cy="11" r="4" />
    <circle cx="6" cy="21" r="4" />
    <circle cx="26" cy="21" r="4" />
    <circle cx="16" cy="16" r="3" />
  </svg>
);

// Chain name helper
const getChainName = (chainId: number | null): string => {
  const chains: Record<number, string> = {
    1: "Ethereum",
    137: "Polygon",
    42161: "Arbitrum",
    10: "Optimism",
    56: "BNB Chain",
  };
  return chainId ? chains[chainId] || `Chain ${chainId}` : "EVM";
};

// ============================================
// Navbar Component
// ============================================

const Navbar = () => {
  const {
    evm,
    polkadot,
    isConnectingEVM,
    isConnectingPolkadot,
    evmError,
    polkadotError,
    connectPolkadot,
    disconnectEVM,
    disconnectPolkadot,
    areBothConnected,
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    setShowEVMModal,
  } = useWallet();

  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const bothConnected = areBothConnected();

  const handleConnectEVM = () => {
    setShowEVMModal(true); // Opens our custom EVM wallet modal
  };

  return (
    <>
      <EVMWalletModal />
      <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between bg-gradient-to-r from-rose-50/95 via-pink-50/95 to-rose-50/95 backdrop-blur-md border border-rose-200/50 rounded-full px-4 py-2 shadow-lg shadow-rose-200/20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-900 to-pink-900 rounded-full flex items-center justify-center group-hover:from-rose-800 group-hover:to-pink-800 transition-all duration-300">
                <span className="text-rose-50 font-bold text-sm">CR</span>
              </div>
              <span className="font-semibold text-rose-900 tracking-tight hidden sm:block group-hover:text-rose-950 transition-colors">
                ChainRepute
              </span>
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
                to="/dashboard"
                className="text-sm text-rose-700 px-3 py-1.5 rounded-full transition-all duration-300 ease-out hover:bg-rose-100/50 hover:text-rose-900"
              >
                Dashboard
              </Link>
              <Link
                to="/reputation"
                className="text-sm text-rose-700 px-3 py-1.5 rounded-full transition-all duration-300 ease-out hover:bg-rose-100/50 hover:text-rose-900 hidden md:block"
              >
                Scan
              </Link>
            </div>

            {/* Wallet Connection Area */}
            <div className="relative">
              {bothConnected ? (
                /* Both Connected - Show Combined Badge */
                <button
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full hover:shadow-md transition-all ${isDemoMode
                    ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200"
                    : "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200"
                    }`}
                >
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <TrustWalletLogo className="w-3 h-3 text-white" />
                    </div>
                    <div className="w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center">
                      <PolkadotLogo className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${isDemoMode ? "text-amber-700" : "text-emerald-700"}`}>
                    {isDemoMode ? "Demo" : "Connected"}
                  </span>
                  <svg className={`w-3 h-3 ${isDemoMode ? "text-amber-600" : "text-emerald-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ) : (
                /* Connect Wallets Button */
                <button
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className="text-sm px-4 py-2 bg-gradient-to-r from-rose-900 to-pink-900 text-rose-50 rounded-full transition-all duration-300 ease-out hover:from-rose-800 hover:to-pink-800 hover:shadow-lg hover:shadow-rose-900/30 hover:-translate-y-0.5"
                >
                  Connect Wallets
                </button>
              )}

              {/* Wallet Dropdown Menu */}
              {showWalletMenu && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden z-50">
                  <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
                    <h3 className="font-semibold text-rose-900">Connect Wallets</h3>
                    <p className="text-xs text-rose-600 mt-1">
                      Connect both chains for cross-chain reputation
                    </p>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* EVM Wallet (Trust Wallet) */}
                    <div className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <TrustWalletLogo className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">EVM Wallet</p>
                            <p className="text-xs text-gray-500">Trust Wallet / MetaMask</p>
                          </div>
                        </div>
                        {evm.connected && (
                          <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                            ✓ Connected
                          </span>
                        )}
                      </div>

                      {evm.connected ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">{getChainName(evm.chainId)}</p>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                              {truncateAddress(evm.address || "", 8, 6)}
                            </code>
                          </div>
                          <button
                            onClick={disconnectEVM}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors"
                          >
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleConnectEVM}
                          disabled={isConnectingEVM}
                          className="w-full py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isConnectingEVM ? "Connecting..." : "Connect Wallet"}
                        </button>
                      )}

                      {evmError && (
                        <p className="mt-2 text-xs text-red-500">{evmError}</p>
                      )}
                    </div>

                    {/* Polkadot Wallet */}
                    <div className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                            <PolkadotLogo className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">Polkadot</p>
                            <p className="text-xs text-gray-500">
                              {polkadot.wallet?.title || "Talisman / SubWallet"}
                            </p>
                          </div>
                        </div>
                        {polkadot.connected && (
                          <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                            ✓ Connected
                          </span>
                        )}
                      </div>

                      {polkadot.connected ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-500">{polkadot.name}</p>
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                              {truncateAddress(polkadot.address || "", 8, 6)}
                            </code>
                          </div>
                          <button
                            onClick={disconnectPolkadot}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors"
                          >
                            Disconnect
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => connectPolkadot()}
                          disabled={isConnectingPolkadot}
                          className="w-full py-2 text-sm bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isConnectingPolkadot ? "Connecting..." : "Connect Talisman"}
                        </button>
                      )}

                      {polkadotError && (
                        <p className="mt-2 text-xs text-red-500">{polkadotError}</p>
                      )}
                    </div>

                    {/* Demo Mode Button */}
                    <div className="pt-2 border-t border-gray-100">
                      {isDemoMode ? (
                        <button
                          onClick={disableDemoMode}
                          className="w-full py-2 text-sm bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <span>🧪</span>
                          Exit Demo Mode
                        </button>
                      ) : (
                        <button
                          onClick={enableDemoMode}
                          className="w-full py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <span>🧪</span>
                          Try Demo Mode (No Wallet Needed)
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      {isDemoMode
                        ? "🧪 Demo mode active - using test addresses"
                        : bothConnected
                          ? "✨ Both wallets connected! Ready to scan."
                          : "Connect both wallets to scan your reputation"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Click outside to close */}
        {showWalletMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowWalletMenu(false)}
          />
        )}
      </nav>
    </>
  );
};

export default Navbar;
