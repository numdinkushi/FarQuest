import { NextRequest, NextResponse } from "next/server";
import { SelfBackendVerifier } from "@selfxyz/core";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const verification_config = {
  minimumAge: 18,
  ofac: false,
  name: true
};

export async function POST(req: NextRequest) {
  try {
    const { proof, publicSignals } = await req.json();

    // Get the host from the request
    const host = req.headers.get('host');
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    const selfBackendVerifier = new SelfBackendVerifier(
      "farquest", // scope
      `${baseUrl}/api/self-protocol`, // endpoint
      verification_config // config
      // Removed the extra parameters that were causing the error
    );

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
    console.error("Verification error:", error);
    return NextResponse.json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}