import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

export const StrategicGoalModal = ({ isOpen, onSetGoal, onClose, isProcessing }: { isOpen: boolean; onSetGoal: (goal: string) => void; onClose: () => void; isProcessing: boolean; }) => {
    const [goal, setGoal] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setGoal('');
        }
    }, [isOpen]);

    const handleSetGoalClick = () => {
        if (goal.trim()) {
            onSetGoal(goal.trim());
        }
    };

    const footer = (
        <>
            <button className="proposal-reject-button" onClick={onClose} disabled={isProcessing}>Cancel</button>
            <button className="proposal-approve-button" onClick={handleSetGoalClick} disabled={isProcessing || !goal.trim()}>Set Goal</button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Set Strategic Goal"
            footer={footer}
            className="strategic-goal-modal"
        >
            <div className="trace-section">
                <h4>Describe a high-level objective</h4>
                <p>Aura will decompose this strategic goal into a series of smaller, actionable sub-goals and autonomously work to complete them. For example: "Research the current state of AI ethics and produce a summary report."</p>
                <textarea
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="Enter your strategic goal here..."
                    rows={4}
                    disabled={isProcessing}
                />
            </div>
            {isProcessing && <div className="processing-indicator"> Decomposing goal... <div className="spinner"></div> </div>}
        </Modal>
    );
};
