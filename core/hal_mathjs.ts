// core/hal_mathjs.ts
import { loadSdk } from './sdkLoader';

// This tells TypeScript that the 'math' object will be available globally from the CDN script.
declare const math: any;

export const MathJS = {
  /**
   * Executes a symbolic math command using the math.js library.
   * @param command The operation to perform (simplify, solve, differentiate).
   * @param expression The mathematical expression string.
   * @param variable The variable to operate on (for solve/differentiate).
   * @returns A promise resolving to the structured result.
   */
  execute: async (command: 'simplify' | 'solve' | 'differentiate', expression: string, variable?: string): Promise<{ final_result: string | string[]; steps: { description: string, equation: string }[] }> => {
    await loadSdk('mathjs');
    if (typeof math === 'undefined') {
      throw new Error("math.js library is not loaded.");
    }

    try {
      let resultNode;
      const steps: { description: string, equation: string }[] = [];

      steps.push({ description: 'Initial Expression', equation: expression });

      switch (command) {
        case 'simplify':
          resultNode = math.simplify(expression);
          steps.push({ description: 'Simplified Form', equation: resultNode.toTex() });
          break;
        case 'solve':
          resultNode = math.solve(expression, variable || 'x');
           steps.push({ description: `Solving for ${variable || 'x'}`, equation: expression });
          break;
        case 'differentiate':
          resultNode = math.derivative(expression, variable || 'x');
          steps.push({ description: `Differentiating with respect to ${variable || 'x'}`, equation: `d/d${variable || 'x'}(${expression})` });
          break;
        default:
          throw new Error(`Unknown MathJS command: ${command}`);
      }

      const final_result = Array.isArray(resultNode) 
        ? resultNode.map(r => r.toTex()) 
        : resultNode.toTex();
        
      if (!final_result.includes(steps[steps.length - 1].equation)) {
        steps.push({ description: 'Final Result', equation: Array.isArray(final_result) ? final_result.join(', ') : final_result });
      }

      return { final_result, steps };

    } catch (error: any) {
      console.error("HAL.MathJS Error:", error);
      throw new Error(`MathJS execution failed: ${error.message}`);
    }
  }
};