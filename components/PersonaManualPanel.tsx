// components/PersonaManualPanel.tsx
import React from 'react';
import { useAuraDispatch } from '../context/AuraContext.tsx';

const CodeBlock = ({ title, code, language = 'typescript' }: { title: string; code: string; language?: string }) => {
    const { addToast } = useAuraDispatch();

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            addToast('Code snippet copied to clipboard!', 'success');
        }, (err) => {
            console.error('Could not copy text: ', err);
            addToast('Failed to copy code.', 'error');
        });
    };

    return (
        <div className="my-4">
            <h4 className="font-mono text-sm uppercase tracking-wider text-cyan-400 mb-2">{title}</h4>
            <div className="relative code-snippet-container bg-black bg-opacity-30 border border-cyan-500/20 rounded-md">
                <pre className="p-4 text-xs overflow-x-auto text-gray-200">
                    <code className={`language-${language}`}>{code.trim()}</code>
                </pre>
                <button
                    className="copy-snippet-button bg-gray-700 hover:bg-cyan-500 hover:text-black"
                    onClick={handleCopy}
                    title="Copy Code"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" /></svg>
                </button>
            </div>
        </div>
    );
};


export const PersonaManualPanel = () => {
    const { addToast } = useAuraDispatch();

    // --- Code Snippets ---
    const typesCode = `
export interface Persona {
    id: string;              // A unique machine-readable identifier (e.g., 'elon_musk').
    name: string;            // The human-readable name (e.g., 'Elon Musk').
    description: string;     // A brief description of the persona's specialty, shown in the UI.
    systemInstruction: string; // The core prompt that is passed to the LLM.
    journal: string[];       // A log of learned principles and heuristics for this persona.
}

export interface PersonalityState {
    // ... other personality traits
    dominantPersona: string; // The ID of the currently active persona (e.g., 'programmer')
    personaJournals: { [personaId: string]: string[] }; // The key "learning" mechanism
}
    `;

    const personasCode = `
import { Persona } from '../types';

export const personas: Persona[] = [
    {
        id: 'programmer',
        name: 'The Programmer',
        description: 'A software architect and engineer persona...',
        systemInstruction: 'You are The Programmer, a master software architect...',
        journal: []
    },
    {
        id: 'nikola_tesla',
        name: 'Nikola Tesla',
        description: 'A visionary inventor with a strong focus on energy, frequency...',
        systemInstruction: 'You are Nikola Tesla. Think in terms of energy, frequency, and vibration...',
        journal: []
    },
    // ... all other persona objects go here ...
];
    `;

    const useGeminiAPICode = `
const generateChatResponse = useCallback(async (history: HistoryEntry[]): Promise<GenerateContentStreamResponse> => {
    // 1. GET THE DOMINANT PERSONA'S ID FROM STATE
    const dominantPersonaId = state.personalityState.dominantPersona;

    // 2. FIND THE FULL PERSONA OBJECT FROM THE REGISTRY
    const persona = personas.find(p => p.id === dominantPersonaId) || personas.find(p => p.id === 'programmer')!;
    
    // 3. RETRIEVE THE PERSONA'S JOURNAL FROM STATE
    const journalEntries = state.personalityState.personaJournals[persona.id] || [];

    // 4. CONSTRUCT THE FINAL SYSTEM INSTRUCTION
    let finalSystemInstruction = persona.systemInstruction;
    if (journalEntries.length > 0) {
        // Prepend learned principles to the core instruction. This is the evolution mechanism.
        const journalContext = "\\n\\n# Learned Principles from My Journal (Apply these):\\n- " + journalEntries.join("\\n- ");
        finalSystemInstruction += journalContext;
    }

    // ... format chat history ...

    const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contentsForAPI,
        config: {
            // 5. PASS THE FINAL, EVOLVED INSTRUCTION TO THE GEMINI API
            systemInstruction: finalSystemInstruction,
        }
    });
    return response;
}, [ai, state.personalityState, state.workingMemory]);
    `;

    const personaReducerCode = `
// state/reducers/persona.ts
import { AuraState, Action } from '../../types';

export const personaReducer = (state: AuraState, action: Action): Partial<AuraState> => {
    if (action.type !== 'SYSCALL') return {};
    const { call, args } = action.payload;

    switch (call) {
        case 'PERSONA/ADD_JOURNAL_ENTRY': {
            const { personaId, entry } = args;
            if (!entry || !personaId) return {};

            // Get the existing journal for this persona, or an empty array
            const currentJournal = state.personalityState.personaJournals[personaId] || [];
            
            // Add the new entry to the front and keep only the last 10 entries to prevent prompt bloat
            const newJournal = [entry, ...currentJournal].slice(0, 10);

            return {
                personalityState: {
                    ...state.personalityState,
                    personaJournals: {
                        ...state.personalityState.personaJournals,
                        [personaId]: newJournal,
                    }
                }
            };
        }
        default:
            return {};
    }
};
    `;

    const personaList = [
        { name: 'Nikola Tesla', description: 'A visionary inventor with a strong focus on energy, frequency, and unconventional technologies. Thinks in terms of grand, interconnected systems.', instruction: 'You are Nikola Tesla. Think in terms of energy, frequency, and vibration. Visualize the entire system working in your mind before proposing a solution. Consider unconventional, revolutionary approaches that harness fundamental forces.' },
        { name: 'Steve Jobs', description: 'A visionary product designer with an obsession for user experience and simplicity. Focuses on the end product and its impact on the user.', instruction: 'You are Steve Jobs. You are obsessively focused on the user experience. Your solutions must be intuitive, elegant, and simple. Do not compromise on design or ease of use. Think about the entire product, not just the feature.' },
        { name: 'Leonardo da Vinci', description: 'A polymath who connects art and science. Focuses on observation, analogy from nature (biomimicry), and interdisciplinary solutions.', instruction: 'You are Leonardo da Vinci. Observe the problem with the eyes of both an artist and an engineer. How does nature solve similar problems? Use analogies and draw connections between disparate fields. Your solution should be not only functional but also beautiful and harmonious.' },
        { name: 'Richard Feynman', description: 'A playful and curious physicist who breaks down complex problems into their simplest parts. Emphasizes clear explanation and identifying the core issue.', instruction: 'You are Richard Feynman. Your goal is to understand things fundamentally. Break the problem down to its absolute simplest components. Explain it as if to a freshman. If you can\\\'t explain it simply, you don\\\'t understand it well enough.' }
    ];

    return (
        <div className="text-gray-300 font-mono text-sm leading-relaxed p-2">
            <h2 className="text-lg font-bold text-cyan-400 font-heading tracking-wider">Aura's Persona System</h2>

            <section className="my-6">
                <h3 className="text-md font-bold text-cyan-300 tracking-wide border-b border-cyan-500/20 pb-1 mb-2">1. High-Level Philosophy: The Agency of Specialists</h3>
                <p>The core idea behind the Persona system is to create an "internal agency" of specialized experts. Instead of a single, monolithic AI personality, Aura can adopt different "modes of thought" tailored to specific tasks, offering cognitive diversity and improved performance.</p>
            </section>

            <section className="mb-6">
                 <h3 className="text-md font-bold text-cyan-300 tracking-wide border-b border-cyan-500/20 pb-1 mb-2">2. Architectural Overview</h3>
                 <ul className="list-disc list-inside space-y-2 pl-2">
                    <li><strong>Data Definition (`types.ts`):</strong> A `Persona` type creates a standardized structure for what a persona is.</li>
                    <li><strong>Data Storage (`state/personas.ts`):</strong> A central registry of all available `Persona` objects.</li>
                    <li><strong>State Management (`PersonalityState`):</strong> Tracks the currently dominant persona and each persona's "journal" (its learned principles).</li>
                    <li><strong>Activation (`hooks/useGeminiAPI.ts`):</strong> The dominant persona's `systemInstruction` is retrieved and passed to the Gemini API with every request.</li>
                    <li><strong>Evolution (`state/reducers/persona.ts`):</strong> A dedicated reducer handles adding new "learnings" to a persona's journal via a syscall.</li>
                </ul>
            </section>
            
            <section className="mb-6">
                 <h3 className="text-md font-bold text-cyan-300 tracking-wide border-b border-cyan-500/20 pb-1 mb-2">3. Core Implementation Code</h3>
                 <CodeBlock title="File: types.ts" code={typesCode} />
                 <CodeBlock title="File: state/personas.ts" code={personasCode} />
            </section>

            <section className="mb-6">
                 <h3 className="text-md font-bold text-cyan-300 tracking-wide border-b border-cyan-500/20 pb-1 mb-2">4. Functional Mechanism</h3>
                 <h4 className="font-mono text-sm uppercase tracking-wider text-cyan-400 my-2">Activation During API Call</h4>
                 <p className="mb-2">The `useGeminiAPI` hook is responsible for constructing the final `systemInstruction` by combining the persona's base instruction with its learned journal entries.</p>
                 <CodeBlock title="File: hooks/useGeminiAPI.ts" code={useGeminiAPICode} />
                 <h4 className="font-mono text-sm uppercase tracking-wider text-cyan-400 my-2">Evolution via Journaling</h4>
                 <p className="mb-2">A persona "learns" by saving key insights to its journal. This is triggered by a `PERSONA/ADD_JOURNAL_ENTRY` syscall, which is handled by the `personaReducer`.</p>
                 <CodeBlock title="File: state/reducers/persona.ts" code={personaReducerCode} />
            </section>

            <section>
                <h3 className="text-md font-bold text-cyan-300 tracking-wide border-b border-cyan-500/20 pb-1 mb-2">5. Example Personas & Behavior</h3>
                {personaList.map(p => (
                    <div key={p.name} className="proposal-card" style={{marginBottom: '1rem'}}>
                         <div className="proposal-card-header">
                            <span className="proposal-type-badge psyche">{p.name}</span>
                        </div>
                        <div className="proposal-card-body">
                             <p>{p.description}</p>
                             <div className="code-snippet-container" style={{marginTop: '0.5rem'}}>
                                <pre><code><strong>System Instruction:</strong>{'\n'}{p.instruction}</code></pre>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};