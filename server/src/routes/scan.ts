import { Router, type Request, type Response } from "express";
import { scanStellarActivity, isValidStellarAddress } from "../services/stellarScanner.js";
import { scanPolkadotActivity, isValidPolkadotAddress } from "../services/polkadotScanner.js";
import {
  generateAIInsights,
  calculateScoreBreakdown,
  calculateOverallScore,
} from "../services/aiEngine.js";
import type { ScanRequest, ScanResponse, ReputationData } from "../types/index.js";

// ============================================
// Scan Router
// ============================================

export const scanRouter = Router();

/**
 * POST /api/scan
 * 
 * Scan blockchain activity on both Stellar and Polkadot chains,
 * calculate reputation score, and generate AI insights.
 */
scanRouter.post("/", async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const { stellarAddress, polkadotAddress } = req.body as ScanRequest;

    // ============================================
    // Input Validation
    // ============================================

    if (!stellarAddress || !polkadotAddress) {
      return res.status(400).json({
        success: false,
        error: "Both stellarAddress and polkadotAddress are required",
      } as ScanResponse);
    }

    // Validate Stellar address format
    if (!isValidStellarAddress(stellarAddress)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Stellar address format. Must start with 'G' and be 56 characters.",
      } as ScanResponse);
    }

    // Validate Polkadot address format
    if (!isValidPolkadotAddress(polkadotAddress)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Polkadot address format. Must be a valid SS58 address.",
      } as ScanResponse);
    }

    console.log(`[Scan] Starting scan for:
    - Stellar: ${stellarAddress}
    - Polkadot: ${polkadotAddress}`);

    // ============================================
    // Scan Both Chains in Parallel
    // ============================================

    const [stellarActivity, polkadotActivity] = await Promise.all([
      scanStellarActivity(stellarAddress),
      scanPolkadotActivity(polkadotAddress),
    ]);

    // ============================================
    // Calculate Scores and Breakdown
    // ============================================

    const overallScore = calculateOverallScore(
      stellarActivity.score,
      polkadotActivity.score
    );

    const breakdown = calculateScoreBreakdown(stellarActivity, polkadotActivity);

    // ============================================
    // Generate AI Insights
    // ============================================

    const aiInsights = await generateAIInsights(
      stellarActivity,
      polkadotActivity,
      overallScore,
      breakdown
    );

    // ============================================
    // Build Response
    // ============================================

    const reputationData: ReputationData = {
      overallScore,
      profile: aiInsights.profile,
      stellar: stellarActivity,
      polkadot: polkadotActivity,
      breakdown,
      aiInsights,
      timestamp: Date.now(),
    };

    const duration = Date.now() - startTime;
    console.log(`[Scan] Completed in ${duration}ms - Score: ${overallScore}/1000`);

    return res.json({
      success: true,
      data: reputationData,
    } as ScanResponse);

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Scan] Error after ${duration}ms:`, error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("Invalid")) {
        return res.status(400).json({
          success: false,
          error: error.message,
        } as ScanResponse);
      }

      if (error.message.includes("timeout") || error.message.includes("TIMEOUT")) {
        return res.status(504).json({
          success: false,
          error: "Request timed out. Please try again.",
        } as ScanResponse);
      }
    }

    return res.status(500).json({
      success: false,
      error: "Failed to scan blockchain activity. Please try again.",
    } as ScanResponse);
  }
});

/**
 * GET /api/scan/validate
 * 
 * Validate wallet addresses without performing a full scan
 */
scanRouter.get("/validate", (req: Request, res: Response) => {
  const { stellarAddress, polkadotAddress } = req.query;

  const validation = {
    stellar: {
      provided: !!stellarAddress,
      valid: typeof stellarAddress === "string" && isValidStellarAddress(stellarAddress),
    },
    polkadot: {
      provided: !!polkadotAddress,
      valid: typeof polkadotAddress === "string" && isValidPolkadotAddress(polkadotAddress),
    },
  };

  return res.json({
    success: true,
    validation,
    canScan: validation.stellar.valid && validation.polkadot.valid,
  });
});

export default scanRouter;
