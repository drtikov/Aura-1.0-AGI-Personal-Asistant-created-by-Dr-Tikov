// core/heuristicClassifier.ts
// FIX: Imported missing types PuzzleFeatures and PuzzleArchetype
import { PuzzleFeatures, PuzzleArchetype } from '../types.ts';

interface HeuristicResult {
    archetype: PuzzleArchetype;
    confidence: number;
}

/**
 * Performs a lightweight, rule-based classification of an ARC puzzle based on its features.
 * This is the first step in the hybrid classification system.
 * @param features The extracted features of the puzzle.
 * @returns A classification result with an archetype and confidence score.
 */
export const classifyHeuristically = (features: PuzzleFeatures): HeuristicResult => {
    const desc = features.overall_description.toLowerCase();

    // Heuristic for BorderKeyRecoloring
    if (desc.includes('border') || desc.includes('edge') || desc.includes('frame') || desc.includes('outer')) {
        if (desc.includes('color') || desc.includes('recolor') || desc.includes('palette')) {
            return { archetype: 'BorderKeyRecoloring', confidence: 0.8 };
        }
    }

    // Heuristic for ObjectCounting
    if (desc.includes('count') || desc.includes('number of objects') || desc.includes('quantity')) {
        return { archetype: 'ObjectCounting', confidence: 0.85 };
    }
    
    // Heuristic for PatternCompletion
    if (desc.includes('pattern') || desc.includes('repeat') || desc.includes('sequence') || desc.includes('complete the')) {
        return { archetype: 'PatternCompletion', confidence: 0.75 };
    }
    
    // Heuristic for Symmetry
    if (desc.includes('symmetry') || desc.includes('symmetric') || desc.includes('reflection') || desc.includes('mirror')) {
        return { archetype: 'Symmetry', confidence: 0.9 };
    }

    // Default case if no strong heuristics match
    return { archetype: 'UNKNOWN', confidence: 0.1 };
};