/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, UserPlus, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { toast } from "sonner";
import { useAccount, useChainId, usePublicClient, useSendTransaction } from "wagmi";
import { encodeFunctionData, parseEther, parseUnits } from "viem";
import { getDataSuffix, submitReferral } from "@divvi/referral-sdk";
import { FARQUEST_ABI, FARQUEST_CONTRACT_ADDRESS } from "~/lib/constant";
import { celo } from "viem/chains";

interface RegisterProps {
  isRegistered: boolean;
  setIsRegistered: (isRegistered: boolean) => void;
  onRegistrationSuccess?: () => void; // Optional callback for when registration succeeds
}

export default function Register({ isRegistered, setIsRegistered, onRegistrationSuccess }: RegisterProps) {
  const { address, isConnected, chain } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const publicClient = usePublicClient();
  const [isRegistering, setIsRegistering] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const chainId = useChainId();
  const CELO_CHAIN_ID = celo.id;
  const targetChain = celo;
  const isCorrectChain = chain?.id === CELO_CHAIN_ID;

  // Handle registration transaction
  const handleRegister = useCallback(async () => {
    if (!isCorrectChain) {
      toast.error("Please switch to Celo Network");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    setIsRegistering(true);

    try {
      // 1. Encode the register function call
      const registerData = encodeFunctionData({
        abi: FARQUEST_ABI,
        functionName: "register",
      });

      // 2. Get the referral data suffix
      const dataSuffix = getDataSuffix({
        consumer: "0xBdeb0877ea15abd145e12D7c74c04a5A5F924879", //KUSHI CHANGE TO YOUR DIVI CONSUMER ADDRESS
        providers: [
          "0x0423189886d7966f0dd7e7d256898daeee625dca",
          "0xc95876688026be9d6fa7a7c33328bd013effa2bb",
          "0x5f0a55fad9424ac99429f635dfb9bf20c3360ab8",
        ],
      });

      // 3. Properly combine the data
      const combinedData = dataSuffix
        ? registerData +
        (dataSuffix.startsWith("0x") ? dataSuffix.slice(2) : dataSuffix)
        : registerData;

      // 4. Send the transaction (0.1 CELO registration fee)
      const hash = await sendTransactionAsync({
        to: FARQUEST_CONTRACT_ADDRESS,
        data: combinedData as `0x${string}`,
        value: parseEther("0.1"), // 0.1 CELO registration fee
        chainId: CELO_CHAIN_ID,
        maxFeePerGas: parseUnits("100", 9),
        maxPriorityFeePerGas: parseUnits("100", 9),
      });

      setTxHash(hash);

      // 5. Wait for transaction receipt
      if (!publicClient) {
        throw new Error("Public client is not available");
      }
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      if (receipt.status === "success") {
        toast.success(
          `Registration successful! Transaction hash: ${hash.slice(0, 6)}...`,
        );
        setIsRegistered(true);

        // Call the optional success callback
        if (onRegistrationSuccess) {
          onRegistrationSuccess();
        }

        // 6. Report to Divi in a separate try-catch
        try {
          console.log("Submitting referral to Divi:", {
            txHash: hash,
            chainId: CELO_CHAIN_ID,
          });
          await submitReferral({
            txHash: hash,
            chainId: CELO_CHAIN_ID,
          });
          console.log("Referral submitted successfully");
        } catch (diviError) {
          console.error("Divi submitReferral error:", diviError);
          toast.warning(
            "Registration succeeded, but referral tracking failed. We're looking into it.",
          );
        }
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        `Registration failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsRegistering(false);
    }
  }, [
    isCorrectChain,
    address,
    sendTransactionAsync,
    CELO_CHAIN_ID,
    publicClient,
    setIsRegistered,
    onRegistrationSuccess,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden mt-1"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl" />
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-transparent to-pink-500/20 rounded-3xl" />

      {/* Subtle animated orbs */}
      <div className="absolute top-4 right-6 w-16 h-16 bg-pink-400/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-6 left-4 w-20 h-20 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000" />

      <div className="relative p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-2"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-2xl font-bold text-white">
            Join FarQuest
          </h2>
          <p className="text-purple-100/90 text-sm leading-relaxed max-w-sm mx-auto">
            Begin your quest journey with a simple 0.1 CELO registration fee and unlock exclusive rewards!
          </p>
        </div>

        {/* Content */}
        {isRegistered ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-6 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl border border-emerald-400/30"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-2 bg-emerald-400/20 rounded-full">
                <UserPlus className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="text-white font-semibold">Successfully Registered!</span>
            </div>
            <p className="text-emerald-100/80 text-sm text-center mb-4">
              Welcome to FarQuest! Your adventure begins now.
            </p>
            {txHash && (
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                href={`https://celoscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm text-white/90 hover:text-white border border-white/20"
              >
                View Transaction →
              </motion.a>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {!isCorrectChain && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-400/30 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-100 text-sm font-medium">Network Required</p>
                  <p className="text-red-200/80 text-xs mt-1">
                    Please switch to Celo Network to continue
                  </p>
                </div>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleRegister}
                disabled={!address || isRegistering || !isCorrectChain}
                className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Register for FarQuest"
              >
                {isRegistering ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <span>Register Now</span>
                    <div className="px-2 py-1 bg-pink-400/30 rounded-lg text-xs font-medium">
                      0.1 CELO
                    </div>
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}