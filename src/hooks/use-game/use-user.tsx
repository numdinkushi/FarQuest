import { useState } from "react";
import { useConvexGame } from "../use-convex-game";


export const useUserManagement = (walletAddress: string) => {
    // Add user creation state
    const [userCreationError, setUserCreationError] = useState<string | null>(null);
    const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);

    // Convex integration
    const {
        user,
        isUserCreated,
        createUser,
        error: convexError,
        clearError
    } = useConvexGame(walletAddress);

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
            setUserCreationError(error instanceof Error ? error.message : 'Failed to create user');
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
        clearUserError
    };
};