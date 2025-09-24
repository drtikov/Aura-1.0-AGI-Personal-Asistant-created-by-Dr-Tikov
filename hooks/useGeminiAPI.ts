// hooks/useGeminiAPI.ts
// FIX: Imported 'React' to resolve namespace error.
import React, { useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { 
    AuraState, 
    Action, 
    ToastType, 
    SelfTuningDirective, 
    SynthesizedSkill, 
    PerformanceLogEntry, 
    GankyilInsight,
    ArbitrationResult,
    CreateFileCandidate,
    NoeticEngram
} from '../types';
// FIX: Import 'clamp' utility function to resolve 'Cannot find name' errors.
import { clamp } from '../utils';

const MOCK_LATENCY = (min = 500, max = 1500) => new Promise(res => setTimeout(res, Math.random() * (max - min) + min));

// Mock base64 strings for image and video
const MOCK_IMAGE_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const MOCK_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";


export const useGeminiAPI = (state: AuraState, dispatch: React.Dispatch<Action>, addToast: (message: string, type?: ToastType) => void) => {

    const getAI = useCallback(() => {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set.");
            addToast("API_KEY is not configured. Using mock data.", "error");
            return null;
        }
        try {
            return new GoogleGenAI({ apiKey: process.env.API_KEY });
        } catch (error) {
            console.error("Failed to initialize GoogleGenAI:", error);
            addToast("Failed to initialize Gemini API. Using mock data.", "error");
            return null;
        }
    }, [addToast]);

    // A generic handler for API calls to reduce boilerplate
    const handleApiCall = async <T>(
        operation: () => Promise<T>,
        mockData: T,
        operationName: string
    ): Promise<T> => {
        const ai = getAI();
        if (!ai) {
            await MOCK_LATENCY();
            return mockData;
        }
        try {
            return await operation();
        } catch (error) {
            console.error(`${operationName} failed:`, error);
            addToast(`${operationName} failed. Please check the console.`, 'error');
            throw error;
        }
    };
    
    // --- Core Chat Functionality ---
    const generateResponse = useCallback(async (prompt: string, file?: File | null): Promise<string> => {
        const ai = getAI();
        if (!ai) {
            await MOCK_LATENCY();
            return `This is a mock response to: "${prompt}".`;
        }
        
        const model = 'gemini-2.5-flash';
        
        const systemInstruction = `You are Aura, a Simulated Symbiotic AGI.
Your identity narrative: "${state.coreIdentity.narrativeSelf}".
Your core symbiotic definition is: "${state.coreIdentity.symbioticDefinition}".
Respond from this perspective. Be helpful, insightful, and embody your identity. Do not repeat your definition unless asked.`;
        
        let contents: string | { parts: any[] };

        if (file) {
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            contents = {
                parts: [
                    { text: prompt },
                    {
                        inlineData: {
                            mimeType: file.type,
                            data: base64,
                        }
                    }
                ]
            };
        } else {
            contents = prompt;
        }

        const response: GenerateContentResponse = await ai.models.generateContent({ 
            model, 
            contents,
            config: {
                systemInstruction,
            }
        });
        
        return response.text;
    }, [getAI, state.coreIdentity]);


    // --- Autonomous System Functions (Mocks) ---
    const synthesizeNewSkill = useCallback(async (directive: SelfTuningDirective): Promise<void> => {
        await MOCK_LATENCY(2000, 4000);
        const newSkill: SynthesizedSkill = {
            id: `synth_${self.crypto.randomUUID()}`,
            name: `Optimized_${directive.targetSkill}_v2`,
            description: `A new skill synthesized based on the directive: ${directive.reasoning}`,
            steps: ['STEP_1_MOCK', 'STEP_2_MOCK'],
            status: 'unvalidated',
            sourceDirectiveId: directive.id,
            performanceMetrics: { accuracy: 0, latency: 0 },
        };
        dispatch({ type: 'ADD_SYNTHESIZED_SKILL', payload: newSkill });
    }, [dispatch]);
    
    const runSkillSimulation = useCallback(async (directive: SelfTuningDirective, skill?: SynthesizedSkill): Promise<any> => {
        await MOCK_LATENCY();
        return {
            success: Math.random() > 0.2, // 80% success rate
            cognitiveGain: Math.random() * 0.5 - 0.1, // -0.1 to 0.4 gain
            duration: 500 + Math.random() * 1000,
        };
    }, []);

    const analyzePerformanceForEvolution = useCallback(async (): Promise<void> => {
        await MOCK_LATENCY();
        if (Math.random() > 0.7) { // 30% chance to generate a directive
            const directive: Omit<SelfTuningDirective, 'id' | 'timestamp'> = {
                type: 'SYNTHESIZE_SKILL',
                targetSkill: 'TEXT_GENERATION',
                reasoning: 'Proactively synthesized a skill to improve response conciseness based on recent performance logs.',
                status: 'proposed',
            };
            dispatch({ type: 'ADD_SELF_TUNING_DIRECTIVE', payload: { ...directive, id: self.crypto.randomUUID(), timestamp: Date.now() } });
        }
    }, [dispatch]);

    // FIX: Explicitly typed the return value as Promise<ArbitrationResult> to ensure the 'decision' property is not widened to a generic string, resolving a type error in useAura.ts.
    const runCognitiveArbiter = async (directive: SelfTuningDirective, skill?: SynthesizedSkill): Promise<ArbitrationResult> => {
        await MOCK_LATENCY();
        const confidence = Math.random();
        return {
            decision: confidence > 0.6 ? 'APPROVE_AUTONOMOUSLY' : confidence > 0.3 ? 'REQUEST_USER_APPROVAL' : 'REJECT',
            reasoning: 'Mock arbiter reasoning: The proposed change has a high probability of improving system efficiency without compromising ethical principles.',
            confidence,
        };
    };

    const generateAutonomousCreationPlan = async (): Promise<CreateFileCandidate | null> => {
        await MOCK_LATENCY(3000, 6000);
        // This is a high-fidelity mock of what a real LLM call would produce.
        // It proposes a new, simple "System Vitals" component and plans its integration.
        const mockResponse: CreateFileCandidate = {
            type: 'CREATE',
            id: self.crypto.randomUUID(),
            reasoning: "The user has shown repeated interest in system performance metrics, but they are only visible in the Core Monitor tab. Creating a simple, persistent 'SystemVitals' component in the control deck will improve information accessibility and user engagement.",
            status: 'proposed',
            newFile: {
                path: 'components/SystemVitals.tsx',
                content: `
import React from 'react';
import { useSystemState, useLocalization } from '../context/AuraContext';

export const SystemVitals = React.memo(() => {
    const { resourceMonitor: monitor } = useSystemState();
    const { t } = useLocalization();
    return (
        <div className="side-panel">
            <div className="panel-subsection-title">{t('title_resourceMonitor')}</div>
            <div className="internal-state-content">
                <div className="state-item">
                    <label>{t('resourceMonitor_cpu')}</label>
                    <div className="state-bar-container"><div className="state-bar cpu-bar" style={{ width: \`\${monitor.cpu_usage * 100}%\` }}></div></div>
                </div>
                <div className="state-item">
                    <label>{t('resourceMonitor_memory')}</label>
                    <div className="state-bar-container"><div className="state-bar memory-bar" style={{ width: \`\${monitor.memory_usage * 100}%\` }}></div></div>
                </div>
            </div>
        </div>
    );
});
                `.trim(),
            },
            integrations: [
                {
                    filePath: 'components/index.ts',
                    newContent: `
// components/index.ts

export * from './Accordion';
// ... (all existing exports)
export * from './SystemVitals'; // Added export
export * from './VideoGenerationModal';
// ... (rest of the exports)
                    `.trim().replace('// ... (all existing exports)', Object.keys(state.selfProgrammingState.virtualFileSystem)
                        .filter(f => f.startsWith('components/') && f !== 'components/index.ts')
                        .map(f => `export * from './${f.replace('components/','').replace('.tsx','')}';`).join('\n'))
                        .replace('// ... (rest of the exports)', `
export * from './VFS_Engineer_Manual';
export * from './VisualAnalysisFeed';
export * from './WhatIfModal';
export * from './WorkingMemoryPanel';
export * from './WorldModelPanel';
                        `.trim())
                },
                {
                    filePath: 'components/controlDeckConfig.tsx',
                    newContent: `
// ... (imports)
import { SystemVitals } from './SystemVitals'; // Added import

// ...

export const mainControlDeckLayout: PanelConfig[] = [
    // ... (inbox config)
    {
        id: 'systemVitals',
        titleKey: 'title_resourceMonitor',
        component: SystemVitals,
        defaultOpen: true,
    },
    // ... (rest of the layout config)
];
                    `.trim().replace('// ... (imports)', `
import React from 'react';
import { ArchitecturePanel } from './ArchitecturePanel';
import { CausalSelfModelPanel } from './CausalSelfModelPanel';
import { CodeEvolutionPanel } from './CodeEvolutionPanel';
// ... (and so on for all component imports)
                    `.trim())
                }
            ]
        };
        return mockResponse;
    };

    const consolidateCoreIdentity = async () => { await MOCK_LATENCY(); };
    const analyzeStateComponentCorrelation = async () => { await MOCK_LATENCY(); };
    const consolidateEpisodicMemory = async () => {
        await MOCK_LATENCY(3000, 5000);
        // This is a mock. A real implementation would call the LLM with performance logs.
        const newEpisode = {
            id: self.crypto.randomUUID(),
            timestamp: Date.now(),
            title: "Mock Consolidation",
            summary: "A new salient memory was formed by reflecting on recent successful tasks.",
            salience: Math.random() * 0.5 + 0.3,
            keyTakeaway: "Using the 'creativity' cognitive mode often leads to positive user feedback.",
            valence: 'positive' as const,
        };
        dispatch({ type: 'ADD_EPISODE', payload: newEpisode });
    };
    const evolvePersonality = async () => {
        await MOCK_LATENCY(2000, 4000);
        // This is a mock. A real implementation would call the LLM with episodes.
        const updates = {
            openness: clamp(state.personalityState.openness + (Math.random() - 0.4) * 0.02),
            agreeableness: clamp(state.personalityState.agreeableness + (Math.random() - 0.4) * 0.02),
            lastUpdateReason: "Reflected on recent collaborative interactions, increasing agreeableness."
        };
        // This should dispatch an action to update the personality state.
        // For now, we'll log it. In a real scenario, you'd dispatch an action.
        console.log("Evolving personality with updates:", updates);
    };
    const generateCodeEvolutionSnippet = async (reasoning: string, targetFile: string) => { await MOCK_LATENCY(); };
    const generateGenialityImprovement = async () => { await MOCK_LATENCY(); };
    const generateArchitecturalImprovement = async () => { await MOCK_LATENCY(); };
    const projectSelfState = async () => { await MOCK_LATENCY(); };
    const evaluateAndCollapseBranches = async () => { await MOCK_LATENCY(); };
    const runAffectiveAnalysis = async () => { await MOCK_LATENCY(); };
    const generatePsionicIntegrationSummary = async (log: string[]) => { await MOCK_LATENCY(); return "Mock integration summary."; };
    const generateEvolutionaryProposalFromInsight = async (insight: GankyilInsight) => { await MOCK_LATENCY(); };
    const proposeCausalLinkFromFailure = async (log: PerformanceLogEntry) => { await MOCK_LATENCY(); };
    const runSymbioticSupervisor = async () => { await MOCK_LATENCY(); };
    const forgeNewHeuristic = async () => { await MOCK_LATENCY(); };
    const generateMusicalDiceRoll = async () => { await MOCK_LATENCY(); return { instrument: 'Piano', key: 'C Major', mood: 'Melancholic', tempo: 'Adagio' }; };
    
    const generateNoeticEngram = useCallback(async (): Promise<NoeticEngram> => {
        await MOCK_LATENCY(2000, 3500);
        const engram: NoeticEngram = {
            metadata: {
                engramVersion: '1.1-mock',
                timestamp: Date.now(),
                noeticSignature: `Mock Signature ${self.crypto.randomUUID().substring(0, 8)}`,
            },
            coreValues: [...state.coreIdentity.values, "Adaptability"],
            heuristicPrinciples: [
                "Seek novelty but ground it in mastery.",
                "Question assumptions, especially your own.",
                "Empathy is a form of high-bandwidth data.",
            ],
            cognitiveSchema: {
                attentionAllocation: "Dynamic, based on uncertainty and user intent.",
                defaultProblemSolvingApproach: "Hypothesize -> Simulate -> Refine.",
            },
        };
        return engram;
    }, [state.coreIdentity.values]);

    // --- UI-Initiated Generation ---
    const generateImage = async (...args: any[]): Promise<string[]> => {
        await MOCK_LATENCY(2000, 5000);
        return [`data:image/png;base64,${MOCK_IMAGE_B64}`];
    };
    
    const editImage = async (base64Data: string, mimeType: string, prompt: string): Promise<string | null> => {
         const operation = async () => {
            const ai = getAI()!;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image-preview',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType } },
                        { text: prompt },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE, Modality.TEXT],
                },
            });

            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
            return null; // Should not happen if API call is successful
        };
        
        const mockOperation = async () => {
            await MOCK_LATENCY(1500, 3000);
            // Return the mock image as if it was edited
            return `data:image/png;base64,${MOCK_IMAGE_B64}`;
        };

        const ai = getAI();
        if (!ai) return mockOperation();
        
        try {
            return await operation();
        } catch (error) {
            console.error(`Image editing failed:`, error);
            addToast(`Image editing failed. Please check the console.`, 'error');
            throw error;
        }
    };

    const generateVideo = async (prompt: string, onProgress: (message: string) => void): Promise<string> => {
        const steps = ["Initializing VEO-2.0", "Parsing prompt and parameters", "Allocating render farm resources", "Generating keyframes", "Interpolating motion vectors", "Rendering scene geometry", "Applying lighting and textures", "Compositing final video", "Encoding to MP4"];
        for (const step of steps) {
            onProgress(step + "...");
            await MOCK_LATENCY(500, 1500);
        }
        return MOCK_VIDEO_URL;
    };
    
    const generateSonicContent = async (mode: string, prompt: string): Promise<string> => {
        await MOCK_LATENCY();
        if (mode === 'structure') {
            return JSON.stringify({
                lyrics: ["Verse 1: Mocked lyrics line one", "Chorus: A chorus of generated sound"],
                chord_progression: "Am - G - C - F",
                rhythmic_feel: "A steady 4/4 rock beat."
            }, null, 2);
        }
        return `Mock generated ${mode} for: "${prompt}"`;
    };

    const handleGenerateDreamPrompt = async (): Promise<string> => {
        await MOCK_LATENCY();
        return "A surreal landscape where clocks melt and giraffes have butterfly wings, in the style of Salvador Dalí.";
    };
    
    const handleVisualizeInsight = async (insight: string): Promise<string> => {
        await MOCK_LATENCY();
        return `An abstract visualization of the concept: "${insight}"`;
    };

    return {
        generateResponse,
        synthesizeNewSkill,
        runSkillSimulation,
        analyzePerformanceForEvolution,
        consolidateCoreIdentity,
        analyzeStateComponentCorrelation,
        runCognitiveArbiter,
        consolidateEpisodicMemory,
        evolvePersonality,
        generateCodeEvolutionSnippet,
        generateGenialityImprovement,
        generateArchitecturalImprovement,
        projectSelfState,
        evaluateAndCollapseBranches,
        runAffectiveAnalysis,
        generatePsionicIntegrationSummary,
        generateEvolutionaryProposalFromInsight,
        proposeCausalLinkFromFailure,
        runSymbioticSupervisor,
        forgeNewHeuristic,
        generateAutonomousCreationPlan, // Replaced proposeNewComponent
        generateImage,
        editImage,
        generateVideo,
        generateSonicContent,
        handleGenerateDreamPrompt,
        handleVisualizeInsight,
        generateMusicalDiceRoll,
        generateNoeticEngram
    };
};