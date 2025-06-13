import { useState, useEffect } from "react";
import { useConvexGame } from "../use-convex-game";

export const useUserManagement = (walletAddress: string) => {
    // Add user creation state
    const [userCreationError, setUserCreationError] = useState<string | null>(null);
    const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
    const [autoCreateAttempted, setAutoCreateAttempted] = useState<boolean>(false);

    // Convex integration
    const {
        user,
        isUserCreated,
        createUser,
        error: convexError,
        clearError
    } = useConvexGame(walletAddress);

    // Auto-create user when wallet connects and no user exists
    useEffect(() => {
        const autoCreateUser = async () => {
            // Only attempt auto-creation once per wallet connection
            if (!walletAddress || autoCreateAttempted || isCreatingUser) {
                return;
            }

            // Wait a bit for the user query to complete
            // If user is undefined (loading), wait. If user is null (doesn't exist), create it.
            if (user === undefined) {
                return; // Still loading
            }

            if (user === null) {
                // User doesn't exist, create it
                console.log('Auto-creating user for wallet:', walletAddress);
                setAutoCreateAttempted(true);
                
                try {
                    await createUserWithUsername('Player 1', true);
                    console.log('User auto-created successfully');
                } catch (error) {
                    console.error('Auto user creation failed:', error);
                    // Don't throw here - let the user handle it manually if needed
                }
            } else {
                // User exists, mark as attempted to prevent future attempts
                setAutoCreateAttempted(true);
            }
        };

        autoCreateUser();
    }, [walletAddress, user, autoCreateAttempted, isCreatingUser]);

    // Reset auto-create attempt when wallet changes
    useEffect(() => {
        setAutoCreateAttempted(false);
        setUserCreationError(null);
    }, [walletAddress]);

    // Enhanced user creation with better error handling
    const createUserWithUsername = async (username: string, isOG?: boolean): Promise<void> => {
        console.log('Creating user with username:', username, 'isOG:', isOG);
        if (!walletAddress) {
            throw new Error('Wallet not connected');
        }

        if (!username || username.trim().length === 0) {
            throw new Error('Username is required');
        }

        setIsCreatingUser(true);
        setUserCreationError(null);

        try {
            await createUser(username.trim(), walletAddress, isOG);
        } catch (error) {
            console.error('Failed to create user:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
            
            // If user already exists, don't treat it as an error
            if (errorMessage.includes('User already exists')) {
                console.log('User already exists, continuing...');
                return; // Don't throw, just return successfully
            }
            
            setUserCreationError(errorMessage);
            throw error;
        } finally {
            setIsCreatingUser(false);
        }
    };

    const clearUserError = (): void => {
        setUserCreationError(null);
        clearError();
    };

    return {
        user,
        isUserCreated,
        userCreationError,
        isCreatingUser,
        convexError,
        createUserWithUsername,
        clearUserError,
        autoCreateAttempted // Expose this for debugging if needed
    };
};
