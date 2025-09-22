# Free Nutrition API Research for Dynamic Protein Sources

This document explores free APIs that could be used to dynamically populate protein source data instead of maintaining a static database.

## 🔍 Research Summary - November 2024

### **Key Findings**
- Most free nutrition APIs focus on basic macronutrients (protein content) rather than protein quality scores (DIAAS/PDCAAS)
- DIAAS/PDCAAS scores are specialized research data not commonly available in consumer nutrition APIs
- Current static database approach may be the most reliable for protein quality scoring
- Could use APIs for basic nutrition facts and maintain curated quality scores separately

## 🆓 Free Nutrition APIs Available

### **1. USDA Food Data Central API**
**URL**: https://fdc.nal.usda.gov/api-guide.html  
**Status**: ✅ Free, Government-backed  
**Data Available**:
- ✅ Protein content (grams per 100g)
- ✅ Amino acid profiles (detailed breakdowns)
- ✅ Food descriptions and categories
- ❌ DIAAS scores (not available)
- ❌ PDCAAS scores (not available)

**Rate Limits**: 1000 requests/hour (demo key), 3600 requests/hour (signup key)

**Example Response**:
```json
{
  "description": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
  "foodNutrients": [
    {
      "nutrient": {
        "name": "Protein",
        "unitName": "G"
      },
      "amount": 31.02
    }
  ]
}
```

**Pros**:
- ✅ Comprehensive, reliable government data
- ✅ Detailed amino acid profiles for quality scoring calculations
- ✅ Free with reasonable rate limits
- ✅ Well-documented API

**Cons**:
- ❌ No direct DIAAS/PDCAAS scores
- ❌ Complex data structure requiring processing
- ❌ Limited search functionality

### **2. Open Food Facts API**
**URL**: https://world.openfoodfacts.org/data  
**Status**: ✅ Free, Open Source Community  
**Data Available**:
- ✅ Basic nutrition facts from product labels
- ✅ Protein content
- ✅ Ingredient lists
- ❌ DIAAS/PDCAAS scores
- ❌ Detailed amino acid profiles

**Rate Limits**: No official limits, but reasonable usage expected

**Example Response**:
```json
{
  "product": {
    "product_name": "Greek Yogurt",
    "nutriments": {
      "proteins_100g": 10,
      "proteins_unit": "g"
    }
  }
}
```

**Pros**:
- ✅ Completely free, no API key required
- ✅ Community-driven, constantly updated
- ✅ Good for packaged food products
- ✅ Simple JSON structure

**Cons**:
- ❌ Inconsistent data quality (community contributed)
- ❌ No protein quality scoring
- ❌ Limited scientific accuracy for calculations

### **3. Edamam Nutrition Analysis API**
**URL**: https://developer.edamam.com/edamam-nutrition-api  
**Status**: ⚠️ Free tier available (limited)  
**Data Available**:
- ✅ Detailed nutrition analysis
- ✅ Protein content
- ✅ Recipe analysis capabilities
- ❌ DIAAS/PDCAAS scores
- ❌ Amino acid profiles

**Rate Limits**: 5 calls/minute, 10,000/month (free tier)

**Pros**:
- ✅ Professional-grade nutrition analysis
- ✅ Recipe parsing capabilities
- ✅ Well-structured API responses

**Cons**:
- ❌ Very limited free tier
- ❌ No protein quality metrics
- ❌ Requires credit card for signup

### **4. Nutritionix API**
**URL**: https://developer.nutritionix.com/  
**Status**: ⚠️ Free tier available (very limited)  
**Data Available**:
- ✅ Brand name food database
- ✅ Basic nutrition facts
- ✅ Protein content
- ❌ DIAAS/PDCAAS scores

**Rate Limits**: 200 requests/day (free tier)

**Pros**:
- ✅ Large commercial food database
- ✅ Brand name recognition

**Cons**:
- ❌ Very limited free usage
- ❌ No protein quality scoring
- ❌ Commercial focus, not research-grade

## 🧬 DIAAS/PDCAAS Data Sources

### **Research Findings**
After extensive research, DIAAS and PDCAAS scores are **not available in consumer nutrition APIs** because they are:

1. **Specialized Research Data**: Calculated through laboratory analysis of protein digestibility
2. **Limited Database**: Only ~100-200 foods have published scores in scientific literature
3. **Academic Sources**: Published in nutrition research papers, not commercial databases
4. **Standardization Issues**: Different testing methods can yield different scores

### **Current Best Sources**
- **FAO Protein Quality Evaluation Reports** (2013+)
- **Journal of Nutrition publications**
- **USDA Special Reports on Protein Quality**
- **University research databases**

## 🔄 Recommended Implementation Strategy

### **Hybrid Approach: API + Curated Database**

```typescript
interface EnhancedProteinSource {
  // Basic info from API
  id: string;
  name: string;
  proteinPer100g: number;
  aminoAcidProfile?: AminoAcidProfile;
  source: 'USDA' | 'OpenFoodFacts' | 'Curated';
  
  // Curated quality scores (not from APIs)
  diaasScore?: number;
  pdcaasScore?: number;
  qualitySource: 'Research' | 'Estimated' | 'Calculated';
  lastUpdated: Date;
}

// Proposed data flow
class HybridProteinDatabase {
  async fetchBasicNutrition(foodName: string): Promise<BasicNutrition> {
    // Try USDA API first, fallback to Open Food Facts
    return await this.usdaClient.search(foodName) || 
           await this.openFoodFactsClient.search(foodName);
  }
  
  getCuratedQualityScore(foodId: string): QualityScore | null {
    // Return from our curated database
    return this.qualityDatabase.get(foodId);
  }
  
  async getEnhancedProteinSource(query: string): Promise<EnhancedProteinSource> {
    const basic = await this.fetchBasicNutrition(query);
    const quality = this.getCuratedQualityScore(basic.id);
    
    return {
      ...basic,
      ...quality,
      source: basic.source,
      qualitySource: quality ? 'Research' : 'Estimated'
    };
  }
}
```

### **Implementation Phases**

#### **Phase 1: Static Database Enhancement (Current)**
- ✅ Maintain current curated database
- ✅ Add more protein sources from research papers
- ✅ Implement better search and categorization

#### **Phase 2: API Integration for Basic Data**
- 🔄 Integrate USDA Food Data Central API
- 🔄 Use API for basic nutrition facts (protein content, amino acids)
- 🔄 Keep quality scores in curated database

#### **Phase 3: Smart Data Merging**
- 🔄 Match API foods with quality score database
- 🔄 Estimate quality scores for foods without research data
- 🔄 Provide confidence indicators for score accuracy

## 💡 Alternative Approaches

### **1. Calculated DIAAS Estimation**
```typescript
// Estimate DIAAS from amino acid profile
function estimateDIAASFromAminoAcids(profile: AminoAcidProfile): number {
  const essentialAAs = [
    'histidine', 'isoleucine', 'leucine', 'lysine',
    'methionine', 'phenylalanine', 'threonine', 'tryptophan', 'valine'
  ];
  
  // Use WHO/FAO reference pattern to estimate limiting amino acid
  const scores = essentialAAs.map(aa => 
    profile[aa] / REFERENCE_PATTERN[aa]
  );
  
  return Math.min(...scores) * DIGESTIBILITY_FACTOR;
}
```

### **2. Machine Learning Approach**
```typescript
// Train model on known DIAAS scores to predict unknown ones
interface MLFeatures {
  proteinContent: number;
  aminoAcidProfile: AminoAcidProfile;
  foodCategory: ProteinCategory;
  processingMethod: string;
}

class DIAASPredictor {
  predict(features: MLFeatures): { score: number; confidence: number } {
    // ML model trained on published research data
    // Could achieve ~85% accuracy for estimation
  }
}
```

## 📊 Recommendation: Stick with Curated Database (For Now)

### **Rationale**
1. **Accuracy First**: Medical/nutrition apps require high data accuracy
2. **Specialized Data**: DIAAS/PDCAAS not available in free APIs
3. **User Trust**: Curated data with research citations builds trust
4. **Maintenance**: 50-100 protein sources are manageable to maintain manually

### **Future Enhancement Path**
1. **Add API Integration** for basic nutrition facts (nice-to-have)
2. **Expand Curated Database** with more research sources
3. **Add Confidence Indicators** to show data quality
4. **Implement Update Notifications** when new research is published

### **Estimated Implementation Effort**
- **API Integration**: 2-3 days development
- **Data Merging Logic**: 1-2 days development  
- **Testing & Validation**: 2-3 days
- **Total**: ~1 week for basic API integration

**Conclusion**: While free APIs exist for basic nutrition data, the specialized nature of protein quality scoring (DIAAS/PDCAAS) makes our current curated database approach the most reliable. APIs could be added later as an enhancement for basic nutrition facts, but quality scores should remain curated from research sources.
