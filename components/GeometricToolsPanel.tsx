// components/GeometricToolsPanel.tsx
import React, { useState, useRef } from 'react';
import { useAuraDispatch, useLocalization } from '../context/AuraContext.tsx';
import { Accordion } from './Accordion.tsx';
import { loadSdk } from '../core/sdkLoader';

declare const p5: any;

export const GeometricToolsPanel = () => {
    const { syscall, addToast } = useAuraDispatch();
    const { t } = useLocalization();
    
    // --- Boolean Ops State ---
    const [polyA, setPolyA] = useState('[[0,0], [10,0], [10,10], [0,10]]');
    const [polyB, setPolyB] = useState('[[5,5], [15,5], [15,15], [5,15]]');
    const [operation, setOperation] = useState<'union' | 'intersection' | 'difference' | 'xor'>('intersection');
    const [isProcessingBool, setIsProcessingBool] = useState(false);

    // --- p5.js State ---
    const [p5Code, setP5Code] = useState("p.background(10);\np.fill(255, 0, 255);\np.noStroke();\np.rect(p.width * 0.2, p.height * 0.2, p.width * 0.6, p.height * 0.6);");
    const p5Instance = useRef<any>(null);
    const [isP5Loading, setIsP5Loading] = useState(false);

    const handleRunBooleanOp = async () => {
        try {
            const parsedA = JSON.parse(polyA);
            const parsedB = JSON.parse(polyB);
            setIsProcessingBool(true);
            await loadSdk('polygonClipping');
            syscall('EXECUTE_TOOL', {
                toolName: 'geometry_boolean_op',
                args: { polygonA: parsedA, polygonB: parsedB, operation }
            });
            addToast(t('geometry_boolean_dispatched'), 'info');
            setTimeout(() => setIsProcessingBool(false), 2000);
        } catch (e) {
            addToast(t('geometry_invalid_polygon'), 'error');
            setIsProcessingBool(false);
        }
    };

    const handleRunP5 = async () => {
        setIsP5Loading(true);
        try {
            await loadSdk('p5');
            if (p5Instance.current) {
                p5Instance.current.remove();
            }
            const sketch = (p: any) => {
                p.setup = () => {
                    const container = document.getElementById('p5-canvas-container');
                    if (container) {
                        p.createCanvas(container.clientWidth, 200).parent('p5-canvas-container');
                    } else {
                        p.createCanvas(300, 200);
                    }
                };
                try {
                    const userCode = new Function('p', p5Code);
                    userCode(p);
                } catch (e) {
                    console.error("Error in p5.js script:", e);
                    addToast(t('p5_script_error', { message: (e as Error).message }), 'error');
                    p.background(50);
                    p.fill(255, 0, 0);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text('Script Error', p.width / 2, p.height / 2);
                }
            };
            p5Instance.current = new p5(sketch);
            syscall('EXECUTE_TOOL', { toolName: 'creative_coding', args: { p5js_code: p5Code } });
        } catch(e) {
            addToast('Failed to load p5.js', 'error');
        } finally {
            setIsP5Loading(false);
        }
    };

    return (
        <div className="side-panel">
            <Accordion title={t('geometry_boolean_title')} defaultOpen={true}>
                <p className="reason-text">{t('geometry_boolean_desc')}</p>
                <div className="image-gen-control-group">
                    <label htmlFor="polyA">Polygon A (JSON format)</label>
                    <textarea id="polyA" value={polyA} onChange={e => setPolyA(e.target.value)} rows={3} />
                </div>
                <div className="image-gen-control-group">
                    <label htmlFor="polyB">Polygon B (JSON format)</label>
                    <textarea id="polyB" value={polyB} onChange={e => setPolyB(e.target.value)} rows={3} />
                </div>
                <div className="image-gen-control-group">
                    <label htmlFor="bool-op">Operation</label>
                    <select id="bool-op" value={operation} onChange={e => setOperation(e.target.value as any)}>
                        <option value="intersection">Intersection</option>
                        <option value="union">Union</option>
                        <option value="difference">Difference (A - B)</option>
                        <option value="xor">XOR</option>
                    </select>
                </div>
                <button className="control-button" onClick={handleRunBooleanOp} disabled={isProcessingBool} style={{ marginTop: '1rem', width: '100%' }}>
                    {isProcessingBool ? t('geometry_processing') : t('geometry_run_operation')}
                </button>
            </Accordion>

            <Accordion title={t('p5_title')} defaultOpen={true}>
                 <p className="reason-text">{t('p5_desc')}</p>
                 <div id="p5-canvas-container" style={{ border: '1px solid var(--border-color)', marginBottom: '1rem', minHeight: '200px', background: 'var(--background)' }}></div>
                 <div className="image-gen-control-group">
                    <label htmlFor="p5-code">p5.js Code</label>
                    <textarea id="p5-code" value={p5Code} onChange={e => setP5Code(e.target.value)} rows={6} placeholder="p.background(0);" />
                </div>
                <button className="control-button" onClick={handleRunP5} disabled={isP5Loading} style={{ marginTop: '1rem', width: '100%' }}>
                    {isP5Loading ? 'Loading p5...' : t('p5_run_code')}
                </button>
            </Accordion>
        </div>
    );
};