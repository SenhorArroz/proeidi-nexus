"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "~/app/_components/sidebar";

export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname();

	if (pathname === "/nexus/login") {
		return (
				<main className="flex-1 min-w-0 overflow-hidden">
					{children}
				</main>
		);
	}

	return (
		<div className="bg-blue-500 p-1 h-screen">
			<div className="flex h-full w-full bg-white rounded-2xl overflow-hidden border-amber-500 border-6">
				<Sidebar />
				<main className="flex-1 min-w-0 overflow-y-auto">
					{children}
				</main>
			</div>
		</div>
	);
}
