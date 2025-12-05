import {
    type ReputationData,
    getScoreColor,
    getScoreLabel,
    formatNumber,
    getProfileColor,
} from "../services/api";

// ============================================
// Props Interface
// ============================================

interface ReputationDashboardProps {
    data: ReputationData;
    onRescan?: () => void;
}

// ============================================
// Score Gauge Component
// ============================================

const ScoreGauge = ({ score, maxScore = 1000 }: { score: number; maxScore?: number }) => {
    const percentage = (score / maxScore) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                />
                {/* Gradient definition */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </svg>
            {/* Score text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{score}</span>
                <span className="text-sm text-gray-500">/ {maxScore}</span>
            </div>
        </div>
    );
};

// ============================================
// Breakdown Bar Component
// ============================================

const BreakdownBar = ({
    label,
    value,
    maxValue,
    color,
}: {
    label: string;
    value: number;
    maxValue: number;
    color: string;
}) => {
    const percentage = (value / maxValue) * 100;

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium text-gray-900">
                    {value} / {maxValue}
                </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

// ============================================
// Activity Card Component
// ============================================

const ActivityCard = ({
    title,
    icon,
    score,
    maxScore,
    items,
    bgColor,
    iconColor,
}: {
    title: string;
    icon: React.ReactNode;
    score: number;
    maxScore: number;
    items: { label: string; value: string | number }[];
    bgColor: string;
    iconColor: string;
}) => (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className={`${bgColor} px-4 py-3 border-b border-gray-100`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={iconColor}>{icon}</span>
                    <span className="font-medium text-gray-900">{title}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                    {score} / {maxScore}
                </span>
            </div>
        </div>
        <div className="p-4 space-y-3">
            {items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                </div>
            ))}
        </div>
    </div>
);

// ============================================
// ReputationDashboard Component
// ============================================

const ReputationDashboard = ({ data, onRescan }: ReputationDashboardProps) => {
    const { overallScore, profile, stellar, polkadot, breakdown, aiInsights } = data;

    return (
        <div className="space-y-6">
            {/* Main Score Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-4 border-b border-rose-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-rose-900">Your Reputation Score</h2>
                            <p className="text-sm text-rose-600 mt-1">Cross-chain reputation analysis complete</p>
                        </div>
                        {onRescan && (
                            <button
                                onClick={onRescan}
                                className="px-4 py-2 text-sm bg-white border border-rose-200 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                            >
                                Rescan
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Score Gauge */}
                        <div className="flex flex-col items-center">
                            <ScoreGauge score={overallScore} />
                            <div className="mt-4 text-center">
                                <span
                                    className={`text-lg font-semibold ${getScoreColor(overallScore)}`}
                                >
                                    {getScoreLabel(overallScore)}
                                </span>
                            </div>
                        </div>

                        {/* Profile and Summary */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getProfileColor(
                                        profile
                                    )}`}
                                >
                                    {profile}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {aiInsights.confidence}% confidence
                                </span>
                            </div>

                            <p className="text-gray-700">{aiInsights.summary}</p>

                            {/* Strengths */}
                            {aiInsights.strengths.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Strengths</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {aiInsights.strengths.map((strength, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full"
                                            >
                                                {strength}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Red Flags */}
                            {aiInsights.redFlags.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Attention</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {aiInsights.redFlags.map((flag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full"
                                            >
                                                {flag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chain Activity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stellar Activity */}
                <ActivityCard
                    title="Stellar Activity"
                    icon={
                        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                            <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm9.521 22.848l-1.808.947L6.479 14.4v-2.448l1.808-.947L25.52 20.4v2.448zM6.479 9.152l1.808-.947 17.234 9.395v2.448l-1.808.947L6.479 11.6V9.152zm19.042 2.448L8.287 20.995l-1.808-.947v-2.448l17.234-9.395 1.808.947v2.448z" />
                        </svg>
                    }
                    score={stellar.score}
                    maxScore={450}
                    bgColor="bg-gray-50"
                    iconColor="text-gray-800"
                    items={[
                        { label: "Transactions", value: stellar.transactionCount },
                        { label: "Volume", value: `${formatNumber(stellar.totalVolume)} XLM` },
                        { label: "Payments", value: stellar.paymentCount },
                        { label: "Assets Held", value: stellar.assetDiversity },
                        { label: "Account Age", value: `${stellar.accountAge} days` },
                    ]}
                />

                {/* Polkadot Activity */}
                <ActivityCard
                    title="Polkadot Activity"
                    icon={
                        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                            <circle cx="16" cy="6" r="4" />
                            <circle cx="16" cy="26" r="4" />
                            <circle cx="6" cy="11" r="4" />
                            <circle cx="26" cy="11" r="4" />
                            <circle cx="6" cy="21" r="4" />
                            <circle cx="26" cy="21" r="4" />
                            <circle cx="16" cy="16" r="3" />
                        </svg>
                    }
                    score={polkadot.score}
                    maxScore={550}
                    bgColor="bg-pink-50"
                    iconColor="text-pink-600"
                    items={[
                        { label: "Governance Votes", value: polkadot.governanceVotes },
                        { label: "Staking", value: `${formatNumber(polkadot.stakingAmount)} DOT` },
                        { label: "Nominations", value: polkadot.validatorNominations },
                        { label: "Identity", value: polkadot.identityVerified ? "Verified ✓" : "Not Verified" },
                        { label: "Account Age", value: `${polkadot.accountAge} days` },
                    ]}
                />
            </div>

            {/* Score Breakdown */}
            <div className="bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-rose-100">
                    <h3 className="text-lg font-semibold text-gray-900">Score Breakdown</h3>
                </div>
                <div className="p-6 space-y-4">
                    <BreakdownBar
                        label="Transaction Consistency"
                        value={breakdown.transactionConsistency}
                        maxValue={200}
                        color="bg-blue-500"
                    />
                    <BreakdownBar
                        label="Governance Participation"
                        value={breakdown.governanceParticipation}
                        maxValue={250}
                        color="bg-purple-500"
                    />
                    <BreakdownBar
                        label="Staking Behavior"
                        value={breakdown.stakingBehavior}
                        maxValue={200}
                        color="bg-green-500"
                    />
                    <BreakdownBar
                        label="Liquidity Provision"
                        value={breakdown.liquidityProvision}
                        maxValue={150}
                        color="bg-cyan-500"
                    />
                    <BreakdownBar
                        label="Account Age"
                        value={breakdown.accountAge}
                        maxValue={100}
                        color="bg-amber-500"
                    />
                    <BreakdownBar
                        label="Asset Diversity"
                        value={breakdown.assetDiversity}
                        maxValue={100}
                        color="bg-pink-500"
                    />
                </div>
            </div>

            {/* Recommendations */}
            {aiInsights.recommendations.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-rose-100">
                        <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
                        <p className="text-sm text-gray-500 mt-1">Ways to improve your reputation score</p>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-3">
                            {aiInsights.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-medium">
                                        {index + 1}
                                    </span>
                                    <span className="text-gray-700">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Timestamp */}
            <div className="text-center text-sm text-gray-400">
                Last scanned: {new Date(data.timestamp).toLocaleString()}
            </div>
        </div>
    );
};

export default ReputationDashboard;
