import { ProteinSource, ProteinCategory } from '@/types/protein';

// Generate stable IDs based on name for consistency
function generateId(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

export const proteinSources: ProteinSource[] = [
    // MARK: - Meat & Fish (High DIAAS scores)
    {
        id: generateId('Whey Protein Isolate'),
        name: 'Whey Protein Isolate',
        category: ProteinCategory.SUPPLEMENT,
        diaasScore: 1.25,
        pdcaasScore: 1.0,
        description: 'Complete protein with excellent amino acid profile'
    },
    {
        id: generateId('Whey Protein Concentrate'),
        name: 'Whey Protein Concentrate',
        category: ProteinCategory.SUPPLEMENT,
        diaasScore: 1.20,
        pdcaasScore: 1.0,
        description: 'High-quality protein with good bioavailability'
    },
    {
        id: generateId('Milk (Whole)'),
        name: 'Milk (Whole)',
        category: ProteinCategory.DAIRY,
        diaasScore: 1.18,
        pdcaasScore: 1.0,
        description: 'Complete protein with casein and whey'
    },
    {
        id: generateId('Egg (Whole)'),
        name: 'Egg (Whole)',
        category: ProteinCategory.DAIRY,
        diaasScore: 1.13,
        pdcaasScore: 1.0,
        description: 'Gold standard for protein quality'
    },
    {
        id: generateId('Beef (Lean)'),
        name: 'Beef (Lean)',
        category: ProteinCategory.MEAT,
        diaasScore: 1.11,
        pdcaasScore: 0.92,
        description: 'High-quality complete protein'
    },
    {
        id: generateId('Chicken Breast'),
        name: 'Chicken Breast',
        category: ProteinCategory.MEAT,
        diaasScore: 1.08,
        pdcaasScore: 0.97,
        description: 'Lean, complete protein source'
    },
    {
        id: generateId('Fish (Salmon)'),
        name: 'Fish (Salmon)',
        category: ProteinCategory.MEAT,
        diaasScore: 1.09,
        pdcaasScore: 1.0,
        description: 'Complete protein with omega-3 fatty acids'
    },
    {
        id: generateId('Pork (Lean)'),
        name: 'Pork (Lean)',
        category: ProteinCategory.MEAT,
        diaasScore: 1.06,
        pdcaasScore: 0.87,
        description: 'Complete protein source'
    },
    {
        id: generateId('Turkey Breast'),
        name: 'Turkey Breast',
        category: ProteinCategory.MEAT,
        diaasScore: 1.07,
        pdcaasScore: 0.95,
        description: 'Lean, high-quality protein'
    },
    {
        id: generateId('Greek Yogurt'),
        name: 'Greek Yogurt',
        category: ProteinCategory.DAIRY,
        diaasScore: 1.15,
        pdcaasScore: 1.0,
        description: 'Concentrated protein with probiotics'
    },

    // MARK: - Plant Sources (Lower DIAAS scores)
    {
        id: generateId('Soy Protein Isolate'),
        name: 'Soy Protein Isolate',
        category: ProteinCategory.SUPPLEMENT,
        diaasScore: 0.90,
        pdcaasScore: 1.0,
        description: 'Highest quality plant protein'
    },
    {
        id: generateId('Tofu (Firm)'),
        name: 'Tofu (Firm)',
        category: ProteinCategory.PLANT,
        diaasScore: 0.87,
        pdcaasScore: 0.95,
        description: 'Complete plant protein'
    },
    {
        id: generateId('Quinoa'),
        name: 'Quinoa',
        category: ProteinCategory.PLANT,
        diaasScore: 0.84,
        pdcaasScore: 0.73,
        description: 'Complete grain protein'
    },
    {
        id: generateId('Hemp Seeds'),
        name: 'Hemp Seeds',
        category: ProteinCategory.PLANT,
        diaasScore: 0.61,
        pdcaasScore: 0.63,
        description: 'Complete plant protein with healthy fats'
    },
    {
        id: generateId('Spirulina'),
        name: 'Spirulina',
        category: ProteinCategory.SUPPLEMENT,
        diaasScore: 0.69,
        pdcaasScore: 0.68,
        description: 'Blue-green algae protein'
    },
    {
        id: generateId('Lentils (Cooked)'),
        name: 'Lentils (Cooked)',
        category: ProteinCategory.PLANT,
        diaasScore: 0.63,
        pdcaasScore: 0.52,
        description: 'High-fiber legume protein'
    },
    {
        id: generateId('Chickpeas (Cooked)'),
        name: 'Chickpeas (Cooked)',
        category: ProteinCategory.PLANT,
        diaasScore: 0.58,
        pdcaasScore: 0.71,
        description: 'Versatile legume protein'
    },
    {
        id: generateId('Black Beans (Cooked)'),
        name: 'Black Beans (Cooked)',
        category: ProteinCategory.PLANT,
        diaasScore: 0.56,
        pdcaasScore: 0.65,
        description: 'High-fiber bean protein'
    },
    {
        id: generateId('Pea Protein'),
        name: 'Pea Protein',
        category: ProteinCategory.SUPPLEMENT,
        diaasScore: 0.67,
        pdcaasScore: 0.69,
        description: 'Popular plant protein powder'
    },
    {
        id: generateId('Brown Rice Protein'),
        name: 'Brown Rice Protein',
        category: ProteinCategory.SUPPLEMENT,
        diaasScore: 0.42,
        pdcaasScore: 0.55,
        description: 'Hypoallergenic grain protein'
    },
    {
        id: generateId('Almonds'),
        name: 'Almonds',
        category: ProteinCategory.PLANT,
        diaasScore: 0.40,
        pdcaasScore: 0.52,
        description: 'Nut protein with healthy fats'
    },
    {
        id: generateId('Peanuts'),
        name: 'Peanuts',
        category: ProteinCategory.PLANT,
        diaasScore: 0.43,
        pdcaasScore: 0.52,
        description: 'Legume with moderate protein quality'
    },
    {
        id: generateId('Chia Seeds'),
        name: 'Chia Seeds',
        category: ProteinCategory.PLANT,
        diaasScore: 0.58,
        description: 'Seeds with omega-3 fatty acids'
    },
    {
        id: generateId('Pumpkin Seeds'),
        name: 'Pumpkin Seeds',
        category: ProteinCategory.PLANT,
        diaasScore: 0.46,
        description: 'Mineral-rich seed protein'
    },

    // MARK: - Dairy Products
    {
        id: generateId('Cottage Cheese'),
        name: 'Cottage Cheese',
        category: ProteinCategory.DAIRY,
        diaasScore: 1.16,
        pdcaasScore: 1.0,
        description: 'High-casein dairy protein'
    },
    {
        id: generateId('Cheddar Cheese'),
        name: 'Cheddar Cheese',
        category: ProteinCategory.DAIRY,
        diaasScore: 1.12,
        pdcaasScore: 1.0,
        description: 'Complete dairy protein'
    },
    {
        id: generateId('Casein Protein'),
        name: 'Casein Protein',
        category: ProteinCategory.SUPPLEMENT,
        diaasScore: 1.14,
        pdcaasScore: 1.0,
        description: 'Slow-digesting complete protein'
    },

    // MARK: - Grains & Cereals
    {
        id: generateId('Oats'),
        name: 'Oats',
        category: ProteinCategory.PLANT,
        diaasScore: 0.54,
        pdcaasScore: 0.57,
        description: 'Whole grain with moderate protein'
    },
    {
        id: generateId('Wheat (Whole)'),
        name: 'Wheat (Whole)',
        category: ProteinCategory.PLANT,
        diaasScore: 0.45,
        pdcaasScore: 0.54,
        description: 'Cereal grain protein'
    },
    {
        id: generateId('Barley'),
        name: 'Barley',
        category: ProteinCategory.PLANT,
        diaasScore: 0.56,
        description: 'Ancient grain protein'
    },

    // MARK: - Other Supplements
    {
        id: generateId('Collagen Peptides'),
        name: 'Collagen Peptides',
        category: ProteinCategory.SUPPLEMENT,
        diaasScore: 0.37,
        description: 'Incomplete protein for skin/joint health'
    },
    {
        id: generateId('BCAA Powder'),
        name: 'BCAA Powder',
        category: ProteinCategory.SUPPLEMENT,
        description: 'Branched-chain amino acids only'
    },

    // MARK: - Seafood
    {
        id: generateId('Tuna (Canned)'),
        name: 'Tuna (Canned)',
        category: ProteinCategory.MEAT,
        diaasScore: 1.08,
        pdcaasScore: 1.0,
        description: 'Lean fish protein'
    },
    {
        id: generateId('Sardines'),
        name: 'Sardines',
        category: ProteinCategory.MEAT,
        diaasScore: 1.05,
        pdcaasScore: 1.0,
        description: 'Small fish with complete protein'
    },
    {
        id: generateId('Shrimp'),
        name: 'Shrimp',
        category: ProteinCategory.MEAT,
        diaasScore: 1.09,
        pdcaasScore: 1.0,
        description: 'Low-fat seafood protein'
    },

    // MARK: - Vegetables
    {
        id: generateId('Broccoli'),
        name: 'Broccoli',
        category: ProteinCategory.PLANT,
        diaasScore: 0.58,
        description: 'Vegetable with moderate protein'
    },
    {
        id: generateId('Spinach'),
        name: 'Spinach',
        category: ProteinCategory.PLANT,
        diaasScore: 0.51,
        description: 'Leafy green with some protein'
    }
];

export class ProteinSourcesDatabase {
    private static instance: ProteinSourcesDatabase;

    static getInstance(): ProteinSourcesDatabase {
        if (!ProteinSourcesDatabase.instance) {
            ProteinSourcesDatabase.instance = new ProteinSourcesDatabase();
        }
        return ProteinSourcesDatabase.instance;
    }

    private constructor() { }

    getAllSources(): ProteinSource[] {
        return [...proteinSources].sort((a, b) => a.name.localeCompare(b.name));
    }

    getSources(category: ProteinCategory): ProteinSource[] {
        if (category === ProteinCategory.ALL) {
            return this.getAllSources();
        }
        return proteinSources
            .filter(source => source.category === category)
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    searchSources(query: string, category: ProteinCategory = ProteinCategory.ALL): ProteinSource[] {
        const sources = this.getSources(category);

        if (!query.trim()) {
            return sources;
        }

        const lowercaseQuery = query.toLowerCase();
        return sources.filter(source =>
            source.name.toLowerCase().includes(lowercaseQuery) ||
            source.description?.toLowerCase().includes(lowercaseQuery)
        );
    }

    getHighestQualitySources(limit = 10): ProteinSource[] {
        return [...proteinSources]
            .sort((a, b) => {
                const scoreA = a.diaasScore ?? a.pdcaasScore ?? 0;
                const scoreB = b.diaasScore ?? b.pdcaasScore ?? 0;
                return scoreB - scoreA;
            })
            .slice(0, limit);
    }

    findSourceById(id: string): ProteinSource | undefined {
        return proteinSources.find(source => source.id === id);
    }
}

export const proteinDatabase = ProteinSourcesDatabase.getInstance();