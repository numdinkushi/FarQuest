/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUniversalLink } from "@selfxyz/core";
import SelfQRcodeWrapper, {
  SelfAppBuilder,
  type SelfApp,
} from "@selfxyz/qrcode";
import {
  Shield,
  Copy,
  ExternalLink,
  X,
} from "lucide-react";
import { useAccount } from "wagmi";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { APP_ICON_URL } from "~/lib/constant";
import { APP_URL } from "~/constants";

// Ensure this is a stable, deployed URL
// const SELF_ENDPOINT = "https://free-hamster-loving.ngrok-free.app/api/self-protocol";
const SELF_ENDPOINT = "https://far-quest.vercel.app/api/self-protocol";
// export const SELF_ENDPOINT = `${APP_URL}/api/self-protocol`;

interface SelfProtocolComponentProps {
  onComplete?: () => void;
}

const SelfProtocolComponent: React.FC<SelfProtocolComponentProps> = ({ onComplete }) => {
  const { address } = useAccount();
  const router = useRouter();

  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [universalLink, setUniversalLink] = useState<string>("");

  // Convex hooks
  const userData = useQuery(api.queries.getUserByAddress, {
    address: address || "",
  });
  const updateUserOGStatus = useMutation(api.users.updateUserOGStatus);

  const isVerifiedOG = userData?.isOG || false;

  const minimumAge = 18;
  const requireName = true;
  const checkOFAC = false;

  useEffect(() => {
    if (!address || isVerifiedOG) {
      console.log("Skipping Self app initialization: ", { address, isVerifiedOG });
      return;
    }

    try {
      console.log("Initializing SelfAppBuilder with address:", address);
      const app = new SelfAppBuilder({
        appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Farquest",
        scope: "farquest",
        endpoint: SELF_ENDPOINT,
        endpointType: "https",
        logoBase64: APP_ICON_URL,
        userId: address,
        userIdType: "hex",
        devMode: true,
        disclosures: {
          minimumAge,
          ofac: checkOFAC,
          name: requireName,
        },
      }).build();

      console.log("SelfApp built successfully:", app);
      setSelfApp(app);
      const link = getUniversalLink(app);
      console.log("Generated universal link:", link);
      setUniversalLink(link);
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
      toast.error("Failed to initialize verification");
    }
  }, [address, isVerifiedOG]);

  const displayToast = (message: string): void => {
    console.log("Displaying toast:", message);
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyToClipboard = (): void => {
    if (!universalLink) {
      console.warn("No universal link to copy");
      return;
    }

    navigator.clipboard
      .writeText(universalLink)
      .then(() => {
        setLinkCopied(true);
        displayToast("Universal link copied to clipboard!");
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
        toast.error("Failed to copy link");
      });
  };

  const openSelfApp = (): void => {
    if (!universalLink) {
      console.warn("No universal link to open");
      return;
    }

    console.log("Opening Self App with link:", universalLink);
    window.open(universalLink, "_blank");
    toast.success("Opening Self App...");
  };

  const handleSuccessfulVerification = async (): Promise<void> => {
    console.log("Verification callback triggered for address:", address);
    console.log("Verified successfully");
  };

  const handleSkipVerification = (): void => {
    console.log("Verification skipped for address:", address);
    displayToast("Verification skipped. Continuing without O.G benefits.");
    setTimeout(() => onComplete?.(), 1000);
  };

  if (isVerifiedOG) {
    console.log("User already verified, skipping component render:", address);
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Verify Your Identity
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Scan QR code with Self Protocol App to unlock O.G earning potential
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-6 mx-auto w-48">
          <div className="w-32 h-32 mx-auto flex items-center justify-center rounded-xl">
            {selfApp ? (
              <SelfQRcodeWrapper
                selfApp={selfApp}
                onSuccess={handleSuccessfulVerification}
                size={128}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl border-2 border-gray-200">
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-1 flex items-center justify-center animate-pulse">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-600 text-xs">
                    {address ? "QR Code Loading..." : "Connect your wallet first"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <button
            type="button"
            onClick={copyToClipboard}
            disabled={!universalLink}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 transition-colors text-white py-3 px-4 rounded-xl font-medium disabled:cursor-not-allowed"
          >
            <Copy className="w-4 h-4" />
            {linkCopied ? "Copied!" : "Copy Universal Link"}
          </button>

          <button
            type="button"
            onClick={openSelfApp}
            disabled={!universalLink}
            className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 transition-colors text-white py-3 px-4 rounded-xl font-medium disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <ExternalLink className="w-4 h-4" />
            Open Self App
          </button>

          <button
            type="button"
            onClick={handleSkipVerification}
            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 py-3 px-4 rounded-xl font-medium border border-gray-600"
          >
            <X className="w-4 h-4" />
            Skip Verification
          </button>
        </div>

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-purple-600 text-white py-2 px-4 rounded-lg shadow-lg text-sm z-50">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfProtocolComponent;