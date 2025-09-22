'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircleIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ProteinSource, ProteinSourceWithPercentage, ProteinSourceValidation } from '@/types/protein';
import ProteinSourcePicker from './ProteinSourcePicker';
import Input from './ui/Input';
import { getDefaultPercentages } from '@/utils/proteinDefaults';

interface MultiProteinSourcePickerProps {
    proteinSources: ProteinSourceWithPercentage[];
    onSourcesChange: (sources: ProteinSourceWithPercentage[]) => void;
    error?: string;
}

export default function MultiProteinSourcePicker({
    proteinSources,
    onSourcesChange,
    error
}: MultiProteinSourcePickerProps) {
    const [showProteinPicker, setShowProteinPicker] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [validation, setValidation] = useState<ProteinSourceValidation>({ isValid: true, errors: [] });
    const [usePercentages, setUsePercentages] = useState(false);

    // Ensure we always have at least one source entry
    useEffect(() => {
        if (proteinSources.length === 0) {
            onSourcesChange([{ source: null as unknown as ProteinSource, percentage: undefined }]);
        }
    }, [proteinSources.length, onSourcesChange]);

    // Validate percentages whenever sources change (only if user is using percentages)
    useEffect(() => {
        if (usePercentages) {
            validatePercentages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proteinSources, usePercentages]);  // validatePercentages is stable, no need to include

    const validatePercentages = () => {
        const errors: string[] = [];
        let totalPercentage = 0;
        let hasPercentages = false;

        // Check if any percentages are specified
        for (const sourceWithPercentage of proteinSources) {
            if (sourceWithPercentage.percentage !== undefined && sourceWithPercentage.percentage !== null) {
                hasPercentages = true;
                totalPercentage += sourceWithPercentage.percentage;

                // Check individual percentage bounds
                if (sourceWithPercentage.percentage < 0 || sourceWithPercentage.percentage > 100) {
                    errors.push(`Percentages must be between 0 and 100`);
                }
            }
        }

        // If percentages are specified, they must add up to 100
        if (hasPercentages && Math.abs(totalPercentage - 100) > 0.01) {
            errors.push(`Percentages must add up to 100% (currently ${totalPercentage.toFixed(1)}%)`);
        }

        setValidation({
            isValid: errors.length === 0,
            errors,
            totalPercentage: hasPercentages ? totalPercentage : undefined
        });
    };

    const handleAddSource = () => {
        setEditingIndex(proteinSources.length);
        setShowProteinPicker(true);
    };

    const handleEditSource = (index: number) => {
        setEditingIndex(index);
        setShowProteinPicker(true);
    };

    const handleSelectSource = (source: ProteinSource) => {
        const newSources = [...proteinSources];

        if (editingIndex !== null) {
            if (editingIndex < newSources.length) {
                // Editing existing source
                newSources[editingIndex] = {
                    ...newSources[editingIndex],
                    source
                };
            } else {
                // Adding new source
                newSources.push({ source, percentage: undefined });
            }

            // Only auto-fill default percentages if user has explicitly chosen to use percentages
            if (usePercentages && newSources.filter(s => s.source).length > 1) {
                const hasPercentages = newSources.some(s => s.percentage !== undefined);
                if (!hasPercentages) {
                    const defaultPercentages = getDefaultPercentages(newSources.map(s => s.source).filter(Boolean));
                    if (defaultPercentages.length > 0) {
                        newSources.forEach((sourceWithPercentage, index) => {
                            if (sourceWithPercentage.source && defaultPercentages[index]) {
                                sourceWithPercentage.percentage = defaultPercentages[index];
                            }
                        });
                    }
                }
            }

            onSourcesChange(newSources);
        }
    };

    const handleRemoveSource = (index: number) => {
        if (proteinSources.length > 1) {
            const newSources = proteinSources.filter((_, i) => i !== index);
            onSourcesChange(newSources);
        }
    };

    const handlePercentageChange = (index: number, value: string) => {
        const newSources = [...proteinSources];
        const numericValue = value === '' ? undefined : parseFloat(value);

        if (numericValue !== undefined && !isNaN(numericValue)) {
            newSources[index].percentage = numericValue;
        } else if (value === '') {
            newSources[index].percentage = undefined;
        }

        onSourcesChange(newSources);
    };

    const showPercentageInputs = usePercentages && proteinSources.filter(s => s.source).length > 1;

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {proteinSources.map((sourceWithPercentage, index) => (
                    <div key={index} className="relative">
                        <div className="flex gap-2 items-start">
                            {/* Protein Source Selection */}
                            <div className="flex-1">
                                <button
                                    type="button"
                                    onClick={() => handleEditSource(index)}
                                    className="w-full p-4 text-left input-modern hover:bg-white/95 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={sourceWithPercentage.source ? 'text-gray-900 font-medium' : 'text-gray-500 font-medium'}>
                                            {sourceWithPercentage.source?.name || 'Select protein source'}
                                        </span>
                                        <svg
                                            className="w-5 h-5 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                            </div>

                            {/* Percentage Input (shown when there are multiple sources or percentages are being used) */}
                            {showPercentageInputs && (
                                <div className="w-24">
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        placeholder="%"
                                        value={sourceWithPercentage.percentage?.toString() || ''}
                                        onChange={(e) => handlePercentageChange(index, e.target.value)}
                                        className="text-center"
                                    />
                                </div>
                            )}

                            {/* Remove Button (shown for additional sources) */}
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSource(index)}
                                    className="p-2 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md transition-colors"
                                    aria-label="Remove protein source"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Additional Source Button */}
            <button
                type="button"
                onClick={handleAddSource}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-2"
            >
                <PlusCircleIcon className="w-5 h-5" />
                Add additional protein source
            </button>

            {/* Percentage Toggle Button - only show when multiple sources */}
            {proteinSources.filter(s => s.source).length > 1 && (
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setUsePercentages(!usePercentages)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${usePercentages
                                ? 'bg-purple-100 text-purple-700 border-2 border-purple-200'
                                : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
                            }`}
                    >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${usePercentages ? 'bg-purple-600 border-purple-600' : 'border-gray-400'
                            }`}>
                            {usePercentages && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        Specify percentage breakdown
                    </button>
                    {!usePercentages && (
                        <span className="text-sm text-gray-500">
                            We'll automatically distribute based on protein quality
                        </span>
                    )}
                </div>
            )}

            {/* Validation Errors */}
            {(!validation.isValid || error) && (
                <div className="flex items-center gap-3 p-4 bg-red-50/90 border-2 border-red-200 rounded-xl backdrop-blur-sm shadow-md animate-fadeIn">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <div className="text-sm text-red-700 font-medium">
                        {error && <p>{error}</p>}
                        {validation.errors.map((err, index) => (
                            <p key={index}>{err}</p>
                        ))}
                    </div>
                </div>
            )}

            {/* Percentage Total Display */}
            {validation.totalPercentage !== undefined && (
                <div className="text-sm text-gray-600">
                    Total: {validation.totalPercentage.toFixed(1)}%
                </div>
            )}

            {/* Protein Source Picker Modal */}
            <ProteinSourcePicker
                isOpen={showProteinPicker}
                onClose={() => {
                    setShowProteinPicker(false);
                    setEditingIndex(null);
                }}
                selectedSource={editingIndex !== null && editingIndex < proteinSources.length ? proteinSources[editingIndex]?.source : null}
                onSelectSource={handleSelectSource}
            />
        </div>
    );
}
