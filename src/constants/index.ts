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
    },
    {
        id: 13,
        question: "What meta tag is used to make a page in a Mini App shareable?",
        options: [
            "<meta name='fc:share' content='...' />",
            "<meta name='fc:frame' content='...' />",
            "<meta name='og:image' content='...' />",
            "<meta name='app:share' content='...' />"
        ],
        correct: 1,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 14,
        question: "What aspect ratio should the image be in a Mini App embed?",
        options: [
            "1:1",
            "4:3",
            "3:2",
            "16:9"
        ],
        correct: 2,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 15,
        question: "Which tool is recommended to make a local server publicly accessible for testing Mini Apps?",
        options: [
            "ngrok",
            "cloudflared",
            "localhost",
            "Farcaster CLI"
        ],
        correct: 1,
        difficulty: "Farquest Master",
        reward: { exp: 400, crystals: 17 }
    },
    {
        id: 16,
        question: "What is the maximum size limit for the image in a Mini App embed?",
        options: [
            "1MB",
            "5MB",
            "10MB",
            "20MB"
        ],
        correct: 2,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 17,
        question: "What type of content does the 'fc:frame' meta tag contain?",
        options: [
            "Plain text",
            "HTML",
            "Stringified JSON",
            "XML"
        ],
        correct: 2,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 18,
        question: "What is the default action type for a button in a Mini App embed?",
        options: [
            "open_url",
            "launch_frame",
            "share_app",
            "view_image"
        ],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 19,
        question: "What is the purpose of setting a non-zero max-age for dynamic embed images?",
        options: [
            "To ensure the image is always fresh",
            "To prevent caching of the image",
            "To allow the image to be cached and served from CDNs",
            "To increase the load time of the image"
        ],
        correct: 2,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 20,
        question: "What should you do if you need to serve a fallback image for a dynamic image in a Mini App?",
        options: [
            "Use a very long max-age",
            "Use an extremely short or zero max-age",
            "Disable caching for the image",
            "Use a different image format"
        ],
        correct: 1,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 21,
        question: "What is the canonical URL format for Mini Apps in Farcaster?",
        options: [
            "https://farcaster.xyz/apps/<app-id>",
            "https://farcaster.xyz/miniapps/<app-id>/<app-slug>",
            "https://farcaster.xyz/<app-id>/<app-slug>",
            "https://farcaster.xyz/apps/<app-id>/<app-slug>"
        ],
        correct: 1,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 22,
        question: "What is the purpose of the Mini App Embed Tool in Warpcast?",
        options: [
            "To create new Mini Apps",
            "To debug and preview Mini App embeds",
            "To share Mini Apps on social media",
            "To analyze Mini App performance"
        ],
        correct: 1,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    },
    {
        id: 23,
        question: "What is the recommended tool to quickly set up a public URL for local development of Mini Apps?",
        options: [
            "ngrok",
            "Farcaster CLI",
            "cloudflared",
            "LocalTunnel"
        ],
        correct: 2,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 24,
        question: "What is the purpose of the 'button.title' property in a Mini App embed?",
        options: [
            "To specify the button color",
            "To provide a clear call-to-action for the user",
            "To define the button size",
            "To set the button icon"
        ],
        correct: 1,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 25,
        question: "Where should the manifest file for a Mini App be hosted?",
        options: [
            "At the root of the domain",
            "At /.well-known/farcaster.json",
            "In the app's main directory",
            "In a subdirectory named /manifest"
        ],
        correct: 1,
        difficulty: "Explorer",
        reward: { exp: 100, crystals: 5 }
    },
    {
        id: 26,
        question: "What is the required version for the manifest file of a Mini App?",
        options: [
            "0",
            "2",
            "1",
            "3"
        ],
        correct: 2,
        difficulty: "Adventurer",
        reward: { exp: 125, crystals: 6 }
    },
    {
        id: 27,
        question: "What is the maximum length for the Mini App name in the manifest file?",
        options: [
            "20 characters",
            "32 characters",
            "64 characters",
            "128 characters"
        ],
        correct: 1,
        difficulty: "Legend",
        reward: { exp: 150, crystals: 7 }
    },
    {
        id: 28,
        question: "Which property in the manifest file specifies the default launch URL for a Mini App?",
        options: [
            "defaultUrl",
            "launchUrl",
            "homeUrl",
            "startUrl"
        ],
        correct: 2,
        difficulty: "Conqueror",
        reward: { exp: 175, crystals: 8 }
    },
    {
        id: 29,
        question: "What is the required image size for the iconUrl in the Mini App manifest?",
        options: [
            "512x512px",
            "1024x1024px",
            "256x256px",
            "200x200px"
        ],
        correct: 1,
        difficulty: "Star",
        reward: { exp: 200, crystals: 9 }
    },
    {
        id: 30,
        question: "What is the purpose of the splashImageUrl property in the Mini App manifest?",
        options: [
            "To specify the URL of the image shown on the loading screen",
            "To set the background color of the app",
            "To define the app's icon",
            "To provide a promotional image for the app"
        ],
        correct: 0,
        difficulty: "Galaxy",
        reward: { exp: 225, crystals: 10 }
    },
    {
        id: 31,
        question: "Which property in the manifest file is used to specify the primary category of the Mini App?",
        options: [
            "appCategory",
            "mainCategory",
            "category",
            "primaryCategory"
        ],
        correct: 3,
        difficulty: "Cosmic",
        reward: { exp: 250, crystals: 11 }
    },
    {
        id: 32,
        question: "What is the maximum number of tags allowed in the Mini App manifest?",
        options: [
            "3",
            "5",
            "10",
            "Unlimited"
        ],
        correct: 1,
        difficulty: "Oracle",
        reward: { exp: 275, crystals: 12 }
    },
    {
        id: 33,
        question: "What is the purpose of the accountAssociation property in the Mini App manifest?",
        options: [
            "To specify the app's primary category",
            "To verify ownership of the Mini App",
            "To define the app's launch URL",
            "To set the app's icon"
        ],
        correct: 1,
        difficulty: "Sage",
        reward: { exp: 300, crystals: 13 }
    },
    {
        id: 34,
        question: "Which tool is recommended for generating a signed account association object for the Mini App manifest?",
        options: [
            "Farcaster CLI",
            "Mini App Manifest Tool in Warpcast",
            "Mini App Debug Tool",
            "Farcaster SDK"
        ],
        correct: 1,
        difficulty: "Visionary",
        reward: { exp: 325, crystals: 14 }
    },
    {
        id: 35,
        question: "What is the recommended size for the heroImageUrl in the Mini App manifest?",
        options: [
            "1200x630px",
            "800x600px",
            "1024x768px",
            "600x400px"
        ],
        correct: 0,
        difficulty: "Luminary",
        reward: { exp: 350, crystals: 15 }
    },
    {
        id: 36,
        question: "What is the purpose of the noindex property in the Mini App manifest?",
        options: [
            "To exclude the Mini App from search results",
            "To specify the app's primary category",
            "To define the app's launch URL",
            "To set the app's icon"
        ],
        correct: 0,
        difficulty: "Titan",
        reward: { exp: 375, crystals: 16 }
    }
];


