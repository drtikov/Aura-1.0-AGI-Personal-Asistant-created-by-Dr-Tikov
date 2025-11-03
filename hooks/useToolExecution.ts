// hooks/useToolExecution.ts
import { useEffect } from 'react';
import { HAL } from '../core/hal.ts';
// FIX: Imported missing ToolExecutionRequest type
import { ToolExecutionRequest, SyscallCall, AuraState, UseGeminiAPIResult } from '../types.ts';

export interface UseToolExecutionProps {
    syscall: (call: SyscallCall, args: any) => void;
    addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
    toolExecutionRequest: ToolExecutionRequest | null;
    state: AuraState;
    geminiAPI: UseGeminiAPIResult;
}

export const useToolExecution = ({ syscall, addToast, toolExecutionRequest, state, geminiAPI }: UseToolExecutionProps) => {
    useEffect(() => {
        if (!toolExecutionRequest) {
            return;
        }

        const execute = async (request: ToolExecutionRequest) => {
            try {
                let result: any;
                switch (request.toolName) {
                    case 'typescript_check_types':
                        result = await HAL.Tools.typescript_check_types(state.selfProgrammingState.virtualFileSystem, [request.args.filePath]);
                        break;
                    case 'geometry_boolean_op':
                        result = await HAL.Geometry.runBooleanOp(request.args.polygonA, request.args.polygonB, request.args.operation);
                        break;
                    case 'mesh_analysis':
                        result = await HAL.Geometry.runMeshAnalysis(request.args.meshType, request.args.parameters);
                        break;
                    case 'creative_coding':
                        // This tool is handled client-side in the panel, so this is a passthrough/logging action.
                        result = { status: 'Executed', message: 'p5.js code was executed in the browser.' };
                        break;
                    case 'symbolic_math':
                        result = await HAL.MathJS.execute(request.args.command, request.args.expression, request.args.variable);
                        break;
                    case 'numerical_computation':
                         if (request.args.operation === 'matrix_multiply') {
                            result = await HAL.NumericJS.matrixMultiply(request.args.matrixA, request.args.matrixB);
                        } else {
                            throw new Error(`Unsupported numerical operation: ${request.args.operation}`);
                        }
                        break;
                    case 'formal_proof_assistant':
                         result = await geminiAPI.generateFormalProof(request.args.statement_to_prove);
                        break;
                    case 'detect_objects_in_image':
                        // This is a placeholder for the actual TensorFlow.js logic which runs in the component.
                        // The syscall is used to log the action.
                        result = { status: 'Initiated', message: 'Object detection started via VisualAnalysisFeed.' };
                        break;
                    case 'play_music_sequence':
                        // Similar to p5.js, this is handled client-side. The tool call is for logging.
                        result = { status: 'Executed', message: `Tone.js played sequence: ${request.args.notes.join(', ')}` };
                        break;
                    case 'parse_csv_data':
                        // The actual parsing happens in the component. This is for logging and potential future state updates.
                        result = { status: 'Executed', message: `CSV data parsed. ${request.args.rowCount} rows found.` };
                        break;
                    case 'read_text_from_image':
                        // Actual OCR is in the component. This is a log.
                        result = { status: 'Executed', message: `OCR performed on image.` };
                        break;
                    case 'visualize_graph_data':
                        // This is a special case. The "result" is the data itself, which the UI
                        // will use to render a D3 component directly in the chat.
                        result = request.args;
                        break;
                    default:
                        // Default case for tools that are client-side or just for logging.
                        result = { status: 'Executed', message: `Tool '${request.toolName}' was dispatched.` };
                        break;
                }
                
                syscall('ADD_HISTORY_ENTRY', {
                    from: 'tool',
                    toolName: request.toolName,
                    // For visualization, we pass the graph data directly to the history entry
                    // so the UI can render it.
                    args: request.toolName === 'visualize_graph_data' ? result : undefined, 
                    toolResult: { toolName: request.toolName, result: result },
                });

            } catch (error) {
                const errorMessage = `Tool execution failed for '${request.toolName}': ${(error as Error).message}`;
                console.error(errorMessage);
                addToast(errorMessage, 'error');
                 syscall('ADD_HISTORY_ENTRY', {
                    from: 'system',
                    text: `[ERROR] ${errorMessage}`,
                });
            } finally {
                syscall('CLEAR_TOOL_EXECUTION_REQUEST', {});
            }
        };

        execute(toolExecutionRequest);

    }, [toolExecutionRequest, syscall, addToast, state, geminiAPI]);
};