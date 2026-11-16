export interface AccountingCycleStep {
  step: number;
  title: string;
  nepaliTitle: string;
  shortDesc: string;
  fullDescription: string;
  theme: {
    color: string;
    hex: string;
    borderHex: string;
    bgLight: string;
    badgeBg: string;
    textDark: string;
  };
  iconName: string;
  actionSummary: string;
  statutoryRule: string;
  examTrapNote: string;
  workedExample: {
    scenario: string;
    inputDocuments: string[];
    technicalOutput: {
      title: string;
      type: 'table' | 'journal' | 't-account' | 'worksheet' | 'statement';
      data: any;
    };
    explanation: string;
  };
}

export const ACCOUNTING_CYCLE_8_STEPS: AccountingCycleStep[] = [
  {
    step: 1,
    title: 'Identify and analyze transactions',
    nepaliTitle: 'कारोबारको पहिचान तथा स्रोत कागजात विश्लेषण',
    shortDesc: 'Analyze economic events and verify authentic source documents before recording.',
    fullDescription:
      'The accounting cycle commences the moment an economic event occurs between two parties. The accountant inspects authentic source documents (Tax Invoices, Cash Receipts, Bank Slips, Vouchers) to determine if measurable financial value changed hands, which two or more accounts are affected, and verify management authorization.',
    theme: {
      color: 'amber',
      hex: '#B45309', // Brown / Rust matching Step 1 in diagram
      borderHex: '#92400E',
      bgLight: 'bg-amber-50/60',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      textDark: 'text-amber-950',
    },
    iconName: 'Coins',
    actionSummary: 'Verify physical/electronic invoices, payment requests, and contracts for dual-aspect impact.',
    statutoryRule:
      'Audit Verification Rule: Under the Nepal Income Tax Act 2058 (Sec 81) and Companies Act 2063 (Sec 109), no transaction may be recorded without an authentic, serialized, and approved source document.',
    examTrapNote:
      'Trap: Pure agreements or prospective employee appointment letters are NOT financial transactions because no transfer of economic resources or obligations has occurred yet.',
    workedExample: {
      scenario:
        'Himalayan Tech Logistics acquires 4 Dell Core i7 Office Laptops for NPR 240,000 + 13% VAT (NPR 31,200) on credit, and purchases Monthly Office Stationery for NPR 20,000 + 13% VAT (NPR 2,600) under Tax Invoices #7741 and #319.',
      inputDocuments: [
        'VAT Tax Invoice #7741 (Infotech Hub) for NPR 271,200 gross',
        'VAT Tax Invoice #319 (Quality Stationers) for NPR 22,600 gross',
        'Goods Received Note (GRN #108)',
        'Approved Purchase Orders (PO #442 & #443)',
      ],
      technicalOutput: {
        title: 'Source Document Analysis & Entity VAT Registration Scenarios',
        type: 'table',
        data: [
          { field: 'Laptop Asset Invoice (Taxable + 13% VAT)', value: 'NPR 240,000 + NPR 31,200 = NPR 271,200 Gross' },
          { field: 'Office Supplies Invoice (Taxable + 13% VAT)', value: 'NPR 20,000 + NPR 2,600 = NPR 22,600 Gross' },
          {
            field: 'SCENARIO 1: Buyer is VAT-Registered Entity (Tax Asset Treatment)',
            value: 'Under Section 17 of Nepal VAT Act 2052, entity claims Input Tax Credit (कट्टी). Input VAT (NPR 31,200 + NPR 2,600) is recognized as a CURRENT ASSET (Tax Credit Receivable from IRD). Asset and expenses are recorded at net taxable values (NPR 240,000 and NPR 20,000).',
          },
          {
            field: 'SCENARIO 2: Buyer is NOT VAT-Registered (Capital Asset — Part of Cost)',
            value: 'Under NAS 16.16 / IAS 16, non-refundable purchase taxes cannot be claimed back from tax authorities and MUST be CAPITALIZED into the initial cost of the asset. The Dell Laptops are recognized at gross cost of NPR 271,200 (higher depreciable base).',
          },
          {
            field: 'SCENARIO 3: Buyer is NOT VAT-Registered (Consumable Supplies — As Expense)',
            value: 'For consumable goods and operational services (stationery, utilities, printing), the non-recoverable VAT cannot be capitalized into fixed assets. The entity treats the non-refundable VAT directly as an OPERATIONAL EXPENSE (either absorbed into Stationery Expense NPR 22,600 or segregated as VAT Expense NPR 2,600).',
          },
        ],
      },
      explanation:
        'Fundamental Tax Rule: If the entity is VAT-registered and the purchase is eligible for credit, VAT is an ASSET (receivable from IRD). If the entity is NOT VAT-registered (or input tax credit is blocked under Sec 17(4)), VAT is non-recoverable: it is CAPITALIZED into the cost of the asset for capital items (NAS 16), or recognized as an EXPENSE for consumable supplies and operational services.',
    },
  },
  {
    step: 2,
    title: 'Record transactions in a journal',
    nepaliTitle: 'गोश्वारा भौचरमा प्रविष्टि (Books of Original Entry)',
    shortDesc: 'Chronological recording in the General Journal with balanced Debits, Credits, and Narration.',
    fullDescription:
      'Transactions are recorded chronologically in the Books of Original Entry (General Journal / गोश्वारा भौचर) using the fundamental double-entry rule: Total Debits must equal Total Credits. Each journal voucher contains transaction date, account heads, folio references, amounts, and a mandatory explanatory narration.',
    theme: {
      color: 'rose',
      hex: '#9F1239', // Burgundy / Wine matching Step 2 in diagram
      borderHex: '#881337',
      bgLight: 'bg-rose-50/60',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      textDark: 'text-rose-950',
    },
    iconName: 'FileText',
    actionSummary: 'Enter double-entry vouchers with Debit, Credit, and concise narration.',
    statutoryRule:
      'Golden Double-Entry Rule: Every debit entry must have a corresponding equal credit entry. Narration is mandatory for statutory compliance and forensic audit trails.',
    examTrapNote:
      'Exam Rule: Omitting journal narration (संक्षिप्त विवरण) or misclassifying non-refundable VAT results in penalties under both accounting exams and tax audits.',
    workedExample: {
      scenario:
        'Journalizing equipment and operational supply purchases under all 3 real-world entity VAT statuses: (A) VAT-Registered Entity, (B) Non-VAT Registered Entity purchasing Capital Asset, and (C) Non-VAT Registered Entity purchasing Operational Consumables.',
      inputDocuments: [
        'Tax Invoice #7741 (Infotech Hub: NPR 240,000 + NPR 31,200 VAT)',
        'Tax Invoice #319 (Quality Stationers: NPR 20,000 + NPR 2,600 VAT)',
      ],
      technicalOutput: {
        title: 'Comparative General Journal Entries across Real-World VAT Classifications (गोश्वारा भौचर)',
        type: 'journal',
        data: [
          {
            isHeader: true,
            title: 'CASE A: BUYER IS VAT-REGISTERED ENTITY (Input VAT Recognized as ASSET / Tax Credit)',
          },
          {
            date: '2083-05-10',
            particulars: 'Office Equipment (Dell Laptops) A/c (Net Taxable Base) ....... Dr.',
            lf: 'L-14',
            debit: '240,000',
            credit: '-',
          },
          {
            date: '2083-05-10',
            particulars: 'Input VAT Receivable A/c (Current Asset / Tax Credit) ........ Dr.',
            lf: 'L-22',
            debit: '31,200',
            credit: '-',
          },
          {
            date: '2083-05-10',
            particulars: '   To Infotech Hub Pvt. Ltd. (Sundry Creditor) A/c',
            lf: 'L-38',
            debit: '-',
            credit: '271,200',
          },
          {
            date: '',
            particulars: '(Being purchase of 4 laptops on credit by VAT-registered entity; 13% input tax claimed as an asset / tax credit receivable from IRD)',
            lf: '',
            debit: '271,200',
            credit: '271,200',
          },
          {
            isHeader: true,
            title: 'CASE B: BUYER IS NOT VAT-REGISTERED (Capital Asset — Non-Refundable VAT Capitalized into Asset Cost under NAS 16)',
          },
          {
            date: '2083-05-10',
            particulars: 'Office Equipment A/c (Gross Capitalized Cost: 240k + 31.2k) .. Dr.',
            lf: 'L-14',
            debit: '271,200',
            credit: '-',
          },
          {
            date: '2083-05-10',
            particulars: '   To Infotech Hub Pvt. Ltd. (Sundry Creditor) A/c',
            lf: 'L-38',
            debit: '-',
            credit: '271,200',
          },
          {
            date: '',
            particulars: '(Being laptops purchased by non-VAT registered entity; non-recoverable 13% VAT capitalized directly into asset cost under NAS 16.16)',
            lf: '',
            debit: '271,200',
            credit: '271,200',
          },
          {
            isHeader: true,
            title: 'CASE C: BUYER IS NOT VAT-REGISTERED (Consumables & Expenses — Non-Refundable VAT Treated as EXPENSE)',
          },
          {
            date: '2083-05-12',
            particulars: 'Option C1 (Single Gross Expense):',
            lf: '',
            debit: '',
            credit: '',
          },
          {
            date: '2083-05-12',
            particulars: 'Printing & Office Supplies Expense A/c (Gross with VAT) ...... Dr.',
            lf: 'L-54',
            debit: '22,600',
            credit: '-',
          },
          {
            date: '2083-05-12',
            particulars: '   To Quality Stationers Pvt. Ltd. (Creditor) A/c',
            lf: 'L-41',
            debit: '-',
            credit: '22,600',
          },
          {
            date: '',
            particulars: '(Being stationery purchased by non-VAT registered entity; non-claimable 13% VAT absorbed directly into supplies expense)',
            lf: '',
            debit: '22,600',
            credit: '22,600',
          },
          {
            date: '2083-05-12',
            particulars: 'Option C2 (Segregated VAT Expense for IRD Audit Reporting):',
            lf: '',
            debit: '',
            credit: '',
          },
          {
            date: '2083-05-12',
            particulars: 'Printing & Office Supplies Expense A/c (Base Taxable) ........ Dr.',
            lf: 'L-54',
            debit: '20,000',
            credit: '-',
          },
          {
            date: '2083-05-12',
            particulars: 'VAT Expense A/c (Non-Recoverable Indirect Tax Expense) ..... Dr.',
            lf: 'L-55',
            debit: '2,600',
            credit: '-',
          },
          {
            date: '2083-05-12',
            particulars: '   To Quality Stationers Pvt. Ltd. (Creditor) A/c',
            lf: 'L-41',
            debit: '-',
            credit: '22,600',
          },
          {
            date: '',
            particulars: '(Being stationery purchased by non-VAT entity with non-refundable VAT booked separately to VAT Expense for tax deductions)',
            lf: '',
            debit: '22,600',
            credit: '22,600',
          },
        ],
      },
      explanation:
        'Tripartite Accounting Reality: (1) When the buyer is VAT-registered, VAT is an ASSET (receivable from the government). (2) When the buyer is NOT VAT-registered and buys a capital asset, non-refundable VAT cannot be claimed back from the IRD; hence, under NAS 16 / IAS 16, it is CAPITALIZED into the asset cost, raising the asset balance and subsequent annual depreciation. (3) When the buyer is NOT VAT-registered and buys consumable goods or services, non-refundable VAT is recognized as an EXPENSE (either directly bundled into the expense line or separated into a dedicated VAT Expense account).',
    },
  },
  {
    step: 3,
    title: 'Post transactions to general ledger',
    nepaliTitle: 'खातामा खतौनी तथा वर्गीकरण (T-Account Posting)',
    shortDesc: 'Sort individual journal debits and credits into dedicated ledger accounts (खाता).',
    fullDescription:
      'Journal entries are sorted and posted into the General Ledger (खाता), the Principal Book of Accounts. Every account head has its dedicated T-Account. Debits from the journal are posted to the left side and credits to the right side, establishing the cumulative balance (b/d) for every individual asset, liability, equity, revenue, and expense.',
    theme: {
      color: 'teal',
      hex: '#0D9488', // Teal / Slate Cyan matching Step 3 in diagram
      borderHex: '#115E59',
      bgLight: 'bg-teal-50/60',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
      textDark: 'text-teal-950',
    },
    iconName: 'BookOpen',
    actionSummary: 'Transfer entries into individual ledger T-Accounts and balance c/d and b/d.',
    statutoryRule:
      'Principal Book Rule: The General Ledger is the authoritative source for trial balances and audits. Entries must carry Ledger Folio (L.F.) cross-referencing the journal page.',
    examTrapNote:
      'Trap: Balance c/d (carried down) represents closing balance at period end; Balance b/d (brought down) is the opening balance on the opposite normal side at the beginning of the next period.',
    workedExample: {
      scenario:
        'Posting vouchers to ledgers under all 3 scenarios: (A) VAT-Registered: Office Equipment L-14, Input VAT L-22, Creditor L-38; (B) Non-VAT Capital Asset: Gross Office Equipment L-14; (C) Non-VAT Consumables: Supplies Expense L-54 & VAT Expense L-55.',
      inputDocuments: ['General Journal Folio J-12', 'General Ledger Book'],
      technicalOutput: {
        title: 'T-Account Ledger Posting Extract (VAT Asset vs Capitalized Cost vs Expense)',
        type: 't-account',
        data: [
          {
            account: 'CASE A (VAT-Registered): Office Equipment (L-14) & Input VAT Asset (L-22)',
            debitSide: 'Office Equipment Dr. NPR 240,000 | Input VAT Receivable Dr. NPR 31,200',
            creditSide: 'Infotech Hub Creditor Cr. NPR 271,200',
            netBalance: 'Asset Net Balances: Equipment NPR 240,000 & Tax Credit Asset NPR 31,200',
          },
          {
            account: 'CASE B (Non-VAT Registered): Office Equipment Gross Capitalized (L-14)',
            debitSide: '2083-05-10: To Infotech Hub (Base Cost NPR 240,000 + Non-Refundable VAT NPR 31,200) NPR 271,200',
            creditSide: '2083-05-31: By Balance c/d NPR 271,200',
            netBalance: 'Single Capitalized Fixed Asset Balance b/d: NPR 271,200 (NAS 16 Cost Base)',
          },
          {
            account: 'CASE C (Non-VAT Registered): Supplies Expense (L-54) & VAT Expense (L-55)',
            debitSide: 'Stationery Supplies Dr. NPR 20,000 | Non-Recoverable VAT Expense Dr. NPR 2,600 (or Gross NPR 22,600)',
            creditSide: 'Quality Stationers Creditor Cr. NPR 22,600',
            netBalance: 'Total Operational Expense Debits: NPR 22,600 recognized in Profit & Loss',
          },
        ],
      },
      explanation:
        'In Case A, the fixed asset ledger reflects pure net cost (NPR 240,000) and VAT sits in a current asset receivable ledger. In Case B, the non-recoverable VAT is capitalized directly into the fixed asset ledger at NPR 271,200. In Case C, the non-recoverable VAT is posted as an operational expense, reducing net income for the period.',
    },
  },
  {
    step: 4,
    title: 'Determine unadjusted trial balance',
    nepaliTitle: 'कच्चा सन्तुलन परीक्षण (Unadjusted Trial Balance)',
    shortDesc: 'Extract all ledger balances to verify mathematical equality: Total Debits = Total Credits.',
    fullDescription:
      'At period end (monthly or year-end), the accountant compiles an unadjusted trial balance by listing all debit balances in the Dr. column and all credit balances in the Cr. column. This provides immediate proof of arithmetical accuracy and double-entry equilibrium before any adjusting entries are made.',
    theme: {
      color: 'purple',
      hex: '#7C3AED', // Purple / Violet matching Step 4 in diagram
      borderHex: '#581C87',
      bgLight: 'bg-purple-50/60',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      textDark: 'text-purple-950',
    },
    iconName: 'Scale',
    actionSummary: 'List all open ledger balances and test mathematical Dr = Cr equality.',
    statutoryRule:
      'Equilibrium Rule: Total of Debit Column MUST equal Total of Credit Column. If not, errors of addition, posting, or omission exist.',
    examTrapNote:
      'Exam Alert: A tallied trial balance does NOT prove complete absence of errors! Compensating errors, errors of omission, and errors of principle can exist even when total Debits = total Credits.',
    workedExample: {
      scenario:
        'End-of-month trial balance extract for Himalayan Tech Logistics comparing account balances when the entity is VAT-registered vs when it is not VAT-registered.',
      inputDocuments: ['General Ledger Balances Book as of 2083-05-31'],
      technicalOutput: {
        title: 'Unadjusted Trial Balance (Comparative Analysis: VAT vs Non-VAT)',
        type: 'table',
        data: [
          { field: 'Office Equipment (Case A: VAT-Registered Net)', value: 'Dr. NPR 240,000' },
          { field: 'Input VAT Receivable Asset (Case A: VAT-Registered)', value: 'Dr. NPR 31,200' },
          { field: 'Office Equipment (Case B: Non-VAT Capitalized Gross)', value: 'Dr. NPR 271,200 (NAS 16 Cost Base)' },
          { field: 'Input VAT Receivable Asset (Case B & C: Non-VAT)', value: 'NIL / NPR 0 (Non-refundable, No Asset)' },
          { field: 'Printing & Supplies Expense (Case C: Non-VAT Gross)', value: 'Dr. NPR 22,600 (includes NPR 2.6k VAT)' },
          { field: 'Infotech Hub Creditors A/c (Liability)', value: 'Cr. NPR 271,200 (Identical in all scenarios)' },
          { field: 'EQUILIBRIUM RESULT', value: 'Both Dr = Cr balance equations tally with 100% mathematical precision' },
        ],
      },
      explanation:
        'The unadjusted trial balance demonstrates mathematical equilibrium regardless of tax status: in Case A, tax paid is separated into an Asset (NPR 31,200); in Case B, tax paid is capitalized into the Equipment Asset (NPR 271,200); in Case C, non-claimable tax is added into Expenses (NPR 22,600).',
    },
  },
  {
    step: 5,
    title: 'Analyze the worksheet',
    nepaliTitle: '१०-कोठे कार्यतालिका विश्लेषण (10-Column Accounting Worksheet)',
    shortDesc: 'Organize unadjusted balances, proposed adjustments, and test statement impacts.',
    fullDescription:
      'A multi-column worksheet (typically 10 columns: Unadjusted TB Dr/Cr, Adjustments Dr/Cr, Adjusted TB Dr/Cr, Income Statement Dr/Cr, Balance Sheet Dr/Cr) is drafted as a working tool. It enables accountants to model year-end accruals, depreciation, and deferrals before formally committing them to official books.',
    theme: {
      color: 'blue',
      hex: '#0284C7', // Deep Ocean Blue matching Step 5 in diagram
      borderHex: '#0369A1',
      bgLight: 'bg-blue-50/60',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      textDark: 'text-blue-950',
    },
    iconName: 'FileSpreadsheet',
    actionSummary: 'Map accounts across 10 analytical columns to preview Net Profit and Balance Sheet balances.',
    statutoryRule:
      'Accrual & Matching Convention: Revenues must be matched with associated expenses in the period earned/incurred, regardless of actual cash receipt or payment dates.',
    examTrapNote:
      'Trap: The worksheet is an internal informal draft tool for accountants, NOT an official published financial statement for tax authorities or shareholders.',
    workedExample: {
      scenario:
        'Analyzing accrued office rent (NPR 30,000 unpaid) and 1 month laptop depreciation on the 10-column worksheet under both VAT-registered base (NPR 240k) and non-VAT capitalized base (NPR 271.2k).',
      inputDocuments: ['Unadjusted TB', 'Depreciation Schedule (20% p.a.)', 'Unpaid Landlord Invoice'],
      technicalOutput: {
        title: 'Worksheet 10-Column Impact Model (Comparative Depreciation & Expenses)',
        type: 'worksheet',
        data: [
          { col: 'Cols 1-2 (Unadjusted TB)', impact: 'Case A: Laptops NPR 240k Dr + VAT Asset NPR 31.2k Dr | Case B: Laptops NPR 271.2k Dr' },
          { col: 'Cols 3-4 (Adjustments)', impact: 'Case A Depr: NPR 4,000 Dr / Acc. Depr NPR 4,000 Cr | Case B Depr: NPR 4,520 Dr / Acc. Depr NPR 4,520 Cr' },
          { col: 'Cols 5-6 (Adjusted TB)', impact: 'Accrued Rent NPR 30k Cr | Rent Exp NPR 30k Dr | Adjusted Laptop Net Book Value previewed' },
          { col: 'Cols 7-8 (Income Statement)', impact: 'Case A: Depr NPR 4,000 + Rent NPR 30,000 | Case B: Depr NPR 4,520 (higher depreciation expense reduces taxable profit)' },
          { col: 'Cols 9-10 (Balance Sheet)', impact: 'Case A: Laptops Net NPR 236,000 + VAT Credit NPR 31,200 | Case B: Laptops Net NPR 266,680 (271.2k - 4.52k)' },
        ],
      },
      explanation:
        'Crucial Tax Impact: For a non-VAT registered entity, because the non-refundable VAT of NPR 31,200 was capitalized into the asset cost, monthly depreciation is higher (NPR 4,520 vs NPR 4,000). Over the asset useful life, the entire VAT amount is systematically expensed through depreciation, lowering taxable business profit!',
    },
  },
  {
    step: 6,
    title: 'Adjust journal entries and fix errors',
    nepaliTitle: 'समायोजन प्रविष्टि तथा गल्ती सुधार (Adjusting & Rectifying Entries)',
    shortDesc: 'Record mandatory year-end adjusting entries for depreciation, accruals, and deferrals.',
    fullDescription:
      'Accountants formally record Adjusting Journal Entries (AJEs) in the general journal and post them to ledgers. These cover 4 vital accounting categories: Accrued Revenues, Accrued Expenses, Deferred (Unearned) Revenues, and Prepaid Expenses (plus non-cash Depreciation & Bad Debts provisions).',
    theme: {
      color: 'amber',
      hex: '#D97706', // Amber / Goldenrod matching Step 6 in diagram
      borderHex: '#B45309',
      bgLight: 'bg-amber-50/60',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      textDark: 'text-amber-950',
    },
    iconName: 'PenTool',
    actionSummary: 'Record formal adjusting vouchers to update asset valuations and recognize accrued liabilities.',
    statutoryRule:
      'Prudence & Periodicity Rule: Assets and income must not be overstated; liabilities and expenses must not be understated at balance sheet date.',
    examTrapNote:
      'Exam Alert: Adjusting entries NEVER involve Cash A/c! Adjusting entries always impact one Balance Sheet account (Asset/Liability) and one Income Statement account (Revenue/Expense).',
    workedExample: {
      scenario:
        'Formal adjusting journal entries for depreciation on 4 laptops and unpaid office rent at fiscal close, highlighting the difference in depreciation depending on whether VAT was capitalized into asset cost.',
      inputDocuments: ['Depreciation Schedule as per Income Tax Act Annex 2', 'Landlord Rent Confirmation'],
      technicalOutput: {
        title: 'Adjusting Journal Entries (Comparative Depreciation based on VAT Capitalization)',
        type: 'journal',
        data: [
          {
            isHeader: true,
            title: 'OPTION A: IF VAT-REGISTERED ENTITY (Depreciation on Net Asset Cost NPR 240,000 @ 20% p.a. / 12)',
          },
          {
            date: 'Year-End Close',
            particulars: 'Depreciation Expense A/c (240k x 20% / 12) ........... Dr.',
            lf: 'L-52',
            debit: '4,000',
            credit: '-',
          },
          {
            date: 'Year-End Close',
            particulars: '   To Accumulated Depreciation - Laptops A/c (Contra-Asset)',
            lf: 'L-15',
            debit: '-',
            credit: '4,000',
          },
          {
            date: '',
            particulars: '(Being monthly depreciation provided on laptops on net cost base of NPR 240,000 for VAT-registered entity)',
            lf: '',
            debit: '4,000',
            credit: '4,000',
          },
          {
            isHeader: true,
            title: 'OPTION B: IF NON-VAT REGISTERED ENTITY (Depreciation on Capitalized Cost NPR 271,200 @ 20% p.a. / 12)',
          },
          {
            date: 'Year-End Close',
            particulars: 'Depreciation Expense A/c (271.2k x 20% / 12) ......... Dr.',
            lf: 'L-52',
            debit: '4,520',
            credit: '-',
          },
          {
            date: 'Year-End Close',
            particulars: '   To Accumulated Depreciation - Laptops A/c (Contra-Asset)',
            lf: 'L-15',
            debit: '-',
            credit: '4,520',
          },
          {
            date: '',
            particulars: '(Being monthly depreciation on gross capitalized cost of NPR 271,200; non-refundable VAT recovered as allowable depreciation expense)',
            lf: '',
            debit: '4,520',
            credit: '4,520',
          },
          {
            isHeader: true,
            title: 'ACCRUAL ADJUSTMENT (SAME UNDER BOTH SCENARIOS)',
          },
          {
            date: 'Year-End Close',
            particulars: 'Office Rent Expense A/c ............................... Dr.',
            lf: 'L-53',
            debit: '30,000',
            credit: '-',
          },
          {
            date: 'Year-End Close',
            particulars: '   To Outstanding / Accrued Rent Payable A/c (Liability)',
            lf: 'L-39',
            debit: '-',
            credit: '30,000',
          },
          {
            date: '',
            particulars: '(Being unpaid Ashad office rent recognized under Accrual assumption)',
            lf: '',
            debit: '30,000',
            credit: '30,000',
          },
        ],
      },
      explanation:
        'NAS 16 Rule in Practice: Notice that when the buyer is NOT VAT-registered, the non-refundable VAT is capitalized into the asset cost, raising monthly depreciation from NPR 4,000 to NPR 4,520. In this way, tax law allows the business to recover the VAT cost over the asset life as an allowable expense against business income.',
    },
  },
  {
    step: 7,
    title: 'Create financial statements',
    nepaliTitle: 'अन्तिम हिसाब तथा वित्तीय विवरण निर्माण (Statutory Financial Reports)',
    shortDesc: 'Prepare the official Income Statement, Balance Sheet, and Statement of Cash Flows.',
    fullDescription:
      'Using the adjusted balances, the final statutory financial statements are compiled under NAS / NFRS framework: (1) Trading Account (Gross Profit), (2) Statement of Profit or Loss / Income Statement (Net Profit/Loss), (3) Statement of Financial Position / Balance Sheet (Assets, Liabilities, Equity), and (4) Cash Flow Statement.',
    theme: {
      color: 'slate',
      hex: '#475569', // Slate / Charcoal matching Step 7 in diagram
      borderHex: '#334155',
      bgLight: 'bg-slate-100',
      badgeBg: 'bg-slate-200 text-slate-900 border-slate-300',
      textDark: 'text-slate-950',
    },
    iconName: 'PieChart',
    actionSummary: 'Draft official statutory statements for IRD tax filing, auditors, banks, and shareholders.',
    statutoryRule:
      'NAS 1 / IFRS Presentation Rule: Financial statements must present fairly the financial position, performance, and cash flows of the enterprise with comparative prior-year figures.',
    examTrapNote:
      'Trap: Net Profit calculated in the Income Statement does not stay isolated—it is transferred directly into Owner Equity (Retained Earnings) on the Balance Sheet!',
    workedExample: {
      scenario:
        'Preparation of Himalayan Tech Logistics statutory financial statements extract showing revenue, expenses, and asset position.',
      inputDocuments: ['Adjusted Trial Balance as of Year-End Close'],
      technicalOutput: {
        title: 'Statutory Financial Statements Extract',
        type: 'statement',
        data: [
          { statement: 'INCOME STATEMENT', line: 'Operating Revenues: NPR 1,200,000 | Total Operating Expenses: NPR 850,000 | Net Profit before Tax: NPR 350,000' },
          { statement: 'BALANCE SHEET (ASSETS)', line: 'Office Equipment Gross: NPR 240,000 less Acc. Depr (NPR 4,000) = Net NPR 236,000 | Cash & Bank: NPR 550,000 | Total Assets: NPR 786,000' },
          { statement: 'BALANCE SHEET (LIABILITIES & EQUITY)', line: 'Sundry Creditors: NPR 271,200 | Accrued Rent: NPR 30,000 | Share Capital: NPR 134,800 | Retained Earnings: NPR 350,000 | Total: NPR 786,000' },
        ],
      },
      explanation:
        'The balance sheet proves universal accounting equilibrium: Total Assets NPR 786,000 = Total Liabilities NPR 301,200 + Total Equity NPR 484,800.',
    },
  },
  {
    step: 8,
    title: 'Close the books',
    nepaliTitle: 'किताब बन्द तथा नयाँ आर्थिक वर्ष सराई (Closing Entries & Post-Closing TB)',
    shortDesc: 'Close temporary nominal accounts to zero and carry forward permanent real/personal accounts.',
    fullDescription:
      'To conclude the accounting cycle, closing journal entries transfer all temporary nominal accounts (Revenues, Expenses, Dividends/Drawings) into the Profit & Loss / Retained Earnings account, resetting their balances to ZERO for the upcoming fiscal year. A Post-Closing Trial Balance is prepared containing only permanent Asset, Liability, and Equity accounts.',
    theme: {
      color: 'emerald',
      hex: '#16A34A', // Forest Green matching Step 8 in diagram
      borderHex: '#15803D',
      bgLight: 'bg-emerald-50/60',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      textDark: 'text-emerald-950',
    },
    iconName: 'CheckCircle2',
    actionSummary: 'Zero out nominal accounts, transfer net earnings to equity, and open Day 1 of the next fiscal year.',
    statutoryRule:
      'Periodicity Rule: Nominal accounts exist only for one accounting period (Shrawan 1 to Ashad 31). Real and personal accounts never close—their balances carry forward as opening balances.',
    examTrapNote:
      'Exam Alert: The Post-Closing Trial Balance contains ZERO revenue and expense accounts! Only permanent Balance Sheet accounts (Assets, Liabilities, Capital) appear on Day 1.',
    workedExample: {
      scenario:
        'Closing all revenue and expense accounts for Himalayan Tech Logistics and confirming Day 1 opening balances for the new fiscal year.',
      inputDocuments: ['Approved Audited Financial Statements', 'Board Resolution for Closing Accounts'],
      technicalOutput: {
        title: 'Closing Entries & Post-Closing Trial Balance Extract',
        type: 'journal',
        data: [
          {
            date: 'Ashad 31 (Close)',
            particulars: 'Sales & Service Revenue A/c .................... Dr. NPR 1,200,000',
            lf: 'Close',
            debit: '1,200,000',
            credit: 'To Profit & Loss Summary A/c NPR 1,200,000',
          },
          {
            date: 'Ashad 31 (Close)',
            particulars: 'Profit & Loss Summary A/c ..................... Dr. NPR 850,000',
            lf: 'Close',
            debit: '850,000',
            credit: 'To Operating Expenses A/cs (Zeroed Out) NPR 850,000',
          },
          {
            date: 'Ashad 31 (Close)',
            particulars: 'Profit & Loss Summary A/c ..................... Dr. NPR 350,000',
            lf: 'Transfer',
            debit: '350,000',
            credit: 'To Retained Earnings / Owner Capital A/c NPR 350,000',
          },
          {
            date: 'Shrawan 1 (New Year)',
            particulars: 'Post-Closing Trial Balance: Permanent Accounts Only (Assets NPR 786,000 = Liabilities & Capital NPR 786,000)',
            lf: 'Cycle 1',
            debit: 'Step 1 Ready',
            credit: 'Loop Complete',
          },
        ],
      },
      explanation:
        'With nominal accounts zeroed out, the accounting engine is fully cleansed, calibrated, and ready to loop back to Step 1 (Identify and analyze transactions) for the new fiscal year!',
    },
  },
];
