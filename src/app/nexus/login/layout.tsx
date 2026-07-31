export default function DashboardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="bg-blue-500 p-1 h-screen">
            <div className="flex h-full w-full bg-white rounded-2xl overflow-hidden border-amber-500 border-6">
                <main className="flex-1 min-w-0 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
