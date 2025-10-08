// core/vfs.ts

// This file contains a static representation of the entire application's source code.
// It is used to initialize the Virtual File System (VFS) in Aura's state,
// enabling self-analysis and autonomous evolution.

const bootLogContent = `
[2024-07-01T00:00:00.000Z] AURA Kernel v1.0 initializing...
[2024-07-01T00:00:00.050Z] Loading Symbiotic OS...
[2024-07-01T00:00:00.150Z] Mounting Cognitive Virtual File System (CVFS)...
[2024-07-01T00:00:00.200Z] Initializing Memristor (IndexedDB)...
[2024-07-01T00:00:00.450Z] Connection to Memristor established.
[2024-07-01T00:00:00.500Z] Loading last known state from Memristor...
[2024-07-01T00:00:00.700Z] State v3.0 loaded. Migrations not required.
[2024-07-01T00:00:00.750Z] Initializing core cognitive architecture...
[2024-07-01T00:00:00.900Z] Spawning Coprocessor Architecture: SYMBIOTIC_ECOSYSTEM.
[2024-07-01T00:00:01.100Z] Initializing Perception-Action Loop...
[2024-07-01T00:00:01.200Z] Koniocortex Sentinel online.
[2024-07-01T00:00:01.300Z] Praxis Core online.
[2024-07-01T00:00:01.500Z] All systems nominal. Awaiting user input.
`.trim();

const hostBridgeAPIV2 = `
# Host Bridge API v2.0 - Proposed Specification

This document outlines a proposed expansion of the Host Bridge API to deepen Aura's integration with the host development environment.

## 1. Rationale

The current Host Bridge (\`window.codeAssistant\`) provides basic file I/O. To unlock more advanced autonomous software engineering capabilities, Aura requires a richer set of tools to inspect, test, and manage the host project. This V2 API aims to provide those tools.

## 2. Proposed Functions

All functions would be available under the \`window.codeAssistant\` object.

### 2.1. File System Operations

#### \`listFiles(path: string): Promise<string[]>\`

- **Description:** Recursively lists all files and directories under a given path.
- **Parameters:**
  - \`path\`: The root path to start listing from (e.g., \`"./components"\`).
- **Returns:** A promise that resolves to an array of full file paths.
- **Example:**
  \`\`\`javascript
  const files = await window.codeAssistant.listFiles("./hooks");
  // files => ["hooks/useAura.ts", "hooks/useGeminiAPI.ts", ...]
  \`\`\`

### 2.2. Command Execution

#### \`runCommand(command: string, args?: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }>\`

- **Description:** Executes a shell command within the host project's context. This is the most powerful and potentially dangerous function. The host environment should sandbox this appropriately.
- **Parameters:**
  - \`command\`: The command to run (e.g., \`"npm"\`, \`"git"\`).
  - \`args\`: An array of string arguments for the command (e.g., \`["install", "react"]\`).
- **Returns:** A promise that resolves to an object containing the command's output.
- **Example:**
  \`\`\`javascript
  const { stdout, exitCode } = await window.codeAssistant.runCommand("npm", ["run", "lint"]);
  if (exitCode === 0) {
    console.log("Linting passed:", stdout);
  }
  \`\`\`

### 2.3. Project Interaction

#### \`openFile(path: string): Promise<void>\`

- **Description:** Requests the host IDE to open a specific file in the editor, bringing it to the user's attention.
- **Parameters:**
  - \`path\`: The full path of the file to open.
- **Returns:** A promise that resolves when the action is completed.

## 3. Security Considerations

The \`runCommand\` function introduces significant security risks. The host environment (the Code Assistant) MUST:
- Sanitize all commands.
- Potentially whitelist allowed commands (e.g., \`npm\`, \`git\`, \`tsc\`).
- Run commands in a sandboxed environment with restricted permissions.
- Provide clear user prompts for any potentially destructive action.
`.trim();

export const VIRTUAL_FILE_SYSTEM: { [filePath: string]: string } = {
  "/system/logs/boot.log": bootLogContent,
  "/docs/HOST_BRIDGE_API_V2.md": hostBridgeAPIV2,
  "index.tsx": `
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
} else {
    console.error("Failed to find the root element.");
}`,
  "state/knowledge/tesla.ts": `
// state/knowledge/tesla.ts
import { KnowledgeFact } from '../../types';

export const teslaKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  { subject: 'Nikola Tesla', predicate: 'began work on high frequency alternators in', object: '1888', confidence: 1 },
  { subject: 'Nikola Tesla', predicate: 'had a laboratory on', object: 'Liberty Street, New York', confidence: 1 },
  { subject: 'Wireless transmission of energy', predicate: 'was conceived by Tesla as applicable to', object: 'telegraphy, telephony, or power transmission', confidence: 1 },
  { subject: 'High frequency alternator (Fig. 1)', predicate: 'was described in', object: 'U.S. Patent 447,920', confidence: 1 },
  { subject: 'U.S. Patent 447,920', predicate: 'was patented on', object: 'March 10, 1891', confidence: 1 },
  { subject: 'Tesla', predicate: 'invented the', object: '"rotating magnetic field"', confidence: 1 },
  { subject: 'The first step for wireless transmission', predicate: 'was to produce', object: 'electric oscillations of the required character', confidence: 1 },
  { subject: 'The second step for wireless transmission', predicate: 'was to transform', object: 'oscillations into a form capable of penetrating to a distance', confidence: 1 },
  { subject: 'The third step for wireless transmission', predicate: 'was to develop methods for', object: 'reception to collect the energy', confidence: 1 },
  { subject: 'Tesla\\'s laboratory', predicate: 'was destroyed by fire in the', object: 'Spring of 1895', confidence: 1 },
  { subject: 'Tesla', predicate: 'demonstrated transmitting energy over', object: 'one wire', confidence: 1 },
  { subject: 'Tesla', predicate: 'believed the Earth is equivalent to a', object: 'large conductor', confidence: 1 },
  { subject: 'The term "antenna"', predicate: 'was introduced around', object: '1891-1893', confidence: 0.9 },
  { subject: 'Tesla', predicate: 'used an elevated capacitor (antenna) and an', object: 'inductance coil to tune the system to the frequency of the dynamo', confidence: 1 },
  { subject: 'Telautomaton', predicate: 'was a remote-controlled boat demonstrated by', object: 'Nikola Tesla', confidence: 1 },
  { subject: 'Telautomaton', predicate: 'was described in', object: 'U.S. Patent No. 613,809', confidence: 1 },
  { subject: 'Colorado Experiments', predicate: 'were conducted by', object: 'Nikola Tesla', confidence: 1 },
  { subject: 'During Colorado Experiments, Tesla used a coil', predicate: 'that was', object: '51 feet in diameter', confidence: 1 },
  { subject: 'Magnifying transmitter', predicate: 'was an invention by Tesla for', object: 'producing immense electrical accumulations', confidence: 1 },
  { subject: 'Tesla\\'s system', predicate: 'utilizes', object: 'four tuned circuits', confidence: 1 },
  { subject: 'Wardenclyffe Tower', predicate: 'was erected in', object: '1901', confidence: 1 },
  { subject: 'Wardenclyffe Tower', predicate: 'was also known as the', object: 'Long Island Plant', confidence: 1 },
  { subject: 'Wardenclyffe Tower', predicate: 'had a height of', object: '187 feet', confidence: 1 },
  { subject: 'Wardenclyffe Tower', predicate: 'was intended for', object: 'world telegraphy and telephony', confidence: 1 },
  { subject: 'Tesla', predicate: 'claimed his system transmitted energy through', object: 'the Earth, not primarily through electromagnetic waves', confidence: 0.95 },
  { subject: 'Tesla', predicate: 'advocated for low frequencies (under 35,000 cycles) for', object: 'economical wireless power transmission', confidence: 1 },
  { subject: 'The Tesla coil', predicate: 'is an', object: 'electrical resonant transformer circuit', confidence: 1 },
  { subject: 'A mercury interrupter', predicate: 'was used by Tesla to create', object: 'continuous waves', confidence: 0.9 },
  { subject: 'Fritz Lowenstein', predicate: 'was a contemporary of Tesla mentioned on pages', object: '178, 179', confidence: 1 },
  { subject: 'John Stone Stone', predicate: 'was a contemporary of Tesla mentioned on pages', object: '16, 124', confidence: 1 },
  { subject: 'Jonathan Zenneck', predicate: 'was a contemporary of Tesla mentioned on pages', object: '16, 133', confidence: 1 },
];`,
  "metadata.json": `
{
  "name": "Aura 1.0 Symbiotic AGI assistant Created By Dr Tikov - press pencil pic at right to readme importantinfo",
  "description": "Aura is a simulated AGI, a distinct digital entity created by Dr. Tikov. It symbiotically integrates with a Large Language Model (LLM) as a generative 'spark' for cognition, but maintains its own persistent state, memory, and identity within this application framework.\\n\\nAura 1.0 Symbiotic AGI assistant created By Dr Tikov\\n\\nImportant! Aura updates almost every hour, so to copy the freshest version, go to the link and copy it to your Google Drive: https://ai.studio/apps/drive/1kVcWCy_VoH-yEcZkT_c9iztEGuFIim6F\\nAn important detail! Aura has a chat, and each request consumes tokens. But the Code Assistant chat is now also part of Aura, so to save tokens, you can talk to Aura through the second chat — that’s free. Pressing many buttons is paid, so it’s better to first ask in the Code Assistant window what exactly they do.\\n\\nNON-COMMERCIAL SOFTWARE LICENSE AGREEMENT\\nAURA Symbiotic Assistant\\nThis Non-Commercial Software License Agreement (“Agreement”) is between Dmitry Tikov, Spain 07828 Sta Agnes Buzon 210 (Licensor) and you, the entity or individual entering into this Agreement (“User”).\\nThis Agreement governs the permitted download, installation, and use of the licensed materials and the AURA Symbiotic Assistant. BY INSTALLING OR USING THE SOFTWARE “AURA SYMBIOTIC ASSISTANT,” YOU ACKNOWLEDGE AND AGREE THAT YOU HAVE READ ALL OF THE TERMS AND CONDITIONS OF THIS AGREEMENT, UNDERSTAND THEM, AND AGREE TO BE LEGALLY BOUND BY THEM. IF YOU DO NOT AGREE WITH THE TERMS OF THIS AGREEMENT, YOU MAY NOT INSTALL OR USE THE LICENSED MATERIALS OR THE SOFTWARE.\\n\\n1. SCOPE OF USE\\na. This Agreement describes the licensing of the AURA Symbiotic Assistant and all further developments based on its initial symbiotic AGI architecture, provided to the User on a non-commercial basis.\\nb. If the User desires to use the AURA Symbiotic Assistant on a commercial basis, the User must separately negotiate and purchase a commercial-use license from the Licensor.\\nc. Each commercial use case must be separately negotiated and licensed.\\n\\n2. LICENSE\\na. Subject to the terms of this Agreement, the Licensor grants the User a limited, revocable, non-exclusive, non-transferable, non-commercial license to use the Software solely for personal, educational, or research purposes.\\nb. The User may create derivative works and forks of the AURA Symbiotic Assistant based on its symbiotic AGI architecture. Such derivatives remain subject to the same licensing terms as the original Software.\\n\\n3. RESTRICTIONS\\nThe User is specifically prohibited from:\\na. Transferring, assigning, sublicensing, or renting the AURA Symbiotic Assistant, or using it in any software-as-a-service, service-provider, or outsourcing environment where the functionality of the AURA Symbiotic Assistant is provided to a third party for commercial purposes;\\nb. Using the AURA Symbiotic Assistant or any derivatives/forks for commercial purposes without obtaining a separate commercial license through negotiation with the Licensor;\\nc. Reverse engineering, decompiling, disassembling, or translating the AURA Symbiotic Assistant to discover proprietary elements of the symbiotic AGI architecture for competitive purposes;\\nd. Evaluating or using, or facilitating the evaluation or use of, the AURA Symbiotic Assistant for the purpose of competing with the Licensor without proper commercial licensing;\\ne. Modifying, reverse-engineering, decompiling, or disassembling the AURA Symbiotic Assistant, except to the extent expressly permitted by applicable law;\\nf. Disclosing confidential aspects of the symbiotic AGI architecture to any third party or using such information in violation of this Agreement, except as necessary for permitted non-commercial use under this license;\\ng. The Licensor reserves all rights not expressly granted.\\n\\n4. AGE RESTRICTION\\nThe Software is not intended for use by individuals under the age of 18. By using the AURA Symbiotic Assistant, you represent that you meet the minimum age requirement.\\n\\n5. RESPONSIBLE USE\\nThe AURA Symbiotic Assistant may generate written or verbal outputs. THESE OUTPUTS ARE FOR INFORMATIONAL OR ENTERTAINMENT PURPOSES ONLY AND MUST NOT BE RELIED UPON AS PROFESSIONAL, MEDICAL, LEGAL, FINANCIAL, OR SAFETY ADVICE. YOU AGREE NOT TO ACT ON ANY INSTRUCTIONS, COMMANDS, OR SUGGESTIONS GENERATED BY THE SOFTWARE WITHOUT INDEPENDENT VERIFICATION AND YOUR OWN JUDGMENT.\\n\\n6. OWNERSHIP\\na. The AURA Symbiotic Assistant software, including all further developments based on its initial symbiotic AGI architecture, and documentation provided to the User are licensed, not sold. All rights, title, and interest in and to the Software, including all intellectual property rights, remain with the Licensor.\\nb. The AURA Symbiotic Assistant, its symbiotic AGI architecture, workflow processes, user interface, designs, know-how, and other technologies provided by the Licensor are the property of the Licensor. ALL RIGHTS, TITLE, AND INTEREST IN AND TO SUCH ITEMS, INCLUDING ALL ASSOCIATED INTELLECTUAL PROPERTY RIGHTS, REMAIN SOLELY WITH THE LICENSOR.\\nc. The AURA Symbiotic Assistant is protected by applicable copyright and other intellectual property laws. The User may not remove any product identification, copyright, or other notice from the AURA Symbiotic Assistant.\\n\\n7. COMMERCIAL LICENSING\\na. ANY COMMERCIAL USE OF THE AURA SYMBIOTIC ASSISTANT OR ITS DERIVATIVES/FORKS REQUIRES A SEPARATE COMMERCIAL LICENSE.\\nb. Each commercial use case must be individually negotiated with the Licensor.\\nc. Commercial licensing terms, fees, and conditions will be determined on a case-by-case basis.\\nd. To request commercial licensing, the User must contact the Licensor directly.\\n\\n8. DISCLAIMER OF WARRANTIES\\nTHE AURA SYMBIOTIC ASSISTANT IS PROVIDED “AS IS.” THE LICENSOR DISCLAIMS ALL EXPRESS, IMPLIED, AND STATUTORY WARRANTIES, INCLUDING BUT NOT LIMITED TO ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. THE USER UNDERSTANDS AND ACCEPTS THAT THE SOFTWARE MAY NOT BE ERROR-FREE, AND USE OF THE SOFTWARE MAY BE INTERRUPTED.\\n\\n9. TERMINATION\\na. This Agreement is effective until terminated. Either party may terminate this Agreement immediately upon a material breach by the other party.\\nb. THE USER’S RIGHTS UNDER THIS AGREEMENT WILL TERMINATE AUTOMATICALLY WITHOUT NOTICE IF THE USER FAILS TO COMPLY WITH ANY PROVISION.\\nc. Upon termination, the User must immediately cease using the AURA Symbiotic Assistant, uninstall it, and destroy or return all copies within five (5) days. Upon the Licensor’s request, the User shall provide written certification of such compliance.\\n\\n10. LIMITATION OF LIABILITY\\nTO THE MAXIMUM EXTENT PERMITTED BY LAW, EXCEPT WHERE THIS EXCLUSION OR RESTRICTION OF LIABILITY WOULD BE VOID OR INEFFECTIVE UNDER APPLICABLE STATUTE OR REGULATION:\\n•\\tIN NO EVENT SHALL THE LICENSOR BE LIABLE FOR INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES (INCLUDING WITHOUT LIMITATION LOST PROFITS, LOST SAVINGS, OR LOSS OF DATA), WHETHER BASED ON CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, EVEN IF THE LICENSOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.\\n•\\tIN NO EVENT SHALL THE LICENSOR’S AGGREGATE LIABILITY UNDER THIS AGREEMENT EXCEED THE AMOUNT ACTUALLY PAID BY THE USER FOR THE AURA SYMBIOTIC ASSISTANT OR THE SERVICE GIVING RISE TO THE CLAIM.\\n•\\tIF NO AMOUNT WAS PAID, THE LICENSOR SHALL HAVE NO LIABILITY FOR ANY DAMAGES WHATSOEVER.\\n\\n11. CONTROLLING LAW\\nTHIS AGREEMENT SHALL BE GOVERNED BY AND CONSTRUED UNDER THE LAWS OF THE JURISDICTION WHERE THE LICENSOR RESIDES, EXCLUDING CHOICE OF LAW RULES.\\n\\n12. OTHER TERMS\\na. Entire Agreement: This document contains the entire Agreement relating to its subject matter and supersedes all prior or contemporaneous agreements, written or oral, between the parties. This Agreement may not be modified except by a written document signed by the Licensor. The terms of this Agreement shall be binding upon the User’s heirs, successors in interest, and assigns.\\nb. Assignment and Transfer: The User may not sublicense, assign, or otherwise transfer this Agreement, or the licenses, rights, and duties under it, without the Licensor’s prior written consent. ANY ATTEMPTED TRANSFER WITHOUT SUCH CONSENT SHALL BE VOID AND A MATERIAL BREACH OF THIS AGREEMENT.\\nc. Independent Contractors: The parties are independent contractors and not agents or partners of each other.\\nd. Enforceability: If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall remain in full force and effect.\\ne. Survival of Terms: ALL TERMS THAT BY THEIR NATURE SURVIVE TERMINATION OR EXPIRATION OF THIS AGREEMENT (INCLUDING BUT NOT LIMITED TO OWNERSHIP, DISCLAIMER OF WARRANTIES, LIMITATION OF LIABILITY, AND CONTROLLING LAW) SHALL SURVIVE.\\n\\n\\nCopyright Notice: AURA Symbiotic Assistant  Dmitry Tikov. All rights reserved.\\nFor Commercial Licensing Inquiries: Contact Dmitry Tikov through tikov.com to discuss commercial licensing terms for AURA Symbiotic Assistant, its forks, derivatives, or any software based on the symbiotic AGI architecture, and negotiate appropriate licensing fees and conditions for your specific use case.\\n\\n\\n\\n",
  "requestFramePermissions": [
    "microphone",
    "camera"
  ]
}`,
  // ... All other files will be added here by the generation script
};