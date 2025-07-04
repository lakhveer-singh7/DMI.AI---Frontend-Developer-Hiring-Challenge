import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "DMI.AI - Design Made Intelligent",
	description: "From brand kit to launch-ready content, websites & apps — powered by AI.",
	keywords: ["AI", "design", "branding", "automation", "content creation"],
	authors: [{ name: "DMI.AI" }],
	openGraph: {
		title: "DMI.AI - Design Made Intelligent",
		description: "From brand kit to launch-ready content, websites & apps — powered by AI.",
		type: "website",
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
