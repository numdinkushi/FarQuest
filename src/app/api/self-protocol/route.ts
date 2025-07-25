import { NextRequest, NextResponse } from "next/server";
import { getUserIdentifier, SelfBackendVerifier } from "@selfxyz/core";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";
const convex = new ConvexHttpClient(CONVEX_URL);
const SELF_ENDPOINT = "https://far-quest.vercel.app/api/self-protocol";

export async function POST(req: NextRequest) {
  try {
    const { proof, publicSignals } = await req.json();
    console.log("Received verification request");

    const userId = await getUserIdentifier(publicSignals);
    console.log("Extracted userId:", userId);

    console.log("SELF_ENDPOINT:", SELF_ENDPOINT);
    const selfBackendVerifier = new SelfBackendVerifier(
      "farquest",
      SELF_ENDPOINT,
      "hex",
      true
    );

    console.log("Initialized SelfBackendVerifier");

    const result = await selfBackendVerifier.verify(proof, publicSignals);
    console.log("Verification result:", result);

    if (result.isValid) {
      await convex.mutation(api.users.updateUserOGStatus, {
        address: userId,
        isOG: true,
      });
      console.log("Updated OG status for address:", userId);

      return NextResponse.json({
        status: "success",
        result: true,
        credentialSubject: result.credentialSubject,
        userId: userId,
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

export async function GET() {
  return NextResponse.json({
    status: "ready",
    scope: "farquest",
    endpoint: SELF_ENDPOINT,
  });
}