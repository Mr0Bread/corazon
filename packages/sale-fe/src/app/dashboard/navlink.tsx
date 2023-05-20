"use client";

import clsx from "clsx";
import Link from "next/link"
import { usePathname } from "next/navigation";

export const NavLink: React.FC<{ label: string, href: string, icon: JSX.Element }> = ({ label, href, icon }) => {
    const pathname = usePathname();

    return (
        <Link href={href}>
            <div
                className={
                    clsx(
                        "flex items-center justify-start rounded border border-slate-800 py-2 px-6 cursor-pointer text-gray-300 hover:bg-slate-800 hover:text-white transition-all",
                        pathname === href ? "bg-slate-800 text-white" : ""
                    )
                }
            >
                {icon}
                <span className="ml-4">{label}</span>
            </div>
        </Link>
    )
}