import { NextRequest, NextResponse } from "next/server";
import { SelfBackendVerifier } from "@selfxyz/core";

const SELF_ENDPOINT = process.env.NODE_ENV === "development"
  ? "https://free-hamster-loving.ngrok-free.app/api/self-protocol"
  : "https://far-quest.vercel.app/api/self-protocol";

// Create verification config directly
const verification_config = {
  minimumAge: 18,
  ofac: false,
  name: true
};

const selfBackendVerifier = new SelfBackendVerifier(
  "farquest",
  SELF_ENDPOINT,
  verification_config, // Pass config directly
  true, // devMode
  "hex"
);

export async function POST(req: NextRequest) {
  try {
    const { proof, publicSignals } = await req.json();
    const result = await selfBackendVerifier.verify(proof, publicSignals);

    if (result.isValid) {
      return NextResponse.json({
        status: "success",
        result: true,
        credentialSubject: result.credentialSubject
      });
    }

    return NextResponse.json({
      status: "error",
      result: false,
      message: "Verification failed"
    }, { status: 400 });

  } catch (error) {
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