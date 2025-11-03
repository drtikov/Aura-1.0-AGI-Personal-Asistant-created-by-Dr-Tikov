// components/MortgageCalculatorPanel.tsx
import React, { useState, useMemo } from 'react';
import { useLocalization } from '../context/AuraContext.tsx';

export const MortgageCalculatorPanel = () => {
    const { t } = useLocalization();
    const [loanAmount, setLoanAmount] = useState(300000);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);

    const monthlyPayment = useMemo(() => {
        if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
            return 0;
        }
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;
        const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        return payment;
    }, [loanAmount, interestRate, loanTerm]);

    return (
        <div className="side-panel">
            <p className="reason-text">{t('mortgageCalculator_description')}</p>

            <div className="image-gen-control-group">
                <label htmlFor="loan-amount">{t('mortgageCalculator_loanAmount')}: ${loanAmount.toLocaleString()}</label>
                <input 
                    id="loan-amount" 
                    type="range" 
                    min="10000" 
                    max="2000000" 
                    step="1000" 
                    value={loanAmount} 
                    onChange={e => setLoanAmount(Number(e.target.value))} 
                />
            </div>

            <div className="image-gen-control-group">
                <label htmlFor="interest-rate">{t('mortgageCalculator_interestRate')}: {interestRate.toFixed(2)}%</label>
                <input 
                    id="interest-rate" 
                    type="range" 
                    min="1" 
                    max="15" 
                    step="0.01" 
                    value={interestRate} 
                    onChange={e => setInterestRate(Number(e.target.value))} 
                />
            </div>

            <div className="image-gen-control-group">
                <label htmlFor="loan-term">{t('mortgageCalculator_loanTerm')}: {loanTerm} years</label>
                <select id="loan-term" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))}>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                </select>
            </div>

            <div className="entropy-display" style={{ marginTop: '1.5rem' }}>
                <div className="entropy-label">{t('mortgageCalculator_monthlyPayment')}</div>
                <div className="entropy-value">
                    ${monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            </div>
        </div>
    );
};