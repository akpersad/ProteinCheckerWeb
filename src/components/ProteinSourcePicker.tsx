'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ProteinSource, ProteinCategory } from '@/types/protein';
import { proteinDatabase } from '@/data/proteinSources';
import { getScoreColor } from '@/utils/proteinCalculations';
import { debounce } from '@/lib/utils';
import SearchBar from './SearchBar';
import CategoryChip from './CategoryChip';

interface ProteinSourcePickerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedSource: ProteinSource | null;
    onSelectSource: (source: ProteinSource) => void;
}

export default function ProteinSourcePicker({
    isOpen,
    onClose,
    selectedSource,
    onSelectSource
}: ProteinSourcePickerProps) {
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<ProteinCategory>(ProteinCategory.ALL);
    const [filteredSources, setFilteredSources] = useState<ProteinSource[]>([]);

    // Debounced search to improve performance
    const debouncedSearch = debounce((query: string, category: ProteinCategory) => {
        const sources = proteinDatabase.searchSources(query, category);
        setFilteredSources(sources);
    }, 150);

    useEffect(() => {
        debouncedSearch(searchText, selectedCategory);
    }, [searchText, selectedCategory, debouncedSearch]);

    const handleSelectSource = (source: ProteinSource) => {
        onSelectSource(source);
        onClose();
    };

    const categories = [
        ProteinCategory.ALL,
        ProteinCategory.MEAT,
        ProteinCategory.DAIRY,
        ProteinCategory.PLANT,
        ProteinCategory.SUPPLEMENT,
        ProteinCategory.OTHER
    ];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                                        Select Protein Source
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Search and Filters */}
                                <div className="p-6 space-y-4">
                                    <SearchBar
                                        value={searchText}
                                        onChange={setSearchText}
                                        placeholder="Search protein sources..."
                                    />

                                    {/* Category Filter */}
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {categories.map((category) => (
                                            <CategoryChip
                                                key={category}
                                                category={category}
                                                isSelected={selectedCategory === category}
                                                onClick={() => setSelectedCategory(category)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Sources List */}
                                <div className="max-h-96 overflow-y-auto">
                                    {filteredSources.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500">
                                            <div className="text-lg font-medium mb-2">No sources found</div>
                                            <p className="text-sm">Try adjusting your search or category filter.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-200">
                                            {filteredSources.map((source) => {
                                                const isSelected = selectedSource?.id === source.id;

                                                return (
                                                    <button
                                                        key={source.id}
                                                        type="button"
                                                        className="w-full p-6 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                                                        onClick={() => handleSelectSource(source)}
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-3">
                                                                    <h4 className="text-base font-medium text-gray-900">
                                                                        {source.name}
                                                                    </h4>
                                                                    {isSelected && (
                                                                        <CheckCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                                                    )}
                                                                </div>

                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {source.category.charAt(0).toUpperCase() + source.category.slice(1)}
                                                                </p>

                                                                {source.description && (
                                                                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                                                        {source.description}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Scores */}
                                                            <div className="flex flex-col items-end gap-1 ml-4 flex-shrink-0">
                                                                {source.diaasScore && (
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-xs text-gray-500">DIAAS:</span>
                                                                        <span
                                                                            className="text-sm font-semibold"
                                                                            style={{ color: getScoreColor(source.diaasScore) }}
                                                                        >
                                                                            {source.diaasScore.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {source.pdcaasScore && (
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="text-xs text-gray-500">PDCAAS:</span>
                                                                        <span
                                                                            className="text-sm font-semibold"
                                                                            style={{ color: getScoreColor(source.pdcaasScore) }}
                                                                        >
                                                                            {source.pdcaasScore.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
