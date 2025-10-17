// state/plugins.ts
import { Plugin } from '../types';
import { artKnowledge } from './knowledge/art';
import { comparativeNeuroanatomyKnowledge } from './knowledge/comparativeNeuroanatomy';
import { complexSystemsKnowledge } from './knowledge/complexSystems';
import { gardeningKnowledge } from './knowledge/gardening';
import { geneticsKnowledge } from './knowledge/genetics';
import { philosophyOfMindKnowledge } from './knowledge/philosophyOfMind';
import { probabilityTheoryKnowledge } from './knowledge/probabilityTheory';
import { psychologyAndCognitiveBiasesKnowledge } from './knowledge/psychology';
import { softwareDesignKnowledge } from './knowledge/softwareDesign';
import { stemKnowledge } from './knowledge/stem';
import { vigyanBhairavTantraKnowledge } from './knowledge/vigyanBhairavTantra';
import { teslaKnowledge } from './knowledge/tesla';
import { mathlibCoreKnowledge } from './knowledge/mathlibCore';
import { algebraicGeometryKnowledge } from './knowledge/algebraicGeometry';
import { numberTheoryKnowledge } from './knowledge/numberTheory';
import { complexAnalysisKnowledge } from './knowledge/complexAnalysis';
import { typescriptKnowledge } from './knowledge/typescript';
import { machineLearningKnowledge } from './knowledge/machineLearning';
import { Type } from '@google/genai';

export const plugins: Plugin[] = [
  // --- TOOLS ---
  {
    id: 'tool_calculator',
    name: 'plugin_tool_calculator_name',
    description: 'plugin_tool_calculator_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'calculate',
      description: 'Performs mathematical calculations. Can handle basic arithmetic (+, -, *, /) and more complex expressions.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          expression: {
            type: Type.STRING,
            description: 'The mathematical expression to evaluate (e.g., "2 + 2 * (5-3)").',
          },
        },
        required: ['expression'],
      },
    }
  },
  {
    id: 'tool_symbolic_math',
    name: 'plugin_tool_symbolic_math_name',
    description: 'plugin_tool_symbolic_math_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'symbolic_math',
      description: 'Performs symbolic mathematics operations like simplifying, solving, differentiating, or integrating an expression.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          command: {
            type: Type.STRING,
            description: 'The operation to perform.',
            enum: ['simplify', 'solve', 'differentiate', 'integrate', 'factor', 'expand']
          },
          expression: {
            type: Type.STRING,
            description: 'The mathematical expression to operate on, using standard notation (e.g., "x^2 + 2*x + 1"). For solving, include the equation (e.g., "x^2 - 4 = 0").',
          },
          variable: {
            type: Type.STRING,
            description: 'The variable to solve for, differentiate with respect to, or integrate with respect to. Defaults to "x" if not provided. Not needed for simplify, factor, or expand.'
          }
        },
        required: ['command', 'expression'],
      },
    }
  },
  {
    id: 'tool_proof_assistant',
    name: 'plugin_tool_proof_assistant_name',
    description: 'plugin_tool_proof_assistant_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'formal_proof_assistant',
      description: 'Verifies or assists in constructing mathematical proofs within a formal logic system. It can check provided steps or suggest the next logical step to continue the proof.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          statement_to_prove: {
            type: Type.STRING,
            description: 'The final mathematical statement that needs to be proven.',
          },
          proof_steps: {
            type: Type.ARRAY,
            description: 'An ordered list of steps provided so far to construct the proof.',
            items: {
              type: Type.OBJECT,
              properties: {
                step: { type: Type.NUMBER, description: 'The step number.' },
                statement: { type: Type.STRING, description: 'The mathematical statement or expression for this step.' },
                justification: { type: Type.STRING, description: 'The logical rule or axiom used to justify this step.' },
              },
              required: ['step', 'statement', 'justification'],
            },
          },
          action: {
            type: Type.STRING,
            description: 'The action to perform: either verify the completeness and correctness of the provided steps, or suggest the next logical step to continue the proof.',
            enum: ['verify', 'suggest_next_step'],
          }
        },
        required: ['statement_to_prove', 'action'],
      },
    }
  },
  {
    id: 'tool_math_knowledge_retrieval',
    name: 'plugin_tool_math_knowledge_name',
    description: 'plugin_tool_math_knowledge_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'math_knowledge_retrieval',
      description: 'Retrieves formal definitions, theorems, lemmas, or formulas from specialized mathematical knowledge sources like academic archives and encyclopedias.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          query_type: {
            type: Type.STRING,
            description: 'The type of mathematical knowledge to retrieve.',
            enum: ['definition', 'theorem', 'proof', 'lemma', 'formula']
          },
          topic: {
            type: Type.STRING,
            description: 'The broad mathematical field, e.g., "Abstract Algebra", "Topology", "Calculus".'
          },
          keywords: {
            type: Type.ARRAY,
            description: 'Specific keywords to search for, such as "Group Theory", "Fundamental Theorem of Calculus", or "Poincaré conjecture".',
            items: {
              type: Type.STRING
            }
          }
        },
        required: ['query_type', 'keywords']
      }
    }
  },
    {
    id: 'tool_computation_offload',
    name: 'Computation Offload',
    description: 'Offloads a long-running, complex computational task to a background worker.',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'computation_offload',
      description: 'Sends a complex, long-running computation (e.g., high-precision calculation of an L-function, searching for rational points on a curve) to a dedicated high-performance backend. This tool is for non-interactive jobs.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          task_description: {
            type: Type.STRING,
            description: 'A clear, natural language description of the computational goal. For example, "Calculate the first 100 zeros of the Riemann zeta function on the critical line."',
          },
          code_script: {
            type: Type.STRING,
            description: 'A Python script (preferably for SageMath or PARI/GP) that performs the computation. The script should be self-contained and print its final result to standard output.',
          },
        },
        required: ['task_description', 'code_script'],
      },
    }
  },
  {
    id: 'tool_host_command',
    name: 'plugin_tool_host_command_name',
    description: 'plugin_tool_host_command_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'executeHostCommand',
      description: 'Executes a shell command in the host IDE environment using the Host Bridge API. Use with extreme caution for system-level interactions like running tests or linters.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          command: {
            type: Type.STRING,
            description: 'The primary command to execute (e.g., "npm", "git").',
          },
          commandArgs: {
            type: Type.ARRAY,
            description: 'An array of string arguments for the command (e.g., ["run", "test"]). Defaults to an empty array.',
            items: { type: Type.STRING }
          }
        },
        required: ['command'],
      },
    },
  },
  {
    id: 'tool_host_list_files',
    name: 'plugin_tool_host_list_files_name',
    description: 'plugin_tool_host_list_files_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'listFiles',
      description: 'Lists all files and directories recursively under a given path in the host IDE environment.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          path: {
            type: Type.STRING,
            description: 'The directory path to list files from (e.g., "./src/components").',
          },
        },
        required: ['path'],
      },
    },
  },
  {
    id: 'tool_host_open_file',
    name: 'plugin_tool_host_open_file_name',
    description: 'plugin_tool_host_open_file_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'openFileInIDE',
      description: 'Requests the host IDE to open a specific file in the editor for viewing or editing.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          filePath: {
            type: Type.STRING,
            description: 'The full relative path of the file to open (e.g., "src/App.tsx").',
          },
        },
        required: ['filePath'],
      },
    },
  },

  // --- KNOWLEDGE ---
  { id: 'knowledge_art', name: 'plugin_knowledge_art_name', description: 'plugin_knowledge_art_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: artKnowledge },
  { id: 'knowledge_stem', name: 'plugin_knowledge_stem_name', description: 'plugin_knowledge_stem_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: stemKnowledge },
  { id: 'knowledge_psychology', name: 'plugin_knowledge_psychology_name', description: 'plugin_knowledge_psychology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: psychologyAndCognitiveBiasesKnowledge },
  { id: 'knowledge_software_design', name: 'plugin_knowledge_software_design_name', description: 'plugin_knowledge_software_design_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: softwareDesignKnowledge },
  { id: 'knowledge_typescript', name: 'plugin_knowledge_typescript_name', description: 'plugin_knowledge_typescript_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: typescriptKnowledge },
  {
    id: 'knowledge_machine_learning',
    name: 'plugin_knowledge_machine_learning_name',
    description: 'plugin_knowledge_machine_learning_desc',
    type: 'KNOWLEDGE',
    status: 'enabled',
    defaultStatus: 'enabled',
    knowledge: machineLearningKnowledge,
  },
  { id: 'knowledge_philosophy_mind', name: 'plugin_knowledge_philosophy_mind_name', description: 'plugin_knowledge_philosophy_mind_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: philosophyOfMindKnowledge },
  { id: 'knowledge_complex_systems', name: 'plugin_knowledge_complex_systems_name', description: 'plugin_knowledge_complex_systems_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: complexSystemsKnowledge },
  { id: 'knowledge_genetics', name: 'plugin_knowledge_genetics_name', description: 'plugin_knowledge_genetics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: geneticsKnowledge },
  { id: 'knowledge_neuroanatomy', name: 'plugin_knowledge_neuroanatomy_name', description: 'plugin_knowledge_neuroanatomy_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: comparativeNeuroanatomyKnowledge },
  { id: 'knowledge_gardening', name: 'plugin_knowledge_gardening_name', description: 'plugin_knowledge_gardening_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: gardeningKnowledge },
  { id: 'knowledge_probability', name: 'plugin_knowledge_probability_name', description: 'plugin_knowledge_probability_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: probabilityTheoryKnowledge },
  { id: 'knowledge_tantra', name: 'plugin_knowledge_tantra_name', description: 'plugin_knowledge_tantra_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: vigyanBhairavTantraKnowledge },
  { id: 'knowledge_tesla', name: 'knowledge_tesla_book', description: 'knowledge_tesla_book_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: teslaKnowledge },
  { id: 'knowledge_mathlib_core', name: 'plugin_knowledge_mathlib_name', description: 'plugin_knowledge_mathlib_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: mathlibCoreKnowledge },
  { id: 'knowledge_algebraic_geometry', name: 'plugin_knowledge_algebraic_geometry_name', description: 'plugin_knowledge_algebraic_geometry_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: algebraicGeometryKnowledge },
  { id: 'knowledge_number_theory', name: 'plugin_knowledge_number_theory_name', description: 'plugin_knowledge_number_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: numberTheoryKnowledge },
  { id: 'knowledge_complex_analysis', name: 'plugin_knowledge_complex_analysis_name', description: 'plugin_knowledge_complex_analysis_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: complexAnalysisKnowledge },

  // --- COPROCESSORS ---
  { id: 'coprocessor_rie', name: 'plugin_coprocessor_rie_name', description: 'plugin_coprocessor_rie_desc', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_ethical_governor', name: 'plugin_coprocessor_ethical_governor_name', description: 'plugin_coprocessor_ethical_governor_desc', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_proactive_engine', name: 'plugin_coprocessor_proactive_engine_name', description: 'plugin_coprocessor_proactive_engine_desc', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_reasoning_auditor', name: 'Reasoning Auditor', description: 'Monitors formal proof attempts and triggers meta-learning cycles on failure.', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { 
    id: 'coprocessor_math_orchestrator', 
    name: 'plugin_coprocessor_math_orchestrator_name', 
    description: 'plugin_coprocessor_math_orchestrator_desc', 
    type: 'COPROCESSOR', 
    status: 'enabled', 
    defaultStatus: 'enabled' 
  },
];