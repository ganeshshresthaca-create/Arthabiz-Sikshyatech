import { AccountElement } from './chartOfAccountsData';

export interface SubElementDiscussion {
  subGroup: string;
  subGroupNepali: string;
  whyBelongs: string;
  typicalLedgers: string[];
}

export interface RecognitionCriterion {
  number: number;
  title: string;
  titleNepali: string;
  description: string;
}

export interface CoreElementDefinition {
  element: AccountElement;
  englishTitle: string;
  nepaliTitle: string;
  tagline: string;
  primaryStatement: string;
  normalBalance: 'Debit' | 'Credit';
  increasesDecreasesRule: string;
  accountingEquationPosition: string;
  nasIfrsDefinition: string;
  plainMeaning: string;
  plainMeaningNepali: string;
  recognitionCriteria: RecognitionCriterion[];
  discussionGuideIntro: string;
  subElementsDiscussion: SubElementDiscussion[];
  capitalVsRevenueDistinction?: string;
  trainerDiscussionQuestions: string[];
}

export const CORE_ELEMENT_DEFINITIONS: Record<AccountElement, CoreElementDefinition> = {
  Assets: {
    element: 'Assets',
    englishTitle: 'Assets',
    nepaliTitle: 'सम्पत्तिहरू',
    tagline: 'Economic resources controlled by the entity with future benefit potential',
    primaryStatement: 'Balance Sheet / Statement of Financial Position (वासलात)',
    normalBalance: 'Debit',
    increasesDecreasesRule: 'Debit to Increase (↑) • Credit to Decrease (↓)',
    accountingEquationPosition: 'Assets = Liabilities + Owner Equity',
    nasIfrsDefinition:
      'Under the NAS / IFRS Conceptual Framework: "An asset is a present economic resource controlled by the entity as a result of past events. An economic resource is a right that has the potential to produce future economic benefits."',
    plainMeaning:
      'In everyday business terms, an Asset is anything of measurable monetary value that a business owns, holds legal rights to, or controls, which will help generate cash inflows, goods, or economic services in upcoming periods. If a cash outflow provides utility lasting beyond the current fiscal year, it is recognized as an Asset rather than expensed.',
    plainMeaningNepali:
      'व्यावसायिक अर्थमा, व्यवसायको पूर्ण नियन्त्रण तथा स्वामित्वमा रहेका त्यस्ता सम्पूर्ण भौतिक वस्तु, कानुनी अधिकार तथा मौद्रिक स्रोतहरू सम्पत्ति हुन् जसले भविष्यमा आर्थिक लाभ, आम्दानी वा नगद प्रवाह सिर्जना गर्दछन्। चालु आर्थिक वर्षभन्दा पछि पनि लाभ दिने खर्चलाई सम्पत्तिको रूपमा अभिलेख गरिन्छ।',
    recognitionCriteria: [
      {
        number: 1,
        title: 'Controlled by the Entity',
        titleNepali: 'संस्थाको नियन्त्रण वा स्वामित्व',
        description:
          'The enterprise has legal ownership or enforceable contractual rights to deploy the resource and direct how its economic benefits are utilized, while restricting others from accessing them.',
      },
      {
        number: 2,
        title: 'Result of Past Events',
        titleNepali: 'विगतको कारोबार वा घटना',
        description:
          'The resource must have already been acquired or produced through a completed past transaction (e.g., cash purchase, credit agreement, manufacturing, or legal deed), not an anticipated future intention.',
      },
      {
        number: 3,
        title: 'Potential Future Economic Benefits',
        titleNepali: 'भविष्यमा आर्थिक लाभको सम्भावना',
        description:
          'The item must possess the capacity to contribute directly or indirectly to future cash inflows (e.g., selling goods, saving operating costs, or settling obligations).',
      },
    ],
    discussionGuideIntro:
      'How Trainers and Students Classify Sub-Elements & Ledgers under Assets:',
    subElementsDiscussion: [
      {
        subGroup: 'Current Assets (चालु सम्पत्ति)',
        subGroupNepali: 'चालु सम्पत्ति',
        whyBelongs:
          'Meets the definition because these economic resources are already cash, or will be converted into cash, sold, or consumed within 12 months or the normal operating cycle.',
        typicalLedgers: [
          'Cash in Hand (Instant liquidity)',
          'Bank Operating Accounts (Immediate purchasing power)',
          'Accounts Receivable / Debtors (Legal right to collect cash from customers)',
          'Merchandise Inventory (Goods ready to generate revenue upon sale)',
          'Prepaid Expenses (Right to receive future services without further payment)',
        ],
      },
      {
        subGroup: 'Fixed / Non-Current Assets (स्थिर सम्पत्ति)',
        subGroupNepali: 'स्थिर सम्पत्ति (भौतिक)',
        whyBelongs:
          'Meets the definition because they provide productive operational capacity over multiple years and are not held for immediate sale in the ordinary course of business.',
        typicalLedgers: [
          'Freehold Land (Permanent operating site)',
          'Buildings & Premises (Physical shelter for operations)',
          'Plant & Machinery (Manufacturing capacity generating output)',
          'Furniture, Fixtures & Office Equipment (Administrative utility over multiple periods)',
          'Motor Vehicles (Transportation utility)',
        ],
      },
      {
        subGroup: 'Intangible Assets (अमूर्त सम्पत्ति)',
        subGroupNepali: 'अमूर्त सम्पत्ति',
        whyBelongs:
          'Identifiable non-monetary economic resources without physical substance that grant long-term competitive advantages and revenue-generating power.',
        typicalLedgers: [
          'Computer Software & ERP Licenses (Digital operational infrastructure)',
          'Patents & Trademarks (Legal monopolies and brand protection)',
          'Goodwill (Excess earning capacity arising from business acquisition)',
        ],
      },
      {
        subGroup: 'Investments (दीर्घकालीन लगानी)',
        subGroupNepali: 'दीर्घकालीन लगानी',
        whyBelongs:
          'Capital allocated into external securities, bonds, or subsidiaries specifically to earn periodic income (dividends, interest) or capital appreciation.',
        typicalLedgers: [
          'Government Treasury Bonds (Fixed-income sovereign claim)',
          'Shares in Listed Entities (Equity interest yielding dividends)',
          'Fixed Term Deposits > 12 Months (Contractual interest claims)',
        ],
      },
      {
        subGroup: 'Contra-Assets (ऋणात्मक सम्पत्ति)',
        subGroupNepali: 'ऋणात्मक सम्पत्ति (कट्टी खाता)',
        whyBelongs:
          'Valuation accounts carrying credit balances that directly offset and reduce gross asset values to their Net Book Value or Net Realizable Value.',
        typicalLedgers: [
          'Accumulated Depreciation (Total expired service cost of fixed assets)',
          'Allowance for Doubtful Accounts (Estimated uncollectible receivables)',
        ],
      },
    ],
    capitalVsRevenueDistinction:
      'Golden Rule: Capital Expenditure vs Revenue Expenditure — If an outlay enhances the future earning capacity or extends the useful life of a resource beyond 1 year, debit an Asset account. If it merely restores or maintains existing capacity within the current period, debit an Expense account.',
    trainerDiscussionQuestions: [
      'Why is Prepaid Rent classified as an Asset rather than an Expense at the payment date?',
      'Why is a delivery van an Asset, but fuel consumed by the same van an Expense?',
      'What makes Accounts Receivable an economic resource even before the customer pays cash?',
    ],
  },

  Liabilities: {
    element: 'Liabilities',
    englishTitle: 'Liabilities',
    nepaliTitle: 'दायित्वहरू',
    tagline: 'Present legal or constructive obligations requiring future resource transfer',
    primaryStatement: 'Balance Sheet / Statement of Financial Position (वासलात)',
    normalBalance: 'Credit',
    increasesDecreasesRule: 'Credit to Increase (↑) • Debit to Decrease (↓)',
    accountingEquationPosition: 'Liabilities = Assets - Owner Equity',
    nasIfrsDefinition:
      'Under the NAS / IFRS Conceptual Framework: "A liability is a present obligation of the entity to transfer an economic resource as a result of past events."',
    plainMeaning:
      'In practical business terms, a Liability is any external financial debt, legal duty, or statutory commitment that a business owes to outsiders (suppliers, banks, employees, tax authorities). Settling a liability unavoidably demands sacrificing company resources in the future—such as paying cash, transferring assets, or performing services.',
    plainMeaningNepali:
      'व्यावहारिक अर्थमा, विगतका कारोबारका कारण व्यवसायले बाह्य पक्षहरू (ऋणदाता, साहु, बैंक, कर्मचारी वा सरकार) लाई भुक्तानी गर्नुपर्ने सम्पूर्ण कानुनी, मौद्रिक वा सेवामूलक ऋण तथा दायित्व नै Liabilities हुन्। यसको फछ्र्यौट गर्दा भविष्यमा नगद वा अन्य आर्थिक स्रोत बाहिरिन्छ।',
    recognitionCriteria: [
      {
        number: 1,
        title: 'Present Obligation',
        titleNepali: 'विद्यमान कानुनी वा व्यावसायिक कर्तव्य',
        description:
          'The enterprise has a legally binding duty or constructive commitment that it has no practical ability to avoid (contracts, tax legislation, court orders, or established business practices).',
      },
      {
        number: 2,
        title: 'Result of Past Events',
        titleNepali: 'विगतको कारोबार वा प्राप्ति',
        description:
          'The obligation arose from a transaction or event that has already occurred (e.g., goods received on credit, bank loan disbursed, electricity consumed, services rendered by staff), not an intention to borrow in the future.',
      },
      {
        number: 3,
        title: 'Probable Outflow of Economic Resources',
        titleNepali: 'आर्थिक स्रोत बाहिरिने निश्चितता',
        description:
          'Settlement of the duty requires an unavoidable transfer of economic resources (paying cash, handing over merchandise, or providing labor/services).',
      },
    ],
    discussionGuideIntro:
      'How Trainers and Students Classify Sub-Elements & Ledgers under Liabilities:',
    subElementsDiscussion: [
      {
        subGroup: 'Current Liabilities (चालु दायित्व)',
        subGroupNepali: 'चालु दायित्व',
        whyBelongs:
          'Obligations reasonably expected to be settled within 12 months or the operating cycle, using current assets or short-term rollover credit.',
        typicalLedgers: [
          'Accounts Payable / Trade Creditors (Amounts owed to suppliers for goods already received)',
          'Short-term Bank Borrowings & Overdraft (Revolving bank facility due within months)',
          'Bills Payable (Negotiable promissory notes due within short tenors)',
        ],
      },
      {
        subGroup: 'Accrued & Outstanding Expenses (बाँकी भुक्तानी दायित्व)',
        subGroupNepali: 'खर्चको बक्यौता दायित्व',
        whyBelongs:
          'Services were already consumed during the current accounting period, but the cash settlement date falls in the next period. Under accrual accounting, this creates an immediate debt.',
        typicalLedgers: [
          'Outstanding Salaries & Wages (Staff provided labor; salary due on the 1st of next month)',
          'Accrued Interest on Bank Loans (Interest incurred on borrowed capital)',
          'Audit Fees Payable (Statutory audit work conducted; payment pending)',
          'Electricity & Utilities Payable (Energy consumed in the current month)',
        ],
      },
      {
        subGroup: 'Unearned / Advance Revenue (अग्रिम आम्दानी दायित्व)',
        subGroupNepali: 'अग्रिम आम्दानी दायित्व',
        whyBelongs:
          'Cash was collected from customers before fulfilling the performance obligation. Because the business still owes the goods/services, it is a liability until earned!',
        typicalLedgers: [
          'Customer Advances / Retainers (Advance deposit for future contract work)',
          'Unearned Subscription Revenue (Advance fee for upcoming service months)',
        ],
      },
      {
        subGroup: 'Statutory Liabilities (सरकारी कर तथा कोष दायित्व)',
        subGroupNepali: 'सरकारी कर तथा सामाजिक कोष दायित्व',
        whyBelongs:
          'Mandatory legal commitments withheld or collected on behalf of the Government of Nepal or labor authorities, held in trust until Treasury deposit.',
        typicalLedgers: [
          'TDS Withholding Tax Payable (Tax deducted under Sec 87/88/89 awaiting IRD deposit)',
          'Output VAT Payable (13% value added tax collected from buyers)',
          'Social Security Fund (SSF 31%) Payable (Statutory retirement remittance)',
        ],
      },
      {
        subGroup: 'Non-Current Liabilities (दीर्घकालीन दायित्व)',
        subGroupNepali: 'दीर्घकालीन दायित्व',
        whyBelongs:
          'Formal contractual debts and long-term financing commitments maturing beyond 12 months from the reporting date.',
        typicalLedgers: [
          'Bank Term Loans (3 to 10 year project financing)',
          'Debentures & Corporate Bonds (Public long-term debt instruments)',
          'Long-term Employee Gratuity Provisions (Actuarially estimated retirement obligations)',
        ],
      },
    ],
    trainerDiscussionQuestions: [
      'Why is Unearned Revenue (Advance from Customer) treated as a Liability rather than an Income upon cash receipt?',
      'How does Outstanding Salary reflect both an Expense (in P&L) and a Liability (in Balance Sheet)?',
      'Why does statutory TDS Payable represent a liability of the deductor rather than government property until deposited?',
    ],
  },

  Equity: {
    element: 'Equity',
    englishTitle: 'Equity',
    nepaliTitle: 'स्वपुँजी / शेयरधनीको कोष',
    tagline: 'Residual interest in entity assets after deducting all third-party liabilities',
    primaryStatement: 'Balance Sheet / Statement of Financial Position (वासलात)',
    normalBalance: 'Credit',
    increasesDecreasesRule: 'Credit to Increase (↑) • Debit to Decrease (↓)',
    accountingEquationPosition: 'Owner Equity = Total Assets - Total Liabilities',
    nasIfrsDefinition:
      'Under the NAS / IFRS Conceptual Framework: "Equity is the residual interest in the assets of the entity after deducting all its liabilities."',
    plainMeaning:
      'In plain business terms, Equity represents the owners\' true financial stake and net worth in the business. If the business were to liquidate today, sell every asset at carrying value, and pay off every single bank loan, supplier, and tax authority, whatever cash remains belongs exclusively to the equity owners (proprietor, partners, or shareholders). It consists of original capital invested plus accumulated retained profits reinvested into the business.',
    plainMeaningNepali:
      'व्यवसायको कुल सम्पत्तिबाट सबै बाह्य ऋण तथा दायित्वहरू चुक्ता गरिसकेपछि बाँकी रहने खुद मूल्य नै स्वपुँजी (Equity/Net Worth) हो। यो मालिक वा शेयरधनीले व्यवसायमा गरेको लगानी, सञ्चालनबाट आर्जन गरी व्यवसायमै राखिएको खुद नाफा (जगेडा कोष) तथा अन्य अधिशेषको कुल योग हो।',
    recognitionCriteria: [
      {
        number: 1,
        title: 'Residual Claim',
        titleNepali: 'अवशिष्ट दाबी (अन्तिम अधिकार)',
        description:
          'Equity holders have a subordinate, residual claim. Outside creditors, lenders, suppliers, and tax authorities always have legal priority for repayment before owners can claim any assets.',
      },
      {
        number: 2,
        title: 'Dual Origin: Contributed vs. Earned',
        titleNepali: 'लगानी पुँजी तथा खुद नाफाको स्रोत',
        description:
          'Originates from two distinct streams: (1) Direct capital invested by owners (Share Capital/Paid-up Capital), and (2) Operating profits earned by the business and retained instead of distributed (Retained Earnings).',
      },
      {
        number: 3,
        title: 'No Fixed Repayment Maturity',
        titleNepali: 'निश्चित भुक्तानी म्याद नहुने',
        description:
          'Unlike liabilities, pure equity capital does not have a mandatory contractual maturity date and does not trigger fixed mandatory interest costs.',
      },
    ],
    discussionGuideIntro:
      'How Trainers and Students Classify Sub-Elements & Ledgers under Equity:',
    subElementsDiscussion: [
      {
        subGroup: 'Share Capital (सेयर पुँजी)',
        subGroupNepali: 'जारी तथा चुक्ता सेयर पुँजी',
        whyBelongs:
          'The primary formal equity contribution directly injected into the corporation by promoters and public shareholders in exchange for ownership shares.',
        typicalLedgers: [
          'Ordinary / Equity Share Capital (Common voting ownership stock)',
          'Preference Share Capital (Priority claim on dividend distribution)',
          'Owner / Partner Capital Account (Proprietorship or partnership base equity)',
        ],
      },
      {
        subGroup: 'Reserves & Surplus (जगेडा कोष तथा अधिशेष)',
        subGroupNepali: 'जगेडा तथा नाफा नोक्सान बचत',
        whyBelongs:
          'Accumulated net profits generated by business operations across prior fiscal periods that have been reinvested in the enterprise rather than paid out as cash dividends.',
        typicalLedgers: [
          'Retained Earnings / P&L Surplus (Cumulative undistributed operational profits)',
          'General Reserve (Statutory or voluntary capital buffer for future stability)',
          'Capital Redemption Reserve (Statutory reserve created upon equity retirement)',
        ],
      },
      {
        subGroup: 'Share Premium (सेयर प्रिमियम)',
        subGroupNepali: 'सेयर प्रिमियम कोष',
        whyBelongs:
          'Additional consideration contributed by equity investors above the par/nominal face value of shares issued during IPOs or rights offerings.',
        typicalLedgers: [
          'Share Premium Account (Capital surplus received above face value)',
        ],
      },
      {
        subGroup: 'Contra-Equity (स्वपुँजी कट्टी खाता)',
        subGroupNepali: 'स्वपुँजी घटाउने खाता',
        whyBelongs:
          'Accounts with Debit balances that directly offset and decrease total owner equity, representing capital extracted by owners.',
        typicalLedgers: [
          'Owner Drawings Account (Cash or merchandise taken by owner for personal use)',
          'Dividends Declared (Profit distribution reducing retained earnings)',
        ],
      },
    ],
    trainerDiscussionQuestions: [
      'Why do Drawings carry a Debit balance even though Equity is a Credit account?',
      'How does Net Profit earned in the Profit & Loss Statement ultimately flow into Balance Sheet Equity?',
      'Why are ordinary shareholders called "residual claimants" in financial accounting?',
    ],
  },

  Income: {
    element: 'Income',
    englishTitle: 'Income & Revenue',
    nepaliTitle: 'आम्दानी तथा राजस्व',
    tagline: 'Inflows of economic benefits during the period that increase owner equity',
    primaryStatement: 'Income Statement / Profit & Loss (नाफा-नोक्सान हिसाब)',
    normalBalance: 'Credit',
    increasesDecreasesRule: 'Credit to Increase (↑) • Debit to Decrease (↓)',
    accountingEquationPosition: 'Revenue increases Equity (Assets ↑ or Liabilities ↓ → Equity ↑)',
    nasIfrsDefinition:
      'Under the NAS / IFRS Conceptual Framework: "Income is increases in economic benefits during the accounting period in the form of inflows or enhancements of assets, or decreases of liabilities, that result in increases in equity, other than those relating to contributions from equity participants."',
    plainMeaning:
      'In everyday business operations, Income (or Revenue) is the gross inflow of cash, receivables, or other consideration earned by the business from delivering goods, rendering professional services, or engaging in secondary activities (earning interest, collecting rent, receiving trade discounts). Earning income increases the company\'s net worth without needing extra capital from shareholders.',
    plainMeaningNepali:
      'आर्थिक वर्षभर व्यवसायले वस्तु बिक्री गरी वा सेवा प्रदान गरी प्राप्त गरेको वा प्राप्त हुन बाँकी सम्पूर्ण प्रतिफल आम्दानी (Income) हो। यसले व्यवसायको सम्पत्ति बढाउँछ वा दायित्व घटाउँछ, जसले गर्दा मालिकको स्वपुँजीमा खुद वृद्धि हुन्छ।',
    recognitionCriteria: [
      {
        number: 1,
        title: 'Performance Obligation Earned (Accrual Basis)',
        titleNepali: 'काम वा वस्तुको हस्तान्तरण (आर्जित आधार)',
        description:
          'Revenue is recognized when goods are transferred or services are rendered to the buyer, regardless of whether cash is collected immediately or later on credit.',
      },
      {
        number: 2,
        title: 'Reliable Measurement of Consideration',
        titleNepali: 'प्रतिफलको भरपर्दो मापन',
        description:
          'The transaction price, contract value, or consideration can be measured reliably, and the ultimate collection of cash is reasonably assured.',
      },
      {
        number: 3,
        title: 'Increases Net Assets & Equity',
        titleNepali: 'खुद सम्पत्ति तथा पुँजीमा वृद्धि',
        description:
          'Produces an inflow of cash or accounts receivable, or extinguishes an existing customer advance liability, directly boosting net earnings.',
      },
    ],
    discussionGuideIntro:
      'How Trainers and Students Classify Sub-Elements & Ledgers under Income:',
    subElementsDiscussion: [
      {
        subGroup: 'Operating Revenue (मुख्य व्यावसायिक आम्दानी - Trading A/c)',
        subGroupNepali: 'मुख्य कारोबारबाट प्राप्त राजस्व',
        whyBelongs:
          'Gross earnings realized directly from the core business activities for which the company was established (trading inventory or providing primary services).',
        typicalLedgers: [
          'Sales Revenue (Merchandise inventory sold to wholesale/retail buyers)',
          'Professional Service Fee Income (Consulting, legal, engineering, or audit fee revenue)',
          'Contracting & Commission Income (Core agency or execution fees)',
        ],
      },
      {
        subGroup: 'Non-Operating / Other Income (अन्य अप्रत्यक्ष आम्दानी - P&L)',
        subGroupNepali: 'अन्य सहायक तथा गैर-सञ्चालन आम्दानी',
        whyBelongs:
          'Auxiliary or secondary economic inflows arising from side activities, excess treasury deployment, or incidental capital transactions.',
        typicalLedgers: [
          'Interest Income on Bank Deposits (Earnings on surplus cash balances)',
          'Dividend Income (Returns on investment holdings)',
          'Rental Income from Surplus Property (Subletting or leasing spare facility space)',
          'Discount Received from Vendors (Prompt payment discounts earned from suppliers)',
          'Gain on Disposal of Fixed Assets (Sale proceeds exceeding net book value)',
        ],
      },
      {
        subGroup: 'Contra-Revenue (बिक्री कट्टी खाता)',
        subGroupNepali: 'बिक्री घटाउने खाता',
        whyBelongs:
          'Offsetting accounts carrying Debit balances that directly reduce gross sales down to Net Sales in the Income Statement.',
        typicalLedgers: [
          'Sales Return & Inward Allowances (Goods returned by unsatisfied buyers)',
          'Cash Discount Allowed to Customers (Price reductions conceded for early cash payment)',
        ],
      },
    ],
    trainerDiscussionQuestions: [
      'Why is cash received from a bank loan NOT considered Income, even though cash increases?',
      'Why is Sales Revenue recorded on the date goods are delivered on credit, rather than when the client pays cash?',
      'Why does Discount Received carry a Credit balance while Discount Allowed carries a Debit balance?',
    ],
  },

  Expenses: {
    element: 'Expenses',
    englishTitle: 'Expenses',
    nepaliTitle: 'खर्चहरू',
    tagline: 'Costs of resources consumed or expired during the period to generate revenue',
    primaryStatement: 'Income Statement / Profit & Loss (नाफा-नोक्सान हिसाब)',
    normalBalance: 'Debit',
    increasesDecreasesRule: 'Debit to Increase (↑) • Credit to Decrease (↓)',
    accountingEquationPosition: 'Expenses decrease Equity (Assets ↓ or Liabilities ↑ → Equity ↓)',
    nasIfrsDefinition:
      'Under the NAS / IFRS Conceptual Framework: "Expenses are decreases in economic benefits during the accounting period in the form of outflows or depletions of assets, or incurrences of liabilities, that result in decreases in equity, other than those relating to distributions to equity participants."',
    plainMeaning:
      'In everyday business terms, an Expense is the monetary cost of goods, resources, or services used up, consumed, or expired during an accounting period in order to produce revenue or keep business operations functioning. Under the fundamental Matching Principle (समानुकूलता सिद्धान्त), expenses must be recognized in the exact same fiscal period in which the associated revenues were generated.',
    plainMeaningNepali:
      'आर्थिक वर्षभर आम्दानी आर्जन गर्न तथा दैनिक व्यवसाय सञ्चालन गर्न उपभोग गरिएका, सकिएका वा भुक्तानी गरिएका स्रोतहरूको मौद्रिक लागत नै खर्च (Expenses) हो। समानुकूलता सिद्धान्त (Matching Principle) अनुसार जुन वर्ष आम्दानी हुन्छ, त्यसलाई कमाउन गरिएको खर्च सोही वर्षको नाफा-नोक्सानमा डेबिट गरिन्छ।',
    recognitionCriteria: [
      {
        number: 1,
        title: 'Resource Consumed or Utility Expired',
        titleNepali: 'स्रोतको उपभोग वा उपयोगिता समाप्त',
        description:
          'The economic benefit of the expenditure has been consumed during the period. (If the utility extends into future fiscal years, it is an Asset; if it is fully expired now, it is an Expense!).',
      },
      {
        number: 2,
        title: 'Direct Link to Earning Revenue (Matching Principle)',
        titleNepali: 'आम्दानीसँग प्रत्यक्ष वा अप्रत्यक्ष सम्बन्ध',
        description:
          'Costs incurred specifically to purchase materials, produce goods, pay staff, maintain facilities, or market offerings to customers.',
      },
      {
        number: 3,
        title: 'Reduces Net Income & Owner Equity',
        titleNepali: 'खुद नाफा तथा पुँजीमा कमी',
        description:
          'Directly decreases the current period\'s bottom-line net profit without being a distribution of capital/dividends to shareholders.',
      },
    ],
    discussionGuideIntro:
      'How Trainers and Students Classify Sub-Elements & Ledgers under Expenses:',
    subElementsDiscussion: [
      {
        subGroup: 'Direct Expenses / Cost of Goods Sold (प्रत्यक्ष खर्च - Trading A/c)',
        subGroupNepali: 'प्रत्यक्ष खरिद तथा उत्पादन खर्च',
        whyBelongs:
          'Costs directly traceable to procuring inventory or manufacturing finished goods ready for customer delivery. Matched directly against Gross Sales.',
        typicalLedgers: [
          'Merchandise Purchases (Cost of inventory acquired for resale)',
          'Customs & Import Duties (Mandatory border tariff on merchandise imports)',
          'Freight & Carriage Inward (Transportation costs to bring goods into the warehouse)',
          'Direct Factory Wages (Labor directly manufacturing goods)',
        ],
      },
      {
        subGroup: 'Operating & Administrative Expenses (सञ्चालन तथा प्रशासनिक खर्च - P&L)',
        subGroupNepali: 'सामान्य कार्यालय तथा प्रशासनिक खर्च',
        whyBelongs:
          'General overhead costs required to maintain daily organizational infrastructure and management, expired on a time-period basis.',
        typicalLedgers: [
          'Office Rent & Lease (Monthly premises occupancy cost)',
          'Staff Salaries & Allowances (Administrative personnel remuneration)',
          'Electricity, Water & Internet (Utility services consumed)',
          'Audit, Legal & Compliance Fees (Professional advisory overhead)',
          'Printing, Stationery & Office Supplies (Consumables depleted during work)',
        ],
      },
      {
        subGroup: 'Selling & Distribution Expenses (बिक्री तथा वितरण खर्च - P&L)',
        subGroupNepali: 'बिक्री प्रवर्द्धन तथा बजार व्यवस्थापन खर्च',
        whyBelongs:
          'Costs incurred to stimulate market demand, promote products, and transport finished goods to the final purchaser.',
        typicalLedgers: [
          'Advertising & Marketing Campaigns (Promotional spend)',
          'Freight & Carriage Outward (Delivery transport to customer doorstep)',
          'Sales Commissions & Incentives (Performance payout to sales personnel)',
        ],
      },
      {
        subGroup: 'Financing Costs (वित्तीय खर्च - P&L)',
        subGroupNepali: 'ऋण तथा वित्तीय शुल्क',
        whyBelongs:
          'The periodic price paid to banks and lenders for borrowing capital used to finance business operations.',
        typicalLedgers: [
          'Bank Loan Interest (Cost of borrowed debt capital)',
          'Bank Charges, LC & Guarantee Commission (Transaction processing fees)',
        ],
      },
      {
        subGroup: 'Non-Cash & Depreciation Expenses (गैर-नगद खर्च)',
        subGroupNepali: 'मूल्यह्रास तथा गैर-नगद अपलेखन',
        whyBelongs:
          'Systematic allocation of fixed asset acquisition costs over their estimated useful service lives as their economic utility gradually wears out.',
        typicalLedgers: [
          'Depreciation Expense (Periodic wear and tear of machinery, vehicles, furniture)',
          'Amortization Expense (Systematic write-off of software and intangible licenses)',
          'Bad Debts Expense (Irrecoverable customer receivables written off as a loss)',
        ],
      },
      {
        subGroup: 'Contra-Expense (खर्च कट्टी खाता)',
        subGroupNepali: 'खर्च घटाउने खाता',
        whyBelongs:
          'Companion accounts carrying Credit balances that directly reduce gross purchase expenses.',
        typicalLedgers: [
          'Purchase Return & Outward Allowances (Damaged merchandise shipped back to vendors)',
        ],
      },
    ],
    capitalVsRevenueDistinction:
      'Key Exam Trap: Carriage Inward vs Carriage Outward — Carriage Inward is a Direct Cost added to Purchases (Trading A/c); Carriage Outward is a Selling Expense (Profit & Loss A/c). Similarly, Machinery Installation Wages are capitalized to the Machinery Asset account, while normal staff wages are debited to Wages Expense.',
    trainerDiscussionQuestions: [
      'Why is purchasing a computer an Asset, but purchasing printing paper an Expense?',
      'Why is Depreciation classified as an Expense even though no physical cash leaves the bank account at year-end?',
      'How does the Matching Principle prevent a business from recording expenses in the wrong fiscal year?',
    ],
  },
};
