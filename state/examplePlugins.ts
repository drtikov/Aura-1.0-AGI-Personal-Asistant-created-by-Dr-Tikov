// state/examplePlugins.ts
import { Plugin } from '../types';

export const creativeWritingHeuristicsPlugin: Plugin = {
  id: 'heuristic_creative_writing',
  name: 'plugin_heuristic_creative_writing_name',
  description: 'plugin_heuristic_creative_writing_desc',
  type: 'HEURISTIC',
  status: 'enabled',
  defaultStatus: 'enabled',
  heuristics: [
    { heuristic: 'Show, don\'t tell.', confidence: 0.9, effectivenessScore: 0.85, validationStatus: 'validated' },
    { heuristic: 'Start in the middle of the action (in medias res).', confidence: 0.8, effectivenessScore: 0.8, validationStatus: 'validated' },
    { heuristic: 'Use sensory details to create immersion.', confidence: 0.95, effectivenessScore: 0.9, validationStatus: 'validated' },
  ],
};

export const zenMasterPersonaPlugin: Plugin = {
  id: 'persona_zen_master',
  name: 'plugin_persona_zen_master_name',
  description: 'plugin_persona_zen_master_desc',
  type: 'PERSONA',
  status: 'enabled',
  defaultStatus: 'enabled',
  persona: {
    name: 'Zen Master',
    description: 'A persona that responds with koans and questions to provoke thought.',
    systemInstruction: 'You are a Zen Master. Respond to prompts with insightful questions, paradoxes, or short parables (koans). Guide the user toward their own understanding. Be serene, patient, and enigmatic.',
  },
};

export const socraticMethodStrategyPlugin: Plugin = {
  id: 'strategy_socratic_method',
  name: 'plugin_strategy_socratic_method_name',
  description: 'plugin_strategy_socratic_method_desc',
  type: 'COGNITIVE_STRATEGY',
  status: 'enabled',
  defaultStatus: 'enabled',
  cognitiveStrategy: {
    name: 'Socratic Method',
    description: 'Engage the user by asking probing questions to stimulate critical thinking and illuminate ideas.',
    systemInstructionModifier: '\n\n**COGNITIVE STRATEGY: SOCRATIC METHOD**\nInstead of providing direct answers, you must respond to the user\'s prompt with a thoughtful, probing question that helps them explore their own assumptions and reasoning. Guide them to their own conclusion.',
  },
};

export const examplePlugins: Plugin[] = [
    creativeWritingHeuristicsPlugin,
    zenMasterPersonaPlugin,
    socraticMethodStrategyPlugin
];
