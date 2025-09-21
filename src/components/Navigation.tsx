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
            <nav className="hidden md:flex bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <CalculatorIconSolid className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Protein Checker</h1>
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
                                        'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
                <div className="flex items-center justify-around">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = isActive ? item.activeIcon : item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg min-w-0 flex-1',
                                    isActive ? 'text-blue-600' : 'text-gray-600'
                                )}
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-xs font-medium truncate">{item.name}</span>
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
