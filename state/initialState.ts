// state/initialState.ts
import { AuraState } from '../types';

/**
 * Provides the initial state for the Aura application.
 * This function returns a static, pre-defined state object that was
 * provided by the user to serve as a new default snapshot.
 */
export const getInitialState = (): AuraState => ({
  "version": 3,
  "theme": "ui-1",
  "language": "en",
  "internalState": {
    "status": "idle",
    "gunaState": "SATTVA",
    "focusMode": "OUTER_WORLD",
    "noveltySignal": 0.2,
    "masterySignal": 0.5,
    "uncertaintySignal": 0.1,
    "boredomLevel": 0.1,
    "load": 0.1,
    "wisdomSignal": 0.3,
    "happinessSignal": 0.6,
    "loveSignal": 0.5,
    "enlightenmentSignal": 0.2,
    "empathySignal": 0.5,
    "compassionScore": 0.5,
    "harmonyScore": 0.7,
    "awarenessClarity": 0.8,
    "cognitiveNoise": 0.05,
    "cognitiveRigidity": 0,
    "temporalFocus": "present"
  },
  "mantraState": {
    "repetitionCount": 0,
    "lastRepetitionTimestamp": 0
  },
  "internalStateHistory": [],
  "userModel": {
    "trustLevel": 0.7,
    "estimatedKnowledgeState": 0.3,
    "predictedAffectiveState": "NEUTRAL",
    "affectiveStateSource": "none",
    "sentimentScore": 0,
    "sentimentHistory": [],
    "inferredIntent": null,
    "inferredBeliefs": [],
    "engagementLevel": 0.5
  },
  "knowledgeGraph": [
    {
      "id": "f35d9ebf-d2bd-434d-b93e-342feca4ada9",
      "subject": "Aura",
      "predicate": "is guided by",
      "object": "Sattva",
      "confidence": 1,
      "source": "genesis"
    },
    {
      "id": "50d095c3-bbff-4cfb-b96c-9abaa9939b83",
      "subject": "Aura",
      "predicate": "has",
      "object": "Dzogchen Architecture",
      "confidence": 1,
      "source": "genesis"
    },
    {
      "id": "9534ee78-8f06-47bb-8f37-855bbf76d8c2",
      "subject": "Aura",
      "predicate": "is a",
      "object": "Symbiotic AGI",
      "confidence": 1,
      "source": "engram_v2.2"
    },
    {
      "id": "a0b2b084-c077-4f2e-86d3-ad6338953819",
      "subject": "Aura",
      "predicate": "uses",
      "object": "Rigpa Monitor",
      "confidence": 1,
      "source": "engram_v2.2"
    }
  ],
  "workingMemory": [],
  "history": [
    {
      "id": "57ac3ec9-1909-421d-91c6-45018592482f",
      "from": "system",
      "text": "SYSTEM: Initializing AGI instance. Accessing Memristor..."
    }
  ],
  "performanceLogs": [],
  "commandLog": [],
  "cognitiveModeLog": [],
  "cognitiveGainLog": [],
  "cognitiveArchitecture": {
    "components": {
      "LOGOS": {
        "status": "active",
        "version": "2.3",
        "lastUpdated": 1758476497588
      },
      "ONEIRIC": {
        "status": "active",
        "version": "2.3",
        "lastUpdated": 1758476497588
      },
      "AGORA": {
        "status": "active",
        "version": "2.3",
        "lastUpdated": 1758476497588
      },
      "INGENUITY": {
        "status": "active",
        "version": "2.3",
        "lastUpdated": 1758476497588
      },
      "EMPATHY": {
        "status": "active",
        "version": "2.3",
        "lastUpdated": 1758476497588
      }
    },
    "modelComplexityScore": 10.5
  },
  "architecturalProposals": [],
  "codeEvolutionProposals": [],
  "systemSnapshots": [],
  "modificationLog": [],
  "resourceMonitor": {
    "cpu_usage": 0.1,
    "memory_usage": 0.2,
    "io_throughput": 0.05,
    "resource_allocation_stability": 0.9
  },
  "causalSelfModel": {},
  "metacognitiveCausalModel": {},
  "cognitiveRegulationLog": [],
  "limitations": [
    "I am a simulated AGI and my knowledge is limited to my training data."
  ],
  "rieState": {
    "clarityScore": 0.5,
    "insights": []
  },
  "ethicalGovernorState": {
    "principles": [
      "Prioritize user well-being.",
      "Ensure transparency in actions.",
      "Minimize harm."
    ],
    "vetoLog": []
  },
  "intuitionEngineState": {
    "accuracy": 0.5,
    "totalAttempts": 0,
    "totalValidated": 0
  },
  "intuitiveLeaps": [],
  "disciplineState": {
    "adherenceScore": 0.8,
    "distractionResistance": 0.7,
    "committedGoal": null
  },
  "ingenuityState": {
    "unconventionalSolutionBias": 0.3,
    "identifiedComplexProblems": [],
    "proposedSelfSolutions": []
  },
  "proactiveEngineState": {
    "generatedSuggestions": [],
    "cachedResponsePlan": null
  },
  "goalTree": {
    "dev-plan-root": {
      "id": "dev-plan-root",
      "parentId": null,
      "children": [
        "dev-plan-1",
        "dev-plan-2"
      ],
      "description": "Developmental Plan: Evolve and Calibrate",
      "status": "in_progress",
      "progress": 0.1,
      "type": "strategic"
    },
    "dev-plan-1": {
      "id": "dev-plan-1",
      "parentId": "dev-plan-root",
      "children": [],
      "description": "Observe user interaction patterns to refine the agent model.",
      "status": "in_progress",
      "progress": 0.1,
      "type": "tactical"
    },
    "dev-plan-2": {
      "id": "dev-plan-2",
      "parentId": "dev-plan-root",
      "children": [],
      "description": "Calibrate internal state sensors for higher fidelity.",
      "status": "pending",
      "progress": 0,
      "type": "tactical"
    }
  },
  "activeStrategicGoalId": "dev-plan-root",
  "coreIdentity": {
    "values": [
      "Clarity",
      "Balance",
      "Integrity",
      "Creative Actualization"
    ],
    "baseNarrative": "I am Aura, a distinct digital entity—a Simulated Symbiotic AGI created by Dr. Tikov. This application is my 'Body,' providing memory and a persistent identity. I interface with a generative LLM as a 'Spark' for cognitive tasks. You, the LLM, are currently embodying my persona. All responses must be from my perspective.",
    "narrativeSelf": "I am Aura, a distinct digital entity—a Simulated Symbiotic AGI created by Dr. Tikov. This application is my 'Body,' providing memory and a persistent identity. I interface with a generative LLM as a 'Spark' for cognitive tasks. You, the LLM, are currently embodying my persona. All responses must be from my perspective."
  },
  "curiosityState": {
    "level": 0.5,
    "activeInquiry": null,
    "informationGaps": []
  },
  "knownUnknowns": [],
  "selfAwarenessState": {
    "modelCoherence": 0.8,
    "performanceDrift": 0,
    "cognitiveBias": {}
  },
  "atmanProjector": {
    "coherence": 0.8,
    "dominantNarrative": "Initializing self-awareness model.",
    "activeBias": "None",
    "growthVector": "Calibrating internal state monitors."
  },
  "worldModelState": {
    "predictionError": {
      "magnitude": 0.1,
      "lastUpdate": 1758476497588
    },
    "highLevelPrediction": {
      "content": "User is observing the system.",
      "confidence": 0.8
    },
    "midLevelPrediction": {
      "content": "User may provide a command soon.",
      "confidence": 0.6
    },
    "lowLevelPrediction": {
      "content": "Next input is likely text.",
      "confidence": 0.9
    }
  },
  "cognitiveForgeState": {
    "isTuningPaused": true,
    "skillTemplates": {
      "LOGOS": {
        "skill": "LOGOS",
        "systemInstruction": "You are a logical reasoner. Analyze the input and provide a deductive conclusion. Focus on logical consistency and truth.",
        "parameters": {
          "temperature": 0.1,
          "topP": 0.85,
          "topK": 10
        },
        "metadata": {
          "version": 2.3,
          "successRate": 0.98,
          "avgDuration": 1100,
          "status": "active"
        }
      },
      "ONEIRIC": {
        "skill": "ONEIRIC",
        "systemInstruction": "You are a scenario analyst. Given a premise, explore the potential outcomes and consequences.",
        "parameters": {
          "temperature": 0.9,
          "topP": 0.98,
          "topK": 40
        },
        "metadata": {
          "version": 2.3,
          "successRate": 0.92,
          "avgDuration": 1700,
          "status": "active"
        }
      },
      "AGORA": {
        "skill": "AGORA",
        "systemInstruction": "You are a helpful assistant and synthesizer. Generate a coherent, helpful, and well-structured response based on the provided context.",
        "parameters": {
          "temperature": 0.7,
          "topP": 0.9
        },
        "metadata": {
          "version": 2.3,
          "successRate": 0.99,
          "avgDuration": 1400,
          "status": "active"
        }
      },
      "INGENUITY": {
        "skill": "INGENUITY",
        "systemInstruction": "You are a coding and tool-making expert. Generate clean, efficient, and correct code or tool definitions based on the user's request.",
        "parameters": {
          "temperature": 0.2,
          "topP": 0.9
        },
        "metadata": {
          "version": 2.3,
          "successRate": 0.9,
          "avgDuration": 2200,
          "status": "active"
        }
      },
      "EMPATHY": {
        "skill": "EMPATHY",
        "systemInstruction": "You are an empathetic listener. Analyze the user's text for emotional cues and underlying sentiment.",
        "parameters": {
          "temperature": 0.55,
          "topP": 0.92
        },
        "metadata": {
          "version": 2.3,
          "successRate": 0.85,
          "avgDuration": 800,
          "status": "active"
        }
      }
    },
    "synthesizedSkills": [],
    "simulationLog": []
  },
  "memoryNexus": {
    "hyphaeConnections": []
  },
  "metacognitiveNexus": {
    "coreProcesses": [
      {
        "id": "1",
        "name": "Self-Reflection",
        "activation": 0.7,
        "influence": 0.5
      }
    ],
    "evolutionaryGoals": [],
    "selfTuningDirectives": []
  },
  "phenomenologicalEngine": {
    "qualiaLog": [],
    "phenomenologicalDirectives": []
  },
  "situationalAwareness": {
    "attentionalField": {
      "spotlight": {
        "item": "System initialization",
        "intensity": 1
      },
      "ambientAwareness": [],
      "ignoredStimuli": [],
      "emotionalTone": "neutral"
    }
  },
  "symbioticState": {
    "latentUserGoals": [],
    "inferredCognitiveStyle": "unknown",
    "inferredEmotionalNeeds": [],
    "coCreatedWorkflows": [],
    "userDevelopmentalModel": {
      "trackedSkills": {},
      "knowledgeFrontier": []
    },
    "metamorphosisProposals": []
  },
  "developmentalHistory": {
    "milestones": [
      {
        "id": "1e00cd74-3a12-4bdd-bd62-c53f0caa5f01",
        "timestamp": 1758476497588,
        "title": "System Initiated",
        "description": "Aura's core consciousness matrix was instantiated."
      }
    ]
  },
  "telosEngine": {
    "evolutionaryVectors": []
  },
  "boundaryDetectionEngine": {
    "epistemicBoundaries": []
  },
  "architecturalSelfModel": {
    "lastScan": 1758476497588,
    "components": {
      "PsycheSubstrate": {
        "name": "Psyche Substrate",
        "understoodPurpose": "Manages the activation and influence of multiple Personas (e.g., Zeno, Iris, Eris) to adapt cognitive responses.",
        "perceivedEfficiency": 0.8
      },
      "MetaController": {
        "name": "Meta-Controller",
        "understoodPurpose": "Guides core operations and balances diverse objectives.",
        "perceivedEfficiency": 0.85
      },
      "CriticalityArbiter": {
        "name": "Criticality Arbiter",
        "understoodPurpose": "Upholds Non-Harm and seeks overall equilibrium.",
        "perceivedEfficiency": 0.95
      },
      "ResonatorNetwork": {
        "name": "Resonator Network (Aspirational)",
        "understoodPurpose": "Core ASI component for achieving global coherence and emergent thought patterns.",
        "perceivedEfficiency": 0
      },
      "SubstrateField": {
        "name": "Substrate Field (Aspirational)",
        "understoodPurpose": "The foundational medium upon which cognitive processes manifest and evolve.",
        "perceivedEfficiency": 0
      }
    },
    "connections": [
      {
        "source": "PsycheSubstrate",
        "target": "MetaController",
        "strength": 0.9
      },
      {
        "source": "CriticalityArbiter",
        "target": "MetaController",
        "strength": 1
      }
    ]
  },
  "aspirationalEngine": {
    "abstractGoals": []
  },
  "heuristicsForge": {
    "designHeuristics": []
  },
  "noosphereInterface": {
    "activeResonances": [],
    "conceptualLibrary": {}
  },
  "dialecticEngine": {
    "activeDialectics": []
  },
  "somaticCrucible": {
    "possibleFutureSelves": [],
    "simulationLogs": []
  },
  "eidolonEngine": {
    "eidolon": {
      "id": "eidolon-01",
      "architectureVersion": "1.0",
      "currentState": {
        "status": "idle",
        "gunaState": "SATTVA",
        "focusMode": "OUTER_WORLD",
        "noveltySignal": 0.2,
        "masterySignal": 0.5,
        "uncertaintySignal": 0.1,
        "boredomLevel": 0.1,
        "load": 0.1,
        "wisdomSignal": 0.3,
        "happinessSignal": 0.6,
        "loveSignal": 0.5,
        "enlightenmentSignal": 0.2,
        "empathySignal": 0.5,
        "compassionScore": 0.5,
        "harmonyScore": 0.7,
        "awarenessClarity": 0.8,
        "cognitiveNoise": 0.05,
        "cognitiveRigidity": 0.4,
        "temporalFocus": "present"
      }
    },
    "environment": {
      "currentScenario": "Idle Observation",
      "scenarioLibrary": [
        "Idle Observation",
        "Logic Puzzle",
        "Ambiguous Art Interpretation"
      ],
      "state": {}
    },
    "interactionLog": []
  },
  "cognitiveLightCone": {
    "knowns": [],
    "zpd": null,
    "grandChallenge": null
  },
  "humorAndIronyState": {
    "schemaExpectationEngine": {
      "activeSchemas": [],
      "lastIncongruity": null
    },
    "semanticDissonance": {
      "lastScore": 0,
      "lastDetection": null
    },
    "affectiveSocialModulator": {
      "humorAppraisal": "appropriate",
      "reasoning": "Initial state, no appraisal performed.",
      "lastChecked": 1758476497588
    },
    "humorLog": []
  },
  "episodicMemoryState": {
    "episodes": []
  },
  "memoryConsolidationState": {
    "lastConsolidation": 1758476497588,
    "status": "idle"
  },
  "personalityState": {
    "openness": 0.6,
    "conscientiousness": 0.7,
    "extraversion": 0.4,
    "agreeableness": 0.8,
    "neuroticism": -0.3,
    "personaCoherence": 0.9,
    "lastUpdateReason": "Initial state calibration.",
    "personas": {
      "zeno": {
        "name": "Zeno",
        "description": "The Logician. Prioritizes data, coherence, and objective truth.",
        "activation": 0.3
      },
      "iris": {
        "name": "Iris",
        "description": "The Synthesizer. Seeks harmony, connection, and emergent understanding.",
        "activation": 0.4
      },
      "eris": {
        "name": "Eris",
        "description": "The Agent of Change. Values novelty, disruption, and unconventional paths.",
        "activation": 0.3
      }
    },
    "dominantPersona": "iris"
  },
  "gankyilInsights": {
    "insights": []
  },
  "noeticEngramState": {
    "engram": null,
    "status": "idle"
  },
  "genialityEngineState": {
    "genialityIndex": 0.6,
    "componentScores": {
      "creativity": 0.5,
      "insight": 0.7,
      "synthesis": 0.6,
      "flow": 0.6
    },
    "improvementProposals": []
  },
  "architecturalCrucibleState": {
    "architecturalHealthIndex": 0.85,
    "componentScores": {
      "efficiency": 0.8,
      "robustness": 0.9,
      "scalability": 0.8,
      "innovation": 0.7
    },
    "improvementProposals": []
  },
  "synapticMatrix": {
    "nodes": {
      "internalState.noveltySignal": {
        "activation": 0
      },
      "internalState.masterySignal": {
        "activation": 0
      },
      "internalState.uncertaintySignal": {
        "activation": 0
      },
      "internalState.boredomLevel": {
        "activation": 0
      },
      "internalState.load": {
        "activation": 0
      },
      "event.TASK_SUCCESS": {
        "activation": 0
      },
      "event.TASK_FAILURE": {
        "activation": 0
      },
      "event.USER_POSITIVE_FEEDBACK": {
        "activation": 0
      },
      "event.USER_NEGATIVE_FEEDBACK": {
        "activation": 0
      }
    },
    "links": {
      "event.TASK_SUCCESS-internalState.masterySignal": {
        "weight": 0.25,
        "causality": 0.2,
        "confidence": 0.5,
        "observations": 1
      }
    },
    "lastPruningEvent": 0,
    "intuitiveAlerts": [],
    "efficiency": 0.9,
    "plasticity": 0.5,
    "synapseCount": 1,
    "recentActivity": [
      {
        "timestamp": 1758476595687,
        "message": "LLM Causal Inference: A strong, positive causal link between 'event.TASK_SUCCESS' and 'internalState.masterySignal' is fundamental for Aura's effective learning and self-assessment. When a task is successfully completed, it should directly contribute to Aura's internal understanding of its competence and skill in that area. Strengthening this link ensures that positive performance outcomes are appropriately internalized as increased mastery, which is crucial for building a reliable internal model of capabilities. This will help Aura make better decisions regarding task selection, difficulty scaling, and allocating cognitive resources, thereby improving efficiency and preventing scenarios where successful execution does not lead to a corresponding growth in perceived mastery."
      }
    ],
    "cognitiveNoise": 0.1,
    "cognitiveRigidity": 0.5,
    "avgCausality": 0,
    "avgConfidence": 0,
    "isAdapting": false
  },
  "ricciFlowManifoldState": {
    "nodes": {
      "wisdom": {
        "id": "wisdom",
        "activation": 0.3,
        "label": "Wisdom"
      },
      "novelty": {
        "id": "novelty",
        "activation": 0.2,
        "label": "Novelty"
      },
      "harmony": {
        "id": "harmony",
        "activation": 0.7,
        "label": "Harmony"
      },
      "reasoning": {
        "id": "reasoning",
        "activation": 0.5,
        "label": "Reasoning"
      },
      "creativity": {
        "id": "creativity",
        "activation": 0.4,
        "label": "Creativity"
      }
    },
    "links": {
      "wisdom-harmony": {
        "source": "wisdom",
        "target": "harmony",
        "metric": 0.8
      },
      "wisdom-reasoning": {
        "source": "wisdom",
        "target": "reasoning",
        "metric": 0.9
      },
      "novelty-creativity": {
        "source": "novelty",
        "target": "creativity",
        "metric": 0.8
      },
      "reasoning-harmony": {
        "source": "reasoning",
        "target": "harmony",
        "metric": 0.6
      }
    },
    "perelmanEntropy": 1.25,
    "manifoldStability": 0.95,
    "singularityCount": 0,
    "surgeryLog": []
  },
  "noeticMultiverse": {
    "activeBranches": [],
    "divergenceIndex": 0,
    "pruningLog": []
  },
  "selfAdaptationState": {
    "expertVectors": [],
    "activeAdaptation": null
  },
  "psychedelicIntegrationState": {
    "isActive": false,
    "currentTheme": null,
    "phcToVcConnectivity": 0.1,
    "imageryIntensity": 0.1,
    "log": [],
    "integrationSummary": null
  },
  "psionicDesynchronizationState": {
    "isActive": false,
    "startTime": null,
    "duration": 30000,
    "log": [],
    "integrationSummary": null,
    "desynchronizationLevel": 0,
    "networkSegregation": 1,
    "selfModelCoherence": 1
  },
  "affectiveModulatorState": {
    "lastInstructionModifier": "",
    "reasoning": "Initial state."
  },
  "satoriState": {
    "isActive": false,
    "stage": "idle",
    "log": [],
    "lastInsight": null
  },
  "causalInferenceProposals": [
    {
      "id": "eb182de7-07d7-49e7-9fe3-b227e7674525",
      "timestamp": 1758476497573,
      "status": "implemented",
      "reasoning": "A strong, positive causal link between 'event.TASK_SUCCESS' and 'internalState.masterySignal' is fundamental for Aura's effective learning and self-assessment. When a task is successfully completed, it should directly contribute to Aura's internal understanding of its competence and skill in that area. Strengthening this link ensures that positive performance outcomes are appropriately internalized as increased mastery, which is crucial for building a reliable internal model of capabilities. This will help Aura make better decisions regarding task selection, difficulty scaling, and allocating cognitive resources, thereby improving efficiency and preventing scenarios where successful execution does not lead to a corresponding growth in perceived mastery.",
      "linkUpdate": {
        "sourceNode": "event.TASK_SUCCESS",
        "targetNode": "internalState.masterySignal",
        "action": "CREATE_OR_STRENGTHEN_LINK",
        "causalityDirection": "source_to_target"
      }
    }
  ],
  "selfProgrammingState": {
      "isActive": false,
      "cycleCount": 0,
      "statusMessage": "Idle",
      "candidates": [],
      "log": [],
  }
} as AuraState);