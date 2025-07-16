/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(CONVEX_URL);

export async function POST(req: NextRequest) {
  try {
    const { proof, publicSignals } = await req.json();

    if (!proof || !publicSignals) {
      return NextResponse.json(
        { message: 'Proof and publicSignals are required' },
        { status: 400 }
      );
    }

    console.log("Received proof data:", { proof, publicSignals });

    // Extract user ID from the proof
    const USERID = await getUserIdentifier(publicSignals);
    console.log("Extracted userId:", USERID);

    // Initialize and configure the verifier
    // Try the simplified constructor first (new version)
    const selfBackendVerifier = new SelfBackendVerifier(
      "farquest", // scope
      "https://free-hamster-loving.ngrok-free.app/api/self-protocol" // endpoint
    );

    console.log("Initialized SelfBackendVerifier");

    // Verify the proof
    const result = await selfBackendVerifier.verify(proof, publicSignals);
    console.log("Verification result:", result);

    if (result.isValid) {
      // Return successful verification response
      // await convex.mutation(api.users.verifyOG, { address: result.userId });

      return NextResponse.json({
        status: "success",
        result: true,
        credentialSubject: result.credentialSubject,
      });
    }

    // Return failed verification response
    return NextResponse.json(
      {
        status: "error",
        result: false,
        message: "Verification failed",
        details: result.isValidDetails,
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error verifying proof:", error);
    
    // If the error is about constructor parameters, try the old version
    if (error instanceof Error && error.message.includes('constructor')) {
      console.log("Trying old constructor format...");
      try {
        const selfBackendVerifier = new SelfBackendVerifier(
          "farquest", // scope
          "https://free-hamster-loving.ngrok-free.app/api/self-protocol", // endpoint
          "hex" // user_identifier_type
        );
        
        const { proof, publicSignals } = await req.json();
        const result = await selfBackendVerifier.verify(proof, publicSignals);
        
        if (result.isValid) {
          return NextResponse.json({
            status: "success",
            result: true,
            credentialSubject: result.credentialSubject,
          });
        }
        
        return NextResponse.json(
          {
            status: "error",
            result: false,
            message: "Verification failed",
            details: result.isValidDetails,
          },
          { status: 400 },
        );
      } catch (retryError) {
        console.error("Retry also failed:", retryError);
      }
    }
    
    return NextResponse.json(
      {
        status: "error",
        result: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}