"use client";
import type React from "react";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "~/app/_components/sidebar";
import { ForcePasswordChange } from "~/app/_components/force-password-change";

export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname();

	if (pathname === "/nexus/login" || pathname === "/nexus/redefinir-senha") {
		return (
			<main className="nexus-main flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
				<Suspense
					fallback={
						<div className="p-6 text-sm font-semibold text-sky-800">
							Carregando…
						</div>
					}
				>
					{children}
				</Suspense>
			</main>
		);
	}

	return (
		<div className="h-dvh min-h-[100dvh] bg-blue-500 sm:p-1">
			<div className="flex h-full w-full overflow-hidden bg-white sm:rounded-2xl sm:border-6 sm:border-amber-600">
				<Sidebar />
				<main className="nexus-main flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
					<Suspense
						fallback={
							<div className="p-6 text-sm font-semibold text-sky-800">
								Carregando…
							</div>
						}
					>
						{children}
					</Suspense>
				</main>
				<ForcePasswordChange />
			</div>
		</div>
	);
}
