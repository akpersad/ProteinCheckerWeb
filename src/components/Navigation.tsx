'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    CalculatorIcon,
    ClockIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline';
import {
    CalculatorIcon as CalculatorIconSolid,
    ClockIcon as ClockIconSolid,
    BookOpenIcon as BookOpenIconSolid
} from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Calculator', href: '/', icon: CalculatorIcon, activeIcon: CalculatorIconSolid },
    { name: 'History', href: '/history', icon: ClockIcon, activeIcon: ClockIconSolid },
    { name: 'Learn', href: '/education', icon: BookOpenIcon, activeIcon: BookOpenIconSolid },
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex glass-card border-b border-white/20 px-6 py-4">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                            <CalculatorIconSolid className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white drop-shadow-md">Protein Checker</h1>
                    </div>
                    <div className="flex space-x-8">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = isActive ? item.activeIcon : item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                                        isActive
                                            ? 'bg-white text-purple-800 shadow-md backdrop-blur-sm'
                                            : 'text-white hover:text-white hover:bg-white/20 backdrop-blur-sm'
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-white/20 px-4 py-2 safe-area-pb">
                <div className="flex items-center justify-around">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = isActive ? item.activeIcon : item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center space-y-1 px-3 py-2 rounded-xl min-w-0 flex-1 transition-all duration-200',
                                    isActive ? 'text-white bg-white/25 backdrop-blur-sm' : 'text-white/90 hover:text-white hover:bg-white/15'
                                )}
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-xs font-semibold truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Mobile spacer for bottom navigation */}
            <div className="md:hidden h-20" />
        </>
    );
}
