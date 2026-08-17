import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { AccessibilityProvider } from "~/app/_components/accessibility-preferences";

export const metadata: Metadata = {
	title: "ProEIDI",
	description: "Sistema unificado do ProEIDI",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html className={`${geist.variable}`} lang="en">
			<body>
				<AccessibilityProvider>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</AccessibilityProvider>
			</body>
		</html>
	);
}
