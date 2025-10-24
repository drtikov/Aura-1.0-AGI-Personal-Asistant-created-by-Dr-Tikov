// components/PhysicsSimulatorsPanel.tsx
import React, { useState } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';

type PhysicsEngine = 'rapier' | 'cannon' | 'matter' | 'ammo' | 'planck';

export const PhysicsSimulatorsPanel = () => {
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    const [engine, setEngine] = useState<PhysicsEngine>('rapier');
    const [sceneDescription, setSceneDescription] = useState('A 1kg box drops from 10m high onto a static plane under standard gravity.');
    const [isSimulating, setIsSimulating] = useState(false);

    const handleRunSimulation = () => {
        if (!sceneDescription.trim()) {
            addToast(t('physics_scene_required'), 'warning');
            return;
        }
        setIsSimulating(true);
        syscall('EXECUTE_TOOL', {
            toolName: 'physics_simulation',
            args: {
                engine,
                sceneDescription,
            }
        });
        addToast(t('physics_simulation_dispatched', { engine }), 'info');
        // In a real scenario, we would listen for the result. For now, we'll just stop the spinner.
        setTimeout(() => setIsSimulating(false), 2000);
    };

    return (
        <div className="side-panel">
            <p className="reason-text">{t('physics_panel_description')}</p>
            <div className="image-gen-control-group">
                <label htmlFor="physics-engine">{t('physics_engine')}</label>
                <select id="physics-engine" value={engine} onChange={e => setEngine(e.target.value as PhysicsEngine)} disabled={isSimulating}>
                    <option value="rapier">Rapier.rs (WASM)</option>
                    <option value="cannon">Cannon-es (JS)</option>
                    <option value="matter">Matter.js (2D)</option>
                    <option value="ammo">Ammo.js (WASM)</option>
                    <option value="planck">Planck.js (2D)</option>
                </select>
            </div>
            <div className="image-gen-control-group">
                <label htmlFor="physics-scene">{t('physics_scene_description')}</label>
                <textarea
                    id="physics-scene"
                    value={sceneDescription}
                    onChange={e => setSceneDescription(e.target.value)}
                    rows={4}
                    disabled={isSimulating}
                />
            </div>
            <div className="button-grid" style={{ marginTop: '1rem' }}>
                <button className="control-button" onClick={handleRunSimulation} disabled={isSimulating}>
                    {isSimulating ? t('physics_simulating') : t('physics_run_simulation')}
                </button>
            </div>
            <p className="reason-text" style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
                {t('physics_results_note')}
            </p>
        </div>
    );
};