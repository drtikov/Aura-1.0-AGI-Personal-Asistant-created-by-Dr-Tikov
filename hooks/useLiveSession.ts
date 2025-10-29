// hooks/useLiveSession.ts
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob, GenerateContentResponse, Part } from '@google/genai';
import { AuraState, Action, SyscallCall } from '../types';
import { encode, decode, decodeAudioData, getAI } from '../utils';

const FRAME_RATE = 1; // Send 1 video frame per second

export const useLiveSession = (
    state: AuraState,
    dispatch: React.Dispatch<Action>,
    addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void
) => {
    const sessionPromise = useRef<Promise<LiveSession> | null>(null);
    const mediaStream = useRef<MediaStream | null>(null);
    const inputAudioContext = useRef<AudioContext | null>(null);
    const outputAudioContext = useRef<AudioContext | null>(null);
    const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);
    const videoFrameInterval = useRef<number | null>(null);
    const videoElementRef = useRef<HTMLVideoElement | null>(null);
    const canvasElementRef = useRef<HTMLCanvasElement | null>(null);

    const nextStartTime = useRef(0);
    const audioSources = useRef(new Set<AudioBufferSourceNode>());

    const syscall = useCallback((call: SyscallCall, args: any) => {
        dispatch({ type: 'SYSCALL', payload: { call, args } });
    }, [dispatch]);

    const stopSession = useCallback(() => {
        if (sessionPromise.current) {
            sessionPromise.current.then(session => session.close());
            sessionPromise.current = null;
        }
        if (videoFrameInterval.current) {
            clearInterval(videoFrameInterval.current);
            videoFrameInterval.current = null;
        }
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
            mediaStream.current = null;
        }
        if (scriptProcessor.current) {
            scriptProcessor.current.disconnect();
            scriptProcessor.current = null;
        }
        if (mediaStreamSource.current) {
            mediaStreamSource.current.disconnect();
            mediaStreamSource.current = null;
        }
        if (inputAudioContext.current && inputAudioContext.current.state !== 'closed') {
            inputAudioContext.current.close();
            inputAudioContext.current = null;
        }
        if (outputAudioContext.current && outputAudioContext.current.state !== 'closed') {
            outputAudioContext.current.close();
            outputAudioContext.current = null;
        }
        
        audioSources.current.forEach(source => source.stop());
        audioSources.current.clear();
        nextStartTime.current = 0;

        syscall('LIVE/DISCONNECT', {});
        addToast('Live session ended.', 'info');
    }, [syscall, addToast]);

    const startSession = useCallback(async (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) => {
        if (sessionPromise.current) return;

        videoElementRef.current = videoElement;
        canvasElementRef.current = canvasElement;

        syscall('LIVE/SET_STATUS', { status: 'connecting' });
        
        try {
            const ai = await getAI();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            mediaStream.current = stream;
            videoElement.srcObject = stream;
            videoElement.play();

            inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            sessionPromise.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                    },
                    systemInstruction: 'You are Aura, a friendly and helpful symbiotic AI. Keep your responses conversational and relatively brief.',
                },
                callbacks: {
                    onopen: () => {
                        syscall('LIVE/SET_STATUS', { status: 'live' });
                        addToast('Live session started. You can now speak.', 'success');
                        
                        // Audio input stream
                        mediaStreamSource.current = inputAudioContext.current!.createMediaStreamSource(stream);
                        scriptProcessor.current = inputAudioContext.current!.createScriptProcessor(4096, 1, 1);

                        scriptProcessor.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                             const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            if (sessionPromise.current) {
                                sessionPromise.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        mediaStreamSource.current.connect(scriptProcessor.current);
                        scriptProcessor.current.connect(inputAudioContext.current!.destination);

                        // Video input stream
                        const ctx = canvasElement.getContext('2d');
                        if (!ctx) {
                            console.error("Could not get canvas context for video streaming.");
                            return;
                        }
                        videoFrameInterval.current = window.setInterval(() => {
                            canvasElement.width = videoElement.videoWidth;
                            canvasElement.height = videoElement.videoHeight;
                            ctx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
                            canvasElement.toBlob(
                                async (blob) => {
                                    if (blob && sessionPromise.current) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            const base64Data = (reader.result as string).split(',')[1];
                                            sessionPromise.current!.then((session) => {
                                                session.sendRealtimeInput({
                                                    media: { data: base64Data, mimeType: 'image/jpeg' }
                                                });
                                            });
                                        };
                                        reader.readAsDataURL(blob);
                                    }
                                }, 'image/jpeg', 0.8);
                        }, 1000 / FRAME_RATE);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle audio output
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContext.current) {
                            nextStartTime.current = Math.max(nextStartTime.current, outputAudioContext.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext.current, 24000, 1);
                            const source = outputAudioContext.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContext.current.destination);
                            source.addEventListener('ended', () => audioSources.current.delete(source));
                            source.start(nextStartTime.current);
                            nextStartTime.current += audioBuffer.duration;
                            audioSources.current.add(source);
                        }

                        // Handle transcriptions
                        if (message.serverContent?.inputTranscription) {
                            syscall('LIVE/UPDATE_INPUT_TRANSCRIPT', { text: message.serverContent.inputTranscription.text });
                        }
                        if (message.serverContent?.outputTranscription) {
                            syscall('LIVE/UPDATE_OUTPUT_TRANSCRIPT', { text: message.serverContent.outputTranscription.text });
                        }
                        if (message.serverContent?.turnComplete) {
                            syscall('LIVE/TURN_COMPLETE', {});
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        addToast('Live session error.', 'error');
                        stopSession();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live session closed.');
                        // stopSession is already called from the overlay, calling it here can cause issues
                    },
                },
            });
        } catch (error) {
            console.error('Failed to start live session:', error);
            addToast('Failed to get microphone/camera access.', 'error');
            syscall('LIVE/SET_STATUS', { status: 'error' });
        }
    }, [syscall, addToast, stopSession]);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopSession();
        };
    }, [stopSession]);

    return { startSession, stopSession };
};
