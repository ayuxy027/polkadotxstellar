import { useState } from "react";
import { useWallet, truncateAddress } from "../wallet/WalletContext";
import { scanReputation, type ReputationData } from "../services/api";

// ============================================
// Props Interface
// ============================================

interface ReputationScannerProps {
    onScanComplete: (data: ReputationData) => void;
    onScanError: (error: string) => void;
}

// ============================================
// Trust Wallet Logo Component
// ============================================

const TrustWalletLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 2L4 8v8c0 7.732 5.12 14.96 12 17 6.88-2.04 12-9.268 12-17V8L16 2zm0 3.5l9 4.5v6.5c0 5.938-3.84 11.484-9 13.25-5.16-1.766-9-7.312-9-13.25V10l9-4.5z" />
        <path d="M16 8l-7 3.5v5c0 4.5 2.8 8.5 7 10 4.2-1.5 7-5.5 7-10v-5L16 8z" opacity="0.4" />
    </svg>
);

// ============================================
// Polkadot Logo Component
// ============================================

const PolkadotLogo = ({ className = "w-5 h-5" }: { className?: string }) => (
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

// ============================================
// Chain name helper
// ============================================

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
// Scan Progress Steps
// ============================================

type ScanStep = "idle" | "connecting" | "evm" | "polkadot" | "analyzing" | "complete" | "error";

const scanSteps: { key: ScanStep; label: string; icon: string }[] = [
    { key: "connecting", label: "Connecting to wallets", icon: "🔗" },
    { key: "evm", label: "Scanning EVM activity", icon: "💎" },
    { key: "polkadot", label: "Scanning Polkadot activity", icon: "⚫" },
    { key: "analyzing", label: "AI analyzing patterns", icon: "🤖" },
    { key: "complete", label: "Generating reputation", icon: "✅" },
];

// ============================================
// ReputationScanner Component
// ============================================

const ReputationScanner = ({ onScanComplete, onScanError }: ReputationScannerProps) => {
    const { evm, polkadot, connectPolkadot, areBothConnected, setShowEVMModal } = useWallet();
    const [scanStep, setScanStep] = useState<ScanStep>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const bothConnected = areBothConnected();

    const handleConnectEVM = () => {
        setShowEVMModal(true);
    };

    // ============================================
    // Scan Handler
    // ============================================

    const handleScan = async () => {
        if (!evm.address || !polkadot.address) {
            setErrorMessage("Please connect both wallets first");
            return;
        }

        setErrorMessage(null);
        setScanStep("connecting");

        try {
            // Simulate step progression for better UX
            await new Promise((r) => setTimeout(r, 500));
            setScanStep("evm");

            await new Promise((r) => setTimeout(r, 800));
            setScanStep("polkadot");

            await new Promise((r) => setTimeout(r, 800));
            setScanStep("analyzing");

            // Perform actual scan - using EVM address instead of Stellar
            const result = await scanReputation(evm.address, polkadot.address);

            setScanStep("complete");
            await new Promise((r) => setTimeout(r, 500));

            onScanComplete(result);
        } catch (error) {
            setScanStep("error");
            const message = error instanceof Error ? error.message : "Scan failed";
            setErrorMessage(message);
            onScanError(message);
        }
    };

    // ============================================
    // Render
    // ============================================

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4 border-b border-rose-100">
                <h2 className="text-xl font-semibold text-rose-900">Cross-Chain Reputation Scanner</h2>
                <p className="text-sm text-rose-600 mt-1">
                    Connect your wallets and scan your activity across EVM chains and Polkadot
                </p>
            </div>

            <div className="p-6">
                {/* Wallet Connection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* EVM Wallet Card */}
                    <div
                        className={`p-4 rounded-xl border-2 transition-all ${evm.connected
                            ? "border-emerald-200 bg-emerald-50/50"
                            : "border-gray-200 bg-gray-50/50"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <TrustWalletLogo className="w-6 h-6 text-blue-600" />
                                <span className="font-medium text-gray-900">EVM Wallet</span>
                            </div>
                            {evm.connected && (
                                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                                    Connected
                                </span>
                            )}
                        </div>

                        {evm.connected ? (
                            <div>
                                <p className="text-xs text-gray-500 mb-1">{getChainName(evm.chainId)}</p>
                                <div className="font-mono text-sm text-gray-600 bg-white px-3 py-2 rounded-lg">
                                    {truncateAddress(evm.address || "", 10, 8)}
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleConnectEVM}
                                className="w-full py-2 px-4 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <TrustWalletLogo className="w-4 h-4" />
                                Connect Wallet
                            </button>
                        )}
                    </div>

                    {/* Polkadot Wallet Card */}
                    <div
                        className={`p-4 rounded-xl border-2 transition-all ${polkadot.connected
                            ? "border-emerald-200 bg-emerald-50/50"
                            : "border-gray-200 bg-gray-50/50"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <PolkadotLogo className="w-6 h-6 text-pink-600" />
                                <span className="font-medium text-gray-900">Polkadot</span>
                            </div>
                            {polkadot.connected && (
                                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                                    Connected
                                </span>
                            )}
                        </div>

                        {polkadot.connected ? (
                            <div className="font-mono text-sm text-gray-600 bg-white px-3 py-2 rounded-lg">
                                {truncateAddress(polkadot.address || "", 10, 8)}
                            </div>
                        ) : (
                            <button
                                onClick={() => connectPolkadot()}
                                className="w-full py-2 px-4 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <PolkadotLogo className="w-4 h-4" />
                                Connect Talisman
                            </button>
                        )}
                    </div>
                </div>

                {/* Scan Progress */}
                {scanStep !== "idle" && scanStep !== "error" && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                        <div className="space-y-3">
                            {scanSteps.map((step, index) => {
                                const stepIndex = scanSteps.findIndex((s) => s.key === scanStep);
                                const isActive = step.key === scanStep;
                                const isComplete = index < stepIndex;
                                const isPending = index > stepIndex;

                                return (
                                    <div
                                        key={step.key}
                                        className={`flex items-center gap-3 transition-opacity ${isPending ? "opacity-40" : "opacity-100"
                                            }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isComplete
                                                ? "bg-emerald-100 text-emerald-600"
                                                : isActive
                                                    ? "bg-blue-100 text-blue-600 animate-pulse"
                                                    : "bg-gray-100 text-gray-400"
                                                }`}
                                        >
                                            {isComplete ? "✓" : step.icon}
                                        </div>
                                        <span
                                            className={`text-sm ${isActive ? "text-blue-900 font-medium" : "text-gray-600"
                                                }`}
                                        >
                                            {step.label}
                                            {isActive && "..."}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center gap-2 text-red-700">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="text-sm font-medium">{errorMessage}</span>
                        </div>
                    </div>
                )}

                {/* Scan Button */}
                <button
                    onClick={handleScan}
                    disabled={!bothConnected || (scanStep !== "idle" && scanStep !== "error")}
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${bothConnected
                        ? "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 hover:shadow-lg hover:shadow-rose-200 hover:-translate-y-0.5"
                        : "bg-gray-300 cursor-not-allowed"
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none`}
                >
                    {scanStep !== "idle" && scanStep !== "error" ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Scanning...
                        </span>
                    ) : bothConnected ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            Scan My Cross-Chain Reputation
                        </span>
                    ) : (
                        "Connect Both Wallets to Scan"
                    )}
                </button>

                {/* Helper Text */}
                {!bothConnected && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Connect both EVM and Polkadot wallets to scan your cross-chain reputation
                    </p>
                )}
            </div>
        </div>
    );
};

export default ReputationScanner;
