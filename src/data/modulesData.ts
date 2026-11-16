/**
 * Arthabiz | Sikshyatech Hub
 * 15-Day Accounting Daily Practice Curriculum (50 Questions per Day = 750 Transactions)
 */

import { DayModule, Question } from '../types/accounting';
import { DAY_1_TRANSACTIONS } from './day1Data';
import { DAY_2_TRANSACTIONS } from './day2Data';
import { DAY_7_TRANSACTIONS } from './day7Data';
import { DAY_8_TRANSACTIONS } from './day8Data';

interface TemplateConfig {
  dayNum: number;
  title: string;
  theme: string;
  passcode: string;
  dateStr: string;
  description: string;
  baseCategory: Question['dayBookCategory'];
}

export const DAY_CONFIGS: TemplateConfig[] = [
  {
    dayNum: 1,
    title: 'Capital Setup, Bank Account Opening & Cash Operations',
    theme: 'Owner equity, cash infusions, bank accounts, furniture, machinery, and opening entries',
    passcode: '18342',
    dateStr: '2026-04-01',
    description: 'Master the accounting fundamentals of initial capital introduction, opening bank accounts, and purchasing basic plant assets.',
    baseCategory: 'Cash Book',
  },
  {
    dayNum: 2,
    title: 'Merchandise Purchases, Vendors & Trade Discounts',
    theme: 'Cash purchases, credit purchases, trade discounts vs cash discounts, carriage inwards',
    passcode: '29401',
    dateStr: '2026-04-02',
    description: 'Handle merchandise acquisitions from sundry creditors, trade discount deductions, freight inward, and advance payments.',
    baseCategory: 'Purchase Book',
  },
  {
    dayNum: 3,
    title: 'Sales Revenue, Debtors & Cash Settlement Discounts',
    theme: 'Cash sales, credit sales to debtors, trade allowances, point-of-sale receipts',
    passcode: '37158',
    dateStr: '2026-04-03',
    description: 'Record revenue recognition, credit deliveries to clients, customer invoicing, and trade concessions.',
    baseCategory: 'Sales Book',
  },
  {
    dayNum: 4,
    title: 'Fixed Assets Acquisition, Equipment & Depreciation',
    theme: 'Acquisition of machinery, computer systems, delivery vans, carriage on assets, installation wages',
    passcode: '46290',
    dateStr: '2026-04-04',
    description: 'Distinguish capital expenditure from revenue expenditure, asset capitalization, and test-run outlays.',
    baseCategory: 'General Journal',
  },
  {
    dayNum: 5,
    title: 'Digital Banking, eSewa, Fonepay, ConnectIPS & Cheques',
    theme: 'Cheques deposited, cheques issued, dishonour, bank charges, interest credited, RTGS/NEFT, wallet integrations',
    passcode: '51834',
    dateStr: '2026-04-05',
    description: 'Learn double-column cash book dynamics, contra entries, bank fees, standing instructions, and direct debits.',
    baseCategory: 'Bank Book',
  },
  {
    dayNum: 6,
    title: 'Operating Expenses, Utility Bills & Office Refreshments',
    theme: 'Rent, wages, electricity, printing & stationery, advertising, legal fees, repairs',
    passcode: '62947',
    dateStr: '2026-04-06',
    description: 'Account for revenue expenditures, administrative overheads, utility bills, maintenance charges, and petty cash.',
    baseCategory: 'Cash Book',
  },
  {
    dayNum: 7,
    title: 'Value Added Tax (VAT 13%) Purchases & Sales Accounting',
    theme: 'VAT input tax credit, VAT output liability, monthly tax returns, taxable invoices',
    passcode: '73812',
    dateStr: '2026-04-07',
    description: 'Record value added tax implications on trading, sales tax credit adjustments, and net payable settlements.',
    baseCategory: 'General Journal',
  },
  {
    dayNum: 8,
    title: 'Tax Deducted at Source (TDS) & Advance Tax - FY 2083/84 (Nepal)',
    theme: 'Official IRD provisions: Sec 87, 88, 88A, 89, 92 & 95A withholding rates, non-TDS exemptions, final withholding, and treasury deposits',
    passcode: '84920',
    dateStr: '2026-04-08',
    description: 'Master practical TDS and Advance Tax accounting according to the official Inland Revenue Department (IRD) Nepal notification for FY 2083/84 across 50 dedicated real-world scenarios.',
    baseCategory: 'Bank Book',
  },
  {
    dayNum: 9,
    title: 'Payroll & Salary Accounting - SSF & Tax Withholding',
    theme: 'Gross salary, Social Security Fund (SSF) contribution, income tax withholding, net salary disbursement',
    passcode: '95183',
    dateStr: '2026-04-09',
    description: 'Compute and record employee remuneration, employer contributions, and payroll liability journals.',
    baseCategory: 'General Journal',
  },
  {
    dayNum: 10,
    title: 'International Import/Export, EXIM Customs & Freight',
    theme: 'Letter of credit (LC), customs duty, freight forwarders, foreign exchange fluctuations',
    passcode: '10482',
    dateStr: '2026-04-10',
    description: 'Apply the accounting rules for cross-border shipments, clearing charges, and import inventory valuation.',
    baseCategory: 'General Journal',
  },
  {
    dayNum: 11,
    title: 'Public Procurement (e-GP / Bolpatra), Tender Deposits & Guarantees',
    theme: 'Bid security, performance bond, retention money deductions, government contract billings',
    passcode: '21593',
    dateStr: '2026-04-11',
    description: 'Manage specialized accounting for contract advances, earnest money deposits, and milestone receivables.',
    baseCategory: 'General Journal',
  },
  {
    dayNum: 12,
    title: 'Bad Debts Written Off, Provisions & Receivable Recovery',
    theme: 'Insolvent debtors, write-off journals, allowance for credit loss, recovery of previously closed debts',
    passcode: '32604',
    dateStr: '2026-04-12',
    description: 'Process bad debt expense recognitions, provision adjustments, and recoveries.',
    baseCategory: 'Returns & Adjustments',
  },
  {
    dayNum: 13,
    title: 'Period-End Adjusting Entries - Accruals & Prepayments',
    theme: 'Accrued expenses, accrued revenues, prepaid insurance, unearned subscription revenues',
    passcode: '43715',
    dateStr: '2026-04-13',
    description: 'Execute essential end-of-period matching entries for accurate income determination.',
    baseCategory: 'General Journal',
  },
  {
    dayNum: 14,
    title: 'Corporate Governance, Statutory Audit & Compliance Fees',
    theme: 'Director fees, audit honorarium, secretarial compliance, penalty avoidance',
    passcode: '54826',
    dateStr: '2026-04-14',
    description: 'Record professional advisory expenses, annual statutory filing costs, and compliance provisions.',
    baseCategory: 'General Journal',
  },
  {
    dayNum: 15,
    title: 'Financial Year-End Closing & Profit Loss Reconciliation',
    theme: 'Closing entries, trading account balances, gross profit transfer, net profit transfer to capital',
    passcode: '65937',
    dateStr: '2026-04-15',
    description: 'Comprehensive financial synthesis integrating all primary books of original entry and final trial-ready entries.',
    baseCategory: 'General Journal',
  },
];

// Helper to format currency
export const formatRs = (val: number): string => {
  return new Intl.NumberFormat('en-IN').format(val);
};

// Procedural generation of 50 questions per day
function generateQuestionsForDay(cfg: TemplateConfig): Question[] {
  const questions: Question[] = [];

  for (let q = 1; q <= 50; q++) {
    const padQ = q < 10 ? `0${q}` : `${q}`;
    const trxRef = `TrxJV-${padQ}`;
    const trxTitle = `Transaction - ${q}`;
    const questionData = getTransactionScenario(cfg.dayNum, q, cfg.dateStr, trxRef, trxTitle);
    questions.push(questionData);
  }

  return questions;
}

// Generate realistic financial transactions per day and question
function getTransactionScenario(
  day: number,
  qIndex: number,
  dateStr: string,
  trxRef: string,
  trxTitle: string
): Question {
  const seedAmount = 1000 * ((qIndex * 13) % 45 + 5); // realistic amounts between 5,000 and 2,50,000
  const largeAmount = seedAmount * 5;

  let text = '';
  let drLedger = '';
  let crLedger = '';
  let narration = '';
  let amount = seedAmount;
  let explanation = '';
  let dayBookCategory: Question['dayBookCategory'] = 'General Journal';
  let ledgerAffected = '';

  // Distribute across Day Themes
  switch (day) {
    case 1: { // Capital & Setup - 50 Distinct Real-World Transactions
      const item = DAY_1_TRANSACTIONS[qIndex];
      if (item) {
        amount = item.amount;
        text = item.text;
        drLedger = item.drLedger;
        crLedger = item.crLedger;
        narration = item.narration;
        explanation = item.explanation;
        dayBookCategory = item.dayBookCategory;
        ledgerAffected = item.ledgerAffected;
      }
      break;
    }

    case 2: { // Merchandise Purchases, Vendors & Trade Discounts - 50 Distinct Scenarios
      const item = DAY_2_TRANSACTIONS[qIndex];
      if (item) {
        amount = item.amount;
        text = item.text;
        drLedger = item.drLedger;
        crLedger = item.crLedger;
        narration = item.narration;
        explanation = item.explanation;
        dayBookCategory = item.dayBookCategory;
        ledgerAffected = item.ledgerAffected;
      }
      break;
    }

    case 3: { // Sales
      amount = 25000 + (qIndex * 2200);
      if (qIndex % 3 === 0) {
        const catalog = amount;
        const net = catalog * 0.95;
        text = `Sold goods to M/S Pokhara Retailers of catalog price Rs. ${formatRs(catalog)} at 5% trade discount on credit.`;
        drLedger = 'Pokhara Retailers A/c';
        crLedger = 'Sales A/c';
        narration = `Being credit sales made after deducting 5% trade discount`;
        amount = net;
        explanation = 'Customer is the receiver of goods (Debtor - Dr), Sales is revenue earned (Nominal A/c - Cr). Trade discount is deducted from list price.';
        dayBookCategory = 'Sales Book';
        ledgerAffected = 'Debtor & Sales';
      } else if (qIndex % 3 === 1) {
        text = `Sold goods for Rs. ${formatRs(amount)} in cash across the retail counter.`;
        drLedger = 'Cash A/c';
        crLedger = 'Sales A/c';
        narration = 'Being cash sales executed over retail counter';
        explanation = 'Cash comes into business (Dr Real A/c), Sales is credited as operating turnover (Cr Nominal A/c).';
        dayBookCategory = 'Cash Book';
        ledgerAffected = 'Cash & Sales';
      } else {
        text = `Sold goods to Surya & Sons worth Rs. ${formatRs(amount)}, payment received immediately via bank QR transfer.`;
        drLedger = 'Bank A/c';
        crLedger = 'Sales A/c';
        narration = 'Being goods sold with instant bank QR settlement';
        explanation = 'Bank funds increase immediately (Dr Bank), Sales revenue recognized (Cr Sales).';
        dayBookCategory = 'Bank Book';
        ledgerAffected = 'Bank & Sales';
      }
      break;
    }

    case 4: { // Banking Operations
      amount = 12000 + (qIndex * 1400);
      if (qIndex % 4 === 0) {
        text = `Cash Rs. ${formatRs(amount)} withdrawn from bank for office use.`;
        drLedger = 'Cash A/c';
        crLedger = 'Bank A/c';
        narration = 'Being cash withdrawn from bank for office expenses (Contra)';
        explanation = 'Cash in hand increases (Dr Cash), Bank balance decreases (Cr Bank). This is a Contra entry.';
        dayBookCategory = 'Cash Book';
        ledgerAffected = 'Cash & Bank (Contra)';
      } else if (qIndex % 4 === 1) {
        const fee = 650;
        text = `Bank debited Rs. ${formatRs(fee)} for annual SMS banking alert charges and ATM fee.`;
        drLedger = 'Bank Charges A/c';
        crLedger = 'Bank A/c';
        narration = 'Being bank charges deducted by bank directly';
        amount = fee;
        explanation = 'Bank charges are an expense (Dr Nominal A/c), Bank balance reduces (Cr Personal A/c).';
        dayBookCategory = 'Bank Book';
        ledgerAffected = 'Bank Charges & Bank';
      } else if (qIndex % 4 === 2) {
        const intAmt = 4200;
        text = `Bank credited interest of Rs. ${formatRs(intAmt)} on fixed deposit in the current account.`;
        drLedger = 'Bank A/c';
        crLedger = 'Interest Received A/c';
        narration = 'Being interest credited by bank into account';
        amount = intAmt;
        explanation = 'Bank balance increases (Dr Bank), Interest earned is income (Cr Nominal A/c).';
        dayBookCategory = 'Bank Book';
        ledgerAffected = 'Bank & Interest Income';
      } else {
        text = `Received a crossed account payee cheque of Rs. ${formatRs(amount)} from debtor Anil Brothers and deposited into bank on same day.`;
        drLedger = 'Bank A/c';
        crLedger = 'Anil Brothers A/c';
        narration = 'Being crossed cheque received and banked on the same day';
        explanation = 'When cheque is deposited immediately, Bank A/c is debited directly, and the payer (Debtor) is credited.';
        dayBookCategory = 'Bank Book';
        ledgerAffected = 'Bank & Debtor';
      }
      break;
    }

    case 5: { // Vendor Settlements & Discount Received
      amount = 30000 + (qIndex * 1500);
      const discount = 1500;
      const paid = amount - discount;
      if (qIndex % 2 === 0) {
        text = `Settled full claim of creditor Sharma & Co. of Rs. ${formatRs(amount)} by paying Rs. ${formatRs(paid)} via cheque in full settlement.`;
        drLedger = 'Sharma & Co. A/c';
        crLedger = `Bank A/c (Rs. ${formatRs(paid)}) & Discount Received A/c (Rs. ${formatRs(discount)})`;
        narration = `Being creditor settled in full, discount received Rs. ${formatRs(discount)}`;
        explanation = `Sharma & Co. liability of Rs. ${formatRs(amount)} is eliminated (Dr Creditor). Bank pays Rs. ${formatRs(paid)} (Cr Bank), and Discount Received of Rs. ${formatRs(discount)} is a gain (Cr Nominal).`;
        dayBookCategory = 'Bank Book';
        ledgerAffected = 'Creditor, Bank & Discount Received';
      } else {
        const cashDisc = 800;
        const cashPaid = amount - cashDisc;
        text = `Paid cash Rs. ${formatRs(cashPaid)} to supplier Gupta Enterprises in full discharge of bill Rs. ${formatRs(amount)}.`;
        drLedger = 'Gupta Enterprises A/c';
        crLedger = `Cash A/c (Rs. ${formatRs(cashPaid)}) & Discount Received A/c (Rs. ${formatRs(cashDisc)})`;
        narration = `Being cash paid in full settlement, discount received Rs. ${formatRs(cashDisc)}`;
        explanation = 'Debiting the creditor extinguishes liability; Cash is credited for the actual outflow; Discount received is credited as gain.';
        dayBookCategory = 'Cash Book';
        ledgerAffected = 'Creditor, Cash & Discount Received';
      }
      break;
    }

    case 6: { // Operating Expenses, Utility Bills & Office Refreshments
      amount = 8000 + (qIndex * 900);
      if (qIndex % 4 === 0) {
        text = `Paid monthly office rent of Rs. ${formatRs(amount)} by cheque to landlord.`;
        drLedger = 'Rent Expense A/c';
        crLedger = 'Bank A/c';
        narration = 'Being office premises rent paid through bank transfer';
        explanation = 'Rent is an administrative operating expense (Dr Nominal A/c), Bank pays out cash (Cr Bank).';
        dayBookCategory = 'Bank Book';
        ledgerAffected = 'Rent & Bank';
      } else if (qIndex % 4 === 1) {
        text = `Paid staff salaries of Rs. ${formatRs(amount * 2)} for the month in cash.`;
        drLedger = 'Salaries Expense A/c';
        crLedger = 'Cash A/c';
        amount = amount * 2;
        narration = 'Being staff remuneration paid in cash';
        explanation = 'Salaries is an expense (Dr Nominal A/c), Cash goes out (Cr Real A/c).';
        dayBookCategory = 'Cash Book';
        ledgerAffected = 'Salaries & Cash';
      } else if (qIndex % 4 === 2) {
        const util = 4500 + qIndex * 200;
        text = `Paid electricity and water utility bills of Rs. ${formatRs(util)} in cash.`;
        drLedger = 'Electricity & Water Charges A/c';
        crLedger = 'Cash A/c';
        amount = util;
        narration = 'Being utility expenses paid in cash';
        explanation = 'Nominal expense debited, Cash asset credited.';
        dayBookCategory = 'Cash Book';
        ledgerAffected = 'Utilities & Cash';
      } else {
        const adv = 6000 + qIndex * 350;
        text = `Paid advertisement and social media promotion campaign expenses of Rs. ${formatRs(adv)} by cheque.`;
        drLedger = 'Advertising Expense A/c';
        crLedger = 'Bank A/c';
        amount = adv;
        narration = 'Being marketing and advertising agency bill paid via cheque';
        explanation = 'Advertising is a selling expense (Dr Nominal A/c), Bank balance decreases (Cr Bank).';
        dayBookCategory = 'Bank Book';
        ledgerAffected = 'Advertising & Bank';
      }
      break;
    }

    case 7: { // Value Added Tax (VAT 13%) Purchases & Sales Accounting - 50 Distinct Scenarios
      const item = DAY_7_TRANSACTIONS[qIndex];
      if (item) {
        amount = item.amount;
        text = item.text;
        drLedger = item.drLedger;
        crLedger = item.crLedger;
        narration = item.narration;
        explanation = item.explanation;
        dayBookCategory = item.dayBookCategory;
        ledgerAffected = item.ledgerAffected;
      }
      break;
    }

    case 8: { // Tax Deducted at Source (TDS) & Advance Tax - FY 2083/84 (Nepal) - 50 Official Scenarios
      const item = DAY_8_TRANSACTIONS[qIndex];
      if (item) {
        amount = item.amount;
        text = item.text;
        drLedger = item.drLedger;
        crLedger = item.crLedger;
        narration = item.narration;
        explanation = item.explanation;
        dayBookCategory = item.dayBookCategory;
        ledgerAffected = item.ledgerAffected;
      }
      break;
    }

    case 9: { // Depreciation
      amount = 5000 + (qIndex * 600);
      if (qIndex % 2 === 0) {
        text = `Provide annual depreciation of Rs. ${formatRs(amount)} on office computers and servers.`;
        drLedger = 'Depreciation A/c';
        crLedger = 'Computer Equipment A/c';
        narration = 'Being annual depreciation charged on computer systems';
        explanation = 'Depreciation is a non-cash operating loss/expense (Dr Nominal A/c), and it reduces the book value of the fixed asset (Cr Asset).';
        dayBookCategory = 'General Journal';
        ledgerAffected = 'Depreciation & Computer Equipment';
      } else {
        const scrap = 4000;
        text = `Old broken office furniture (Book value Nil) sold as scrap for Rs. ${formatRs(scrap)} cash.`;
        drLedger = 'Cash A/c';
        crLedger = 'Miscellaneous Income / Scrap Sales A/c';
        amount = scrap;
        narration = 'Being scrap disposal proceeds received in cash';
        explanation = 'Cash received is debited (Dr Cash), and revenue from scrap is credited as incidental income (Cr Nominal).';
        dayBookCategory = 'Cash Book';
        ledgerAffected = 'Cash & Scrap Income';
      }
      break;
    }

    case 10: { // Accruals
      amount = 7500 + (qIndex * 650);
      if (qIndex % 2 === 0) {
        text = `Salaries of Rs. ${formatRs(amount)} for the current month remain unpaid at the end of the accounting period.`;
        drLedger = 'Salaries Expense A/c';
        crLedger = 'Outstanding Salaries A/c';
        narration = 'Being salaries accrued and outstanding for the period';
        explanation = 'Expense is recognized in the period incurred (Dr Expense), and Outstanding Salaries is recorded as a current liability (Cr Liability).';
        dayBookCategory = 'General Journal';
        ledgerAffected = 'Salaries & Outstanding Salaries';
      } else {
        const accInt = 3200 + qIndex * 150;
        text = `Accrued interest on fixed deposit Rs. ${formatRs(accInt)} earned during the month but not yet received from bank.`;
        drLedger = 'Accrued Interest A/c';
        crLedger = 'Interest Income A/c';
        amount = accInt;
        narration = 'Being interest earned on fixed deposit but not yet collected';
        explanation = 'Accrued Interest is a current asset representing receivables (Dr Asset), and Interest Income is credited (Cr Nominal).';
        dayBookCategory = 'General Journal';
        ledgerAffected = 'Accrued Interest & Interest Income';
      }
      break;
    }

    case 11: { // Prepayments & Unearned
      amount = 6000 + (qIndex * 500);
      if (qIndex % 2 === 0) {
        text = `Paid fire insurance premium Rs. ${formatRs(amount)} by cheque, of which one-third (Rs. ${formatRs(Math.round(amount / 3))}) relates to the subsequent financial year. What is the year-end adjusting entry for prepaid portion?`;
        const prepaid = Math.round(amount / 3);
        drLedger = 'Prepaid Insurance A/c';
        crLedger = 'Insurance Premium A/c';
        amount = prepaid;
        narration = 'Being unexpired portion of insurance premium carried forward to next period';
        explanation = 'Prepaid Insurance is a current asset (Dr Asset), reducing the insurance expense for current year (Cr Expense).';
        dayBookCategory = 'General Journal';
        ledgerAffected = 'Prepaid Insurance & Insurance Premium';
      } else {
        const advance = 15000 + qIndex * 800;
        text = `Received Rs. ${formatRs(advance)} by bank transfer from client as advance retainer for annual accounting consulting services.`;
        drLedger = 'Bank A/c';
        crLedger = 'Unearned Consulting Fees A/c';
        amount = advance;
        narration = 'Being advance fees received for unperformed future services';
        explanation = 'Cash/Bank is debited upon collection. Since service is not yet rendered, it is a liability (Unearned Income - Cr Liability).';
        dayBookCategory = 'Bank Book';
        ledgerAffected = 'Bank & Unearned Revenue';
      }
      break;
    }

    case 12: { // Returns
      amount = 8000 + (qIndex * 700);
      if (qIndex % 2 === 0) {
        text = `Returned damaged goods worth Rs. ${formatRs(amount)} to supplier Sagar Traders and issued Debit Note #DN-${qIndex}.`;
        drLedger = 'Sagar Traders A/c';
        crLedger = 'Purchase Returns A/c';
        narration = `Being damaged goods returned to supplier per Debit Note #DN-${qIndex}`;
        explanation = 'Supplier is the receiver (Dr Personal A/c), and Purchase Returns (Returns Outward) reduces the cost of goods bought (Cr Nominal A/c).';
        dayBookCategory = 'Returns & Adjustments';
        ledgerAffected = 'Creditor & Purchase Returns';
      } else {
        text = `Customer Kankai Stores returned defective goods worth Rs. ${formatRs(amount)} and Credit Note #CN-${qIndex} was issued.`;
        drLedger = 'Sales Returns A/c';
        crLedger = 'Kankai Stores A/c';
        narration = `Being defective merchandise returned by client per Credit Note #CN-${qIndex}`;
        explanation = 'Sales Returns (Returns Inward) reduces gross sales revenue (Dr Nominal A/c), and Customer account is credited (Cr Personal A/c).';
        dayBookCategory = 'Returns & Adjustments';
        ledgerAffected = 'Sales Returns & Debtor';
      }
      break;
    }

    case 13: { // Drawings & Casualty
      amount = 10000 + (qIndex * 800);
      if (qIndex % 3 === 0) {
        text = `Proprietor withdrew merchandise of purchase cost Rs. ${formatRs(amount)} for personal household consumption.`;
        drLedger = 'Drawings A/c';
        crLedger = 'Purchases A/c';
        narration = 'Being goods withdrawn by proprietor for private domestic use';
        explanation = 'Drawings reduces owner equity (Dr Personal/Equity). Merchandise cost is credited directly to Purchases A/c at cost price, not Sales.';
        dayBookCategory = 'General Journal';
        ledgerAffected = 'Drawings & Purchases';
      } else if (qIndex % 3 === 1) {
        const sampleAmt = 5000 + qIndex * 300;
        text = `Distributed goods costing Rs. ${formatRs(sampleAmt)} as free promotional samples to prospective institutional clients.`;
        drLedger = 'Advertisement / Sample Promotion A/c';
        crLedger = 'Purchases A/c';
        amount = sampleAmt;
        narration = 'Being goods distributed as free samples for marketing publicity';
        explanation = 'Marketing expense increases (Dr Advertisement A/c), and inventory cost is reduced at original cost (Cr Purchases A/c).';
        dayBookCategory = 'General Journal';
        ledgerAffected = 'Advertising & Purchases';
      } else {
        const fireLoss = 18000;
        text = `Goods worth Rs. ${formatRs(fireLoss)} destroyed by sudden fire outbreak in warehouse; no insurance was held.`;
        drLedger = 'Loss by Fire A/c';
        crLedger = 'Purchases A/c';
        amount = fireLoss;
        narration = 'Being uninsured goods destroyed by fire written off to profit and loss';
        explanation = 'Loss by Fire is an abnormal loss (Dr Nominal A/c), and Purchases A/c is credited for the inventory destroyed at cost.';
        dayBookCategory = 'General Journal';
        ledgerAffected = 'Loss by Fire & Purchases';
      }
      break;
    }

    case 14: { // Bills of Exchange
      amount = 25000 + (qIndex * 1200);
      if (qIndex % 3 === 0) {
        text = `Drew a 3-month bill of exchange for Rs. ${formatRs(amount)} on debtor Milan Bros, which was duly accepted and returned.`;
        drLedger = 'Bills Receivable A/c';
        crLedger = 'Milan Bros A/c';
        narration = 'Being 3-month acceptance received from customer';
        explanation = 'Bills Receivable is a negotiable legal asset (Dr Asset), and Milan Bros account is settled/credited against the bill.';
        dayBookCategory = 'General Journal';
        ledgerAffected = 'Bills Receivable & Debtor';
      } else if (qIndex % 3 === 1) {
        const discCharge = 750;
        const netCash = amount - discCharge;
        text = `Discounted Milan Bros bill of Rs. ${formatRs(amount)} with bank immediately at discount charge of Rs. ${formatRs(discCharge)}.`;
        drLedger = `Bank A/c (Rs. ${formatRs(netCash)}) & Discounting Charges A/c (Rs. ${formatRs(discCharge)})`;
        crLedger = 'Bills Receivable A/c';
        narration = `Being bill discounted with bank at fee of Rs. ${formatRs(discCharge)}`;
        explanation = 'Bank funds increase (Dr Bank); Discount charge is a financing cost (Dr Nominal); Bills Receivable is extinguished (Cr Asset).';
        dayBookCategory = 'Bank Book';
        ledgerAffected = 'Bank, Discount Charges & Bills Receivable';
      } else {
        text = `Accepted a 60-day bill of exchange for Rs. ${formatRs(amount)} drawn by supplier Raj Overseas in settlement of debt.`;
        drLedger = 'Raj Overseas A/c';
        crLedger = 'Bills Payable A/c';
        narration = 'Being acceptance given to supplier on 60-day term';
        explanation = 'Sundry Creditor is debited to close trade payable account; Bills Payable is credited as a formal negotiable liability.';
        dayBookCategory = 'General Journal';
        ledgerAffected = 'Creditor & Bills Payable';
      }
      break;
    }

    default: { // Day 15: Year-End & Integrated
      amount = 35000 + (qIndex * 2100);
      if (qIndex % 4 === 0) {
        const tds = Math.round(amount * 0.1);
        const netPay = amount - tds;
        text = `Paid professional auditor fees of Rs. ${formatRs(amount)} by cheque after deducting 10% TDS (Tax Deducted at Source).`;
        drLedger = 'Audit / Legal Fees A/c';
        crLedger = `Bank A/c (Rs. ${formatRs(netPay)}) & TDS Payable A/c (Rs. ${formatRs(tds)})`;
        narration = `Being audit fees paid after statutory withholding tax deduction`;
        explanation = 'Audit Fee expense is recognized in full (Dr Expense); Bank is credited for net disbursement; TDS Payable is credited as current liability due to government.';
        dayBookCategory = 'Bank Book';
        ledgerAffected = 'Audit Fees, Bank & TDS Payable';
      } else if (qIndex % 4 === 1) {
        text = `Transferred net gross profit of Rs. ${formatRs(amount * 3)} from Trading Account to Profit and Loss Account.`;
        drLedger = 'Trading A/c';
        crLedger = 'Profit & Loss A/c';
        amount = amount * 3;
        narration = 'Being gross profit transferred to profit & loss statement';
        explanation = 'Closing entry: Trading Account debit balance is closed out by debiting Trading A/c and crediting Profit & Loss A/c.';
        dayBookCategory = 'General Journal';
        ledgerAffected = 'Trading A/c & Profit and Loss A/c';
      } else if (qIndex % 4 === 2) {
        const prov = 9200;
        text = `Created a 5% Provision for Doubtful Debts amounting to Rs. ${formatRs(prov)} against year-end debtor balances.`;
        drLedger = 'Profit & Loss A/c';
        crLedger = 'Provision for Doubtful Debts A/c';
        amount = prov;
        narration = 'Being provision for bad & doubtful debts established';
        explanation = 'Prudence concept: Potential credit losses are charged to Profit & Loss A/c (Dr) and held in contra-asset Provision A/c (Cr).';
        dayBookCategory = 'General Journal';
        ledgerAffected = 'Profit & Loss & Provision for Doubtful Debts';
      } else {
        text = `Proprietor invested an additional Rs. ${formatRs(amount * 2)} via online bank wire to strengthen working capital.`;
        drLedger = 'Bank A/c';
        crLedger = 'Capital A/c';
        amount = amount * 2;
        narration = 'Being additional capital injected via bank transfer';
        explanation = 'Bank funds increase (Dr Asset), Capital increases (Cr Equity).';
        dayBookCategory = 'Bank Book';
        ledgerAffected = 'Bank & Capital';
      }
      break;
    }
  }

  // Helper to format ledger name with amount unless already formatted with compound amounts
  const formatWithAmount = (ledgerStr: string, amt: number) => {
    if (ledgerStr.includes('Rs.')) return ledgerStr;
    return `${ledgerStr} (Rs. ${formatRs(amt)})`;
  };

  const drWithAmt = formatWithAmount(drLedger, amount);
  const crWithAmt = formatWithAmount(crLedger, amount);

  // Construct 4 realistic standard accounting options with ledger amounts
  const correctOption = `Dr. ${drWithAmt} | Cr. ${crWithAmt}`;

  // Distractors with amounts
  let distractor1 = `Dr. ${crWithAmt} | Cr. ${drWithAmt}`; // Inverted Dr and Cr
  let distractor2 = `Dr. Suspense A/c (Rs. ${formatRs(amount)}) | Cr. ${crWithAmt}`;

  let altCr = 'Cash A/c';
  if (crLedger.includes('Cash')) {
    altCr = 'Bank A/c';
  } else if (crLedger.includes('Bank')) {
    altCr = 'Sundry Creditors A/c';
  }
  let distractor3 = `Dr. ${drWithAmt} | Cr. ${formatWithAmount(altCr, amount)}`;

  if (day === 8) {
    if (crLedger.includes('TDS Payable') || crLedger.includes('Tax Payable')) {
      // Distractor 1: Paid without deducting statutory TDS
      distractor1 = `Dr. ${drWithAmt} | Cr. Bank A/c (Rs. ${formatRs(amount)})`;
      // Distractor 2: TDS erroneously debited instead of credited as liability
      distractor2 = `Dr. ${drWithAmt} & TDS Payable A/c | Cr. Bank A/c (Rs. ${formatRs(amount)})`;
      // Distractor 3: Inverted Dr and Cr
      distractor3 = `Dr. ${crWithAmt} | Cr. ${drWithAmt}`;
    } else {
      // For statutory non-TDS exempt items: distractors that wrongly deduct tax
      const tds15 = Math.round(amount * 0.15);
      const net85 = amount - tds15;
      distractor1 = `Dr. ${drWithAmt} | Cr. Bank A/c (Rs. ${formatRs(net85)}) & TDS Payable A/c (Rs. ${formatRs(tds15)})`;
      distractor2 = `Dr. ${drWithAmt} & TDS Expense A/c (Rs. ${formatRs(tds15)}) | Cr. Bank A/c (Rs. ${formatRs(amount)})`;
      distractor3 = `Dr. ${crWithAmt} | Cr. ${drWithAmt}`;
    }
  }

  // Place correct option deterministically (using modulo based on question index)
  const correctPos = (day + qIndex) % 4;
  const rawOptions = [distractor1, distractor2, distractor3];
  rawOptions.splice(correctPos, 0, correctOption);

  const options: [string, string, string, string] = [
    `Option A: ${rawOptions[0]}`,
    `Option B: ${rawOptions[1]}`,
    `Option C: ${rawOptions[2]}`,
    `Option D: ${rawOptions[3]}`,
  ];

  return {
    id: qIndex,
    transactionCode: trxRef,
    transactionTitle: trxTitle,
    date: dateStr,
    transactionText: text,
    options,
    correctOptionIndex: correctPos,
    explanation,
    journalEntry: {
      date: dateStr,
      ref: trxRef,
      drLedger,
      crLedger,
      narration,
      debitAmount: amount,
      creditAmount: amount,
    },
    dayBookCategory,
    ledgerAffected,
  };
}

// Generate the complete 15-day modules
export const ALL_DAY_MODULES: DayModule[] = DAY_CONFIGS.map((cfg) => {
  return {
    dayNumber: cfg.dayNum,
    title: cfg.title,
    theme: cfg.theme,
    passcode: cfg.passcode,
    defaultDate: cfg.dateStr,
    description: cfg.description,
    questions: generateQuestionsForDay(cfg),
  };
});
