import { ProteinSource, ProteinCategory } from '@/types/protein';

interface ProteinCombination {
    sources: string[]; // source names or patterns
    percentages: number[];
    description: string;
}

// Common protein source combinations with default percentages
const commonCombinations: ProteinCombination[] = [
    // Meat + Plant combinations
    {
        sources: ['chicken', 'quinoa'],
        percentages: [70, 30],
        description: 'Chicken and quinoa bowl'
    },
    {
        sources: ['beef', 'lentils'],
        percentages: [60, 40],
        description: 'Beef and lentil stew'
    },
    {
        sources: ['fish', 'rice'],
        percentages: [80, 20],
        description: 'Fish with rice'
    },

    // Dairy + Plant combinations
    {
        sources: ['milk', 'oats'],
        percentages: [60, 40],
        description: 'Oatmeal with milk'
    },
    {
        sources: ['yogurt', 'nuts'],
        percentages: [75, 25],
        description: 'Yogurt with nuts'
    },
    {
        sources: ['cheese', 'bread'],
        percentages: [70, 30],
        description: 'Cheese sandwich'
    },

    // Multiple plant sources (complementary proteins)
    {
        sources: ['beans', 'rice'],
        percentages: [60, 40],
        description: 'Rice and beans (complete protein)'
    },
    {
        sources: ['lentils', 'quinoa'],
        percentages: [50, 50],
        description: 'Lentil quinoa salad'
    },
    {
        sources: ['peanuts', 'bread'],
        percentages: [40, 60],
        description: 'Peanut butter sandwich'
    },
    {
        sources: ['chickpeas', 'tahini'],
        percentages: [80, 20],
        description: 'Hummus'
    },

    // Supplement combinations
    {
        sources: ['whey', 'casein'],
        percentages: [70, 30],
        description: 'Whey and casein blend'
    },
    {
        sources: ['pea protein', 'rice protein'],
        percentages: [70, 30],
        description: 'Plant protein blend'
    },

    // Breakfast combinations
    {
        sources: ['egg', 'bread'],
        percentages: [60, 40],
        description: 'Egg sandwich'
    },
    {
        sources: ['milk', 'cereal'],
        percentages: [50, 50],
        description: 'Cereal with milk'
    }
];

// Fallback percentages based on protein quality scores
function getQualityBasedPercentages(sources: ProteinSource[]): number[] {
    // Calculate weights based on DIAAS scores (or PDCAAS as fallback)
    const weights = sources.map(source => {
        const score = source.diaasScore ?? source.pdcaasScore ?? 0.5;
        return Math.max(score, 0.1); // Minimum weight to prevent 0% allocations
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    // Convert to percentages and ensure they sum to 100
    const percentages = weights.map(weight => (weight / totalWeight) * 100);

    // Round to 1 decimal place and adjust to ensure sum is exactly 100
    const roundedPercentages = percentages.map(p => Math.round(p * 10) / 10);
    const sum = roundedPercentages.reduce((total, p) => total + p, 0);

    if (Math.abs(sum - 100) > 0.1) {
        // Adjust the largest percentage to make sum exactly 100
        const maxIndex = roundedPercentages.indexOf(Math.max(...roundedPercentages));
        roundedPercentages[maxIndex] += (100 - sum);
    }

    return roundedPercentages;
}

// Removed getCategoryBasedPercentages function as it's currently unused

export function getDefaultPercentages(sources: ProteinSource[]): number[] {
    if (sources.length === 0) return [];
    if (sources.length === 1) return [100];

    // Try to find a matching common combination
    for (const combination of commonCombinations) {
        if (combination.sources.length === sources.length) {
            const matches = combination.sources.every(pattern => {
                return sources.some(source =>
                    source.name.toLowerCase().includes(pattern.toLowerCase())
                );
            });

            if (matches) {
                return [...combination.percentages];
            }
        }
    }

    // Try category-based matching for complementary proteins
    const hasPlantAndAnimal = sources.some(s => s.category === ProteinCategory.PLANT) &&
        sources.some(s => [ProteinCategory.MEAT, ProteinCategory.DAIRY].includes(s.category));

    if (hasPlantAndAnimal && sources.length === 2) {
        const animalIndex = sources.findIndex(s => [ProteinCategory.MEAT, ProteinCategory.DAIRY, ProteinCategory.SUPPLEMENT].includes(s.category));
        return animalIndex === 0 ? [70, 30] : [30, 70];
    }

    // Use quality-based percentages as fallback
    return getQualityBasedPercentages(sources);
}

export function getCommonCombinations(): ProteinCombination[] {
    return [...commonCombinations];
}

export function suggestComplementaryProteins(): ProteinSource[] {
    // This would typically query the protein database for complementary sources
    // For now, return empty array - could be expanded later
    return [];
}
