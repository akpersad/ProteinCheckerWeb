'use client';

import React, { useState } from 'react';
import { useProtein } from '@/contexts/ProteinContext';
import { formatProteinAmount, formatPercentage, getPercentageColorClass } from '@/utils/proteinCalculations';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ProteinSourcePicker from '@/components/ProteinSourcePicker';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function CalculatorPage() {
  const {
    state,
    setStatedProtein,
    setDvPercentage,
    setSelectedProteinSource,
    calculateProtein,
    resetCalculator,
    setError
  } = useProtein();

  const [showProteinPicker, setShowProteinPicker] = useState(false);

  const canCalculate =
    state.statedProtein.trim() !== '' &&
    state.selectedProteinSource !== null &&
    !isNaN(parseFloat(state.statedProtein)) &&
    parseFloat(state.statedProtein) > 0;

  const handleCalculate = () => {
    if (!canCalculate) {
      setError('Please enter a valid protein amount and select a protein source');
      return;
    }
    calculateProtein();
  };

  const handleReset = () => {
    resetCalculator();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Protein Quality Calculator
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate quality-adjusted protein using DIAAS/PDCAAS scores
          </p>
        </div>

        {/* Input Section */}
        <Card variant="elevated" className="p-6">
          <div className="space-y-6">
            {/* Protein Amount Input */}
            <Input
              type="number"
              step="0.1"
              min="0"
              label="Protein Amount"
              value={state.statedProtein}
              onChange={(e) => setStatedProtein(e.target.value)}
              placeholder="Enter protein grams"
              suffix="g"
            />

            {/* DV Percentage Input */}
            <Input
              type="number"
              step="0.1"
              min="0"
              max="1000"
              label="Daily Value % (Optional)"
              value={state.dvPercentage}
              onChange={(e) => setDvPercentage(e.target.value)}
              placeholder="e.g., 25"
              suffix="%"
              helper="If provided, DV% will be used to calculate protein amount"
            />

            {/* Protein Source Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protein Source
              </label>
              <button
                type="button"
                onClick={() => setShowProteinPicker(true)}
                className="w-full p-4 text-left bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className={state.selectedProteinSource ? 'text-gray-900' : 'text-gray-500'}>
                    {state.selectedProteinSource?.name || 'Select protein source'}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Error Display */}
            {state.error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleCalculate}
                disabled={!canCalculate || state.isLoading}
                isLoading={state.isLoading}
                className="flex-1"
              >
                Calculate Quality-Adjusted Protein
              </Button>
              {(state.calculationResult || state.statedProtein || state.dvPercentage || state.selectedProteinSource) && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Results Section */}
        {state.calculationResult && (
          <Card variant="elevated" className="p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Results</h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Main Result */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Quality-Adjusted Protein</div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {formatProteinAmount(state.calculationResult.qualityAdjustedProtein)}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Based on {state.calculationResult.calculationMethod} score
                  </div>
                </div>

                {/* Quality Percentage */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 font-medium">Protein Quality</div>
                  <div className={`text-2xl font-bold mt-1 ${getPercentageColorClass(state.calculationResult.proteinQualityPercentage)}`}>
                    {formatPercentage(state.calculationResult.proteinQualityPercentage)}
                  </div>
                </div>

                {/* Score Used */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 font-medium">
                    {state.calculationResult.calculationMethod} Score
                  </div>
                  <div className="text-2xl font-bold text-gray-700 mt-1">
                    {state.calculationResult.scoreUsed.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* DV Adjustment */}
              {state.calculationResult.adjustedProtein && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">DV% Adjusted Amount</div>
                  <div className="text-xl font-bold text-orange-700 mt-1">
                    {formatProteinAmount(state.calculationResult.adjustedProtein)}
                  </div>
                </div>
              )}

              {/* DV Discrepancy Warning */}
              {state.calculationResult.dvDiscrepancy && state.calculationResult.dvDiscrepancy > 0.5 && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-orange-800 font-medium">Discrepancy Notice</p>
                    <p className="text-sm text-orange-700 mt-1">
                      Stated protein differs from DV% by {formatProteinAmount(state.calculationResult.dvDiscrepancy)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Quick Tips */}
        <Card variant="outlined" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">DIAAS vs PDCAAS</h4>
              <p className="text-sm text-gray-600">
                DIAAS is more accurate and can exceed 1.0, while PDCAAS is capped at 1.0. We use DIAAS when available.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Daily Value %</h4>
              <p className="text-sm text-gray-600">
                Using the DV% from nutrition labels often provides more accurate calculations than stated protein amounts.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Protein Source Picker Modal */}
      <ProteinSourcePicker
        isOpen={showProteinPicker}
        onClose={() => setShowProteinPicker(false)}
        selectedSource={state.selectedProteinSource}
        onSelectSource={setSelectedProteinSource}
      />
    </div>
  );
}