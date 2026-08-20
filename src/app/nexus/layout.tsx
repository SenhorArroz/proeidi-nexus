"use client";
import type React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "~/app/_components/sidebar";

export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname();

	if (pathname === "/nexus/login") {
		return (
				<main className="nexus-main flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
					{children}
				</main>
		);
	}

	return (
		<div className="h-dvh min-h-[100dvh] bg-blue-500 p-0 sm:p-1">
			<div className="flex h-full w-full overflow-hidden bg-white sm:rounded-2xl sm:border-6 sm:border-amber-500">
				<Sidebar />
				<main className="nexus-main flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
					{children}
				</main>
			</div>
		</div>
	);
}
