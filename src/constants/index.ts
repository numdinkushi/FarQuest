// import { Question } from "~/types";

import { Difficulty } from "~/types";

interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    difficulty: Difficulty;
    reward: {
        exp: number;
        crystals: number;
    };
}

interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    difficulty: Difficulty;
    reward: {
        exp: number;
        crystals: number;
    };
}

export const QUESTIONS: Question[] = [
    // Starter (12 questions)
    {
        id: 1,
        question: "What are Farcaster Mini Apps primarily built with?",
        options: ["Python and Flask", "Ruby on Rails", "HTML, CSS, and JavaScript", "Swift and Xcode"],
        correct: 2,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 2,
        question: "What is the main purpose of Farcaster Mini Apps?",
        options: ["To replace blockchain networks", "To be used within Farcaster clients", "To run as standalone desktop apps", "To create VR experiences"],
        correct: 1,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 3,
        question: "What type of network is Farcaster described as?",
        options: ["Centralized", "Private", "Hybrid", "Decentralized"],
        correct: 3,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 4,
        question: "What does Celo aim to create conditions for?",
        options: ["Exclusive financial systems", "Prosperity for everyone", "Centralized banking", "Gaming ecosystems"],
        correct: 1,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 5,
        question: "Which platform hosts Farcaster Mini Apps?",
        options: ["App Store", "Google Play", "Farcaster clients", "Microsoft Store"],
        correct: 2,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 6,
        question: "What is the primary focus of Celo’s blockchain?",
        options: ["Gaming", "Social media", "Financial inclusion", "Data storage"],
        correct: 2,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 7,
        question: "What type of apps can be built on Celo?",
        options: ["Centralized apps", "Decentralized apps", "Desktop-only apps", "Console apps"],
        correct: 1,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 8,
        question: "What kind of Mini App can be created on Celo using MiniPay?",
        options: ["Web-only", "Desktop-first", "Mobile-first", "Console-based"],
        correct: 2,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 9,
        question: "What is one feature Mini Apps can access via the Farcaster SDK?",
        options: ["Hardware sensors", "User authentication", "Cloud storage", "Local file system"],
        correct: 1,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 10,
        question: "What is the file extension of the manifest file for Farcaster Mini Apps?",
        options: [".xml", ".txt", ".yaml", ".json"],
        correct: 3,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 11,
        question: "Which Celo tool helps developers quickstart a dApp?",
        options: ["Celo Editor", "Celo Composer", "Celo Builder", "Celo Studio"],
        correct: 1,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 12,
        question: "What is one way Farcaster Mini Apps can be discovered?",
        options: ["Through social feeds", "On TV ads", "In app stores", "Via email campaigns"],
        correct: 0,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },

    // Novice (12 questions)
    {
        id: 13,
        question: "Which CLI command is used to set up a new Farcaster Mini App project?",
        options: [
            "npm install @farcaster/mini-app",
            "npx @farcaster/create-mini-app",
            "npx @farcaster/new-app",
            "npm create @farcaster/frame"
        ],
        correct: 1,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 14,
        question: "Where is the Farcaster Mini App manifest file hosted?",
        options: ["/manifest.json", "/app/farcaster.json", "/.well-known/farcaster.json", "/root/miniapp.json"],
        correct: 2,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 15,
        question: "What does the Farcaster Mini App SDK facilitate communication over?",
        options: ["HTTP requests", "WebSocket", "gRPC", "postMessage channel"],
        correct: 3,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 16,
        question: "What is the purpose of Celo’s Mento protocol?",
        options: ["Gaming rewards", "Social networking", "Local stablecoins", "Cloud computing"],
        correct: 2,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 17,
        question: "Which Farcaster feature allows Mini Apps to interact with a user’s wallet?",
        options: ["Frame SDK", "WalletConnect", "AuthKit", "Mini App SDK"],
        correct: 3,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 18,
        question: "What type of versioning does the Farcaster Mini App SDK use?",
        options: ["Calendar Versioning", "Semantic Versioning", "Incremental Versioning", "Hash-based Versioning"],
        correct: 1,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 19,
        question: "What can developers build on Celo using Farcaster?",
        options: ["Databases", "Frames", "Virtual machines", "Operating systems"],
        correct: 1,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 20,
        question: "What is the purpose of the splash screen in Farcaster Mini Apps?",
        options: [
            "To show in-app purchases",
            "To display a branded loading page",
            "To display ads",
            "To collect user feedback"
        ],
        correct: 1,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 21,
        question: "Which Celo feature verifies real users using zero-knowledge proofs?",
        options: ["UserAuth", "RealID", "SelfVerify", "ZKProof"],
        correct: 2,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 22,
        question: "How can Farcaster Mini Apps be shared in social feeds?",
        options: ["By SMS", "Using special embeds", "Via email links", "Through QR codes"],
        correct: 1,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 23,
        question: "What does the Farcaster Mini App SDK provide access to?",
        options: ["Hardware drivers", "Third-party APIs", "Native Farcaster features", "Local storage"],
        correct: 2,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 24,
        question: "What is one benefit of Celo’s mobile-first approach?",
        options: ["Complex setup", "Higher latency", "Improved accessibility", "Limited scalability"],
        correct: 2,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },

    // Explorer (12 questions)
    {
        id: 25,
        question: "Which method is called to hide the Farcaster Mini App splash screen?",
        options: ["sdk.actions.load()", "sdk.actions.hide()", "sdk.actions.ready()", "sdk.actions.start()"],
        correct: 2,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 26,
        question: "What is the purpose of the /.well-known/farcaster.json file?",
        options: [
            "To store user data",
            "To cache app assets",
            "To configure server settings",
            "To publish Mini App metadata"
        ],
        correct: 3,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 27,
        question: "Which Celo tool allows developers to launch agents for an onchain economy?",
        options: ["Celo AI", "Onchain Agents", "AgentKit", "Build with AI"],
        correct: 3,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 28,
        question: "What type of notifications can Farcaster Mini Apps send to users?",
        options: ["SMS", "Push notifications", "Email", "In-app alerts"],
        correct: 1,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 29,
        question: "Which JavaScript framework is shown in examples for redirecting Farcaster manifest requests?",
        options: ["Vue.js", "Next.js", "React", "Angular"],
        correct: 1,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 30,
        question: "What does the Farcaster Mini App SDK allow apps to subscribe to?",
        options: ["Blockchain transactions", "Host events", "User profiles", "Server logs"],
        correct: 1,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 31,
        question: "Which Celo Mini App allows users to earn $gm points?",
        options: ["0xHarmonybot", "DeepGov", "GMonchain", "USDGLO"],
        correct: 2,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 32,
        question: "What is one way to include the Farcaster Mini App SDK in a project?",
        options: ["Via FTP", "Via a CDN", "Through a database", "Using a local file"],
        correct: 1,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 33,
        question: "What type of wallet can Farcaster Mini Apps interact with?",
        options: ["Solana wallet", "EVM wallet", "Bitcoin wallet", "Cardano wallet"],
        correct: 1,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 34,
        question: "Which Celo feature supports building with DeFi protocols?",
        options: ["Mento DeFi", "Celo DeFi", "DeFiKit", "Build with DeFi"],
        correct: 3,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 35,
        question: "What is the purpose of meta tags in Farcaster Mini App URLs?",
        options: [
            "To secure the app",
            "To enable sharing in social feeds",
            "To cache data",
            "To optimize search engines"
        ],
        correct: 1,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 36,
        question: "What does the Farcaster Mini App context object provide?",
        options: ["Server status", "User session information", "App logs", "Database access"],
        correct: 1,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },

    // Adventurer (12 questions)
    {
        id: 37,
        question: "Which Farcaster Mini App event is triggered when a user adds a frame?",
        options: ["frame_loaded", "notifications_added", "frame_added", "frame_enabled"],
        correct: 2,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 38,
        question: "What is the URL for Farcaster’s hosted manifest redirects?",
        options: [
            "https://farcaster.xyz/manifest/${id}",
            "https://api.farcaster.xyz/miniapps/hosted-manifest/${id}",
            "https://miniapps.farcaster.xyz/redirect/${id}",
            "https://api.farcaster.xyz/redirect/${id}"
        ],
        correct: 1,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 39,
        question: "Which Celo Mini App allows users to mint exclusive NFTs?",
        options: ["GMonchain", "0xHarmonybot", "DeepGov", "MiniPay"],
        correct: 1,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 40,
        question: "What HTTP status code is used for Farcaster manifest redirects?",
        options: ["302", "301", "307", "308"],
        correct: 2,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 41,
        question: "Which Farcaster Mini App SDK method disables native gestures?",
        options: [
            "sdk.actions.setGestures(false)",
            "sdk.actions.ready({ disableNativeGestures: true })",
            "sdk.actions.disableGestures()",
            "sdk.actions.configureGestures()"
        ],
        correct: 1,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 42,
        question: "What is the purpose of Celo’s funding opportunities?",
        options: [
            "To limit app distribution",
            "To increase project awareness",
            "To support hardware development",
            "To reduce blockchain usage"
        ],
        correct: 1,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 43,
        question: "Which Farcaster tool helps developers preview Mini Apps?",
        options: ["Mini App Simulator", "Farcaster Emulator", "Warpcast Developer Tools", "Frame Debugger"],
        correct: 2,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 44,
        question: "What does the Farcaster Mini App SDK use for communication in iframes?",
        options: ["REST API", "postMessage", "WebSocket", "GraphQL"],
        correct: 1,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 45,
        question: "Which Celo protocol supports local stablecoins?",
        options: ["MiniPay", "Mento", "SelfVerify", "Celo Composer"],
        correct: 1,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 46,
        question: "What is one requirement for Farcaster Mini App notifications?",
        options: [
            "They require a paid subscription",
            "They are sent via email",
            "Users must enable them",
            "They are enabled by default"
        ],
        correct: 2,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 47,
        question: "Which Farcaster Mini App feature rewards developers based on usage?",
        options: ["Mini App Credits", "Warpcast Developer Rewards", "Farcaster Points", "Chain Rewards"],
        correct: 1,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 48,
        question: "What is the purpose of the Cache-Control header in Farcaster Mini App embeds?",
        options: [
            "To authenticate users",
            "To cache images for feeds",
            "To secure the app",
            "To compress data"
        ],
        correct: 1,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },

    // Legend (12 questions)
    {
        id: 49,
        question: "Which Farcaster Mini App event invalidates notification tokens when a user disables notifications?",
        options: ["frame_removed", "notifications_disabled", "notifications_invalid", "frame_disabled"],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 50,
        question: "What is the purpose of the accountAssociation property in farcaster.json?",
        options: [
            "To cache app data",
            "To verify Mini App ownership",
            "To store user preferences",
            "To configure notifications"
        ],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 51,
        question: "Which Celo Mini App allows users to earn USDGLO tokens?",
        options: ["GMonchain", "0xHarmonybot", "DeepGov", "MiniPay"],
        correct: 2,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 52,
        question: "What is the recommended max-age for Cache-Control in Farcaster Mini App embeds?",
        options: ["Infinite", "Non-zero", "Zero", "Random"],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 53,
        question: "Which Farcaster Mini App SDK property provides client information?",
        options: ["sdk.client.info", "sdk.info.client", "sdk.context.client", "sdk.context.info"],
        correct: 2,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 54,
        question: "What is one benefit of Farcaster’s decentralized publishing model?",
        options: [
            "Centralized control",
            "No single entity submission",
            "Faster app store reviews",
            "Limited client support"
        ],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 55,
        question: "Which Celo feature supports onchain transactions for Mini Apps?",
        options: ["Mento", "MiniPay", "SelfVerify", "Celo Composer"],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 56,
        question: "What is the purpose of the Farcaster Mini App Developer Playground?",
        options: [
            "To debug server logs",
            "To test Mini Apps",
            "To host Mini Apps",
            "To configure wallets"
        ],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 57,
        question: "Which Farcaster Mini App SDK method prepares the app for display?",
        options: ["sdk.actions.load()", "sdk.actions.ready()", "sdk.actions.display()", "sdk.actions.show()"],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 58,
        question: "What is one challenge with Farcaster Mini App chain support?",
        options: [
            "High latency",
            "Limited chain compatibility",
            "Centralized chains",
            "No wallet support"
        ],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 59,
        question: "Which Celo tool integrates with Farcaster for frame creation?",
        options: ["Celo Composer", "Mento", "MiniPay", "Build with Farcaster"],
        correct: 3,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 60,
        question: "What is the purpose of the fc:frame meta tag in Farcaster Mini Apps?",
        options: [
            "To configure settings",
            "To enable sharing in feeds",
            "To secure the app",
            "To cache data"
        ],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },

    // Conqueror (12 questions)
    {
        id: 61,
        question: "Which Farcaster Mini App SDK package is used for wallet integration?",
        options: [
            "@farcaster/wagmi-sdk",
            "@farcaster/frame-wagmi-connector",
            "@farcaster/wallet-sdk",
            "@farcaster/chain-connector"
        ],
        correct: 1,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 62,
        question: "What is the purpose of the Farcaster Hosted Manifests beta?",
        options: [
            "To host user data",
            "To simplify manifest updates",
            "To cache app assets",
            "To secure notifications"
        ],
        correct: 1,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 63,
        question: "Which Celo blockchain metric increased by 10% after Mini App announcements?",
        options: ["Transaction fees", "Daily active addresses", "Block size", "Node count"],
        correct: 1,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 64,
        question: "Which Farcaster Mini App SDK method checks if a wallet is connected?",
        options: ["checkWallet", "isConnected", "walletStatus", "connectStatus"],
        correct: 1,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 65,
        question: "What is the role of the Farcaster Mini App webhookUrl?",
        options: [
            "To cache images",
            "To receive client events",
            "To send user data",
            "To configure wallets"
        ],
        correct: 1,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 66,
        question: "Which Celo Mini App drives liquidity through user engagement?",
        options: ["GMonchain", "0xHarmonybot", "DeepGov", "All of the above"],
        correct: 3,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 67,
        question: "What is one requirement for Farcaster Mini App verification?",
        options: [
            "App store submission",
            "Cryptographically signed message",
            "Centralized approval",
            "Paid subscription"
        ],
        correct: 1,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 68,
        question: "Which Farcaster Mini minimized SDK feature supports chain-specific interactions?",
        options: ["chainList", "supportedChainIds", "networkIds", "chainSupport"],
        correct: 1,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 69,
        question: "What is the purpose of Celo’s total value locked (TVL) metric?",
        options: [
            "To track user logins",
            "To measure DeFi protocol confidence",
            "To monitor server uptime",
            "To count nodes"
        ],
        correct: 1,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 70,
        question: "Which Farcaster Mini App SDK method triggers user prompts to add the app?",
        options: ["promptAdd", "addMiniApp", "installApp", "addFrame"],
        correct: 1,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 71,
        question: "What is one benefit of Farcaster Mini Apps over traditional apps?",
        options: [
            "Higher development costs",
            "No app store reviews",
            "Limited user reach",
            "Complex deployment"
        ],
        correct: 1,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 72,
        question: "Which Celo tool supports stablecoin integration?",
        options: ["MiniPay", "SelfVerify", "Mento", "Celo Composer"],
        correct: 2,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },

    // Star (12 questions)
    {
        id: 73,
        question: "Which Farcaster Mini App SDK script is used for direct HTML embedding?",
        options: [
            "https://farcaster.xyz/sdk/index.js",
            "https://cdn.jsdelivr.net/npm/@farcaster/frame-sdk/dist/index.min.js",
            "https://miniapps.farcaster.xyz/sdk.js",
            "https://api.farcaster.xyz/frame-sdk.js"
        ],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 74,
        question: "What is the purpose of the Farcaster Mini App frame property in the manifest?",
        options: [
            "To cache assets",
            "To specify metadata",
            "To configure security",
            "To store user data"
        ],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 75,
        question: "Which Celo metric showed a 7% uptick after Mini App announcements?",
        options: ["Daily transactions", "Total value locked", "User logins", "Node count"],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 76,
        question: "Which Farcaster Mini App SDK method handles Ethereum wallet connections?",
        options: ["walletConnect", "miniAppConnector", "ethConnector", "chainConnect"],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 77,
        question: "What is one risk of not setting a non-zero max-age in Farcaster Mini App embeds?",
        options: [
            "Security vulnerabilities",
            "High service provider costs",
            "Data corruption",
            "User authentication issues"
        ],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 78,
        question: "Which Celo Mini App incentivizes daily activity?",
        options: ["DeepGov", "GMonchain", "0xHarmonybot", "MiniPay"],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 79,
        question: "Which Farcaster Mini App SDK feature supports dynamic image rendering?",
        options: ["ImageKit", "Vercel OG", "RenderAPI", "DynamicPNG"],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 80,
        question: "What is the purpose of the Farcaster Mini App changelog?",
        options: [
            "To store user data",
            "To document all changes",
            "To cache assets",
            "To configure settings"
        ],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 81,
        question: "Which Celo blockchain pair saw a 12% volume increase after Mini App news?",
        options: ["CELO/ETH", "CELO/BTC", "CELO/USDT", "CELO/USD"],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 82,
        question: "Which Farcaster Mini App SDK method retrieves session context?",
        options: ["sdk.session", "sdk.context", "sdk.info", "sdk.state"],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 83,
        question: "What is one benefit of Farcaster Mini App verification?",
        options: [
            "Increased latency",
            "Eligibility for rewards",
            "Limited user reach",
            "Complex setup"
        ],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 84,
        question: "Which Celo tool supports mobile-first Mini Apps?",
        options: ["Mento", "MiniPay", "SelfVerify", "Celo Composer"],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },

    // Galaxy (12 questions)
    {
        id: 85,
        question: "Which Farcaster Mini App SDK feature lists supported blockchain chains?",
        options: ["chainList", "supportedChainIds", "networkIds", "blockchainSupport"],
        correct: 1,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 86,
        question: "What is the purpose of the Farcaster Mini App What’s New page?",
        options: [
            "To store user data",
            "To communicate developer changes",
            "To cache assets",
            "To configure settings"
        ],
        correct: 1,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 87,
        question: "Which Celo metric indicates growing network activity?",
        options: ["Block size", "Daily active addresses", "Node count", "Transaction fees"],
        correct: 1,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 88,
        question: "Which Farcaster Mini App SDK method handles notification events?",
        options: ["eventListener", "notifications_enabled", "subscribeEvents", "handleNotifications"],
        correct: 0,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 89,
        question: "What is one challenge with Farcaster Mini App embeds in feeds?",
        options: [
            "High latency",
            "Cached metadata",
            "Security risks",
            "Limited compatibility"
        ],
        correct: 1,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 90,
        question: "Which Celo Mini App supports governance participation?",
        options: ["0xHarmonybot", "DeepGov", "GMonchain", "MiniPay"],
        correct: 1,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 91,
        question: "Which Farcaster Mini App SDK method configures chain connections?",
        options: ["setChain", "createConfig", "configureChain", "chainSetup"],
        correct: 1,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 92,
        question: "What is the purpose of Celo’s onchain data from CeloScan?",
        options: [
            "To store user data",
            "To track network activity",
            "To cache assets",
            "To configure settings"
        ],
        correct: 1,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 93,
        question: "Which Farcaster Mini App SDK feature supports social feed integration?",
        options: ["socialTag", "fc:frame meta tag", "feedEmbed", "shareLink"],
        correct: 1,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 94,
        question: "What is one benefit of Celo’s Mini App ecosystem?",
        options: [
            "Higher latency",
            "Increased user retention",
            "Limited scalability",
            "Complex setup"
        ],
        correct: 1,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 95,
        question: "Which Farcaster Mini App SDK method handles user authentication?",
        options: ["SignIn", "AuthKit", "UserAuth", "LoginKit"],
        correct: 1,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 96,
        question: "Which Celo blockchain pair saw a 9% volume increase after Mini App news?",
        options: ["CELO/BTC", "CELO/USDT", "CELO/ETH", "CELO/USD"],
        correct: 2,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },

    // Cosmic (12 questions)
    {
        id: 97,
        question: "Which Farcaster Mini App SDK feature supports real-time data access?",
        options: ["DataStream", "Hub queries", "RealTimeAPI", "LiveData"],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 98,
        question: "What is the purpose of the Farcaster Mini App llms.txt file?",
        options: [
            "To store user data",
            "To update LLMs with docs",
            "To cache assets",
            "To configure settings"
        ],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 99,
        question: "Which Celo metric tracks DeFi protocol growth?",
        options: ["Daily transactions", "Total value locked", "User logins", "Node count"],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 100,
        question: "Which Farcaster Mini App SDK method syncs network data?",
        options: ["SyncHub", "Replicator", "DataSync", "NetworkSync"],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 101,
        question: "What is one challenge with Farcaster Mini App chain compatibility?",
        options: [
            "High latency",
            "Client-specific chain support",
            "Security risks",
            "Limited scalability"
        ],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 102,
        question: "Which Celo Mini App supports NFT minting with Farcaster ID?",
        options: ["GMonchain", "DeepGov", "0xHarmonybot", "MiniPay"],
        correct: 2,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 103,
        question: "Which Farcaster Mini App SDK method handles social data access?",
        options: ["SocialKit", "Sign In with Farcaster", "DataAccess", "UserData"],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 104,
        question: "What is the purpose of Celo’s mobile-first solutions?",
        options: [
            "To increase latency",
            "To enhance financial inclusion",
            "To limit scalability",
            "To reduce user access"
        ],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 105,
        question: "Which Farcaster Mini App SDK feature supports advanced queries?",
        options: ["QueryKit", "Postgres replicator", "DataBase", "AdvancedQuery"],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 106,
        question: "What is one benefit of Farcaster Mini App SDK’s open-source packages?",
        options: [
            "High costs",
            "Community contributions",
            "Limited compatibility",
            "Complex setup"
        ],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 107,
        question: "Which Celo tool supports grant opportunities?",
        options: ["GrantKit", "Get Funding", "FundAccess", "Celo Grants"],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 108,
        question: "Which Farcaster Mini App SDK method handles frame metadata?",
        options: ["metaFrame", "fc:frame", "frameData", "embedMeta"],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },

    // Oracle (12 questions)
    {
        id: 109,
        question: "Which Farcaster Mini App SDK feature supports client-specific chain lists?",
        options: ["clientChains", "supportedChainIds", "chainList", "networkIds"],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 110,
        question: "What is the purpose of the Farcaster Mini App developer rewards?",
        options: [
            "To increase latency",
            "To incentivize usage",
            "To limit scalability",
            "To reduce access"
        ],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 111,
        question: "Which Celo metric tracks trading volume?",
        options: ["Daily transactions", "24-hour trading volume", "User logins", "Node count"],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 112,
        question: "Which Farcaster Mini App SDK method handles dynamic ETH price rendering?",
        options: ["PriceRender", "Vercel OG", "DynamicPrice", "ETHRender"],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 113,
        question: "What is one challenge with Farcaster Mini App notification tokens?",
        options: [
            "High latency",
            "Invalidation on removal",
            "Security risks",
            "Limited scalability"
        ],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 114,
        question: "Which Celo Mini App supports daily $gm point earning?",
        options: ["DeepGov", "GMonchain", "0xHarmonybot", "MiniPay"],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 115,
        question: "Which Farcaster Mini App SDK method handles client identification?",
        options: ["idClient", "clientInfo", "clientId", "clientTag"],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 116,
        question: "What is the purpose of Celo’s DeFi protocols?",
        options: [
            "To increase latency",
            "To support financial apps",
            "To limit scalability",
            "To reduce access"
        ],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 117,
        question: "Which Farcaster Mini App SDK feature supports feed caching?",
        options: ["FeedCache", "Cache-Control", "DataCache", "EmbedCache"],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 118,
        question: "What is one benefit of Farcaster Mini App SDK’s event system?",
        options: [
            "High costs",
            "Real-time updates",
            "Limited compatibility",
            "Complex setup"
        ],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 119,
        question: "Which Celo tool supports onchain economy agents?",
        options: ["AgentKit", "Build with AI", "Onchain Agents", "Celo AI"],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 120,
        question: "Which Farcaster Mini App SDK method handles user session data?",
        options: ["sessionData", "sdk.context", "userSession", "contextData"],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },

    // Sage (12 questions)
    {
        id: 121,
        question: "Which Farcaster Mini App SDK feature supports chain-specific wallet connections?",
        options: ["chainConnect", "miniAppConnector", "walletChain", "connectChain"],
        correct: 1,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 122,
        question: "What is the purpose of the Farcaster Mini App verification process?",
        options: [
            "To increase latency",
            "To ensure ownership",
            "To limit scalability",
            "To reduce access"
        ],
        correct: 1,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 123,
        question: "Which Celo Mini App integrates with Farcaster for social engagement?",
        options: ["DeepGov", "GMonchain", "0xHarmonybot", "All of the above"],
        correct: 3,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 124,
        question: "Which Farcaster Mini App SDK method handles dynamic frame updates?",
        options: ["frameUpdate", "dynamicFrame", "updateFrame", "frameSync"],
        correct: 2,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 125,
        question: "What is one challenge with Farcaster Mini App SDK’s wallet integration?",
        options: [
            "Limited chain support",
            "High latency",
            "Security risks",
            "Complex setup"
        ],
        correct: 0,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 126,
        question: "Which Celo metric tracks user adoption of Mini Apps?",
        options: ["Daily active users", "Transaction fees", "Block size", "Node count"],
        correct: 0,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 127,
        question: "Which Farcaster Mini App SDK feature supports user profile access?",
        options: ["ProfileKit", "UserProfile", "ProfileAccess", "UserData"],
        correct: 2,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 128,
        question: "What is the purpose of Celo’s onchain governance?",
        options: [
            "To manage user data",
            "To enable community decisions",
            "To cache assets",
            "To configure settings"
        ],
        correct: 1,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 129,
        question: "Which Farcaster Mini App SDK method handles transaction signing?",
        options: ["signTransaction", "txSign", "signTx", "transactionSign"],
        correct: 0,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 130,
        question: "What is one benefit of Farcaster Mini App SDK’s modular design?",
        options: [
            "High costs",
            "Flexible integration",
            "Limited compatibility",
            "Complex setup"
        ],
        correct: 1,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 131,
        question: "Which Celo tool supports NFT creation for Mini Apps?",
        options: ["NFTKit", "Build with NFTs", "Celo Composer", "MiniPay"],
        correct: 1,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 132,
        question: "Which Farcaster Mini App SDK feature supports feed analytics?",
        options: ["FeedStats", "AnalyticsKit", "FeedAnalytics", "StatsFeed"],
        correct: 2,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },

    // Visionary (12 questions)
    {
        id: 133,
        question: "Which Farcaster Mini App SDK feature supports advanced wallet interactions?",
        options: ["WalletKit", "AdvancedWallet", "WalletPro", "ProWallet"],
        correct: 0,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 134,
        question: "What is the purpose of the Farcaster Mini App SDK’s event listener system?",
        options: [
            "To cache assets",
            "To handle real-time updates",
            "To store user data",
            "To configure settings"
        ],
        correct: 1,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 135,
        question: "Which Celo metric tracks Mini App transaction volume?",
        options: ["Daily transactions", "Mini App volume", "User logins", "Node count"],
        correct: 1,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 136,
        question: "Which Farcaster Mini App SDK method handles multi-chain support?",
        options: ["multiChain", "chainSwitch", "multiChainSupport", "chainSync"],
        correct: 0,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 137,
        question: "What is one challenge with Farcaster Mini App SDK’s notification system?",
        options: [
            "Token expiration",
            "High latency",
            "Security risks",
            "Limited scalability"
        ],
        correct: 0,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 138,
        question: "Which Celo Mini App supports cross-chain interactions?",
        options: ["GMonchain", "DeepGov", "0xHarmonybot", "MiniPay"],
        correct: 3,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 139,
        question: "Which Farcaster Mini App SDK feature supports user engagement tracking?",
        options: ["EngageTrack", "UserTrack", "TrackEngage", "EngagementKit"],
        correct: 3,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 140,
        question: "What is the purpose of Celo’s onchain identity system?",
        options: [
            "To verify real users",
            "To cache assets",
            "To store user data",
            "To configure settings"
        ],
        correct: 0,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 141,
        question: "Which Farcaster Mini App SDK method handles feed personalization?",
        options: ["personalizeFeed", "feedPersonalize", "customFeed", "feedCustomize"],
        correct: 0,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 142,
        question: "What is one benefit of Farcaster Mini App SDK’s chain-agnostic design?",
        options: [
            "Broad compatibility",
            "High costs",
            "Limited scalability",
            "Complex setup"
        ],
        correct: 0,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 143,
        question: "Which Celo tool supports cross-chain Mini App development?",
        options: ["CrossChainKit", "Build with Chains", "Celo Composer", "MiniPay"],
        correct: 1,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 144,
        question: "Which Farcaster Mini App SDK feature supports onchain analytics?",
        options: ["ChainStats", "OnchainAnalytics", "AnalyticsChain", "StatsOnchain"],
        correct: 1,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },

    // Luminary (12 questions)
    {
        id: 145,
        question: "Which Farcaster Mini App SDK feature supports decentralized data storage?",
        options: ["DataStore", "DecentralizedStore", "StoreDecentralized", "DStorage"],
        correct: 1,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 146,
        question: "What is the purpose of the Farcaster Mini App SDK’s chain-switching system?",
        options: [
            "To cache assets",
            "To enable multi-chain support",
            "To store user data",
            "To configure settings"
        ],
        correct: 1,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 147,
        question: "Which Celo metric tracks onchain governance participation?",
        options: ["Governance votes", "Daily transactions", "User logins", "Node count"],
        correct: 0,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 148,
        question: "Which Farcaster Mini App SDK method handles cross-chain transactions?",
        options: ["crossChainTx", "txCrossChain", "chainTx", "multiChainTx"],
        correct: 0,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 149,
        question: "What is one challenge with Farcaster Mini App SDK’s multi-chain support?",
        options: [
            "Chain synchronization",
            "High latency",
            "Security risks",
            "Limited scalability"
        ],
        correct: 0,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 150,
        question: "Which Celo Mini App supports decentralized governance?",
        options: ["GMonchain", "DeepGov", "0xHarmonybot", "MiniPay"],
        correct: 1,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 151,
        question: "Which Farcaster Mini App SDK feature supports onchain identity verification?",
        options: ["IdentityKit", "OnchainID", "VerifyID", "IDVerify"],
        correct: 1,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 152,
        question: "What is the purpose of Celo’s onchain economy agents?",
        options: [
            "To automate transactions",
            "To cache assets",
            "To store user data",
            "To configure settings"
        ],
        correct: 0,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 153,
        question: "Which Farcaster Mini App SDK method handles governance proposals?",
        options: ["proposeGov", "govPropose", "proposalGov", "submitProposal"],
        correct: 3,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 154,
        question: "What is one benefit of Farcaster Mini App SDK’s decentralized architecture?",
        options: [
            "High costs",
            "Resilience to failures",
            "Limited compatibility",
            "Complex setup"
        ],
        correct: 1,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 155,
        question: "Which Celo tool supports decentralized identity for Mini Apps?",
        options: ["IdentityKit", "Build with ID", "Celo Composer", "MiniPay"],
        correct: 1,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 156,
        question: "Which Farcaster Mini App SDK feature supports cross-chain analytics?",
        options: ["CrossChainStats", "ChainAnalytics", "AnalyticsCrossChain", "StatsCrossChain"],
        correct: 2,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },

    // Titan (12 questions)
    {
        id: 157,
        question: "Which Farcaster Mini App SDK feature supports onchain reputation systems?",
        options: ["ReputationKit", "OnchainRep", "RepSystem", "ReputationSys"],
        correct: 0,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 158,
        question: "What is the purpose of the Farcaster Mini App SDK’s governance integration?",
        options: [
            "To cache assets",
            "To enable community decisions",
            "To store user data",
            "To configure settings"
        ],
        correct: 1,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 159,
        question: "Which Celo metric tracks decentralized identity adoption?",
        options: ["Identity verifications", "Daily transactions", "User logins", "Node count"],
        correct: 0,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 160,
        question: "Which Farcaster Mini App SDK method handles reputation scoring?",
        options: ["scoreRep", "repScore", "reputationScore", "calculateRep"],
        correct: 2,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 161,
        question: "What is one challenge with Farcaster Mini App SDK’s governance system?",
        options: [
            "Voter apathy",
            "High latency",
            "Security risks",
            "Limited scalability"
        ],
        correct: 0,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 162,
        question: "Which Celo Mini App supports onchain reputation?",
        options: ["GMonchain", "DeepGov", "0xHarmonybot", "MiniPay"],
        correct: 1,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 163,
        question: "Which Farcaster Mini App SDK feature supports cross-chain governance?",
        options: ["CrossGov", "GovCrossChain", "ChainGov", "GovernanceCross"],
        correct: 0,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 164,
        question: "What is the purpose of Celo’s onchain reputation system?",
        options: [
            "To enhance trust",
            "To cache assets",
            "To store user data",
            "To configure settings"
        ],
        correct: 0,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 165,
        question: "Which Farcaster Mini App SDK method handles voting on proposals?",
        options: ["voteProposal", "proposalVote", "castVote", "submitVote"],
        correct: 2,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 166,
        question: "What is one benefit of Farcaster Mini App SDK’s reputation system?",
        options: [
            "High costs",
            "Enhanced user trust",
            "Limited compatibility",
            "Complex setup"
        ],
        correct: 1,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 167,
        question: "Which Celo tool supports onchain reputation for Mini Apps?",
        options: ["ReputationKit", "Build with Reputation", "Celo Composer", "MiniPay"],
        correct: 1,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 168,
        question: "Which Farcaster Mini App SDK feature supports governance analytics?",
        options: ["GovStats", "GovernanceAnalytics", "AnalyticsGov", "StatsGov"],
        correct: 1,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },

    // Farquest Master (12 questions)
    {
        id: 169,
        question: "Which Farcaster Mini App SDK feature supports onchain social graphs?",
        options: ["SocialGraph", "OnchainSocial", "GraphSocial", "SocialNet"],
        correct: 0,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 170,
        question: "What is the purpose of the Farcaster Mini App SDK’s social graph integration?",
        options: [
            "To cache assets",
            "To map user relationships",
            "To store user data",
            "To configure settings"
        ],
        correct: 1,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 171,
        question: "Which Celo metric tracks social graph adoption?",
        options: ["Social connections", "Daily transactions", "User logins", "Node count"],
        correct: 0,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 172,
        question: "Which Farcaster Mini App SDK method handles social graph queries?",
        options: ["queryGraph", "graphQuery", "socialQuery", "fetchGraph"],
        correct: 0,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 173,
        question: "What is one challenge with Farcaster Mini App SDK’s social graph system?",
        options: [
            "Data privacy",
            "High latency",
            "Security risks",
            "Limited scalability"
        ],
        correct: 0,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 174,
        question: "Which Celo Mini App supports onchain social interactions?",
        options: ["GMonchain", "DeepGov", "0xHarmonybot", "MiniPay"],
        correct: 2,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 175,
        question: "Which Farcaster Mini App SDK feature supports cross-chain social graphs?",
        options: ["CrossSocial", "SocialCrossChain", "ChainSocial", "SocialGraphCross"],
        correct: 0,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 176,
        question: "What is the purpose of Celo’s onchain social system?",
        options: [
            "To enhance user engagement",
            "To cache assets",
            "To store user data",
            "To configure settings"
        ],
        correct: 0,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 177,
        question: "Which Farcaster Mini App SDK method handles social engagement tracking?",
        options: ["trackEngage", "engageTrack", "socialTrack", "monitorEngage"],
        correct: 0,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 178,
        question: "What is one benefit of Farcaster Mini App SDK’s social graph system?",
        options: [
            "High costs",
            "Enhanced connectivity",
            "Limited compatibility",
            "Complex setup"
        ],
        correct: 1,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 179,
        question: "Which Celo tool supports onchain social graphs for Mini Apps?",
        options: ["SocialKit", "Build with Social", "Celo Composer", "MiniPay"],
        correct: 1,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 180,
        question: "Which Farcaster Mini App SDK feature supports social analytics?",
        options: ["SocialStats", "AnalyticsSocial", "SocialAnalytics", "StatsSocial"],
        correct: 2,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    }
];

