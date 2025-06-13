import type { Metadata } from "next";

import { getSession } from "~/auth"
import "~/app/globals.css";
import { Providers } from "~/app/providers";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_FRAME_NAME || "Frames v2 Demo",
  description: process.env.NEXT_PUBLIC_FRAME_DESCRIPTION || "A Farcaster Frames v2 demo app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  
  const session = await getSession()

  return (
    <html lang="en">
      <body>
        <Providers session={session}>{children}</Providers>
        <ToastContainer />
      </body>
    </html>
  );
}
