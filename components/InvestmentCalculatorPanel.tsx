// components/InvestmentCalculatorPanel.tsx
import React, { useState, useMemo } from 'react';
import { useLocalization } from '../context/AuraContext.tsx';

export const InvestmentCalculatorPanel = () => {
    const { t } = useLocalization();
    const [purchasePrice, setPurchasePrice] = useState(350000);
    const [downPayment, setDownPayment] = useState(70000);
    const [monthlyRent, setMonthlyRent] = useState(2500);
    const [annualTaxes, setAnnualTaxes] = useState(4000);
    const [annualInsurance, setAnnualInsurance] = useState(1200);
    const [vacancyRate, setVacancyRate] = useState(5);
    const [interestRate, setInterestRate] = useState(6.5); // For mortgage calculation

    const metrics = useMemo(() => {
        const annualGrossRent = monthlyRent * 12;
        const vacancyLoss = annualGrossRent * (vacancyRate / 100);
        const effectiveGrossIncome = annualGrossRent - vacancyLoss;
        const operatingExpenses = annualTaxes + annualInsurance;
        const noi = effectiveGrossIncome - operatingExpenses;
        
        const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;
        
        const loanAmount = purchasePrice - downPayment;
        const monthlyInterestRate = interestRate / 100 / 12;
        const loanTermMonths = 30 * 12;
        const monthlyMortgagePayment = loanAmount > 0 ?
            loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
            : 0;
            
        const monthlyCashFlow = (effectiveGrossIncome / 12) - monthlyMortgagePayment - (operatingExpenses / 12);
        const annualCashFlow = monthlyCashFlow * 12;
        
        const totalCashInvested = downPayment;
        const cocReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;

        return {
            noi,
            capRate,
            monthlyCashFlow,
            annualCashFlow,
            cocReturn
        };
    }, [purchasePrice, downPayment, monthlyRent, annualTaxes, annualInsurance, vacancyRate, interestRate]);

    return (
        <div className="side-panel">
            <p className="reason-text">{t('investmentCalculator_description')}</p>
            {/* Input fields as sliders */}
            <div className="image-gen-control-group">
                <label>Purchase Price: ${purchasePrice.toLocaleString()}</label>
                <input type="range" min="50000" max="2000000" step="10000" value={purchasePrice} onChange={e => setPurchasePrice(Number(e.target.value))} />
            </div>
            <div className="image-gen-control-group">
                <label>Down Payment: ${downPayment.toLocaleString()}</label>
                <input type="range" min="0" max={purchasePrice} step="5000" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} />
            </div>
            <div className="image-gen-control-group">
                <label>Monthly Rent: ${monthlyRent.toLocaleString()}</label>
                <input type="range" min="500" max="10000" step="100" value={monthlyRent} onChange={e => setMonthlyRent(Number(e.target.value))} />
            </div>
            {/* Other inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="image-gen-control-group">
                    <label>Annual Taxes</label>
                    <input type="number" value={annualTaxes} onChange={e => setAnnualTaxes(Number(e.target.value))} />
                </div>
                 <div className="image-gen-control-group">
                    <label>Annual Insurance</label>
                    <input type="number" value={annualInsurance} onChange={e => setAnnualInsurance(Number(e.target.value))} />
                </div>
            </div>

            <div className="panel-subsection-title">{t('investmentCalculator_results_title')}</div>
            <div className="secondary-metrics" style={{ gridTemplateColumns: '1fr 1fr', textAlign: 'left', gap: '0.5rem 1rem' }}>
                <div className="metric-item">
                    <span className="metric-label">{t('investmentCalculator_capRate')}</span>
                    <span className="metric-value">{metrics.capRate.toFixed(2)}%</span>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">{t('investmentCalculator_cocReturn')}</span>
                    <span className="metric-value">{metrics.cocReturn.toFixed(2)}%</span>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">{t('investmentCalculator_monthlyCashFlow')}</span>
                    <span className="metric-value" style={{color: metrics.monthlyCashFlow >= 0 ? 'var(--success-color)' : 'var(--failure-color)'}}>${metrics.monthlyCashFlow.toFixed(2)}</span>
                </div>
                 <div className="metric-item">
                    <span className="metric-label">{t('investmentCalculator_annualCashFlow')}</span>
                    <span className="metric-value" style={{color: metrics.annualCashFlow >= 0 ? 'var(--success-color)' : 'var(--failure-color)'}}>${metrics.annualCashFlow.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};