import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavLinkProps {
    className?: string;
    href: Partial<URL>;
    children: ReactNode;
}

export default function NavLink({ href, children, className }: NavLinkProps) {
    let isActive: boolean = false;
    if (usePathname().includes(href.pathname ?? '')) isActive = true;

    return (
        <Link
            href={href}
            className={`${className} ${isActive ? 'text-gray-400' : 'text-white'}`}>
            {children}
        </Link>
    );
}
