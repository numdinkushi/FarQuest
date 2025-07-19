import { NextRequest, NextResponse } from "next/server";
import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(CONVEX_URL);

export async function POST(req: NextRequest) {
  try {
    const { proof, publicSignals } = await req.json();

    console.log("Received verification request");

    // Extract user ID from the proof
    const userId = await getUserIdentifier(publicSignals);
    console.log("Extracted userId:", userId);

    // Initialize and configure the verifier with the correct parameters
    const selfBackendVerifier = new SelfBackendVerifier(
      "farquest", // scope - make sure this matches your frontend
      "https://far-quest.vercel.app/api/self-protocol", // endpoint
      "hex" // user_identifier_type - THIS WAS MISSING
    );

    console.log("Initialized SelfBackendVerifier");

    // Verify the proof
    const result = await selfBackendVerifier.verify(proof, publicSignals);
    console.log("Verification result:", result);

    if (result.isValid) {
      // Update Convex database after successful verification
      try {
        await convex.mutation(api.users.updateUserOGStatus, {
          address: userId, // Use the userId from the proof
          isOG: true,
        });
        console.log("Updated OG status for address:", userId);
      } catch (convexError) {
        console.error("Failed to update Convex:", convexError);
        // Still return success since verification worked
      }

      return NextResponse.json({
        status: "success",
        result: true,
        credentialSubject: result.credentialSubject,
        userId: userId, // Include userId in response
      });
    }

    // Return failed verification response
    console.warn("Verification failed:", result.isValidDetails);
    return NextResponse.json(
      {
        status: "error",
        result: false,
        message: "Verification failed",
        details: result.isValidDetails,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error verifying proof:", error);
    return NextResponse.json(
      {
        status: "error",
        result: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Add GET handler for health check
export async function GET() {
  return NextResponse.json({
    status: "ready",
    scope: "farquest",
    endpoint: "https://free-hamster-loving.ngrok-free.app/api/self-protocol",
  });
}