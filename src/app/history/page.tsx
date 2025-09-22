'use client';

import React, { useState, useMemo } from 'react';
import { useProtein } from '@/contexts/ProteinContext';
import { ProteinCategory, ProteinCalculation } from '@/types/protein';
import { formatProteinAmount, formatPercentage, getPercentageColorClass } from '@/utils/proteinCalculations';
import { formatRelativeDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/SearchBar';
import CategoryChip from '@/components/CategoryChip';
import {
    ClockIcon,
    ChartBarIcon,
    TrashIcon,
    DocumentArrowDownIcon,
    DocumentArrowUpIcon
} from '@heroicons/react/24/outline';

export default function HistoryPage() {
    const {
        state,
        deleteCalculation,
        clearHistory,
        setSearchText,
        setSelectedCategory,
        exportHistory,
        importHistory
    } = useProtein();

    const [showStatistics, setShowStatistics] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Filter history based on search and category
    const filteredHistory = useMemo(() => {
        let history = [...state.calculationHistory];

        // Filter by category
        if (state.selectedCategory !== ProteinCategory.ALL) {
            history = history.filter(calc => calc.proteinSource.category === state.selectedCategory);
        }

        // Filter by search text
        if (state.searchText.trim()) {
            const searchLower = state.searchText.toLowerCase();
            history = history.filter(calc =>
                calc.proteinSource.name.toLowerCase().includes(searchLower)
            );
        }

        return history;
    }, [state.calculationHistory, state.selectedCategory, state.searchText]);

    const handleExport = () => {
        try {
            const data = exportHistory();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `protein-calculations-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (content) {
                const success = importHistory(content);
                if (success) {
                    alert('Data imported successfully!');
                } else {
                    alert('Failed to import data. Please check the file format.');
                }
            }
        };
        reader.readAsText(file);

        // Reset the input
        event.target.value = '';
    };

    const categories = [
        ProteinCategory.ALL,
        ProteinCategory.MEAT,
        ProteinCategory.DAIRY,
        ProteinCategory.PLANT,
        ProteinCategory.SUPPLEMENT,
        ProteinCategory.OTHER
    ];

    if (state.calculationHistory.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                    <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No calculations yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Your protein calculations will appear here. Start by using the calculator.
                    </p>
                    <div className="mt-6">
                        <Button onClick={() => window.location.href = '/'}>
                            Go to Calculator
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Calculation History</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {state.calculationHistory.length} total calculations
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowStatistics(!showStatistics)}
                            className="flex items-center gap-2"
                        >
                            <ChartBarIcon className="w-4 h-4" />
                            Statistics
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="flex items-center gap-2"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4" />
                            Export
                        </Button>

                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors">
                            <DocumentArrowUpIcon className="w-4 h-4" />
                            Import
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="sr-only"
                            />
                        </label>

                        <Button
                            variant="destructive"
                            onClick={() => setShowClearConfirm(true)}
                            className="flex items-center gap-2"
                        >
                            <TrashIcon className="w-4 h-4" />
                            Clear All
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                {showStatistics && state.statistics && (
                    <Card variant="elevated" className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-sm text-blue-600 font-medium">Total Calculations</div>
                                <div className="text-2xl font-bold text-blue-700 mt-1">
                                    {state.statistics.totalCalculations}
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-sm text-green-600 font-medium">Avg Stated Protein</div>
                                <div className="text-2xl font-bold text-green-700 mt-1">
                                    {formatProteinAmount(state.statistics.averageStatedProtein)}
                                </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="text-sm text-purple-600 font-medium">Avg Quality-Adjusted</div>
                                <div className="text-2xl font-bold text-purple-700 mt-1">
                                    {formatProteinAmount(state.statistics.averageQualityAdjustedProtein)}
                                </div>
                            </div>

                            <div className="bg-orange-50 p-4 rounded-lg">
                                <div className="text-sm text-orange-600 font-medium">Most Used</div>
                                <div className="text-sm font-semibold text-orange-700 mt-1">
                                    {state.statistics.mostUsedSources[0]?.[0] || 'None'}
                                </div>
                            </div>
                        </div>

                        {state.statistics.mostUsedSources.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Most Used Sources</h3>
                                <div className="space-y-2">
                                    {state.statistics.mostUsedSources.slice(0, 5).map(([name, count], index) => (
                                        <div key={name} className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">{index + 1}.</span>
                                                <span className="text-sm font-medium text-gray-900">{name}</span>
                                            </div>
                                            <span className="text-sm text-gray-500">{count} times</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                )}

                {/* Filters */}
                <div className="space-y-4">
                    <SearchBar
                        value={state.searchText}
                        onChange={setSearchText}
                        placeholder="Search calculations by protein source..."
                    />

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <CategoryChip
                                key={category}
                                category={category}
                                isSelected={state.selectedCategory === category}
                                onClick={() => setSelectedCategory(category)}
                            />
                        ))}
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-4">
                    {filteredHistory.length === 0 ? (
                        <Card className="p-8 text-center">
                            <p className="text-gray-500">No calculations match your filters.</p>
                        </Card>
                    ) : (
                        filteredHistory.map((calculation) => (
                            <HistoryCard
                                key={calculation.id}
                                calculation={calculation}
                                onDelete={() => deleteCalculation(calculation.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Clear Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear All History</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            This will permanently delete all calculation history. This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowClearConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    clearHistory();
                                    setShowClearConfirm(false);
                                }}
                            >
                                Clear All
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface HistoryCardProps {
    calculation: ProteinCalculation;
    onDelete: () => void;
}

function HistoryCard({ calculation, onDelete }: HistoryCardProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <>
            <Card variant="outlined" className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {calculation.proteinSource.name}
                            </h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {calculation.calculationMethod}
                            </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-3">
                            <div>
                                <div className="text-xs text-gray-500">Stated Protein</div>
                                <div className="text-sm font-medium text-gray-900">
                                    {formatProteinAmount(calculation.statedProtein)}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-500">Quality-Adjusted</div>
                                <div className="text-sm font-semibold text-blue-600">
                                    {formatProteinAmount(calculation.digestibleProtein)}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-500">Quality %</div>
                                <div className={`text-sm font-semibold ${getPercentageColorClass(calculation.digestibilityPercentage)}`}>
                                    {formatPercentage(calculation.digestibilityPercentage)}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-500">Calculated</div>
                                <div className="text-sm text-gray-600">
                                    {formatRelativeDate(calculation.timestamp)}
                                </div>
                            </div>
                        </div>

                        {calculation.dvPercentage && (
                            <div className="text-sm text-orange-600">
                                Daily Value: {formatPercentage(calculation.dvPercentage)}
                            </div>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                </div>
            </Card>

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Calculation</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this calculation for {calculation.proteinSource.name}?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    onDelete();
                                    setShowDeleteConfirm(false);
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
