import { NextRequest, NextResponse } from "next/server";
import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(CONVEX_URL);
const SELF_ENDPOINT = "https://free-hamster-loving.ngrok-free.app/";

export async function POST(req: NextRequest) {
  try {
    const { proof, publicSignals, address } = await req.json();
    console.log("Received request:", { proof, publicSignals, address });

    if (!proof || !publicSignals || !address) {
      console.warn("Missing required fields in request body");
      return NextResponse.json(
        { message: "Proof, publicSignals, and address are required" },
        { status: 400 }
      );
    }

    // Extract user ID from publicSignals
    const userId = await getUserIdentifier(publicSignals);
    console.log("Extracted userId:", userId);

    if (userId !== address) {
      console.warn("User ID mismatch:", { userId, address });
      return NextResponse.json(
        { message: "User ID does not match provided address" },
        { status: 400 }
      );
    }

    // Initialize verifier
    const selfBackendVerifier = new SelfBackendVerifier(
      "farquest", // scope
      SELF_ENDPOINT // endpoint
    );
    console.log("Initialized SelfBackendVerifier");

    // Verify proof
    const result = await selfBackendVerifier.verify(proof, publicSignals);
    console.log("Verification result:", result);

    if (result.isValid) {
      // Update Convex database
      try {
        await convex.mutation(api.users.updateUserOGStatus, {
          address: userId,
          isOG: true,
        });
        console.log("Updated OG status for address:", userId);
      } catch (convexError) {
        console.error("Failed to update Convex:", convexError);
        return NextResponse.json(
          { message: "Verification succeeded but failed to update status" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        status: "success",
        result: true,
        credentialSubject: result.credentialSubject,
      });
    }

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