import { NextRequest, NextResponse } from "next/server";
import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { DefaultConfigStore } from "@selfxyz/core";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(CONVEX_URL);

// Define the endpoints based on environment
const SELF_ENDPOINT = process.env.NODE_ENV === "development"
  ? "https://free-hamster-loving.ngrok-free.app/api/self-protocol"
  : "https://far-quest.vercel.app/api/self-protocol";

const verification_config = {
  minimumAge: 18,
  ofac: false,
  name: true
};

const configStore = new DefaultConfigStore(verification_config);

const selfBackendVerifier = new SelfBackendVerifier(
  "farquest", // scope must match frontend
  SELF_ENDPOINT,
  configStore, // Add the config store
  true, // devMode must match frontend
  "hex" // userIdType must match frontend
);

export async function POST(req: NextRequest) {
  try {
    const { proof, publicSignals } = await req.json();
    console.log("Received verification request:", { proof, publicSignals });

    if (!proof || !publicSignals) {
      console.error("Missing proof or publicSignals");
      return NextResponse.json({
        status: "error",
        message: "Missing proof or publicSignals"
      }, { status: 400 });
    }

    const result = await selfBackendVerifier.verify(proof, publicSignals);
    console.log("Verification result:", result);

    if (result.isValid) {
      return NextResponse.json({
        status: "success",
        result: true,
        credentialSubject: result.credentialSubject
      });
    }

    console.error("Verification failed:", result);
    return NextResponse.json({
      status: "error",
      result: false,
      message: "Verification failed",
      details: result
    }, { status: 400 });

  } catch (error) {
    console.error("Error in verification:", error);
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    scope: "farquest",
    endpoint: SELF_ENDPOINT,
  });
}