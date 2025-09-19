export const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return { inlineData: { data: await base64EncodedDataPromise, mimeType: file.type }, };
};

export const clamp = (value: number) => Math.max(0.0, Math.min(1.0, value));

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
