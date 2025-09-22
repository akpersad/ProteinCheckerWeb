'use client';

import React from 'react';
import { useProtein } from '@/contexts/ProteinContext';
import { formatProteinAmount, formatPercentage, getPercentageColorClass } from '@/utils/proteinCalculations';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import MultiProteinSourcePicker from '@/components/MultiProteinSourcePicker';
import { ExclamationTriangleIcon, CalculatorIcon } from '@heroicons/react/24/outline';

export default function CalculatorPage() {
  const {
    state,
    setStatedProtein,
    setDvPercentage,
    setProteinSources,
    calculateProtein,
    resetCalculator,
    setError
  } = useProtein();


  const validSources = state.proteinSources.filter(ps => ps.source);
  const canCalculate =
    state.statedProtein.trim() !== '' &&
    validSources.length > 0 &&
    !isNaN(parseFloat(state.statedProtein)) &&
    parseFloat(state.statedProtein) > 0;

  const handleCalculate = () => {
    if (!canCalculate) {
      setError('Please enter a valid protein amount and select at least one protein source');
      return;
    }
    calculateProtein();
  };

  const handleReset = () => {
    resetCalculator();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center relative">
          <div className="floating">
            <div className="inline-block p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                <CalculatorIcon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-6xl mb-4">
            <span className="text-white drop-shadow-lg">Protein Quality Calculator</span>
          </h1>
          <p className="mt-4 text-xl text-white max-w-3xl mx-auto font-medium drop-shadow-md">
            Calculate quality-adjusted protein using scientific DIAAS/PDCAAS scores for optimal nutrition planning
          </p>
        </div>

        {/* Input Section */}
        <Card variant="elevated" className="p-8 animate-fadeIn">
          <div className="space-y-8">
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
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Protein Sources
              </label>
              <MultiProteinSourcePicker
                proteinSources={state.proteinSources}
                onSourcesChange={setProteinSources}
                error={state.error ?? undefined}
              />
            </div>

            {/* Additional error display for general errors not handled by MultiProteinSourcePicker */}
            {state.error && !state.error.toLowerCase().includes('percentage') && !state.error.toLowerCase().includes('protein source') && (
              <div className="flex items-center gap-3 p-4 bg-red-50/90 border-2 border-red-200 rounded-xl backdrop-blur-sm shadow-md animate-fadeIn">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">{state.error}</p>
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
          <Card variant="elevated" className="p-8 animate-fadeIn">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Your Results</h2>
                <div className="w-16 h-1 gradient-primary rounded-full mx-auto mt-2"></div>

                {/* Display protein sources used */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Protein Sources Used:</div>
                  {validSources.length === 1 ? (
                    <div className="text-gray-900 font-semibold">
                      {validSources[0].source.name}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-800 space-y-1">
                      {validSources.map((ps, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{ps.source.name}</span>
                          {ps.percentage && (
                            <span className="font-medium text-blue-600">
                              {ps.percentage.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Main Result */}
                <div className="gradient-success p-6 rounded-2xl text-white shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-sm font-semibold opacity-90">Quality-Adjusted Protein</div>
                  <div className="text-3xl font-bold mt-2">
                    {formatProteinAmount(state.calculationResult.qualityAdjustedProtein)}
                  </div>
                  <div className="text-xs opacity-80 mt-2">
                    Based on {state.calculationResult.calculationMethod} score
                  </div>
                </div>

                {/* Quality Percentage */}
                <div className="card-modern p-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-sm text-gray-600 font-semibold">Protein Quality</div>
                  <div className={`text-3xl font-bold mt-2 ${getPercentageColorClass(state.calculationResult.proteinQualityPercentage)}`}>
                    {formatPercentage(state.calculationResult.proteinQualityPercentage)}
                  </div>
                </div>

                {/* Score Used */}
                <div className="card-modern p-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300">
                  <div className="text-sm text-gray-600 font-semibold">
                    {state.calculationResult.calculationMethod} Score
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mt-2">
                    {state.calculationResult.scoreUsed.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* DV Adjustment */}
              {state.calculationResult.adjustedProtein && (
                <div className="gradient-warning p-6 rounded-2xl text-white shadow-xl animate-fadeIn">
                  <div className="text-sm font-semibold opacity-90">DV% Adjusted Amount</div>
                  <div className="text-2xl font-bold mt-2">
                    {formatProteinAmount(state.calculationResult.adjustedProtein)}
                  </div>
                </div>
              )}

              {/* DV Discrepancy Warning */}
              {state.calculationResult.dvDiscrepancy && state.calculationResult.dvDiscrepancy > 0.5 && (
                <div className="flex items-start gap-4 p-5 bg-orange-50/90 border-2 border-orange-200 rounded-xl backdrop-blur-sm shadow-md animate-fadeIn">
                  <ExclamationTriangleIcon className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-orange-800 font-semibold">Discrepancy Notice</p>
                    <p className="text-sm text-orange-700 mt-1 font-medium">
                      Stated protein differs from DV% by {formatProteinAmount(state.calculationResult.dvDiscrepancy)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Quick Tips */}
        <Card variant="outlined" className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Tips</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 hover:scale-105 transition-all duration-300">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">DIAAS vs PDCAAS</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                DIAAS is more accurate and can exceed 1.0, while PDCAAS is capped at 1.0. We use DIAAS when available.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 hover:scale-105 transition-all duration-300">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">Daily Value %</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                Using the DV% from nutrition labels often provides more accurate calculations than stated protein amounts.
              </p>
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
}