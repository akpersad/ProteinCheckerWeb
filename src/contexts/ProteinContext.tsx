'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import {
    ProteinCalculation,
    ProteinSource,
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
    selectedProteinSource: ProteinSource | null;
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

    const calculateProtein = () => {
        const { statedProtein, dvPercentage, selectedProteinSource } = state;

        // Validate inputs
        const statedProteinValue = parseFloat(statedProtein);
        if (!selectedProteinSource || isNaN(statedProteinValue) || statedProteinValue <= 0) {
            setError('Please enter a valid protein amount and select a protein source');
            return;
        }

        try {
            const dvPercentageValue = dvPercentage ? parseFloat(dvPercentage) : undefined;

            const input: CalculationInput = {
                statedProtein: statedProteinValue,
                dvPercentage: dvPercentageValue && !isNaN(dvPercentageValue) ? dvPercentageValue : undefined,
                proteinSource: selectedProteinSource
            };

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
