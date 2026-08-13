"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    PanelLeftClose,
    PanelLeftOpen,
    LayoutDashboard,
    Users,
    Settings,
} from "lucide-react";

interface NavItem {
    id: string;
    label: string;
    link: string;
    icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
    { id: "dashboard", label: "Dashboard", link: "/nexus/dashboard", icon: LayoutDashboard },
    { id: "diretoria", label: "Diretoria", link: "/nexus/diretoria", icon: Users },
];

// Componente utilitário para esconder/mostrar texto suavemente sem quebrar o layout
function Collapsible({
    collapsed,
    children,
}: {
    collapsed: boolean;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`grid transition-all duration-300 ease-in-out ${
                collapsed ? "grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100"
            }`}
        >
            <div className="overflow-hidden whitespace-nowrap flex items-center">
                {children}
            </div>
        </div>
    );
}

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    
    // Extrai o segmento após /nexus/ → ex: "/nexus/diretoria/algo" → "diretoria"
    const activeSegment = pathname.split("/")[2] ?? "dashboard";

    return (
        <aside
            className={`flex flex-col h-[100dvh] bg-white border-r border-gray-200 transition-all duration-500 ease-in-out z-20 shrink-0 ${
                collapsed ? "w-[72px]" : "w-64"
            }`}
        >
            {/* Header do Menu */}
            <div className="flex items-center h-16 px-4 border-b border-gray-200">
                <Collapsible collapsed={collapsed}>
                    <span className="text-sm font-semibold text-gray-700 pr-3 truncate">
                        Seja Bem-Vindo(a)
                        <span className="inline-block w-[2px] h-[1em] bg-sky-500 align-middle ml-0.5 animate-[blink_1s_steps(1)_infinite]" />
                        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
                    </span>
                </Collapsible>

                <button
                    onClick={() => setCollapsed((v) => !v)}
                    className={`p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-sky-600 flex-shrink-0 transition-colors ${
                        collapsed ? "mx-auto" : "ml-auto"
                    }`}
                    aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
                >
                    {collapsed ? (
                        <PanelLeftOpen className="w-5 h-5" />
                    ) : (
                        <PanelLeftClose className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Links de Navegação */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1.5 custom-scrollbar">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSegment === item.id;
                    return (
                        <Link
                            key={item.id}
                            href={item.link}
                            title={collapsed ? item.label : undefined}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? "bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-100"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-sky-600" : "text-gray-400"}`} />
                            <Collapsible collapsed={collapsed}>
                                <span>{item.label}</span>
                            </Collapsible>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer do Menu */}
            <div className="p-3 border-t border-gray-200 space-y-3">
                <button 
                    title={collapsed ? "Configurações" : undefined}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                    <Settings className="w-5 h-5 flex-shrink-0 text-gray-400" />
                    <Collapsible collapsed={collapsed}>
                        <span>Configurações</span>
                    </Collapsible>
                </button>
                
                <div className={`flex items-center justify-center pt-2 pb-1 transition-all duration-500 ${collapsed ? "px-1" : "px-4"}`}>
                    <Image
                        src="/nexus_logo.png"
                        alt="Logo ProEIDI Nexus"
                        width={120}
                        height={40}
                        className={`object-contain transition-all duration-500 ease-in-out mix-blend-multiply ${
                            collapsed ? "w-8 opacity-70" : "w-24 opacity-100"
                        }`}
                    />
                </div>
            </div>
        </aside>
    );
}