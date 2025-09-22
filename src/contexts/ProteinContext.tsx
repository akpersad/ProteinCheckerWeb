'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import {
    ProteinCalculation,
    ProteinSource,
    ProteinSourceWithPercentage,
    ProteinCategory,
    CalculationStatistics,
    CalculationInput,
    CalculationResult
} from '@/types/protein';
import { dataManager } from '@/utils/dataManager';
import { calculateDigestibleProtein, createCalculationRecord } from '@/utils/proteinCalculations';

// State interface
interface ProteinState {
    // Calculator state
    statedProtein: string;
    dvPercentage: string;
    selectedProteinSource: ProteinSource | null; // Keep for backward compatibility
    proteinSources: ProteinSourceWithPercentage[]; // New multi-source support
    calculationResult: CalculationResult | null;

    // History state
    calculationHistory: ProteinCalculation[];
    searchText: string;
    selectedCategory: ProteinCategory;
    statistics: CalculationStatistics | null;

    // UI state
    isLoading: boolean;
    error: string | null;
}

// Action types
type ProteinAction =
    | { type: 'SET_STATED_PROTEIN'; payload: string }
    | { type: 'SET_DV_PERCENTAGE'; payload: string }
    | { type: 'SET_SELECTED_PROTEIN_SOURCE'; payload: ProteinSource | null }
    | { type: 'SET_PROTEIN_SOURCES'; payload: ProteinSourceWithPercentage[] }
    | { type: 'SET_CALCULATION_RESULT'; payload: CalculationResult | null }
    | { type: 'SET_CALCULATION_HISTORY'; payload: ProteinCalculation[] }
    | { type: 'ADD_CALCULATION'; payload: ProteinCalculation }
    | { type: 'REMOVE_CALCULATION'; payload: string }
    | { type: 'CLEAR_HISTORY' }
    | { type: 'SET_SEARCH_TEXT'; payload: string }
    | { type: 'SET_SELECTED_CATEGORY'; payload: ProteinCategory }
    | { type: 'SET_STATISTICS'; payload: CalculationStatistics }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'RESET_CALCULATOR' };

// Initial state
const initialState: ProteinState = {
    statedProtein: '',
    dvPercentage: '',
    selectedProteinSource: null,
    proteinSources: [{ source: null as unknown as ProteinSource, percentage: undefined }],
    calculationResult: null,
    calculationHistory: [],
    searchText: '',
    selectedCategory: ProteinCategory.ALL,
    statistics: null,
    isLoading: false,
    error: null
};

// Reducer
function proteinReducer(state: ProteinState, action: ProteinAction): ProteinState {
    switch (action.type) {
        case 'SET_STATED_PROTEIN':
            return { ...state, statedProtein: action.payload };
        case 'SET_DV_PERCENTAGE':
            return { ...state, dvPercentage: action.payload };
        case 'SET_SELECTED_PROTEIN_SOURCE':
            return { ...state, selectedProteinSource: action.payload };
        case 'SET_PROTEIN_SOURCES':
            return { ...state, proteinSources: action.payload };
        case 'SET_CALCULATION_RESULT':
            return { ...state, calculationResult: action.payload };
        case 'SET_CALCULATION_HISTORY':
            return { ...state, calculationHistory: action.payload };
        case 'ADD_CALCULATION':
            return {
                ...state,
                calculationHistory: [action.payload, ...state.calculationHistory]
            };
        case 'REMOVE_CALCULATION':
            return {
                ...state,
                calculationHistory: state.calculationHistory.filter(calc => calc.id !== action.payload)
            };
        case 'CLEAR_HISTORY':
            return { ...state, calculationHistory: [] };
        case 'SET_SEARCH_TEXT':
            return { ...state, searchText: action.payload };
        case 'SET_SELECTED_CATEGORY':
            return { ...state, selectedCategory: action.payload };
        case 'SET_STATISTICS':
            return { ...state, statistics: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'RESET_CALCULATOR':
            return {
                ...state,
                statedProtein: '',
                dvPercentage: '',
                selectedProteinSource: null,
                proteinSources: [{ source: null as unknown as ProteinSource, percentage: undefined }],
                calculationResult: null,
                error: null
            };
        default:
            return state;
    }
}

// Context interface
interface ProteinContextType {
    state: ProteinState;

    // Calculator actions
    setStatedProtein: (value: string) => void;
    setDvPercentage: (value: string) => void;
    setSelectedProteinSource: (source: ProteinSource | null) => void;
    setProteinSources: (sources: ProteinSourceWithPercentage[]) => void;
    calculateProtein: () => void;
    resetCalculator: () => void;

    // History actions
    loadHistory: () => void;
    deleteCalculation: (id: string) => void;
    clearHistory: () => void;
    setSearchText: (text: string) => void;
    setSelectedCategory: (category: ProteinCategory) => void;
    exportHistory: () => string;
    importHistory: (jsonData: string, replaceExisting?: boolean) => boolean;

    // Statistics actions
    loadStatistics: () => void;

    // Utility actions
    setError: (error: string | null) => void;
}

// Create context
const ProteinContext = createContext<ProteinContextType | undefined>(undefined);

// Provider component
interface ProteinProviderProps {
    children: ReactNode;
}

export function ProteinProvider({ children }: ProteinProviderProps) {
    const [state, dispatch] = useReducer(proteinReducer, initialState);

    // Calculator actions
    const setStatedProtein = (value: string) => {
        dispatch({ type: 'SET_STATED_PROTEIN', payload: value });
    };

    const setDvPercentage = (value: string) => {
        dispatch({ type: 'SET_DV_PERCENTAGE', payload: value });
    };

    const setSelectedProteinSource = (source: ProteinSource | null) => {
        dispatch({ type: 'SET_SELECTED_PROTEIN_SOURCE', payload: source });
    };

    const setProteinSources = (sources: ProteinSourceWithPercentage[]) => {
        dispatch({ type: 'SET_PROTEIN_SOURCES', payload: sources });

        // Keep backward compatibility: if only one source, set selectedProteinSource
        if (sources.length === 1 && sources[0].source) {
            dispatch({ type: 'SET_SELECTED_PROTEIN_SOURCE', payload: sources[0].source });
        } else {
            dispatch({ type: 'SET_SELECTED_PROTEIN_SOURCE', payload: null });
        }
    };

    const calculateProtein = () => {
        const { statedProtein, dvPercentage, selectedProteinSource, proteinSources } = state;

        // Validate inputs
        const statedProteinValue = parseFloat(statedProtein);
        if (isNaN(statedProteinValue) || statedProteinValue <= 0) {
            setError('Please enter a valid protein amount');
            return;
        }

        // Check if we have valid protein sources
        const validSources = proteinSources.filter(ps => ps.source);
        if (validSources.length === 0 && !selectedProteinSource) {
            setError('Please select at least one protein source');
            return;
        }

        // Validate percentages if multiple sources
        if (validSources.length > 1) {
            const hasPercentages = validSources.some(ps => ps.percentage !== undefined);
            if (hasPercentages) {
                const totalPercentage = validSources.reduce((sum, ps) => sum + (ps.percentage || 0), 0);
                if (Math.abs(totalPercentage - 100) > 0.01) {
                    setError(`Percentages must add up to 100% (currently ${totalPercentage.toFixed(1)}%)`);
                    return;
                }
            }
        }

        try {
            const dvPercentageValue = dvPercentage ? parseFloat(dvPercentage) : undefined;

            let input: CalculationInput;

            // Use multi-source if available, otherwise fall back to single source
            if (validSources.length > 0) {
                input = {
                    statedProtein: statedProteinValue,
                    dvPercentage: dvPercentageValue && !isNaN(dvPercentageValue) ? dvPercentageValue : undefined,
                    proteinSources: validSources
                };
            } else {
                input = {
                    statedProtein: statedProteinValue,
                    dvPercentage: dvPercentageValue && !isNaN(dvPercentageValue) ? dvPercentageValue : undefined,
                    proteinSource: selectedProteinSource
                };
            }

            const result = calculateDigestibleProtein(input);
            dispatch({ type: 'SET_CALCULATION_RESULT', payload: result });

            // Save to history
            const calculationRecord = createCalculationRecord(input, result);
            dataManager.saveCalculation(calculationRecord);
            dispatch({ type: 'ADD_CALCULATION', payload: calculationRecord });

            // Update statistics
            loadStatistics();

            setError(null);
        } catch (error) {
            console.error('Calculation error:', error);
            setError('An error occurred during calculation');
        }
    };

    const resetCalculator = () => {
        dispatch({ type: 'RESET_CALCULATOR' });
    };

    // History actions
    const loadHistory = useCallback(() => {
        try {
            const history = dataManager.getCalculationHistory();
            dispatch({ type: 'SET_CALCULATION_HISTORY', payload: history });
        } catch (error) {
            console.error('Error loading history:', error);
            setError('Failed to load calculation history');
        }
    }, []);

    const deleteCalculation = (id: string) => {
        try {
            dataManager.deleteCalculation(id);
            dispatch({ type: 'REMOVE_CALCULATION', payload: id });
            loadStatistics();
        } catch (error) {
            console.error('Error deleting calculation:', error);
            setError('Failed to delete calculation');
        }
    };

    const clearHistory = () => {
        try {
            dataManager.clearCalculationHistory();
            dispatch({ type: 'CLEAR_HISTORY' });
            loadStatistics();
        } catch (error) {
            console.error('Error clearing history:', error);
            setError('Failed to clear history');
        }
    };

    const setSearchText = (text: string) => {
        dispatch({ type: 'SET_SEARCH_TEXT', payload: text });
    };

    const setSelectedCategory = (category: ProteinCategory) => {
        dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
    };

    const exportHistory = (): string => {
        return dataManager.exportCalculationHistory();
    };

    const importHistory = (jsonData: string, replaceExisting = false): boolean => {
        try {
            const success = dataManager.importCalculationHistory(jsonData, replaceExisting);
            if (success) {
                loadHistory();
                loadStatistics();
            }
            return success;
        } catch (error) {
            console.error('Error importing history:', error);
            setError('Failed to import calculation history');
            return false;
        }
    };

    // Statistics actions
    const loadStatistics = useCallback(() => {
        try {
            const stats = dataManager.getCalculationStatistics();
            dispatch({ type: 'SET_STATISTICS', payload: stats });
        } catch (error) {
            console.error('Error loading statistics:', error);
            setError('Failed to load statistics');
        }
    }, []);

    // Utility actions
    const setError = (error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    };

    // Load initial data
    useEffect(() => {
        loadHistory();
        loadStatistics();
    }, [loadHistory, loadStatistics]);

    const contextValue: ProteinContextType = {
        state,
        setStatedProtein,
        setDvPercentage,
        setSelectedProteinSource,
        setProteinSources,
        calculateProtein,
        resetCalculator,
        loadHistory,
        deleteCalculation,
        clearHistory,
        setSearchText,
        setSelectedCategory,
        exportHistory,
        importHistory,
        loadStatistics,
        setError
    };

    return (
        <ProteinContext.Provider value={contextValue}>
            {children}
        </ProteinContext.Provider>
    );
}

// Hook to use context
export function useProtein() {
    const context = useContext(ProteinContext);
    if (context === undefined) {
        throw new Error('useProtein must be used within a ProteinProvider');
    }
    return context;
}
