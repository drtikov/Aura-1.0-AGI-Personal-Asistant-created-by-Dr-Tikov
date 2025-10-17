// components/PersonaJournalModal.tsx
import React from 'react';
import { Modal } from './Modal.tsx';
import { Persona } from '../types.ts';
import { useLocalization } from '../context/AuraContext.tsx';

interface PersonaJournalModalProps {
    isOpen: boolean;
    onClose: () => void;
    payload: {
        persona: Persona | null;
        entries: string[];
    }
}

export const PersonaJournalModal = ({ isOpen, onClose, payload }: PersonaJournalModalProps) => {
    const { persona, entries } = payload;
    const { t } = useLocalization();
    
    if (!persona) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${t(`personality_${persona.id}_name`)}'s Journal`}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                These are the learned principles and distilled successes for this persona, which are automatically added to its context when it is used.
            </p>
            {entries && entries.length > 0 ? (
                <ul style={{ listStyle: 'decimal', paddingLeft: '20px', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {entries.map((entry, index) => (
                        <li key={index}>
                            <div className="axiom-card" style={{ margin: 0, background: 'rgba(0,0,0,0.2)' }}>
                                <p className="axiom-card-text">"{entry}"</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="kg-placeholder" style={{ marginTop: '1rem' }}>This persona's journal is empty.</div>
            )}
        </Modal>
    );
};