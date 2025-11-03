// state/knowledge/realEstate.ts
import { KnowledgeFact } from '../../types.ts';

export const realEstateKnowledge: Omit<KnowledgeFact, 'id' | 'source'>[] = [
  // --- Terminology ---
  { subject: 'MLS', predicate: 'stands for', object: 'Multiple Listing Service', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'MLS', predicate: 'is a', object: 'database used by real estate brokers to share information about properties for sale', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Escrow', predicate: 'is a', object: 'legal arrangement in which a third party temporarily holds large sums of money or property until a particular condition has been met', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Appraisal', predicate: 'is an', object: 'unbiased professional opinion of a home\'s value', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Contingency', predicate: 'in a real estate contract is a', object: 'clause that requires a specific condition to be met for the contract to become binding', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Title Insurance', predicate: 'protects homeowners and lenders against', object: 'defects or problems with a title to a property that were not discovered during a title search', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Zoning', predicate: 'refers to', object: 'municipal or local laws that dictate how real property can be used in certain areas', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Deed', predicate: 'is a', object: 'legal document that transfers ownership of real estate from a seller to a buyer', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Closing Costs', predicate: 'are', object: 'fees paid at the closing of a real estate transaction', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  
  // --- Financial Principles ---
  { subject: 'Mortgage', predicate: 'is a', object: 'loan used to purchase or maintain a home, land, or other types of real estate', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Amortization', predicate: 'is the process of', object: 'spreading out a loan into a series of fixed payments', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'LTV', predicate: 'stands for', object: 'Loan-to-Value ratio', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'LTV ratio', predicate: 'is an assessment of lending risk that', object: 'financial institutions examine before approving a mortgage', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'DTI', predicate: 'stands for', object: 'Debt-to-Income ratio', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'DTI ratio', predicate: 'compares', object: 'how much you owe each month to how much you earn', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Fixed-Rate Mortgage', predicate: 'has an', object: 'interest rate that remains the same for the term of the loan', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'ARM', predicate: 'stands for', object: 'Adjustable-Rate Mortgage', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },
  { subject: 'Adjustable-Rate Mortgage', predicate: 'has an', object: 'interest rate that may change periodically', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'PITI', predicate: 'stands for', object: 'Principal, Interest, Taxes, and Insurance', confidence: 1, strength: 1.0, lastAccessed: 0, type: 'definition' },

  // --- Processes ---
  { subject: 'Buying Process', predicate: 'typically involves', object: 'getting pre-approved for a mortgage, finding a home, making an offer, home inspection, and closing', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Selling Process', predicate: 'typically involves', object: 'determining home value, preparing the home for sale, marketing, showing, and negotiating offers', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Home Inspection', predicate: 'is an', object: 'examination of the condition of a real estate property', confidence: 1, strength: 1.0, lastAccessed: 0 },
  { subject: 'Closing', predicate: 'is the final step in executing a', object: 'real estate transaction', confidence: 1, strength: 1.0, lastAccessed: 0 },
];