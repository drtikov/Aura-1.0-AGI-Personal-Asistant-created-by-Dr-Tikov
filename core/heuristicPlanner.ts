// core/heuristicPlanner.ts
import { SEDLDirective, CGLPlan, CGLStep } from '../types';

/**
 * A local, synchronous, heuristic-based planner that converts a SEDL directive
 * into a basic CGL plan without calling an LLM. It uses simple keyword matching
 * to decide if a tool should be used.
 *
 * @param directive The user's high-level directive.
 * @returns A structured CGLPlan.
 */
export const generateHeuristicCGLPlan = (directive: SEDLDirective): CGLPlan => {
    const prompt = directive.content.toLowerCase();
    const planId = `cgl-plan-${self.crypto.randomUUID()}`;
    const steps: CGLStep[] = [];

    // Heuristic 1: Weather Tool
    if (prompt.includes('weather')) {
        const locationMatch = prompt.match(/weather in ([\w\s,]+)/);
        const location = locationMatch ? locationMatch[1].trim() : 'San Francisco, CA';
        
        steps.push({
            id: `cgl-step-${self.crypto.randomUUID()}`,
            operation: 'EXECUTE_TOOL',
            details: `Get the weather for ${location}`,
            parameters: { name: 'get_weather', args: { location } }
        });
        steps.push({
            id: `cgl-step-${self.crypto.randomUUID()}`,
            operation: 'GENERATE_RESPONSE',
            details: 'Formulate a response based on the weather data.',
            parameters: { prompt: `The weather tool returned its data. Based on that, answer the user's original question: "${directive.content}"` }
        });

    // Heuristic 2: Calculator Tool
    } else if (prompt.startsWith('calculate') || prompt.match(/what is .*[\d\+\-\*\/]/)) {
        steps.push({
            id: `cgl-step-${self.crypto.randomUUID()}`,
            operation: 'EXECUTE_TOOL',
            details: `Calculate the result of the expression: ${directive.content}`,
            parameters: { name: 'calculate', args: { expression: directive.content.replace(/what is|calculate/gi, '').trim() } }
        });
        steps.push({
            id: `cgl-step-${self.crypto.randomUUID()}`,
            operation: 'GENERATE_RESPONSE',
            details: 'Present the calculation result to the user.',
            parameters: { prompt: `The calculation is complete. State the result clearly.` }
        });
        
    // Heuristic 3: Document Forge
    } else if (prompt.includes('create pdf') || prompt.includes('make a document') || prompt.includes('generate a specification') || prompt.includes('create document')) {
        // Extract the goal from the prompt.
        const goalMatch = prompt.match(/(?:about|on|for)\s(.+)/);
        const goal = goalMatch ? goalMatch[1].trim() : directive.content;

        steps.push({
            id: `cgl-step-${self.crypto.randomUUID()}`,
            operation: 'SYSCALL',
            details: `Start document generation process with the goal: "${goal}"`,
            parameters: { call: 'DOCUMENT_FORGE/START_PROJECT', args: { goal } }
        });

        // Also add a chat message to inform the user.
        steps.push({
            id: `cgl-step-${self.crypto.randomUUID()}`,
            operation: 'GENERATE_RESPONSE',
            details: 'Inform the user that the document generation has started.',
            parameters: { prompt: `Acknowledge that you are starting to generate the document about "${goal}" and that the user can monitor the progress in the Document Forge panel.` }
        });
        
    // Default Fallback: Simple Chat
    } else {
        steps.push({
            id: `cgl-step-${self.crypto.randomUUID()}`,
            operation: 'GENERATE_RESPONSE',
            details: 'Generate a direct response to the user prompt.',
            parameters: { prompt: directive.content }
        });
    }

    return {
        id: planId,
        sourceDirectiveId: directive.id,
        goal: `Respond to user directive: "${directive.content.substring(0, 50)}..."`,
        steps,
    };
};