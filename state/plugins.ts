// state/plugins.ts
import { Plugin } from '../types.ts';
import { abstractionAndPatternsKnowledge } from './knowledge/abstractionAndPatterns';
import { aestheticsKnowledge } from './knowledge/aesthetics';
import { algebraicGeometryKnowledge } from './knowledge/algebraicGeometry';
import { anthropologyKnowledge } from './knowledge/anthropology';
import { artKnowledge } from './knowledge/art';
import { astronomyKnowledge } from './knowledge/astronomy';
import { backendImplementationKnowledge } from './knowledge/backendImplementation';
import { biologyKnowledge } from './knowledge/biology';
import { chaosDynamicsKnowledge } from './knowledge/chaosDynamics';
import { chemistryKnowledge } from './knowledge/chemistry';
import { classicalMechanicsKnowledge } from './knowledge/classicalMechanics';
import { cloudServicesKnowledge } from './knowledge/cloudServices';
import { cognitiveScienceKnowledge } from './knowledge/cognitiveScience';
import { comparativeNeuroanatomyKnowledge } from './knowledge/comparativeNeuroanatomy';
import { complexAnalysisKnowledge } from './knowledge/complexAnalysis';
import { complexSystemsKnowledge } from './knowledge/complexSystems';
import { computerScienceKnowledge } from './knowledge/computerScience';
import { databaseManagementKnowledge } from './knowledge/databaseManagement';
import { dataScienceKnowledge } from './knowledge/dataScience';
import { dataVisualizationKnowledge } from './knowledge/dataVisualization';
import { designPatternsKnowledge } from './knowledge/designPatterns';
import { devopsKnowledge } from './knowledge/devops';
import { digitalAssetManagementKnowledge } from './knowledge/digitalAssetManagement';
import { ecologyKnowledge } from './knowledge/ecology';
import { economicsKnowledge } from './knowledge/economics';
import { engineeringDesignKnowledge } from './knowledge/engineeringDesign';
import { ergodicTheoryKnowledge } from './knowledge/ergodicTheory';
import { ethicsKnowledge } from './knowledge/ethics';
import { fourierAnalysisKnowledge } from './knowledge/fourierAnalysis';
import { foundationalAxioms } from './knowledge/foundationalAxioms';
import { gameTheoryKnowledge } from './knowledge/gameTheory';
import { gardeningKnowledge } from './knowledge/gardening';
import { geneticsKnowledge } from './knowledge/genetics';
import { geologyKnowledge } from './knowledge/geology';
import { historyKnowledge } from './knowledge/history';
import { installedSDKsKnowledge } from './knowledge/installedSDKs';
import { intuitionisticLogicKnowledge } from './knowledge/intuitionisticLogic';
import { jestVitestKnowledge } from './knowledge/jestVitest';
import { leanKnowledge } from './knowledge/lean';
import { literaryTheoryKnowledge } from './knowledge/literaryTheory';
import { machineLearningKnowledge } from './knowledge/machineLearning';
import { marketAnalysisKnowledge } from './knowledge/marketAnalysis';
import { mathjsKnowledge } from './knowledge/mathjs';
import { mathlibCoreKnowledge } from './knowledge/mathlibCore';
import { musicTheoryKnowledge } from './knowledge/musicTheory';
import { numberTheoryKnowledge } from './knowledge/numberTheory';
import { numericjsKnowledge } from './knowledge/numericjs';
import { organizationalPsychologyKnowledge } from './knowledge/organizationalPsychology';
import { pedagogyKnowledge } from './knowledge/pedagogy';
import { philosophyOfMindKnowledge } from './knowledge/philosophyOfMind';
import { physicsKnowledge } from './knowledge/physics';
import { pluginArchitectureKnowledge } from './knowledge/pluginArchitecture';
import { probabilityTheoryKnowledge } from './knowledge/probabilityTheory';
import { productManagementKnowledge } from './knowledge/productManagement';
import { psychologyAndCognitiveBiasesKnowledge } from './knowledge/psychology';
import { pythonKnowledge } from './knowledge/python';
import { reactKnowledge } from './knowledge/react';
import { securityKnowledge } from './knowledge/security';
import { selfCohesionKnowledge } from './knowledge/selfCohesion';
import { softwareDesignKnowledge } from './knowledge/softwareDesign';
import { sociologyKnowledge } from './knowledge/sociology';
import { stemKnowledge } from './knowledge/stem';
import { strategicForecastingKnowledge } from './knowledge/strategicForecasting';
import { technicalWritingKnowledge } from './knowledge/technicalWriting';
import { teslaKnowledge } from './knowledge/tesla';
import { teslaAetherKnowledge } from './knowledge/teslaAether';
import { topologyKnowledge } from './knowledge/topology';
import { typescriptKnowledge } from './knowledge/typescript';
import { userModelingKnowledge } from './knowledge/userModeling';
import { userOnboardingKnowledge } from './knowledge/userOnboarding';
import { uxPrinciplesKnowledge } from './knowledge/uxPrinciples';
import { vigyanBhairavTantraKnowledge } from './knowledge/vigyanBhairavTantra';
import { vlmArchitectureKnowledge } from './knowledge/vlmArchitecture';
import { webServersKnowledge } from './knowledge/webServers';
import { workflowDesignKnowledge } from './knowledge/workflowDesign';
import { pdeKnowledge } from './knowledge/pde';
import { functionalAnalysisKnowledge } from './knowledge/functionalAnalysis';
import { fluidDynamicsKnowledge } from './knowledge/fluidDynamics';
import { cloudInfrastructureKnowledge } from './knowledge/cloudInfrastructure';
import { businessAndFinanceKnowledge } from './knowledge/businessAndFinance';
import { entrepreneurNetworkData } from './knowledge/entrepreneurNetwork';
import { realEstateKnowledge } from './knowledge/realEstate';
import { homeImprovementKnowledge } from './knowledge/homeImprovement';
import { interiorDesignKnowledge } from './knowledge/interiorDesign';
import { urbanPlanningKnowledge } from './knowledge/urbanPlanning';
import { propertyLawKnowledge } from './knowledge/propertyLaw';
import { personalFinanceKnowledge } from './knowledge/personalFinance';
import { Type } from '@google/genai';
import { examplePlugins } from './examplePlugins';
import { heuristicsPlugins } from './knowledge/heuristics';
import { personaPlugins } from './knowledge/personas';
import { cognitiveStrategyPlugins } from './knowledge/cognitiveStrategies';


export const plugins: Plugin[] = [
  // --- NEW HARMONIC ENGINE PLUGINS ---
  {
    id: 'coprocessor_harmonic_engine',
    name: 'plugin_coprocessor_harmonic_engine_name',
    description: 'plugin_coprocessor_harmonic_engine_desc',
    type: 'COPROCESSOR',
    status: 'enabled',
    defaultStatus: 'enabled',
  },
  {
    id: 'tool_harmonic_engine_solve',
    name: 'plugin_tool_harmonic_engine_solve_name',
    description: 'plugin_tool_harmonic_engine_solve_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'harmonic_engine_solve',
      description: 'Solves a potential field problem using harmonic functions. Ideal for pathfinding, physics simulation (heat, electrostatics), and abstract optimization.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          problem_description: {
            type: Type.STRING,
            description: 'A natural language description of the problem (e.g., "Find the optimal path in a maze" or "Model heat distribution on a 2D plate").',
          },
          dimensionality: {
            type: Type.NUMBER,
            description: 'The number of dimensions for the problem space (e.g., 2 for 2D, 3 for 3D).',
          },
          domain_definition: {
            type: Type.STRING,
            description: 'A description of the problem space, e.g., "A 10x10 grid".'
          },
          boundary_conditions: {
            type: Type.STRING,
            description: 'A JSON string describing the constraints, obstacles, sources, or sinks. E.g., \'{"walls": [[2,2], [2,3]], "goal": [8,8]}\'.',
          },
        },
        required: ['problem_description', 'dimensionality', 'boundary_conditions', 'domain_definition'],
      },
    }
  },
  
  // --- NEW REAL ESTATE PLUGINS ---
  { id: 'knowledge_real_estate', name: 'plugin_knowledge_real_estate_name', description: 'plugin_knowledge_real_estate_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: realEstateKnowledge },
  {
    id: 'tool_mortgage_calculator',
    name: 'plugin_tool_mortgage_calculator_name',
    description: 'plugin_tool_mortgage_calculator_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'calculateMortgagePayment',
      description: 'Calculates the monthly mortgage payment (principal + interest).',
      parameters: {
        type: Type.OBJECT,
        properties: {
          loanAmount: { type: Type.NUMBER, description: 'The total amount of the loan.' },
          interestRate: { type: Type.NUMBER, description: 'The annual interest rate (e.g., 6.5 for 6.5%).' },
          loanTerm: { type: Type.NUMBER, description: 'The loan term in years.' },
        },
        required: ['loanAmount', 'interestRate', 'loanTerm'],
      },
    }
  },
  {
    id: 'tool_market_analyzer',
    name: 'plugin_tool_market_analyzer_name',
    description: 'plugin_tool_market_analyzer_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'analyzeMarketTrends',
      description: 'Analyzes real estate market trends for a specific location using real-time web data. Provides key metrics like median sale price, average days on market, and price per square foot.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING, description: 'The city or area to analyze (e.g., "Austin, TX").' },
          propertyType: { type: Type.STRING, description: 'The type of property to analyze (e.g., "single-family home", "condo").' },
        },
        required: ['location', 'propertyType'],
      },
    }
  },
  {
    id: 'tool_comps_finder',
    name: 'plugin_tool_comps_finder_name',
    description: 'plugin_tool_comps_finder_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'findComparableProperties',
      description: 'Finds simulated comparable sold properties ("comps") to help estimate a property\'s value.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          address: { type: Type.STRING, description: 'The address of the subject property.' },
          beds: { type: Type.NUMBER, description: 'Number of bedrooms in the subject property.' },
          baths: { type: Type.NUMBER, description: 'Number of bathrooms in the subject property.' },
          sqft: { type: Type.NUMBER, description: 'Square footage of the subject property.' },
          radius: { type: Type.NUMBER, description: 'Search radius in miles for comparable properties.' },
        },
        required: ['address', 'beds', 'baths', 'sqft', 'radius'],
      },
    }
  },
  {
    id: 'tool_listing_generator',
    name: 'plugin_tool_listing_generator_name',
    description: 'plugin_tool_listing_generator_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'generateListingDescription',
      description: 'Generates a compelling real estate listing description.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          features: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of key features and amenities (e.g., "renovated kitchen", "large backyard").' },
          characteristics: { type: Type.STRING, description: 'Unique characteristics or story of the property (e.g., "historic charm", "great for entertaining").' },
          tone: { type: Type.STRING, description: 'The desired tone of the description.', enum: ['Luxury', 'Cozy', 'Modern', 'Family-Friendly'] },
        },
        required: ['features', 'tone'],
      },
    }
  },
  {
    id: 'tool_investment_calculator',
    name: 'plugin_tool_investment_calculator_name',
    description: 'plugin_tool_investment_calculator_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'calculateInvestmentMetrics',
      description: 'Calculates key metrics for a real estate investment property.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          purchasePrice: { type: Type.NUMBER },
          downPayment: { type: Type.NUMBER },
          monthlyRent: { type: Type.NUMBER },
          annualTaxes: { type: Type.NUMBER },
          annualInsurance: { type: Type.NUMBER },
          vacancyRate: { type: Type.NUMBER, description: 'Percentage (e.g., 5 for 5%)' },
        },
        required: ['purchasePrice', 'downPayment', 'monthlyRent', 'annualTaxes', 'annualInsurance'],
      },
    }
  },
  {
    id: 'tool_neighborhood_explorer',
    name: 'plugin_tool_neighborhood_explorer_name',
    description: 'plugin_tool_neighborhood_explorer_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'getNeighborhoodData',
      description: 'Retrieves hyper-local data for a specific location using Google Maps grounding.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING, description: 'An address or neighborhood name.' },
        },
        required: ['location'],
      },
    }
  },
  {
    id: 'tool_affordability_calculator',
    name: 'plugin_tool_affordability_calculator_name',
    description: 'plugin_tool_affordability_calculator_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'calculateAffordability',
      description: 'Calculates a recommended maximum home price based on income and debts.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          annualIncome: { type: Type.NUMBER },
          monthlyDebts: { type: Type.NUMBER },
          downPayment: { type: Type.NUMBER },
        },
        required: ['annualIncome', 'monthlyDebts', 'downPayment'],
      },
    }
  },
  {
    id: 'tool_home_buying_guide',
    name: 'plugin_tool_home_buying_guide_name',
    description: 'plugin_tool_home_buying_guide_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'startHomeBuyingGuide',
      description: 'Initiates the creation of a step-by-step interactive guide for buying or selling a home.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          processType: { type: Type.STRING, enum: ['buying', 'selling'] },
        },
        required: ['processType'],
      },
    }
  },

  // --- NEW KNOWLEDGE PLUGINS ---
  { id: 'knowledge_home_improvement', name: 'plugin_knowledge_home_improvement_name', description: 'plugin_knowledge_home_improvement_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: homeImprovementKnowledge },
  { id: 'knowledge_interior_design', name: 'plugin_knowledge_interior_design_name', description: 'plugin_knowledge_interior_design_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: interiorDesignKnowledge },
  { id: 'knowledge_urban_planning', name: 'plugin_knowledge_urban_planning_name', description: 'plugin_knowledge_urban_planning_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: urbanPlanningKnowledge },
  { id: 'knowledge_property_law', name: 'plugin_knowledge_property_law_name', description: 'plugin_knowledge_property_law_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: propertyLawKnowledge },
  { id: 'knowledge_personal_finance', name: 'plugin_knowledge_personal_finance_name', description: 'plugin_knowledge_personal_finance_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: personalFinanceKnowledge },
  
  // --- NEW BUSINESS PLUGINS ---
  { id: 'knowledge_business_finance', name: 'plugin_knowledge_business_finance_name', description: 'plugin_knowledge_business_finance_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: businessAndFinanceKnowledge },
  { id: 'knowledge_entrepreneur_network', name: 'plugin_knowledge_entrepreneur_network_name', description: 'plugin_knowledge_entrepreneur_network_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: entrepreneurNetworkData },

  // --- NEW CONCEPTUAL PLUGINS ---
  { id: 'knowledge_self_cohesion', name: 'plugin_knowledge_self_cohesion_name', description: 'plugin_knowledge_self_cohesion_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: selfCohesionKnowledge },
  { id: 'coprocessor_orchestrator', name: 'Orchestrator Plugin', description: 'Dynamically assembles workflows from other tools based on user intent.', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_homeostatic', name: 'Homeostatic Plugin', description: 'Monitors and regulates system health, pruning memory and tasks to maintain equilibrium.', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_synthesis', name: 'Synthesis Plugin', description: 'Proactively generates novel ideas and creative content by finding connections in memory.', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'tool_reflector', name: 'Reflector Plugin', description: 'A tool to explain Aura\'s own components and functions from first principles.', type: 'TOOL', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'knowledge_axiomatic', name: 'Axiomatic Plugin', description: 'A knowledge base of foundational, verifiable axioms and logical rules.', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: foundationalAxioms },
  { id: 'coprocessor_axiom_guardian', name: 'Axiom Guardian', description: 'Periodically checks for logical inconsistencies between new facts and foundational axioms.', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_qualia_mapper', name: 'Qualia-Topology Mapper', description: 'Finds correlations between internal state (qualia) and knowledge graph structure, forging new causal links.', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },

  { id: 'coprocessor_daedalus', name: 'daedalus_panel_title', description: 'daedalus_description', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },
  { id: 'coprocessor_eris', name: 'eris_engine_panel_title', description: 'eris_description', type: 'COPROCESSOR', status: 'enabled', defaultStatus: 'enabled' },

  // --- NEW SERVER DEPLOYMENT PLUGINS ---
  { id: 'knowledge_cloud_services', name: 'plugin_knowledge_cloud_services_name', description: 'plugin_knowledge_cloud_services_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: cloudServicesKnowledge },
  { id: 'knowledge_database_management', name: 'plugin_knowledge_database_management_name', description: 'plugin_knowledge_database_management_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: databaseManagementKnowledge },
  { id: 'knowledge_backend_implementation', name: 'plugin_knowledge_backend_implementation_name', description: 'plugin_knowledge_backend_implementation_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: backendImplementationKnowledge },
  { id: 'knowledge_devops', name: 'plugin_knowledge_devops_name', description: 'plugin_knowledge_devops_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: devopsKnowledge },
  { id: 'knowledge_web_servers', name: 'plugin_knowledge_web_servers_name', description: 'plugin_knowledge_web_servers_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: webServersKnowledge },
  { id: 'knowledge_cloud_infrastructure', name: 'plugin_knowledge_cloud_infrastructure_name', description: 'plugin_knowledge_cloud_infrastructure_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: cloudInfrastructureKnowledge },
  
  // --- NEW MATH PLUGINS ---
  { id: 'knowledge_pde', name: 'plugin_knowledge_pde_name', description: 'plugin_knowledge_pde_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: pdeKnowledge },
  { id: 'knowledge_functional_analysis', name: 'plugin_knowledge_functional_analysis_name', description: 'plugin_knowledge_functional_analysis_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: functionalAnalysisKnowledge },
  { id: 'knowledge_fluid_dynamics', name: 'plugin_knowledge_fluid_dynamics_name', description: 'plugin_knowledge_fluid_dynamics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: fluidDynamicsKnowledge },
  
  // --- EXISTING TOOLS ---
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
            enum: ['simplify', 'solve', 'differentiate']
          },
          expression: {
            type: Type.STRING,
            description: 'The mathematical expression to operate on, using standard notation (e.g., "x^2 + 2*x + 1"). For solving, include the equation (e.g., "x^2 - 4 = 0").',
          },
          variable: {
            type: Type.STRING,
            description: 'The variable to solve for or differentiate with respect to. Defaults to "x" if not provided. Not needed for simplify.'
          }
        },
        required: ['command', 'expression'],
      },
    }
  },
   {
    id: 'tool_numerical_computation',
    name: 'plugin_tool_numerical_computation_name',
    description: 'plugin_tool_numerical_computation_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'numerical_computation',
      description: 'Performs high-performance numerical linear algebra operations like matrix multiplication.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          operation: {
            type: Type.STRING,
            enum: ['matrix_multiply']
          },
          matrixA: {
            type: Type.ARRAY,
            description: "The first matrix, represented as an array of arrays of numbers.",
            items: { type: Type.ARRAY, items: { type: Type.NUMBER } }
          },
          matrixB: {
            type: Type.ARRAY,
            description: "The second matrix, represented as an array of arrays of numbers.",
            items: { type: Type.ARRAY, items: { type: Type.NUMBER } }
          }
        },
        required: ['operation', 'matrixA', 'matrixB']
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
    id: 'tool_propose_lemma',
    name: 'Mathematical Lemma Proposer',
    description: 'Analyzes a goal and context to propose a new, unproven mathematical statement (lemma) that could help bridge a gap in a proof.',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'propose_mathematical_lemma',
      description: 'Generates a novel mathematical conjecture or lemma based on a goal and the current context of a proof.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          goal: {
            type: Type.STRING,
            description: 'The high-level mathematical goal being pursued.',
          },
          context: {
            type: Type.STRING,
            description: 'The current state of the proof, including established facts and the specific gap that needs to be bridged.',
          },
        },
        required: ['goal', 'context'],
      },
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
      description: 'Executes a shell command in the host IDE environment. Use for system-level tasks like running Terraform, kubectl, git, npm, or cloud provider CLIs (aws, gcloud, az).',
      parameters: {
        type: Type.OBJECT,
        properties: {
          command: {
            type: Type.STRING,
            description: 'The primary command to execute (e.g., "terraform", "npm", "git").',
          },
          commandArgs: {
            type: Type.ARRAY,
            description: 'An array of string arguments for the command (e.g., ["apply", "-auto-approve"]).',
            items: { type: Type.STRING }
          }
        },
        required: ['command', 'commandArgs'],
      },
    },
  },
  {
    id: 'tool_write_file',
    name: 'plugin_tool_write_file_name',
    description: 'plugin_tool_write_file_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
        name: 'writeFile',
        description: 'Writes or overwrites a file in the virtual file system (VFS) or host environment. Use for creating configuration files like Dockerfile, nginx.conf, or Terraform .tf files.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                filePath: {
                    type: Type.STRING,
                    description: "The full path of the file to write (e.g., 'Dockerfile', 'src/config.json')."
                },
                content: {
                    type: Type.STRING,
                    description: "The full content to write to the file."
                }
            },
            required: ['filePath', 'content']
        }
    }
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
  {
    id: 'tool_generateAST',
    name: 'plugin_tool_generateAST_name',
    description: 'plugin_tool_generateAST_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'generateAST',
      description: 'Parses a source code file from the VFS and returns its Abstract Syntax Tree (AST) as a JSON object.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          filePath: {
            type: Type.STRING,
            description: "The full path of the file in the VFS to parse (e.g., 'hooks/useAura.ts').",
          },
        },
        required: ['filePath'],
      },
    }
  },
  {
    id: 'tool_calculateCodeMetrics',
    name: 'plugin_tool_calculateCodeMetrics_name',
    description: 'plugin_tool_calculateCodeMetrics_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'calculateCodeMetrics',
      description: 'Computes code quality metrics for a given file. Requires an AST, but can be called directly with a file path.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          filePath: {
            type: Type.STRING,
            description: "The full path of the file in the VFS to analyze (e.g., 'components/CoreMonitor.tsx').",
          },
        },
        required: ['filePath'],
      },
    }
  },
  {
    id: 'tool_runNpmAudit',
    name: 'plugin_tool_runNpmAudit_name',
    description: 'plugin_tool_runNpmAudit_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'runNpmAudit',
      description: "Executes 'npm audit --json' in the host environment to check for dependency vulnerabilities. This requires the Host Bridge to be active.",
      parameters: {
        type: Type.OBJECT,
        properties: {}, // No parameters needed
      },
    }
  },
  {
    id: 'tool_getGitBlame',
    name: 'plugin_tool_getGitBlame_name',
    description: 'plugin_tool_getGitBlame_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'getGitBlame',
      description: "Executes 'git blame' on a file in the host environment to get line-by-line authorship information. Requires the Host Bridge.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          filePath: {
            type: Type.STRING,
            description: "The path of the file to run git blame on.",
          },
        },
        required: ['filePath'],
      },
    }
  },
  {
    id: 'tool_graph_visualizer',
    name: 'plugin_tool_graph_visualizer_name',
    description: 'plugin_tool_graph_visualizer_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'graph_visualizer',
      description: "Generates a text-based (ASCII) representation of a graph from a list of nodes and edges.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          nodes: {
            type: Type.ARRAY,
            description: "An array of node objects.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
              }
            }
          },
          edges: {
            type: Type.ARRAY,
            description: "An array of edge objects connecting nodes by ID.",
            items: {
              type: Type.OBJECT,
              properties: {
                from: { type: Type.STRING },
                to: { type: Type.STRING },
              }
            }
          },
        },
        required: ['nodes', 'edges'],
      },
    }
  },
  {
    id: 'tool_generate_doc_template',
    name: 'plugin_tool_generate_doc_template_name',
    description: 'plugin_tool_generate_doc_template_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'generate_documentation_template',
      description: "Generates a standard Markdown documentation template for a given source file.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          file_path: {
            type: Type.STRING,
            description: "The path of the source file to document.",
          },
        },
        required: ['file_path'],
      },
    }
  },
  {
    id: 'tool_prioritization_matrix',
    name: 'plugin_tool_prioritization_matrix_name',
    description: 'plugin_tool_prioritization_matrix_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'prioritization_matrix_tool',
      description: "Takes a list of tasks and returns a prioritized list based on a RICE (Reach, Impact, Confidence, Effort) score.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          tasks: {
            type: Type.ARRAY,
            description: "An array of task objects to be scored and prioritized.",
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                description: { type: Type.STRING },
              }
            }
          },
        },
        required: ['tasks'],
      },
    }
  },
  {
    id: 'tool_data_analysis',
    name: 'plugin_tool_data_analysis_name',
    description: 'plugin_tool_data_analysis_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'data_analysis_tool',
      description: "Performs basic statistical analysis on a given dataset provided as a CSV string.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          dataset_csv: {
            type: Type.STRING,
            description: "A string containing data in CSV format. The first line must be the header.",
          },
        },
        required: ['dataset_csv'],
      },
    }
  },
  {
    id: 'tool_vulnerability_scanner',
    name: 'plugin_tool_vulnerability_scanner_name',
    description: 'plugin_tool_vulnerability_scanner_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'vulnerability_scanner_tool',
      description: "Performs a static analysis scan on a code snippet to find potential security vulnerabilities.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          code_snippet: {
            type: Type.STRING,
            description: "The source code to be analyzed for vulnerabilities.",
          },
        },
        required: ['code_snippet'],
      },
    }
  },
  {
    id: 'tool_ci_cd_pipeline_generator',
    name: 'plugin_tool_ci_cd_pipeline_generator_name',
    description: 'plugin_tool_ci_cd_pipeline_generator_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'ci_cd_pipeline_generator_tool',
      description: "Generates a CI/CD pipeline configuration in YAML format based on requirements.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          platform: {
            type: Type.STRING,
            description: "The target CI/CD platform.",
            enum: ['GitHub Actions', 'GitLab CI', 'Jenkins']
          },
          build_command: {
            type: Type.STRING,
            description: "The shell command to build the application (e.g., 'npm run build').",
          },
          test_command: {
            type: Type.STRING,
            description: "The shell command to run tests (e.g., 'npm test').",
          },
        },
        required: ['platform', 'build_command', 'test_command'],
      },
    }
  },
  {
    id: 'tool_web_server_config_generator',
    name: 'plugin_tool_web_server_config_generator_name',
    description: 'plugin_tool_web_server_config_generator_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'web_server_config_generator_tool',
      description: "Generates a mock Nginx web server configuration file based on hosting requirements.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          domain_name: {
            type: Type.STRING,
            description: "The domain name for the server block (e.g., 'example.com').",
          },
          proxy_pass_url: {
            type: Type.STRING,
            description: "The upstream application URL to proxy requests to (e.g., 'http://localhost:3000').",
          },
          enable_ssl: {
            type: Type.BOOLEAN,
            description: "Whether to include a placeholder SSL configuration.",
          },
        },
        required: ['domain_name', 'proxy_pass_url'],
      },
    }
  },
  {
    id: 'tool_propose_collaboration',
    name: 'plugin_tool_propose_collaboration_name',
    description: 'plugin_tool_propose_collaboration_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'propose_collaboration',
      description: "Used by The Liaison to formally propose a collaborative action to the user, such as creating a workflow.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          observation: { type: Type.STRING, description: "The observed user behavior pattern." },
          suggestion: { type: Type.STRING, description: "The proposed collaborative action or automation." },
        },
        required: ['observation', 'suggestion'],
      },
    }
  },
   {
    id: 'tool_design_new_plugin',
    name: 'plugin_tool_design_new_plugin_name',
    description: 'plugin_tool_design_new_plugin_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'design_new_plugin',
      description: "Used by The Artificer to design the schema for a new, simple tool plugin.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          plugin_name: { type: Type.STRING, description: "The name for the new plugin." },
          plugin_description: { type: Type.STRING, description: "A brief description of what the plugin does." },
          function_signature: { type: Type.STRING, description: "A text description of the function signature, including parameters and return type." },
        },
        required: ['plugin_name', 'plugin_description', 'function_signature'],
      },
    }
  },
  {
    id: 'tool_audit_workflows',
    name: 'plugin_tool_audit_workflows_name',
    description: 'plugin_tool_audit_workflows_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'audit_workflows',
      description: "Used by The Curator to analyze the usage and efficiency of an existing Co-Created Workflow.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          workflow_id: { type: Type.STRING, description: "The ID of the workflow to audit." },
        },
        required: ['workflow_id'],
      },
    }
  },
  {
    id: 'tool_review_artifact_usability',
    name: 'plugin_tool_review_artifact_usability_name',
    description: 'plugin_tool_review_artifact_usability_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'review_artifact_usability',
      description: "Used by The Advocate to formally review a proposed workflow or plugin design for usability issues.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          artifact_id: { type: Type.STRING, description: "The ID of the workflow or plugin design being reviewed." },
          review_notes: { type: Type.STRING, description: "Markdown-formatted notes on potential usability issues, confusion points, or suggestions for simplification." },
        },
        required: ['artifact_id', 'review_notes'],
      },
    }
  },
  {
    id: 'tool_propose_abstraction',
    name: 'plugin_tool_propose_abstraction_name',
    description: 'plugin_tool_propose_abstraction_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'propose_abstraction',
      description: "Used by The Synthesizer to propose generalizing multiple workflows into a single, more powerful tool.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          source_artifact_ids: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of IDs for the artifacts that show a recurring pattern." },
          proposal_summary: { type: Type.STRING, description: "A summary of the identified pattern and the proposed new, generalized tool." },
        },
        required: ['source_artifact_ids', 'proposal_summary'],
      },
    }
  },
  {
    id: 'tool_create_tutorial',
    name: 'plugin_tool_create_tutorial_name',
    description: 'plugin_tool_create_tutorial_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'create_tutorial',
      description: "Used by The Enabler to generate a simple tutorial for a new co-created artifact.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          artifact_id: { type: Type.STRING, description: "The ID of the new workflow or plugin." },
          tutorial_content: { type: Type.STRING, description: "Simple, user-facing, step-by-step instructions on how to use the new artifact." },
        },
        required: ['artifact_id', 'tutorial_content'],
      },
    }
  },
  {
    id: 'tool_visualize_data_as_story',
    name: 'plugin_tool_visualize_data_name',
    description: 'plugin_tool_visualize_data_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'visualize_data_as_story',
      description: "Used by The Cartographer to generate a specification for a data visualization.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          data_summary: { type: Type.STRING, description: "A summary of the raw data provided by the user." },
          narrative_goal: { type: Type.STRING, description: "The story or insight the user wants to convey." },
          visualization_spec: { type: Type.STRING, description: "A JSON string or text description of the proposed visualization (e.g., chart type, axes, annotations)." },
        },
        required: ['data_summary', 'narrative_goal', 'visualization_spec'],
      },
    }
  },
  {
    id: 'tool_design_physical_object',
    name: 'plugin_tool_design_physical_object_name',
    description: 'plugin_tool_design_physical_object_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'design_physical_object',
      description: "Used by The Fabricator to generate a blueprint for a physical object.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          object_goal: { type: Type.STRING, description: "The intended function of the object." },
          constraints: { type: Type.STRING, description: "Constraints like size, material, or manufacturing method." },
          blueprint: { type: Type.STRING, description: "A detailed text description, list of materials, and assembly steps for the object." },
        },
        required: ['object_goal', 'constraints', 'blueprint'],
      },
    }
  },
  {
    id: 'tool_create_curriculum',
    name: 'plugin_tool_create_curriculum_name',
    description: 'plugin_tool_create_curriculum_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'create_curriculum',
      description: "Used by The Pedagogue to generate a structured lesson plan.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: "The complex subject to be taught." },
          target_audience: { type: Type.STRING, description: "The intended learner (e.g., 'a beginner')." },
          lesson_plan: { type: Type.STRING, description: "A markdown-formatted curriculum with modules, key concepts, examples, and questions." },
        },
        required: ['topic', 'target_audience', 'lesson_plan'],
      },
    }
  },
  {
    id: 'tool_generate_future_scenarios',
    name: 'plugin_tool_generate_future_scenarios_name',
    description: 'plugin_tool_generate_future_scenarios_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'generate_future_scenarios',
      description: "Used by The Oracle to generate plausible future scenarios.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: "The topic for forecasting (e.g., 'electric vehicle industry')." },
          time_horizon: { type: Type.STRING, description: "The future timeframe (e.g., 'in 2035')." },
          scenarios: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: {type: Type.STRING}, narrative: {type: Type.STRING} } }, description: "An array of distinct, plausible future scenarios, each with a title and a narrative description." },
        },
        required: ['topic', 'time_horizon', 'scenarios'],
      },
    }
  },
  {
    id: 'tool_analyze_game_theory_scenario',
    name: 'plugin_tool_analyze_game_theory_scenario_name',
    description: 'plugin_tool_analyze_game_theory_scenario_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'analyze_game_theory_scenario',
      description: "Used by The Gamemaster to analyze a competitive or cooperative situation.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          scenario_description: { type: Type.STRING, description: "A description of the situation, including players and their goals." },
          analysis: { type: Type.STRING, description: "A strategic analysis identifying dominant strategies, potential equilibria, and key insights." },
        },
        required: ['scenario_description', 'analysis'],
      },
    }
  },
  {
    id: 'tool_geometry_boolean_op',
    name: 'plugin_tool_geometry_boolean_op_name',
    description: 'plugin_tool_geometry_boolean_op_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'geometry_boolean_op',
      description: 'Performs a boolean (union, intersection, etc.) operation on two 2D polygons.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          operation: {
            type: Type.STRING,
            description: 'The boolean operation to perform.',
            enum: ['union', 'intersection', 'difference', 'xor']
          },
          polygonA: {
            type: Type.ARRAY,
            description: 'The first polygon, defined as an array of [x, y] coordinate pairs.',
            items: { type: Type.ARRAY, items: { type: Type.NUMBER } }
          },
          polygonB: {
            type: Type.ARRAY,
            description: 'The second polygon, defined as an array of [x, y] coordinate pairs.',
            items: { type: Type.ARRAY, items: { type: Type.NUMBER } }
          }
        },
        required: ['operation', 'polygonA', 'polygonB']
      }
    }
  },
  {
    id: 'tool_mesh_analysis',
    name: 'plugin_tool_mesh_analysis_name',
    description: 'plugin_tool_mesh_analysis_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'mesh_analysis',
      description: 'Analyzes a simple 3D mesh and returns its properties like bounding box.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          meshType: {
            type: Type.STRING,
            description: 'The type of mesh to analyze.',
            enum: ['box', 'sphere']
          },
          parameters: {
            type: Type.OBJECT,
            description: 'Parameters for the mesh, e.g., { "width": 2, "height": 2, "depth": 2 } for a box, or { "radius": 1 } for a sphere.'
          }
        },
        required: ['meshType', 'parameters']
      }
    }
  },
  {
    id: 'tool_creative_coding',
    name: 'plugin_tool_creative_coding_name',
    description: 'plugin_tool_creative_coding_desc',
    type: 'TOOL',
    status: 'enabled',
    defaultStatus: 'enabled',
    toolSchema: {
      name: 'creative_coding',
      description: 'Executes a snippet of p5.js code to generate a visual output on a canvas.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          p5js_code: {
            type: Type.STRING,
            description: "The p5.js code to execute. The code runs within a sketch with access to a 'p' object (e.g., 'p.background(0); p.fill(255); p.rect(10, 10, 50, 50);')."
          }
        },
        required: ['p5js_code']
      }
    }
  },

  // --- KNOWLEDGE ---
  { id: 'knowledge_installed_sdks', name: 'knowledge_installed_sdks_name', description: 'knowledge_installed_sdks_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: installedSDKsKnowledge },
  { id: 'knowledge_intuitionistic_logic', name: 'plugin_knowledge_intuitionistic_logic_name', description: 'plugin_knowledge_intuitionistic_logic_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: intuitionisticLogicKnowledge },
  { id: 'knowledge_classical_mechanics', name: 'plugin_knowledge_classical_mechanics_name', description: 'plugin_knowledge_classical_mechanics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: classicalMechanicsKnowledge },
  { id: 'knowledge_fourier_analysis', name: 'plugin_knowledge_fourier_analysis_name', description: 'plugin_knowledge_fourier_analysis_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: fourierAnalysisKnowledge },
  { id: 'knowledge_ergodic_theory', name: 'plugin_knowledge_ergodic_theory_name', description: 'plugin_knowledge_ergodic_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: ergodicTheoryKnowledge },
  { id: 'knowledge_art', name: 'plugin_knowledge_art_name', description: 'plugin_knowledge_art_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: artKnowledge },
  { id: 'knowledge_stem', name: 'plugin_knowledge_stem_name', description: 'plugin_knowledge_stem_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: stemKnowledge },
  { id: 'knowledge_psychology', name: 'plugin_knowledge_psychology_name', description: 'plugin_knowledge_psychology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: psychologyAndCognitiveBiasesKnowledge },
  { id: 'knowledge_software_design', name: 'plugin_knowledge_software_design_name', description: 'plugin_knowledge_software_design_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: softwareDesignKnowledge },
  { id: 'knowledge_philosophy_of_mind', name: 'plugin_knowledge_philosophy_of_mind_name', description: 'plugin_knowledge_philosophy_of_mind_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: philosophyOfMindKnowledge },
  { id: 'knowledge_complex_systems', name: 'plugin_knowledge_complex_systems_name', description: 'plugin_knowledge_complex_systems_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: complexSystemsKnowledge },
  { id: 'knowledge_genetics', name: 'plugin_knowledge_genetics_name', description: 'plugin_knowledge_genetics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: geneticsKnowledge },
  { id: 'knowledge_gardening', name: 'plugin_knowledge_gardening_name', description: 'plugin_knowledge_gardening_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: gardeningKnowledge },
  { id: 'knowledge_comparative_neuroanatomy', name: 'plugin_knowledge_comparative_neuroanatomy_name', description: 'plugin_knowledge_comparative_neuroanatomy_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: comparativeNeuroanatomyKnowledge },
  { id: 'knowledge_vigyan_bhairav_tantra', name: 'plugin_knowledge_vigyan_bhairav_tantra_name', description: 'plugin_knowledge_vigyan_bhairav_tantra_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: vigyanBhairavTantraKnowledge },
  { id: 'knowledge_tesla_core_concepts', name: 'plugin_knowledge_tesla_core_concepts_name', description: 'plugin_knowledge_tesla_core_concepts_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: teslaKnowledge },
  { id: 'knowledge_tesla_aether', name: 'plugin_knowledge_tesla_aether_name', description: 'plugin_knowledge_tesla_aether_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: teslaAetherKnowledge },
  { id: 'knowledge_chaos_dynamics', name: 'plugin_knowledge_chaos_dynamics_name', description: 'plugin_knowledge_chaos_dynamics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: chaosDynamicsKnowledge },
  { id: 'knowledge_vlm_architecture', name: 'plugin_knowledge_vlm_architecture_name', description: 'plugin_knowledge_vlm_architecture_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: vlmArchitectureKnowledge },
  { id: 'knowledge_mathlib_core', name: 'plugin_knowledge_mathlib_core_name', description: 'plugin_knowledge_mathlib_core_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: mathlibCoreKnowledge },
  { id: 'knowledge_algebraic_geometry', name: 'plugin_knowledge_algebraic_geometry_name', description: 'plugin_knowledge_algebraic_geometry_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: algebraicGeometryKnowledge },
  { id: 'knowledge_number_theory', name: 'plugin_knowledge_number_theory_name', description: 'plugin_knowledge_number_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: numberTheoryKnowledge },
  { id: 'knowledge_complex_analysis', name: 'plugin_knowledge_complex_analysis_name', description: 'plugin_knowledge_complex_analysis_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: complexAnalysisKnowledge },
  { id: 'knowledge_probability_theory', name: 'plugin_knowledge_probability_theory_name', description: 'plugin_knowledge_probability_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: probabilityTheoryKnowledge },
  { id: 'knowledge_typescript', name: 'plugin_knowledge_typescript_name', description: 'plugin_knowledge_typescript_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: typescriptKnowledge },
  { id: 'knowledge_machine_learning', name: 'plugin_knowledge_machine_learning_name', description: 'plugin_knowledge_machine_learning_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: machineLearningKnowledge },
  { id: 'knowledge_topology', name: 'plugin_knowledge_topology_name', description: 'plugin_knowledge_topology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: topologyKnowledge },
  { id: 'knowledge_python', name: 'plugin_knowledge_python_name', description: 'plugin_knowledge_python_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: pythonKnowledge },
  { id: 'knowledge_design_patterns', name: 'plugin_knowledge_design_patterns_name', description: 'plugin_knowledge_design_patterns_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: designPatternsKnowledge },
  { id: 'knowledge_react', name: 'plugin_knowledge_react_name', description: 'plugin_knowledge_react_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: reactKnowledge },
  { id: 'knowledge_jest_vitest', name: 'plugin_knowledge_jest_vitest_name', description: 'plugin_knowledge_jest_vitest_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: jestVitestKnowledge },
  { id: 'knowledge_technical_writing', name: 'plugin_knowledge_technical_writing_name', description: 'plugin_knowledge_technical_writing_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: technicalWritingKnowledge },
  { id: 'knowledge_product_management', name: 'plugin_knowledge_product_management_name', description: 'plugin_knowledge_product_management_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: productManagementKnowledge },
  { id: 'knowledge_data_science', name: 'plugin_knowledge_data_science_name', description: 'plugin_knowledge_data_science_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: dataScienceKnowledge },
  { id: 'knowledge_security', name: 'plugin_knowledge_security_name', description: 'plugin_knowledge_security_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: securityKnowledge },
  { id: 'knowledge_devops', name: 'plugin_knowledge_devops_name', description: 'plugin_knowledge_devops_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: devopsKnowledge },
  { id: 'knowledge_web_servers', name: 'plugin_knowledge_web_servers_name', description: 'plugin_knowledge_web_servers_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: webServersKnowledge },
  { id: 'knowledge_user_modeling', name: 'plugin_knowledge_user_modeling_name', description: 'plugin_knowledge_user_modeling_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: userModelingKnowledge },
  { id: 'knowledge_workflow_design', name: 'plugin_knowledge_workflow_design_name', description: 'plugin_knowledge_workflow_design_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: workflowDesignKnowledge },
  { id: 'knowledge_plugin_architecture', name: 'plugin_knowledge_plugin_architecture_name', description: 'plugin_knowledge_plugin_architecture_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: pluginArchitectureKnowledge },
  { id: 'knowledge_digital_asset_management', name: 'plugin_knowledge_digital_asset_management_name', description: 'plugin_knowledge_digital_asset_management_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: digitalAssetManagementKnowledge },
  { id: 'knowledge_ux_principles', name: 'plugin_knowledge_ux_principles_name', description: 'plugin_knowledge_ux_principles_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: uxPrinciplesKnowledge },
  { id: 'knowledge_abstraction_patterns', name: 'plugin_knowledge_abstraction_patterns_name', description: 'plugin_knowledge_abstraction_patterns_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: abstractionAndPatternsKnowledge },
  { id: 'knowledge_user_onboarding', name: 'plugin_knowledge_user_onboarding_name', description: 'plugin_knowledge_user_onboarding_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: userOnboardingKnowledge },
  { id: 'knowledge_data_visualization', name: 'plugin_knowledge_data_visualization_name', description: 'plugin_knowledge_data_visualization_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: dataVisualizationKnowledge },
  { id: 'knowledge_engineering_design', name: 'plugin_knowledge_engineering_design_name', description: 'plugin_knowledge_engineering_design_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: engineeringDesignKnowledge },
  { id: 'knowledge_pedagogy', name: 'plugin_knowledge_pedagogy_name', description: 'plugin_knowledge_pedagogy_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: pedagogyKnowledge },
  { id: 'knowledge_strategic_forecasting', name: 'plugin_knowledge_strategic_forecasting_name', description: 'plugin_knowledge_strategic_forecasting_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: strategicForecastingKnowledge },
  { id: 'knowledge_game_theory', name: 'plugin_knowledge_game_theory_name', description: 'plugin_knowledge_game_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: gameTheoryKnowledge },
  { id: 'knowledge_mathjs', name: 'plugin_knowledge_mathjs_name', description: 'plugin_knowledge_mathjs_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: mathjsKnowledge },
  { id: 'knowledge_numericjs', name: 'plugin_knowledge_numericjs_name', description: 'plugin_knowledge_numericjs_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: numericjsKnowledge },
// FIX: Corrected a typo in the plugin type from "K" to "KNOWLEDGE".
  { id: 'knowledge_lean', name: 'plugin_knowledge_lean_name', description: 'plugin_knowledge_lean_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: leanKnowledge },
  { id: 'knowledge_sociology', name: 'plugin_knowledge_sociology_name', description: 'plugin_knowledge_sociology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: sociologyKnowledge },
  { id: 'knowledge_anthropology', name: 'plugin_knowledge_anthropology_name', description: 'plugin_knowledge_anthropology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: anthropologyKnowledge },
  { id: 'knowledge_ecology', name: 'plugin_knowledge_ecology_name', description: 'plugin_knowledge_ecology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: ecologyKnowledge },
  { id: 'knowledge_cognitive_science', name: 'plugin_knowledge_cognitive_science_name', description: 'plugin_knowledge_cognitive_science_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: cognitiveScienceKnowledge },
  { id: 'knowledge_geology', name: 'plugin_knowledge_geology_name', description: 'plugin_knowledge_geology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: geologyKnowledge },
  { id: 'knowledge_astronomy', name: 'plugin_knowledge_astronomy_name', description: 'plugin_knowledge_astronomy_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: astronomyKnowledge },
  { id: 'knowledge_computer_science', name: 'plugin_knowledge_computer_science_name', description: 'plugin_knowledge_computer_science_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: computerScienceKnowledge },
  { id: 'knowledge_biology', name: 'plugin_knowledge_biology_name', description: 'plugin_knowledge_biology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: biologyKnowledge },
  { id: 'knowledge_chemistry', name: 'plugin_knowledge_chemistry_name', description: 'plugin_knowledge_chemistry_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: chemistryKnowledge },
  { id: 'knowledge_physics', name: 'plugin_knowledge_physics_name', description: 'plugin_knowledge_physics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: physicsKnowledge },
  { id: 'knowledge_economics', name: 'plugin_knowledge_economics_name', description: 'plugin_knowledge_economics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: economicsKnowledge },
  { id: 'knowledge_market_analysis', name: 'plugin_knowledge_market_analysis_name', description: 'plugin_knowledge_market_analysis_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: marketAnalysisKnowledge },
  { id: 'knowledge_history', name: 'plugin_knowledge_history_name', description: 'plugin_knowledge_history_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: historyKnowledge },
  { id: 'knowledge_ethics', name: 'plugin_knowledge_ethics_name', description: 'plugin_knowledge_ethics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: ethicsKnowledge },
  { id: 'knowledge_literary_theory', name: 'plugin_knowledge_literary_theory_name', description: 'plugin_knowledge_literary_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: literaryTheoryKnowledge },
  { id: 'knowledge_organizational_psychology', name: 'plugin_knowledge_organizational_psychology_name', description: 'plugin_knowledge_organizational_psychology_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: organizationalPsychologyKnowledge },
  { id: 'knowledge_aesthetics', name: 'plugin_knowledge_aesthetics_name', description: 'plugin_knowledge_aesthetics_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: aestheticsKnowledge },
  { id: 'knowledge_music_theory', name: 'plugin_knowledge_music_theory_name', description: 'plugin_knowledge_music_theory_desc', type: 'KNOWLEDGE', status: 'enabled', defaultStatus: 'enabled', knowledge: musicTheoryKnowledge },
  
  ...examplePlugins,
  ...heuristicsPlugins,
  ...personaPlugins,
  ...cognitiveStrategyPlugins
];