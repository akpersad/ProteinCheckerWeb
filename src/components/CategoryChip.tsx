'use client';

import React from 'react';
import { ProteinCategory, ProteinCategoryDisplay } from '@/types/protein';
import { cn } from '@/lib/utils';

interface CategoryChipProps {
    category: ProteinCategory;
    isSelected: boolean;
    onClick: () => void;
    className?: string;
}

export default function CategoryChip({
    category,
    isSelected,
    onClick,
    className
}: CategoryChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                className
            )}
        >
            {ProteinCategoryDisplay[category]}
        </button>
    );
}
