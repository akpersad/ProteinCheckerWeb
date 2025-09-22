'use client';

import React, { useState } from 'react';
import { EducationTopic, EducationTopicDisplay } from '@/types/protein';
import { proteinDatabase } from '@/data/proteinSources';
import { getScoreColor } from '@/utils/proteinCalculations';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { BookOpenIcon } from '@heroicons/react/24/outline';

export default function EducationPage() {
    const [selectedTopic, setSelectedTopic] = useState<EducationTopic>(EducationTopic.OVERVIEW);

    const topics = [
        EducationTopic.OVERVIEW,
        EducationTopic.DIAAS,
        EducationTopic.PDCAAS,
        EducationTopic.PROTEIN_SOURCES,
        EducationTopic.PRACTICAL_TIPS
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="floating">
                        <div className="inline-block p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
                            <BookOpenIcon className="w-16 h-16 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white sm:text-6xl mb-4">
                        <span className="text-white drop-shadow-lg">Learn About</span>
                        <br />
                        <span className="text-white drop-shadow-lg">Protein</span>
                    </h1>
                    <p className="mt-4 text-xl text-white max-w-3xl mx-auto font-medium drop-shadow-md">
                        Understanding protein quality and how to optimize your nutrition
                    </p>
                </div>

                {/* Topic Selector */}
                <Card variant="elevated" className="p-6">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {topics.map((topic) => (
                            <Button
                                key={topic}
                                variant={selectedTopic === topic ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedTopic(topic)}
                                className="whitespace-nowrap"
                            >
                                {EducationTopicDisplay[topic]}
                            </Button>
                        ))}
                    </div>
                </Card>

                {/* Content Area */}
                <div className="space-y-8">
                    {selectedTopic === EducationTopic.OVERVIEW && <OverviewContent />}
                    {selectedTopic === EducationTopic.DIAAS && <DIAASContent />}
                    {selectedTopic === EducationTopic.PDCAAS && <PDCAASContent />}
                    {selectedTopic === EducationTopic.PROTEIN_SOURCES && <ProteinSourcesContent />}
                    {selectedTopic === EducationTopic.PRACTICAL_TIPS && <PracticalTipsContent />}
                </div>
            </div>
        </div>
    );
}

function EducationCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card variant="elevated" className="p-8 hover:scale-[1.01] transition-all duration-300 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
            <div className="prose prose-sm max-w-none text-gray-800">
                {children}
            </div>
        </Card>
    );
}

function OverviewContent() {
    return (
        <div className="space-y-6">
            <EducationCard title="What is Protein Quality?">
                <p>
                    Protein quality refers to how well a protein provides the essential amino acids your body needs.
                    It&apos;s determined by two main factors:
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-1">
                    <li><strong>Amino Acid Profile</strong>: Does it contain all essential amino acids?</li>
                    <li><strong>Digestibility</strong>: How well can your body absorb and use it?</li>
                </ul>
                <p className="mt-3">
                    DIAAS and PDCAAS are scientific methods to measure these factors.
                </p>
            </EducationCard>

            <EducationCard title="Why Does This Matter?">
                <p>Understanding protein quality helps you:</p>
                <ul className="list-disc ml-6 mt-3 space-y-1">
                    <li>Make informed dietary choices</li>
                    <li>Ensure adequate amino acid intake</li>
                    <li>Optimize muscle protein synthesis</li>
                    <li>Plan balanced meals effectively</li>
                </ul>
                <p className="mt-3 font-medium text-blue-600">Not all proteins are created equal!</p>
            </EducationCard>

            <EducationCard title="How to Use This App">
                <ol className="list-decimal ml-6 space-y-2">
                    <li><strong>Enter</strong> the protein amount from your food label</li>
                    <li><strong>Add</strong> Daily Value % if available (more accurate)</li>
                    <li><strong>Select</strong> your protein source from our database</li>
                    <li><strong>Calculate</strong> to see the quality-adjusted protein amount</li>
                    <li><strong>Review</strong> your history to track patterns</li>
                </ol>
                <p className="mt-3">
                    The app uses scientific DIAAS/PDCAAS scores for accuracy.
                </p>
            </EducationCard>
        </div>
    );
}

function DIAASContent() {
    return (
        <div className="space-y-6">
            <EducationCard title="What is DIAAS?">
                <p>
                    <strong>Digestible Indispensable Amino Acid Score (DIAAS)</strong> is the gold standard
                    for measuring protein quality, recommended by the FAO since 2013.
                </p>
                <p className="mt-3">DIAAS measures:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Individual amino acid digestibility</li>
                    <li>Limiting amino acid content</li>
                    <li>Real absorption at the end of the small intestine</li>
                </ul>
            </EducationCard>

            <EducationCard title="DIAAS Score Interpretation">
                <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="font-semibold text-green-800">Excellent (≥1.0)</div>
                        <div className="text-green-700 text-sm">Complete, high-quality protein</div>
                        <div className="text-green-600 text-sm mt-1">
                            Examples: Whey (1.25), Milk (1.18), Eggs (1.13)
                        </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="font-semibold text-orange-800">Good (0.8-0.99)</div>
                        <div className="text-orange-700 text-sm">High-quality with minor limitations</div>
                        <div className="text-orange-600 text-sm mt-1">
                            Examples: Soy protein (0.90), Tofu (0.87)
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="font-semibold text-yellow-800">Fair (0.6-0.79)</div>
                        <div className="text-yellow-700 text-sm">Moderate quality, some limitations</div>
                        <div className="text-yellow-600 text-sm mt-1">
                            Examples: Quinoa (0.84), Hemp seeds (0.61)
                        </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                        <div className="font-semibold text-red-800">Poor (&lt;0.6)</div>
                        <div className="text-red-700 text-sm">Significant amino acid limitations</div>
                        <div className="text-red-600 text-sm mt-1">
                            Examples: Rice protein (0.42), Almonds (0.40)
                        </div>
                    </div>
                </div>
            </EducationCard>

            <EducationCard title="Advantages of DIAAS">
                <ul className="list-disc ml-6 space-y-1">
                    <li>More accurate than PDCAAS</li>
                    <li>Measures actual absorption</li>
                    <li>Accounts for processing effects</li>
                    <li>Can exceed 1.0 (showing superior quality)</li>
                    <li>Considers individual amino acid digestibility</li>
                </ul>
            </EducationCard>
        </div>
    );
}

function PDCAASContent() {
    return (
        <div className="space-y-6">
            <EducationCard title="What is PDCAAS?">
                <p>
                    <strong>Protein Digestibility Corrected Amino Acid Score (PDCAAS)</strong> was the
                    previous gold standard for protein quality assessment (1989-2013).
                </p>
                <p className="mt-3">PDCAAS considers:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Amino acid composition</li>
                    <li>Overall protein digestibility</li>
                    <li>Limiting amino acid</li>
                </ul>
            </EducationCard>

            <EducationCard title="PDCAAS Limitations">
                <div className="bg-red-50 p-4 rounded-lg">
                    <ul className="list-disc ml-6 space-y-1 text-red-800">
                        <li>Capped at 1.0 (can&apos;t show superior quality)</li>
                        <li>Uses fecal digestibility (less accurate)</li>
                        <li>Assumes all amino acids digest equally</li>
                        <li>Doesn&apos;t account for processing effects</li>
                        <li>Overestimates some plant protein quality</li>
                    </ul>
                </div>
            </EducationCard>

            <EducationCard title="When We Use PDCAAS">
                <p>
                    This app uses PDCAAS as a fallback when DIAAS data isn&apos;t available.
                    Many protein sources still only have PDCAAS scores in scientific literature.
                </p>
                <p className="mt-3">
                    While less accurate than DIAAS, PDCAAS still provides valuable insight into
                    protein quality and is widely used in nutrition labeling.
                </p>
            </EducationCard>
        </div>
    );
}

function ProteinSourcesContent() {
    const topSources = proteinDatabase.getHighestQualitySources(8);

    return (
        <div className="space-y-6">
            <EducationCard title="Animal vs. Plant Proteins">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">Animal Proteins</h3>
                        <p className="text-blue-700 text-sm mb-2">Typically score higher because they:</p>
                        <ul className="list-disc ml-6 text-blue-600 text-sm space-y-1">
                            <li>Contain all essential amino acids</li>
                            <li>Have better digestibility</li>
                            <li>Match human amino acid needs closely</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">Plant Proteins</h3>
                        <p className="text-green-700 text-sm mb-2">Often score lower due to:</p>
                        <ul className="list-disc ml-6 text-green-600 text-sm space-y-1">
                            <li>Missing or limited amino acids</li>
                            <li>Lower digestibility</li>
                            <li>Anti-nutritional factors</li>
                        </ul>
                    </div>
                </div>
            </EducationCard>

            <Card variant="elevated" className="p-8 hover:scale-[1.01] transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Highest Quality Sources</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {topSources.map((source) => {
                        return (
                            <div key={source.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                                    {source.name}
                                </h3>
                                <p className="text-xs text-gray-600 mb-2">
                                    {source.category.charAt(0).toUpperCase() + source.category.slice(1)}
                                </p>
                                {source.diaasScore && (
                                    <div className="text-xs">
                                        <span className="text-gray-500">DIAAS: </span>
                                        <span
                                            className="font-semibold"
                                            style={{ color: getScoreColor(source.diaasScore) }}
                                        >
                                            {source.diaasScore.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {source.pdcaasScore && (
                                    <div className="text-xs">
                                        <span className="text-gray-500">PDCAAS: </span>
                                        <span
                                            className="font-semibold"
                                            style={{ color: getScoreColor(source.pdcaasScore) }}
                                        >
                                            {source.pdcaasScore.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <EducationCard title="Combining Plant Proteins">
                <p>You can improve plant protein quality by combining sources:</p>
                <div className="mt-3 space-y-2">
                    <div className="bg-green-50 p-3 rounded">
                        <strong className="text-green-800">Complementary Proteins:</strong>
                        <ul className="list-disc ml-6 mt-1 text-green-700 text-sm space-y-1">
                            <li>Rice + Beans = Complete amino acid profile</li>
                            <li>Peanut Butter + Whole Wheat = Better balance</li>
                            <li>Hummus + Pita = Improved quality</li>
                        </ul>
                    </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                    You don&apos;t need to combine at every meal - just throughout the day!
                </p>
            </EducationCard>
        </div>
    );
}

function PracticalTipsContent() {
    return (
        <div className="space-y-6">
            <EducationCard title="Reading Nutrition Labels">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-2">✅ Look for:</h3>
                        <ul className="list-disc ml-6 text-green-700 text-sm space-y-1">
                            <li>Protein grams per serving</li>
                            <li>Daily Value percentage (more accurate for calculations)</li>
                            <li>Ingredient list (identifies protein source)</li>
                        </ul>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-red-800 mb-2">🚩 Red Flags:</h3>
                        <ul className="list-disc ml-6 text-red-700 text-sm space-y-1">
                            <li>&quot;Protein blend&quot; without specifics</li>
                            <li>Very cheap protein powders</li>
                            <li>Missing amino acid information</li>
                        </ul>
                    </div>
                </div>
            </EducationCard>

            <EducationCard title="Daily Protein Needs">
                <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded">
                        <strong className="text-blue-800">General Population:</strong>
                        <span className="text-blue-700 ml-2">0.8g per kg body weight</span>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                        <strong className="text-purple-800">Active Individuals:</strong>
                        <span className="text-purple-700 ml-2">1.2-1.6g per kg body weight</span>
                    </div>
                    <div className="bg-orange-50 p-3 rounded">
                        <strong className="text-orange-800">Athletes/Bodybuilders:</strong>
                        <span className="text-orange-700 ml-2">1.6-2.2g per kg body weight</span>
                    </div>
                </div>
                <p className="mt-3 text-sm">
                    <strong>Example:</strong> 70kg person needs 56-154g protein daily
                </p>
                <p className="mt-2 font-medium text-blue-600">Quality matters as much as quantity!</p>
            </EducationCard>

            <EducationCard title="Meal Planning Tips">
                <ul className="list-disc ml-6 space-y-1">
                    <li>Include a high-quality protein at each meal</li>
                    <li>Combine different plant proteins throughout the day</li>
                    <li>Don&apos;t rely solely on supplements</li>
                    <li>Consider protein timing around workouts</li>
                    <li>Aim for 20-30g high-quality protein per meal</li>
                </ul>
            </EducationCard>

            <EducationCard title="Common Mistakes">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <span className="text-red-500 text-xl">❌</span>
                        <div>
                            <strong>Assuming all proteins are equal</strong>
                            <div className="text-sm text-gray-600 mt-1">✅ Check DIAAS/PDCAAS scores</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-red-500 text-xl">❌</span>
                        <div>
                            <strong>Only counting total grams</strong>
                            <div className="text-sm text-gray-600 mt-1">✅ Consider quality-adjusted amounts</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-red-500 text-xl">❌</span>
                        <div>
                            <strong>Ignoring Daily Value percentages</strong>
                            <div className="text-sm text-gray-600 mt-1">✅ Use DV% for more accurate calculations</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-red-500 text-xl">❌</span>
                        <div>
                            <strong>Not varying protein sources</strong>
                            <div className="text-sm text-gray-600 mt-1">✅ Diversify for complete nutrition</div>
                        </div>
                    </div>
                </div>
            </EducationCard>
        </div>
    );
}
