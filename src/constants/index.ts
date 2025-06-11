// import { Question } from "~/types";

import { Difficulty } from "~/types";

// export const QUESTIONS: Question[] = [
//   {
//     id: 1,
//     question: "You encounter a mystical portal in the Web3 realm. What powers decentralized networks?",
//     options: [
//       "Centralized servers",
//       "Blockchain technology",
//       "Traditional databases",
//       "Cloud storage"
//     ],
//     correct: 1,
//     difficulty: "easy",
//     reward: { exp: 50, crystals: 2 }
//   },
//   {
//     id: 2,
//     question: "A wise sage asks: 'What consensus mechanism does Ethereum 2.0 use?'",
//     options: [
//       "Proof of Work",
//       "Proof of Stake",
//       "Proof of Authority",
//       "Delegated Proof of Stake"
//     ],
//     correct: 1,
//     difficulty: "medium",
//     reward: { exp: 75, crystals: 3 }
//   },
//   {
//     id: 3,
//     question: "The dragon guardian challenges you: 'What does DeFi stand for?'",
//     options: [
//       "Digital Finance",
//       "Decentralized Finance",
//       "Distributed Finance",
//       "Dynamic Finance"
//     ],
//     correct: 1,
//     difficulty: "hard",
//     reward: { exp: 100, crystals: 5 }
//   },
//   {
//     id: 4,
//     question: "In the depths of the smart contract dungeon, what language is primarily used for Ethereum smart contracts?",
//     options: [
//       "JavaScript",
//       "Python",
//       "Solidity",
//       "Rust"
//     ],
//     correct: 2,
//     difficulty: "medium",
//     reward: { exp: 75, crystals: 3 }
//   },
//   {
//     id: 5,
//     question: "The final boss appears! What is the native token of the Celo blockchain?",
//     options: [
//       "CELO",
//       "ETH",
//       "BTC",
//       "USDC"
//     ],
//     correct: 0,
//     difficulty: "hard",
//     reward: { exp: 150, crystals: 7 }
//   }
// ];


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
    {
        id: 1,
        question: "What are Mini Apps in Farcaster primarily built with?",
        options: [
            "Python and Django",
            "HTML, CSS, and JavaScript",
            "C++ and Unity",
            "Java and Android SDK"
        ],
        correct: 1,
        difficulty: "Starter",
        reward: { exp: 50, crystals: 2 }
    },
    {
        id: 2,
        question: "Which command is used to set up a new Mini App project using the Farcaster CLI?",
        options: [
            "npm create @farcaster/new-app",
            "npm create @farcaster/mini-app",
            "npm install @farcaster/frame-sdk",
            "npm build @farcaster/mini-app"
        ],
        correct: 1,
        difficulty: "Novice",
        reward: { exp: 75, crystals: 3 }
    },
    {
        id: 3,
        question: "What is the purpose of the Splash Screen in Farcaster Mini Apps?",
        options: [
            "To show advertisements",
            "To display a branded loading page",
            "To collect user data",
            "To show app tutorials"
        ],
        correct: 1,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 4,
        question: "Which method is called to hide the Splash Screen once the Mini App interface is ready?",
        options: [
            "sdk.actions.load()",
            "sdk.actions.start()",
            "sdk.actions.ready()",
            "sdk.actions.hide()"
        ],
        correct: 2,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 5,
        question: "What feature allows Mini Apps to re-engage users by bringing them back when there is something new to do?",
        options: [
            "Email notifications",
            "Mobile notifications",
            "Desktop alerts",
            "Push messages"
        ],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 6,
        question: "Which SDK method can disable native gestures in Mini Apps?",
        options: [
            "sdk.actions.disableGestures()",
            "sdk.actions.ready({ disableNativeGestures: true })",
            "sdk.actions.setGestures(false)",
            "sdk.actions.configureGestures()"
        ],
        correct: 1,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 7,
        question: "What is one way to include the Frame SDK in your Mini App project without using a package manager?",
        options: [
            "Using a CDN like esm.sh",
            "Downloading the SDK manually",
            "Including it via a local server",
            "Using a custom loader"
        ],
        correct: 0,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 8,
        question: "Which tool is used to preview Mini Apps in Warpcast?",
        options: [
            "Mini App Preview Tool",
            "Warpcast Simulator",
            "Mini App Debug Tool",
            "Farcaster Emulator"
        ],
        correct: 2,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 9,
        question: "What is the primary benefit of using Mini Apps for developers according to the article?",
        options: [
            "Longer development cycles",
            "No need for app store reviews",
            "Higher development costs",
            "Limited user reach"
        ],
        correct: 1,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 10,
        question: "Which file is used to keep an LLM updated with the Mini App documentation?",
        options: [
            "llms-full.txt",
            "docs-update.txt",
            "llm-docs.md",
            "update-llm.txt"
        ],
        correct: 0,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 11,
        question: "What is the purpose of the 'disableNativeGestures' flag in the ready method?",
        options: [
            "To enable additional app features",
            "To prevent the app from closing on certain gestures",
            "To improve app performance",
            "To enhance user interaction"
        ],
        correct: 1,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 12,
        question: "Which of the following is a best practice to avoid jitter and content reflowing in Mini Apps?",
        options: [
            "Calling ready as soon as possible",
            "Using placeholders and skeleton states",
            "Loading all resources at once",
            "Disabling all animations"
        ],
        correct: 1,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    }
];
