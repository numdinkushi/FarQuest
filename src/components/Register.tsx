/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { toast } from "sonner";
import { useAccount, useChainId, usePublicClient, useSendTransaction } from "wagmi";
import { encodeFunctionData, parseEther, parseUnits } from "viem";
import { getDataSuffix, submitReferral } from "@divvi/referral-sdk";
import { FARQUEST_ABI, FARQUEST_CONTRACT_ADDRESS } from "~/lib/constant";
import { celo } from "viem/chains";

interface RegisterProps {
  isCorrectChain: boolean;
  FARQUEST_CONTRACT_ADDRESS: `0x${string}`;
  FARQUEST_ABI: any[];
  CELO_CHAIN_ID: number;
}

export default function Register( ) {
  const { address, isConnected, chain } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const publicClient = usePublicClient();
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

   const chainId = useChainId();
  const CELO_CHAIN_ID = celo.id;
  const targetChain = celo;
  const isCorrectChain = chain?.id === CELO_CHAIN_ID;

  // Check if user is already registered
  const checkRegistration = useCallback(async () => {
    if (!address || !publicClient) return;
    
    try {
      const registered: any = await publicClient.readContract({
        address: FARQUEST_CONTRACT_ADDRESS,
        abi: FARQUEST_ABI,
        functionName: "users",
        args: [address],
      });
      
      setIsRegistered(registered[0]); // First field in User struct is 'registered'
      setIsCheckingRegistration(false);
    } catch (error) {
      console.error("Error checking registration:", error);
      toast.error("Failed to check registration status");
      setIsCheckingRegistration(false);
    }
  }, [address, publicClient]);

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
        consumer: "0xC5337CeE97fF5B190F26C4A12341dd210f26e17c", //KUSHI CHANGE TO YOUR DIVI CONSUMER ADDRESS
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
  ]);

  // Check registration status on mount and when address changes
  useEffect(() => {
    checkRegistration();
  }, [checkRegistration]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-5"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Register for FarQuest
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Pay a 0.1 CELO registration fee to join FarQuest and start earning
        rewards by completing quests!
      </p>

      {isCheckingRegistration ? (
        <div className="p-4 text-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-300">
            Checking registration status...
          </p>
        </div>
      ) : isRegistered ? (
        <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-800 dark:text-green-200">
          <div className="flex items-center justify-center gap-2">
            <UserPlus className="w-5 h-5" />
            <span>You are already registered!</span>
          </div>
          {txHash && (
            <a
              href={`https://celoscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline block mt-2 text-center"
            >
              View transaction
            </a>
          )}
        </div>
      ) : (
        <>
          {!isCorrectChain && (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg text-sm text-red-800 dark:text-red-200 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Please switch to Celo Network to register</span>
            </div>
          )}

          <Button
            onClick={handleRegister}
            disabled={!address || isRegistering || !isCorrectChain}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
            aria-label="Register for FarQuest"
          >
            {isRegistering ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" />
                <span>Register (0.1 CELO)</span>
              </div>
            )}
          </Button>
        </>
      )}
    </motion.div>
  );
}