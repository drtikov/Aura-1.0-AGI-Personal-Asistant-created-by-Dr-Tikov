export const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return { inlineData: { data: await base64EncodedDataPromise, mimeType: file.type }, };
};

// FIX: Update clamp to accept min and max arguments for more flexible usage.
export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const TRUNCATE_STRING_LENGTH = 150;
const TRUNCATE_ARRAY_LENGTH = 10;

/**
 * Recursively optimizes a JavaScript object to reduce its size for API calls.
 * - Removes null and undefined values.
 * - Truncates long strings.
 * - Truncates long arrays.
 * @param data The object to optimize.
 * @returns A smaller, optimized version of the object.
 */
export const optimizeObjectForPrompt = (data: any): any => {
    if (data === null || data === undefined) {
        return undefined;
    }
    
    if (Array.isArray(data)) {
        if (data.length > TRUNCATE_ARRAY_LENGTH) {
            // Keep first 5 and last 5 elements for context
            const truncated = [
                ...data.slice(0, 5).map(optimizeObjectForPrompt),
                `...(${data.length - TRUNCATE_ARRAY_LENGTH} more items)...`,
                ...data.slice(data.length - 5).map(optimizeObjectForPrompt),
            ];
            return truncated.filter(item => item !== undefined);
        }
        return data.map(optimizeObjectForPrompt).filter(item => item !== undefined);
    }

    if (typeof data === 'string') {
        if (data.length > TRUNCATE_STRING_LENGTH) {
            return data.substring(0, TRUNCATE_STRING_LENGTH) + '...';
        }
        return data;
    }

    if (typeof data === 'object' && data.constructor === Object) {
        const optimizedObj: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const optimizedValue = optimizeObjectForPrompt(data[key]);
                if (optimizedValue !== undefined) {
                    optimizedObj[key] = optimizedValue;
                }
            }
        }
        // Return undefined if the object becomes empty after optimization
        if (Object.keys(optimizedObj).length === 0) {
            return undefined;
        }
        return optimizedObj;
    }

    return data; // Return primitives (number, boolean, etc.) as is
};

/**
 * Provides a file's content for the self-programming cycle.
 * In a real application, this might involve complex logic to select a file.
 * For this simulation, we will hardcode the content of `utils.ts` itself.
 */
export const getFileContentForSelfProgramming = (): { fileName: string, fileContent: string } => {
    const fileName = 'utils.ts';
    // We have to paste the content of utils.ts here.
    const fileContent = `
export const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return { inlineData: { data: await base64EncodedDataPromise, mimeType: file.type }, };
};

// FIX: Update clamp to accept min and max arguments for more flexible usage.
export const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

const TRUNCATE_STRING_LENGTH = 150;
const TRUNCATE_ARRAY_LENGTH = 10;

/**
 * Recursively optimizes a JavaScript object to reduce its size for API calls.
 * - Removes null and undefined values.
 * - Truncates long strings.
 * - Truncates long arrays.
 * @param data The object to optimize.
 * @returns A smaller, optimized version of the object.
 */
export const optimizeObjectForPrompt = (data: any): any => {
    if (data === null || data === undefined) {
        return undefined;
    }
    
    if (Array.isArray(data)) {
        if (data.length > TRUNCATE_ARRAY_LENGTH) {
            // Keep first 5 and last 5 elements for context
            const truncated = [
                ...data.slice(0, 5).map(optimizeObjectForPrompt),
                \`...(\${data.length - TRUNCATE_ARRAY_LENGTH} more items)...\`,
                ...data.slice(data.length - 5).map(optimizeObjectForPrompt),
            ];
            return truncated.filter(item => item !== undefined);
        }
        return data.map(optimizeObjectForPrompt).filter(item => item !== undefined);
    }

    if (typeof data === 'string') {
        if (data.length > TRUNCATE_STRING_LENGTH) {
            return data.substring(0, TRUNCATE_STRING_LENGTH) + '...';
        }
        return data;
    }

    if (typeof data === 'object' && data.constructor === Object) {
        const optimizedObj: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const optimizedValue = optimizeObjectForPrompt(data[key]);
                if (optimizedValue !== undefined) {
                    optimizedObj[key] = optimizedValue;
                }
            }
        }
        // Return undefined if the object becomes empty after optimization
        if (Object.keys(optimizedObj).length === 0) {
            return undefined;
        }
        return optimizedObj;
    }

    return data; // Return primitives (number, boolean, etc.) as is
};
    `;
    return { fileName, fileContent: fileContent.trim() };
};