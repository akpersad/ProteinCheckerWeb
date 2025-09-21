import { ProteinCalculation, ProteinSource, CalculationStatistics } from '@/types/protein';

class DataManager {
    private static instance: DataManager;
    private readonly calculationHistoryKey = 'protein_calculation_history';
    private readonly maxHistoryItems = 100;

    static getInstance(): DataManager {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager();
        }
        return DataManager.instance;
    }

    private constructor() { }

    /**
     * Save a new calculation to history
     */
    saveCalculation(calculation: ProteinCalculation): void {
        const history = this.getCalculationHistory();

        // Add new calculation to the beginning
        history.unshift(calculation);

        // Limit history size
        if (history.length > this.maxHistoryItems) {
            history.splice(this.maxHistoryItems);
        }

        this.saveCalculationHistory(history);
    }

    /**
     * Get all calculation history
     */
    getCalculationHistory(): ProteinCalculation[] {
        try {
            const data = localStorage.getItem(this.calculationHistoryKey);
            if (!data) return [];

            const parsed = JSON.parse(data);
            // Convert timestamp strings back to Date objects
            return parsed.map((calc: any) => ({
                ...calc,
                timestamp: new Date(calc.timestamp)
            }));
        } catch (error) {
            console.error('Error loading calculation history:', error);
            return [];
        }
    }

    /**
     * Save calculation history
     */
    private saveCalculationHistory(history: ProteinCalculation[]): void {
        try {
            localStorage.setItem(this.calculationHistoryKey, JSON.stringify(history));
        } catch (error) {
            console.error('Error saving calculation history:', error);
        }
    }

    /**
     * Delete a specific calculation from history
     */
    deleteCalculation(id: string): void {
        const history = this.getCalculationHistory();
        const filtered = history.filter(calc => calc.id !== id);
        this.saveCalculationHistory(filtered);
    }

    /**
     * Clear all calculation history
     */
    clearCalculationHistory(): void {
        localStorage.removeItem(this.calculationHistoryKey);
    }

    /**
     * Get calculation history filtered by date range
     */
    getCalculationHistory(startDate: Date, endDate: Date): ProteinCalculation[] {
        const allHistory = this.getCalculationHistory();
        return allHistory.filter(calculation =>
            calculation.timestamp >= startDate && calculation.timestamp <= endDate
        );
    }

    /**
     * Get calculation history for a specific protein source
     */
    getCalculationHistoryForSource(proteinSource: ProteinSource): ProteinCalculation[] {
        const allHistory = this.getCalculationHistory();
        return allHistory.filter(calc => calc.proteinSource.id === proteinSource.id);
    }

    /**
     * Get calculation statistics
     */
    getCalculationStatistics(): CalculationStatistics {
        const history = this.getCalculationHistory();

        const totalCalculations = history.length;
        const averageProtein = totalCalculations === 0
            ? 0
            : history.reduce((sum, calc) => sum + calc.statedProtein, 0) / totalCalculations;
        const averageQualityAdjusted = totalCalculations === 0
            ? 0
            : history.reduce((sum, calc) => sum + calc.digestibleProtein, 0) / totalCalculations;

        // Group by protein source name and count occurrences
        const sourceCount = new Map<string, number>();
        history.forEach(calc => {
            const name = calc.proteinSource.name;
            sourceCount.set(name, (sourceCount.get(name) || 0) + 1);
        });

        // Sort by count and take top 5
        const mostUsedSources = Array.from(sourceCount.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        return {
            totalCalculations,
            averageStatedProtein: averageProtein,
            averageQualityAdjustedProtein: averageQualityAdjusted,
            mostUsedSources
        };
    }

    /**
     * Export calculation history as JSON data
     */
    exportCalculationHistory(): string {
        const history = this.getCalculationHistory();
        return JSON.stringify(history, null, 2);
    }

    /**
     * Import calculation history from JSON data
     */
    importCalculationHistory(jsonData: string, replaceExisting = false): boolean {
        try {
            const importedHistory: ProteinCalculation[] = JSON.parse(jsonData);

            // Validate the data structure
            if (!Array.isArray(importedHistory)) {
                throw new Error('Invalid data format');
            }

            // Convert timestamp strings to Date objects
            const processedHistory = importedHistory.map(calc => ({
                ...calc,
                timestamp: new Date(calc.timestamp)
            }));

            if (replaceExisting) {
                this.saveCalculationHistory(processedHistory);
            } else {
                const existingHistory = this.getCalculationHistory();

                // Merge and deduplicate based on ID
                const existingIds = new Set(existingHistory.map(calc => calc.id));
                const newCalculations = processedHistory.filter(calc => !existingIds.has(calc.id));

                const mergedHistory = [...existingHistory, ...newCalculations];
                mergedHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

                // Limit total history
                if (mergedHistory.length > this.maxHistoryItems) {
                    mergedHistory.splice(this.maxHistoryItems);
                }

                this.saveCalculationHistory(mergedHistory);
            }

            return true;
        } catch (error) {
            console.error('Error importing calculation history:', error);
            return false;
        }
    }

    /**
     * Check if local storage is available
     */
    isStorageAvailable(): boolean {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }
}

export const dataManager = DataManager.getInstance();
