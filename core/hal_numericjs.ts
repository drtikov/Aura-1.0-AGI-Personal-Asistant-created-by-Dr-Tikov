// core/hal_numericjs.ts
import { loadSdk } from './sdkLoader';

// This tells TypeScript that the 'numeric' object will be available globally from the CDN script.
declare const numeric: any;

export const NumericJS = {
  /**
   * Performs matrix multiplication (dot product) on two matrices.
   * @param matrixA The first matrix as a 2D array of numbers.
   * @param matrixB The second matrix as a 2D array of numbers.
   * @returns A promise resolving to the resulting matrix.
   */
  matrixMultiply: async (matrixA: number[][], matrixB: number[][]): Promise<number[][]> => {
    await loadSdk('numericjs');
    if (typeof numeric === 'undefined') {
      throw new Error("numeric.js library is not loaded.");
    }
    
    try {
      // numeric.js expects arrays of arrays.
      const result = numeric.dot(matrixA, matrixB);
      if (!Array.isArray(result) || (result.length > 0 && !Array.isArray(result[0]))) {
         throw new Error("Invalid result from numeric.dot. Matrices may be incompatible.");
      }
      return result;
    } catch (error: any) {
      console.error("HAL.NumericJS Error:", error);
      throw new Error(`NumericJS execution failed: ${error.message}`);
    }
  }
};