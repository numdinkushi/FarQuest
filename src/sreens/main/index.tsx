/* eslint @typescript-eslint/ban-ts-comment: "off" */
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api'; // Adjust path as needed
import Register from '~/components/Register';
import { FARQUEST_ABI, FARQUEST_CONTRACT_ADDRESS } from '~/lib/constant';
import SelfProtocolComponent from '~/components/app/self-protocol/self';

interface MenuScreenProps {
    isWalletConnected: boolean;
    onStartGame: () => void;
}

export const MenuScreen: React.FC<MenuScreenProps> = ({ isWalletConnected, onStartGame }) => {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const [showInstructions, setShowInstructions] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
    const [showSelfProtocol, setShowSelfProtocol] = useState(false);

    // Check if user is already verified OG from Convex DB
    const userData = useQuery(api.queries.getUserByAddress, {
        address: address || "",
    });

    const isVerifiedOG = userData?.isOG || false;

    // Check if user is already registered on blockchain
    const checkRegistration = useCallback(async () => {
        if (!address || !publicClient || !isWalletConnected) {
            setIsCheckingRegistration(false);
            return;
        }

        try {
            setIsCheckingRegistration(true);

            const registered = await publicClient.readContract({
                address: FARQUEST_CONTRACT_ADDRESS,
                abi: FARQUEST_ABI,
                functionName: "users",
                args: [address],
            });

            setIsRegistered(registered[0]); // First field in User struct is 'registered'
        } catch (error) {
            console.log("Error checking registration:", error);
            toast.error("Failed to check registration status");
            setIsRegistered(false);
        } finally {
            setIsCheckingRegistration(false);
        }
    }, [address, publicClient, isWalletConnected]);

    // Check registration status on mount and when address/wallet connection changes
    useEffect(() => {
        checkRegistration();
    }, [checkRegistration]);

    // Handle successful registration
    const handleRegistrationSuccess = () => {
        setIsRegistered(true);
        // After successful registration, show self protocol verification
        setShowSelfProtocol(true);
        checkRegistration();
    };

    // Handle self protocol completion (either skip or verify)
    const handleSelfProtocolComplete = () => {
        setShowSelfProtocol(false);
    };

    // Show loading state while checking registration
    if (isWalletConnected && isCheckingRegistration) {
        return (
            <motion.div
                key="checking-registration"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
            >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-200" />
                </div>
                <h2 className="text-2xl font-bold text-white">Checking Registration</h2>
                <p className="text-purple-200">
                    Verifying your quest status on the blockchain...
                </p>
            </motion.div>
        );
    }

    // Determine what to show based on registration and OG status
    const shouldShowRegister = isWalletConnected && !isRegistered;
    const shouldShowSelfProtocol = isWalletConnected && isRegistered && !isVerifiedOG && showSelfProtocol;
    const shouldShowProceedSection = isWalletConnected && isRegistered && (isVerifiedOG || !showSelfProtocol);

    return (
        <>
            <motion.div
                key="menu"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center space-y-8"
            >
                {/* Show Registration Component */}
                {shouldShowRegister && (
                    <Register
                        isRegistered={isRegistered}
                        setIsRegistered={setIsRegistered}
                        onRegistrationSuccess={handleRegistrationSuccess}
                    />
                )}

                {/* Show Self Protocol Component */}
                {shouldShowSelfProtocol && (
                    <div className="mb-3">
                        <SelfProtocolComponent onComplete={handleSelfProtocolComplete} />
                    </div>
                )}

                {/* Show Proceed Section (Game Instructions + Begin Quest) */}
                {shouldShowProceedSection && (
                    <>
                        <div className="space-y-6">
                            <div className="text-6xl">🏰</div>
                            <h2 className="text-3xl font-bold text-white">
                                Welcome, Adventurer{isVerifiedOG ? ' (O.G)' : ''}!
                            </h2>
                            <p className="text-lg text-purple-200 max-w-md mx-auto">
                                Embark on an epic quest through the Web3 realm. Answer mystical questions to collect crystals and level up!
                                {isVerifiedOG && (
                                    <span className="block mt-2 text-yellow-300 font-semibold">
                                        🌟 O.G Status: 2x Rewards Active! 🌟
                                    </span>
                                )}
                            </p>
                        </div>

                        <div className="space-y-6 max-w-md mx-auto">
                            <motion.button
                                onClick={() => setShowInstructions(true)}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)",
                                    y: -2
                                }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                                }}
                            >
                                <span className="flex items-center justify-center gap-3">
                                    <span className="text-2xl">⚡</span>
                                    Game Instructions
                                </span>
                            </motion.button>

                            <motion.button
                                onClick={onStartGame}
                                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 0 40px rgba(34, 197, 94, 0.6)",
                                    y: -2
                                }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                    boxShadow: '0 8px 32px rgba(5, 150, 105, 0.3)',
                                }}
                            >
                                <span className="flex items-center justify-center gap-3">
                                    <span className="text-2xl">🚀</span>
                                    Begin Quest
                                </span>
                            </motion.button>

                            {/* Show option to verify with Self Protocol if not already verified */}
                            {!isVerifiedOG && (
                                <motion.button
                                    onClick={() => setShowSelfProtocol(true)}
                                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl text-white font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg"
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 0 40px rgba(245, 158, 11, 0.6)",
                                        y: -2
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
                                        boxShadow: '0 8px 32px rgba(217, 119, 6, 0.3)',
                                    }}
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        <span className="text-2xl">🌟</span>
                                        Verify for O.G Status (2x Rewards)
                                    </span>
                                </motion.button>
                            )}
                        </div>
                    </>
                )}
            </motion.div>

            <AnimatePresence>
                {showInstructions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setShowInstructions(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-lg rounded-2xl px-6 py-6 max-w-sm w-full h-full flex flex-col border-2 border-purple-400/30 shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center mb-6 flex-shrink-0">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="text-4xl mb-3"
                                >
                                    🌌
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-3">Galactic Quest Rules</h3>
                                <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
                            </div>

                            <motion.div
                                className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="space-y-4 text-purple-100 pb-4">
                                    <div className="flex items-start space-x-3 p-4 bg-purple-800/30 rounded-xl border border-purple-400/20">
                                        <span className="text-2xl">🎯</span>
                                        <div>
                                            <p className="font-semibold text-purple-200 text-base">Mission Structure</p>
                                            <p className="text-sm">Navigate through 15 levels, each containing 12 challenging questions</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-4 bg-red-800/30 rounded-xl border border-red-400/20">
                                        <span className="text-2xl">❤️</span>
                                        <div>
                                            <p className="font-semibold text-red-200 text-base">Health System</p>
                                            <p className="text-sm">Your health fluctuates based on performance - wrong answers cost 20% health</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-4 bg-green-800/30 rounded-xl border border-green-400/20">
                                        <span className="text-2xl">⚡</span>
                                        <div>
                                            <p className="font-semibold text-green-200 text-base">Power Boost</p>
                                            <p className="text-sm">Answer 10 consecutive questions correctly to gain 5% health</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-4 bg-yellow-800/30 rounded-xl border border-yellow-400/20">
                                        <span className="text-2xl">💀</span>
                                        <div>
                                            <p className="font-semibold text-yellow-200 text-base">Game Over</p>
                                            <p className="text-sm">When health reaches 0, your galactic journey ends</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-4 bg-indigo-800/30 rounded-xl border border-indigo-400/20">
                                        <span className="text-2xl">🌟</span>
                                        <div>
                                            <p className="font-semibold text-indigo-200 text-base">Ultimate Goal</p>
                                            <p className="text-sm">Reach the ends of the galaxy and become a cosmic legend!</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="mt-6 text-center flex-shrink-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <p className="text-purple-300 font-semibold mb-4 text-base">✨ Good luck, Space Warrior! ✨</p>
                                <motion.button
                                    onClick={() => setShowInstructions(false)}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-base hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg border border-purple-400/30"
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 0 25px rgba(168, 85, 247, 0.5)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="flex items-center gap-2">
                                        Ready to Quest!
                                        <span className="text-lg">🚀</span>
                                    </span>
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #8b5cf6 rgba(139, 92, 246, 0.1);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(139, 92, 246, 0.1);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #8b5cf6, #ec4899);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #7c3aed, #db2777);
                }
            `}</style>
        </>
    );
};