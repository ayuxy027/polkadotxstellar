import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReputationScanner from "../components/ReputationScanner";
import ReputationDashboard from "../components/ReputationDashboard";
import type { ReputationData } from "../services/api";

// ============================================
// Dashboard Page
// ============================================

const Dashboard = () => {
    const [reputationData, setReputationData] = useState<ReputationData | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);

    const handleScanComplete = (data: ReputationData) => {
        setReputationData(data);
        setScanError(null);
    };

    const handleScanError = (error: string) => {
        setScanError(error);
    };

    const handleRescan = () => {
        setReputationData(null);
        setScanError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
            <Navbar />

            {/* Main Content */}
            <main className="pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Reputation Dashboard
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover your unified cross-chain reputation score across Stellar and Polkadot ecosystems
                        </p>
                    </div>

                    {/* Show Scanner or Dashboard based on state */}
                    {!reputationData ? (
                        <ReputationScanner
                            onScanComplete={handleScanComplete}
                            onScanError={handleScanError}
                        />
                    ) : (
                        <ReputationDashboard
                            data={reputationData}
                            onRescan={handleRescan}
                        />
                    )}

                    {/* Error Display */}
                    {scanError && !reputationData && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                            <p className="text-red-700">{scanError}</p>
                            <button
                                onClick={() => setScanError(null)}
                                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
