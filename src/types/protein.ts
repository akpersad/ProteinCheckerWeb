/** @format */

// Core protein models matching Swift structures

export interface AminoAcidProfile {
  histidine: number;
  isoleucine: number;
  leucine: number;
  lysine: number;
  methionine: number;
  phenylalanine: number;
  threonine: number;
  tryptophan: number;
  valine: number;
}

export enum ProteinCategory {
  ALL = "all",
  MEAT = "meat",
  DAIRY = "dairy",
  PLANT = "plant",
  SUPPLEMENT = "supplement",
  OTHER = "other",
}

export const ProteinCategoryDisplay: Record<ProteinCategory, string> = {
  [ProteinCategory.ALL]: "All Sources",
  [ProteinCategory.MEAT]: "Meat & Fish",
  [ProteinCategory.DAIRY]: "Dairy & Eggs",
  [ProteinCategory.PLANT]: "Plant Sources",
  [ProteinCategory.SUPPLEMENT]: "Supplements",
  [ProteinCategory.OTHER]: "Other",
};

export interface ProteinSource {
  id: string;
  name: string;
  category: ProteinCategory;
  diaasScore?: number;
  pdcaasScore?: number;
  aminoAcidProfile?: AminoAcidProfile;
  description?: string;
}

export interface ProteinSourceWithPercentage {
  source: ProteinSource;
  percentage?: number; // Optional percentage (0-100)
}

export interface ProteinSourceValidation {
  isValid: boolean;
  errors: string[];
  totalPercentage?: number;
}

export enum CalculationMethod {
  DIAAS = "DIAAS",
  PDCAAS = "PDCAAS",
}

export interface CalculationInput {
  statedProtein: number;
  dvPercentage?: number;
  proteinSource?: ProteinSource; // Keep for backward compatibility
  proteinSources?: ProteinSourceWithPercentage[]; // New multi-source support
}

export interface CalculationResult {
  qualityAdjustedProtein: number;
  proteinQualityPercentage: number;
  calculationMethod: CalculationMethod;
  adjustedProtein?: number;
  scoreUsed: number;
  dvDiscrepancy?: number;
}

export interface ProteinCalculation {
  id: string;
  statedProtein: number;
  dvPercentage?: number;
  proteinSource?: ProteinSource; // Keep for backward compatibility
  proteinSources?: ProteinSourceWithPercentage[]; // New multi-source support
  digestibleProtein: number; // Keep for backwards compatibility
  digestibilityPercentage: number; // Keep for backwards compatibility
  calculationMethod: CalculationMethod;
  timestamp: Date;
}

export enum QualityRating {
  EXCELLENT = "Excellent",
  HIGH = "High",
  GOOD = "Good",
  FAIR = "Fair",
  POOR = "Poor",
  INCOMPLETE = "Incomplete",
}

export interface ProteinQualityRating {
  rating: QualityRating;
  description: string;
}

export interface CalculationStatistics {
  totalCalculations: number;
  averageStatedProtein: number;
  averageQualityAdjustedProtein: number;
  mostUsedSources: Array<[string, number]>;
}

export enum EducationTopic {
  OVERVIEW = "overview",
  DIAAS = "diaas",
  PDCAAS = "pdcaas",
  PROTEIN_SOURCES = "protein_sources",
  PRACTICAL_TIPS = "practical_tips",
}

export const EducationTopicDisplay: Record<EducationTopic, string> = {
  [EducationTopic.OVERVIEW]: "Overview",
  [EducationTopic.DIAAS]: "DIAAS Score",
  [EducationTopic.PDCAAS]: "PDCAAS Score",
  [EducationTopic.PROTEIN_SOURCES]: "Protein Sources",
  [EducationTopic.PRACTICAL_TIPS]: "Practical Tips",
};

export const QualityRatingColors: Record<QualityRating, string> = {
  [QualityRating.EXCELLENT]: "#344E41",
  [QualityRating.HIGH]: "#3A5A40",
  [QualityRating.GOOD]: "#527A51",
  [QualityRating.FAIR]: "#A3B18A",
  [QualityRating.POOR]: "#DAD7CD",
  [QualityRating.INCOMPLETE]: "#B71C1C",
};
