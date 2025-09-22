import {
    CalculationInput,
    CalculationResult,
    CalculationMethod,
    ProteinCalculation,
    ProteinSource,
    QualityRating,
    ProteinQualityRating
} from '@/types/protein';
import { v4 as uuidv4 } from 'uuid';

// Constants
const FDA_DAILY_VALUE_PROTEIN = 50.0; // grams per day

/**
 * Calculate quality-adjusted protein using DIAAS or PDCAAS scores
 * 
 * Note: DIAAS/PDCAAS scores indicate protein quality (amino acid completeness and digestibility),
 * not absorption rates. A score of 0.6 means the protein can meet 60% of amino acid requirements
 * due to limiting amino acids, making it "60% as effective" as a complete protein.
 */
export function calculateDigestibleProtein(input: CalculationInput): CalculationResult {
    const { statedProtein, dvPercentage, proteinSource } = input;

    // Use DV% to calculate protein amount if provided, otherwise use stated protein
    let adjustedProtein = statedProtein;
    let dvDiscrepancy: number | undefined;

    if (dvPercentage && dvPercentage > 0) {
        const proteinFromDV = (dvPercentage / 100) * FDA_DAILY_VALUE_PROTEIN;
        adjustedProtein = proteinFromDV;

        // Note discrepancy for educational purposes
        const discrepancy = Math.abs(proteinFromDV - statedProtein);
        if (discrepancy > 0.5) {
            dvDiscrepancy = discrepancy;
        }
    }

    // Use DIAAS if available, otherwise fall back to PDCAAS
    let score: number;
    let method: CalculationMethod;

    if (proteinSource.diaasScore !== undefined) {
        score = proteinSource.diaasScore;
        method = CalculationMethod.DIAAS;
    } else if (proteinSource.pdcaasScore !== undefined) {
        score = proteinSource.pdcaasScore;
        method = CalculationMethod.PDCAAS;
    } else {
        // Fallback for sources without scores
        score = 0.75;
        method = CalculationMethod.DIAAS;
    }

    const qualityAdjustedProtein = adjustedProtein * score;
    const proteinQualityPercentage = (qualityAdjustedProtein / statedProtein) * 100;

    return {
        qualityAdjustedProtein,
        proteinQualityPercentage,
        calculationMethod: method,
        adjustedProtein: dvPercentage ? adjustedProtein : undefined,
        scoreUsed: score,
        dvDiscrepancy
    };
}

/**
 * Create a full calculation record
 */
export function createCalculationRecord(
    input: CalculationInput,
    result: CalculationResult
): ProteinCalculation {
    return {
        id: uuidv4(),
        statedProtein: input.statedProtein,
        dvPercentage: input.dvPercentage,
        proteinSource: input.proteinSource,
        digestibleProtein: result.qualityAdjustedProtein,
        digestibilityPercentage: result.proteinQualityPercentage,
        calculationMethod: result.calculationMethod,
        timestamp: new Date()
    };
}

/**
 * Format protein amount for display
 */
export function formatProteinAmount(amount: number): string {
    return `${amount.toFixed(1)}g`;
}

/**
 * Format percentage for display
 */
export function formatPercentage(percentage: number): string {
    return `${percentage.toFixed(1)}%`;
}

/**
 * Calculate protein from DV percentage
 */
export function calculateProteinFromDV(dvPercentage: number): number {
    return (dvPercentage / 100) * FDA_DAILY_VALUE_PROTEIN;
}

/**
 * Calculate DV percentage from protein amount
 */
export function calculateDVFromProtein(proteinGrams: number): number {
    return (proteinGrams / FDA_DAILY_VALUE_PROTEIN) * 100;
}

/**
 * Compare protein quality scores
 */
export function compareProteinQuality(sourceA: ProteinSource, sourceB: ProteinSource): number {
    const scoreA = sourceA.diaasScore ?? sourceA.pdcaasScore ?? 0;
    const scoreB = sourceB.diaasScore ?? sourceB.pdcaasScore ?? 0;

    if (scoreA > scoreB) return 1;
    if (scoreA < scoreB) return -1;
    return 0;
}

/**
 * Get protein quality rating
 */
export function getProteinQualityRating(source: ProteinSource): ProteinQualityRating {
    const score = source.diaasScore ?? source.pdcaasScore ?? 0;

    if (score >= 1.0) {
        return {
            rating: QualityRating.EXCELLENT,
            description: 'Complete, high-quality protein'
        };
    } else if (score >= 0.8) {
        return {
            rating: QualityRating.HIGH,
            description: 'Good quality protein with minor limitations'
        };
    } else if (score >= 0.6) {
        return {
            rating: QualityRating.GOOD,
            description: 'Moderate quality protein'
        };
    } else if (score >= 0.4) {
        return {
            rating: QualityRating.FAIR,
            description: 'Lower quality protein'
        };
    } else if (score > 0) {
        return {
            rating: QualityRating.POOR,
            description: 'Limited protein quality'
        };
    } else {
        return {
            rating: QualityRating.INCOMPLETE,
            description: 'Missing essential amino acids'
        };
    }
}

/**
 * Get digestibility color based on percentage
 */
export function getDigestibilityColor(percentage: number): string {
    if (percentage <= 40) {
        return '#FF5252'; // Bright red - AAA compliant on dark backgrounds
    } else if (percentage <= 80) {
        return '#FFD54F'; // Bright yellow - AAA compliant on dark backgrounds
    } else {
        return '#66BB6A'; // Bright green - AAA compliant on dark backgrounds
    }
}

/**
 * Get score color for UI display
 */
export function getScoreColor(score: number): string {
    if (score >= 1.0) {
        return '#22c55e'; // green-500
    } else if (score >= 0.8) {
        return '#f97316'; // orange-500
    } else {
        return '#ef4444'; // red-500
    }
}

/**
 * Get Tailwind color class for percentage
 */
export function getPercentageColorClass(percentage: number): string {
    if (percentage <= 40) {
        return 'text-red-500';
    } else if (percentage <= 80) {
        return 'text-orange-500';
    } else {
        return 'text-green-500';
    }
}
