// components/AffordabilityCalculatorPanel.tsx
import React, { useState, useMemo } from 'react';
import { useLocalization } from '../context/AuraContext.tsx';

export const AffordabilityCalculatorPanel = () => {
    const { t } = useLocalization();
    const [annualIncome, setAnnualIncome] = useState(80000);
    const [monthlyDebts, setMonthlyDebts] = useState(500);
    const [downPayment, setDownPayment] = useState(40000);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);

    const recommendation = useMemo(() => {
        const grossMonthlyIncome = annualIncome / 12;
        const maxTotalDebtPayment = grossMonthlyIncome * 0.36; // 36% DTI rule
        
        // PITI = Principal, Interest, Taxes, Insurance
        // We need to estimate T&I. A common estimate is 1.25% of home value per year.
        const estimatedTaxesAndInsuranceRate = 0.0125;

        // Max monthly PITI = Max Total Debt - Other Debts
        const maxMonthlyPITI = maxTotalDebtPayment - monthlyDebts;

        if (maxMonthlyPITI <= 0) {
            return { recommendedPrice: 0, monthlyPayment: 0 };
        }

        // Now, we need to work backward from PITI to find the loan amount, which is tricky
        // because T&I depend on the home price, which depends on the loan amount.
        // Let's assume T&I is a percentage of the mortgage payment. Say, 25% of PITI is T&I.
        // So, max PI = maxPITI * 0.75
        const maxMonthlyPI = maxMonthlyPITI * 0.75;
        
        const monthlyInterestRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;

        if (monthlyInterestRate <= 0) {
             return { recommendedPrice: 0, monthlyPayment: 0 };
        }
        
        // Reverse mortgage formula to find Loan Amount (L) from Monthly Payment (M)
        const maxLoanAmount = maxMonthlyPI * (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) / (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments));
        
        const recommendedPrice = maxLoanAmount + downPayment;

        return {
            recommendedPrice: Math.floor(recommendedPrice / 1000) * 1000, // Round to nearest thousand
            monthlyPayment: maxMonthlyPITI,
        };

    }, [annualIncome, monthlyDebts, downPayment, interestRate, loanTerm]);
    
    return (
        <div className="side-panel">
            <p className="reason-text">{t('affordabilityCalculator_description')}</p>
            <div className="image-gen-control-group">
                <label>Gross Annual Income: ${annualIncome.toLocaleString()}</label>
                <input type="range" min="20000" max="500000" step="1000" value={annualIncome} onChange={e => setAnnualIncome(Number(e.target.value))} />
            </div>
            <div className="image-gen-control-group">
                <label>Total Monthly Debts: ${monthlyDebts.toLocaleString()}</label>
                <input type="range" min="0" max="5000" step="50" value={monthlyDebts} onChange={e => setMonthlyDebts(Number(e.target.value))} />
            </div>
            <div className="image-gen-control-group">
                <label>Down Payment: ${downPayment.toLocaleString()}</label>
                <input type="range" min="0" max="200000" step="1000" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} />
            </div>

            <div className="entropy-display" style={{ marginTop: '1.5rem' }}>
                <div className="entropy-label">{t('affordabilityCalculator_recommendedPrice')}</div>
                <div className="entropy-value">
                    ${recommendation.recommendedPrice.toLocaleString()}
                </div>
                <div className="entropy-label" style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>
                    (Est. Monthly PITI: ${recommendation.monthlyPayment.toFixed(2)})
                </div>
            </div>
        </div>
    );
};