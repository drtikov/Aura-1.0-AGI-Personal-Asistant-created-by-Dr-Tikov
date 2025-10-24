// utils.ts
import { MDNAVector } from './types.ts';
import { GenerateContentResponse } from "@google/genai";

declare const dayjs: any;

/**
 * Clamps a number between a minimum and maximum value.
 * @param value The number to clamp.
 * @param min The minimum value. Defaults to 0.
 * @param max The maximum value. Defaults to 1.
 * @returns The clamped number.
 */
export const clamp = (value: number, min: number = 0, max: number = 1): number => {
    return Math.max(min, Math.min(max, value));
};


/**
 * Normalizes a vector to have a magnitude of 1 (a unit vector).
 * @param v The vector to normalize.
 * @returns A new vector with a magnitude of 1.
 */
export const normalizeVector = (v: MDNAVector): MDNAVector => {
    const magnitude = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    return magnitude === 0 ? v : v.map(val => val / magnitude);
}

/**
 * Creates a random vector of a given dimension and normalizes it.
 * @param dimensions The number of dimensions for the vector.
 * @returns A normalized random vector.
 */
export const createRandomVector = (dimensions: number): MDNAVector => {
    const randomVector = Array.from({ length: dimensions }, () => Math.random() * 2 - 1);
    return normalizeVector(randomVector);
};

/**
 * Adds two vectors.
 */
export const addVectors = (v1: MDNAVector, v2: MDNAVector): MDNAVector => {
    if (v1.length !== v2.length) throw new Error("Vectors must have the same dimension");
    return v1.map((val, i) => val + (v2[i] || 0));
};

/**
 * Subtracts the second vector from the first.
 */
export const subtractVectors = (v1: MDNAVector, v2: MDNAVector): MDNAVector => {
    if (v1.length !== v2.length) throw new Error("Vectors must have the same dimension");
    return v1.map((val, i) => val - (v2[i] || 0));
};

/**
 * Calculates the cosine similarity between two vectors.
 */
export const cosineSimilarity = (v1: MDNAVector, v2: MDNAVector): number => {
    if (v1.length !== v2.length) return 0;
    const dotProduct = v1.reduce((sum, val, i) => sum + val * (v2[i] || 0), 0);
    const mag1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));
    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (mag1 * mag2);
};

/**
 * Finds the n closest vectors in a space to a target vector.
 */
export const findClosestVectors = (targetVector: MDNAVector, space: Record<string, MDNAVector>, n: number = 1): { name: string, similarity: number }[] => {
    const similarities = Object.entries(space).map(([name, vector]) => ({
        name,
        similarity: cosineSimilarity(targetVector, vector),
    }));
    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, n);
};

/**
 * Safely extracts the full text content from a GenerateContentResponse.
 * @param response The GenerateContentResponse from the Gemini API.
 * @returns A string containing the text content.
 */
export function getText(response: GenerateContentResponse): string {
    return response.text ?? "";
}


// --- Gemini Live API Audio Helpers ---

/**
 * Encodes a byte array into a Base64 string.
 * @param bytes The byte array to encode.
 * @returns The Base64 encoded string.
 */
export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Decodes a Base64 string into a byte array.
 * @param base64 The Base64 string to decode.
 * @returns The decoded byte array.
 */
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM audio data into an AudioBuffer for playback.
 * This is a manual implementation because AudioContext.decodeAudioData expects a full audio file format, not raw PCM.
 * @param data Raw PCM audio data as a byte array.
 * @param ctx The AudioContext for creating the buffer.
 * @param sampleRate The sample rate of the audio (e.g., 24000 for Gemini Live output).
 * @param numChannels The number of audio channels (typically 1).
 * @returns A promise that resolves to an AudioBuffer.
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // The data is Int16, so we create a view of the buffer.
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Normalize the Int16 value to a Float32 value between -1.0 and 1.0
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


/**
 * Formats a timestamp into a consistent string format using day.js.
 * @param timestamp The timestamp number (milliseconds since epoch).
 * @returns A formatted date string, e.g., "2024-07-15 14:35:10".
 */
export const formatTimestamp = (timestamp: number): string => {
    if (typeof dayjs === 'undefined') {
        return new Date(timestamp).toLocaleString();
    }
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
};