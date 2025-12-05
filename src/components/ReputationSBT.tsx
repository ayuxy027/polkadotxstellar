// src/components/ReputationSBT.tsx
import React, { useState, useEffect } from "react";
import {
  getCredential,
  mintCredential,
  revokeCredential,
} from "../services/reputation";
import { useWallet } from "../wallet/WalletContext";

interface SBT {
  id: string;
  level: string;
  score: number;
  issuedAt: string;
  metadataHash: string;
  revoked: boolean;
}

const ReputationSBT: React.FC = () => {
  const { stellar, connectStellar, stellarError } = useWallet();
  const [sbtList, setSbtList] = useState<SBT[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newSbtLevel, setNewSbtLevel] = useState<string>("Bronze");
  const [newSbtScore, setNewSbtScore] = useState<number>(0);

  // Auto-fetch SBTs when wallet is connected
  useEffect(() => {
    if (stellar.connected && stellar.address) {
      fetchSBTs(stellar.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stellar.connected, stellar.address]);

  // Fetch SBTs from the Soroban contract
  const fetchSBTs = async (address: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const credential = await getCredential(address);

      if (!credential) {
        // No credential found
        setSbtList([]);
        return;
      }

      // Parse metadata hash to extract level and score if available
      // For now, we'll create a basic SBT from the credential
      const liveSBT: SBT = {
        id: credential.metadataHash.substring(0, 8), // Use first 8 chars of hash as ID
        level: newSbtLevel || "Bronze", // Could be stored in metadata
        score: newSbtScore || 0, // Could be stored in metadata
        issuedAt: new Date().toISOString(),
        metadataHash: credential.metadataHash,
        revoked: false,
      };

      setSbtList([liveSBT]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch SBTs";
      setError(errorMessage);
      console.error(err);
      setSbtList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintSBT = async () => {
    if (!stellar.address || !stellar.connected) {
      setError("Please connect your Stellar wallet first");
      return;
    }

    if (!newSbtLevel || newSbtScore <= 0) {
      setError("Please fill all fields correctly");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Create metadata hash from level, score, and timestamp
      const metadata = JSON.stringify({
        level: newSbtLevel,
        score: newSbtScore,
        timestamp: Date.now(),
      });
      // Convert string to hex
      const metadataHash = Array.from(new TextEncoder().encode(metadata))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const result = await mintCredential(stellar.address, metadataHash);

      if (result.success) {
        // Refresh SBT list after successful mint
        await fetchSBTs(stellar.address);
        setNewSbtLevel("Bronze");
        setNewSbtScore(0);
        setError(null);
      } else {
        throw new Error("Minting failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to mint SBT";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSBT = async () => {
    if (!stellar.address || !stellar.connected) {
      setError("Please connect your Stellar wallet first");
      return;
    }

    if (!window.confirm("Are you sure you want to revoke this SBT?")) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await revokeCredential(stellar.address);

      if (result.success) {
        // Refresh SBT list after successful revoke
        await fetchSBTs(stellar.address);
      } else {
        throw new Error("Revocation failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to revoke SBT";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Connect wallet handler
  const handleConnectWallet = async () => {
    try {
      await connectStellar();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect wallet";
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reputation SBT Manager</h1>

      {!stellar.connected || !stellar.address ? (
        <div className="text-center py-10">
          <button
            onClick={handleConnectWallet}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Connect Stellar Wallet"}
          </button>
          {stellarError && <p className="mt-4 text-red-600">{stellarError}</p>}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Connected Wallet</h2>
            <p className="font-mono text-gray-700 break-all">
              {stellar.address}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Wallet: {stellar.walletName || "Unknown"}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Mint New SBT</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={newSbtLevel}
                  onChange={(e) => setNewSbtLevel(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Score
                </label>
                <input
                  type="number"
                  min="0"
                  value={newSbtScore}
                  onChange={(e) => setNewSbtScore(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleMintSBT}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Minting..." : "Mint SBT"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your SBTs</h2>
            {isLoading && sbtList.length === 0 ? (
              <p className="text-center py-4">Loading SBTs...</p>
            ) : sbtList.length === 0 ? (
              <p className="text-center py-4">No SBTs found for this wallet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issued
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sbtList.map((sbt) => (
                      <tr
                        key={sbt.id}
                        className={sbt.revoked ? "bg-gray-100" : ""}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                sbt.level === "Gold"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : sbt.level === "Silver"
                                  ? "bg-gray-100 text-gray-800"
                                  : sbt.level === "Platinum"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {sbt.level}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sbt.score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(sbt.issuedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              sbt.revoked
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {sbt.revoked ? "Revoked" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {!sbt.revoked && (
                            <button
                              onClick={() => handleRevokeSBT()}
                              className="text-red-600 hover:text-red-900"
                              disabled={isLoading}
                            >
                              Revoke
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default ReputationSBT;
