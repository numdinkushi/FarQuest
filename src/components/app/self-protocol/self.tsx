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
    CheckCircle,
    Verified,
    X,
} from "lucide-react";
import { useAccount } from "wagmi";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { APP_ICON_URL } from "~/lib/constant";
import { APP_URL } from "~/constants";
import { updateUserOGStatus } from "../../../../convex/users";
import { useWallet } from "~/hooks/use-game/use-wallet";

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
    const updateUserOGStatus = useMutation(api.users.updateUserOGStatus);

    // Check if user is already verified OG
    const userData = useQuery(api.queries.getUserByAddress, {
        address: address || "",
    });

    const isVerifiedOG = userData?.isOG || false;

    console.log(909090, { userData }, { address }, { isVerifiedOG });

    const minimumAge = 18;
    const requireName = true;
    const checkOFAC = true;

    useEffect(() => {
        if (!address || isVerifiedOG) return;

        try {
            // Keep the original configuration that was working
            const app = new SelfAppBuilder({
                appName: process.env.NEXT_PUBLIC_SELF_APP_NAME || "Farquest",
                scope: "farquest",
                endpoint: `https://free-hamster-loving.ngrok-free.app/api/self-protocol`,
                endpointType: "https",
                logoBase64: APP_ICON_URL,
                userId: address,
                userIdType: "hex", // Keep this - it's still required according to docs
                disclosures: {
                    minimumAge,
                    ofac: checkOFAC,
                    name: requireName,
                },
            }).build();

            setSelfApp(app);
            setUniversalLink(getUniversalLink(app));
        } catch (error) {
            console.log("Failed to initialize Self app:", error);
        }
    }, [address, checkOFAC, requireName, isVerifiedOG]);

    const displayToast = (message: string): void => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const copyToClipboard = (): void => {
        if (!universalLink) return;

        navigator.clipboard
            .writeText(universalLink)
            .then(() => {
                setLinkCopied(true);
                displayToast("Universal link copied to clipboard!");
                setTimeout(() => setLinkCopied(false), 2000);
            })
            .catch((err) => {
                console.log("Failed to copy text: ", err);
                toast.error("Failed to copy link");
            });
    };

    const openSelfApp = (): void => {
        if (!universalLink) return;

        window.open(universalLink, "_blank");
        toast.success("Opening Self App...");
    };

    const handleSuccessfulVerification = (): void => {
        toast.success("Identity verified successfully!");
        onSuccess();
    };

    const handleSkipVerification = (): void => {
        displayToast("Verification skipped. Continuing without O.G benefits.");
        setTimeout(() => {
            onComplete?.();
        }, 1000);
    };

    console.log("isVerifiedOG:", isVerifiedOG);

    const onSuccess = async () => {
        displayToast("Identity verified successfully!");

        // Update user's OG status in Convex database
        if (address) {
            try {
                await updateUserOGStatus({ address, isOG: true });
                console.log("User OG status updated successfully for address:", address);
            } catch (error) {
                console.error("Failed to update user OG status:", error);
                toast.error("Failed to update verification status");
            }
        }

        setTimeout(() => {
            onComplete?.();
        }, 1500);
    };

    // If user is already verified, don't show the verification screen
    if (isVerifiedOG) {
        return null;
    }

    return (
        <div className="w-full bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="text-center max-w-md mx-auto">
                {/* Header */}
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

                {/* QR Code Container */}
                <div className="bg-white rounded-2xl p-4 mb-6 mx-auto w-48">
                    <div className="w-32 h-32 mx-auto flex items-center justify-center rounded-xl">
                        {selfApp ? (
                            <div className="">
                                <SelfQRcodeWrapper
                                    selfApp={selfApp}
                                    onSuccess={handleSuccessfulVerification}
                                    size={128}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl border-2 border-gray-200">
                                <div className="text-center">
                                    <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-1 flex items-center justify-center animate-pulse">
                                        <Shield className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="text-gray-600 text-xs">{address ? 'QR Code Loading...' : "Connect your wallet first"}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
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

                {/* Toast notification */}
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