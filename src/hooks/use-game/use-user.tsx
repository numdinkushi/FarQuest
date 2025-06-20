import { useState, useEffect } from "react";
import { useConvexGame } from "../use-convex-game";

export const useUserManagement = (walletAddress: string) => {
    // Add user creation state
    const [userCreationError, setUserCreationError] = useState<string | null>(null);
    const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);
    const [autoCreateAttempted, setAutoCreateAttempted] = useState<boolean>(false);
    const [fetchingUsername, setFetchingUsername] = useState<boolean>(false);

    // Convex integration
    const {
        user,
        isUserCreated,
        createUser,
        error: convexError,
        clearError
    } = useConvexGame(walletAddress);

    // Function to fetch username from Neynar API
    const fetchUsernameFromNeynar = async (address: string): Promise<string> => {
        setFetchingUsername(true);
        try {
            const response = await fetch(`/api/farcaster/user?address=${encodeURIComponent(address)}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Return the username if found, otherwise fallback to a default
            return data.username || `Player ${address.slice(-4)}`;
        } catch (error) {
            console.error('Error fetching username from Neynar:', error);
            // Fallback to a default username based on wallet address
            return `Player ${address.slice(-4)}`;
        } finally {
            setFetchingUsername(false);
        }
    };

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
                    // Fetch username from Neynar API
                    const username = await fetchUsernameFromNeynar(walletAddress);
                    console.log('Fetched username:', username);
                    
                    await createUserWithUsername(username, true);
                    console.log('User auto-created successfully with username:', username);
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

    // Enhanced manual user creation that fetches username
    const createUserWithFetchedUsername = async (isOG?: boolean): Promise<void> => {
        if (!walletAddress) {
            throw new Error('Wallet not connected');
        }

        try {
            const username = await fetchUsernameFromNeynar(walletAddress);
            await createUserWithUsername(username, isOG);
        } catch (error) {
            console.error('Failed to create user with fetched username:', error);
            throw error;
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
        fetchingUsername,
        convexError,
        createUserWithUsername,
        createUserWithFetchedUsername, // New method for manual creation with API fetch
        clearUserError,
        autoCreateAttempted, // Expose this for debugging if needed
        fetchUsernameFromNeynar // Expose this for manual use if needed
    };
};