import React, { useState, useRef } from 'react';
import {
  BookOpen,
  FileText,
  Building2,
  Scale,
  Receipt,
  AlertTriangle,
  Search,
  Check,
  Copy,
  ExternalLink,
  Calendar,
  Sparkles,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Printer,
  Eye,
  X,
  Download,
} from 'lucide-react';
import { IrdRevenueCodesTable } from './IrdRevenueCodesTable';
import { TdsPdfFlipBook } from './TdsPdfFlipBook';
import { EtdsWorkflowPresentation } from './EtdsWorkflowPresentation';
import { downloadTdsRatesPDF } from '../utils/documentExport';

interface Props {
  onBack?: () => void;
  onOpenCalculator?: () => void;
  onGoToTestArena?: (dayNumber?: number) => void;
}

export const TdsComplianceGuide: React.FC<Props> = ({
  onBack,
  onOpenCalculator,
}) => {
  // activeWindow: null means only the 6 cards are displayed; when set, opens in a dedicated window
  const [activeWindow, setActiveWindow] = useState<'flipbook' | 'rates' | 'codes' | 'etds' | 'vouchers' | 'penalties' | null>(null);
  const [previewVoucher, setPreviewVoucher] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const contentAreaRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Statutory TDS Rates Matrix Data
  const TDS_RATES_DATA = [
    {
      section: 'Sec 88(1)',
      sectionNepali: 'दफा ८८(१)',
      nature: 'Natural Resource Royalty (खानी, ढुङ्गा, बालुवा, गिट्टी आदि उत्खनन रोयल्टी)',
      payee: 'Resident individual or entity leasing mineral/natural rights',
      rate: '15%',
      rateColor: 'text-rose-600 bg-rose-50 border-rose-200',
      depositCode: '१११३५',
      depositCodeRaw: '11135',
      taxType: 'Withholding at Source (कट्टी गरी दाखिला)',
      rules: 'Deducted on total gross royalty payable before disbursement.',
      voucherHint: 'Dr. Natural Resource Royalty Expense A/c, Cr. Bank A/c (85%), Cr. TDS Payable A/c (15%)'
    },
    {
      section: 'Sec 88(1)',
      sectionNepali: 'दफा ८८(१)',
      nature: 'General Royalty & Intellectual Property (पेटेन्ट, ट्रेडमार्क, सफ्टवेयर लाइसेन्स, प्रतिलिपि अधिकार)',
      payee: 'Resident individual or corporate licensor',
      rate: '15%',
      rateColor: 'text-rose-600 bg-rose-50 border-rose-200',
      depositCode: '१११३५',
      depositCodeRaw: '11135',
      taxType: 'Advance Tax / Withholding',
      rules: 'Applicable on license and copyright royalties with source in Nepal.',
      voucherHint: 'Dr. Royalty Expense A/c, Cr. Bank A/c (85%), Cr. TDS Payable A/c (15%)'
    },
    {
      section: 'Sec 88(1)',
      sectionNepali: 'दफा ८८(१)',
      nature: 'Private Loan Interest (बैंक बाहेक व्यक्ति वा फर्मबाट लिएको ऋणको ब्याज)',
      payee: 'Resident natural person or private lender',
      rate: '15%',
      rateColor: 'text-rose-600 bg-rose-50 border-rose-200',
      depositCode: '१११३२',
      depositCodeRaw: '11132',
      taxType: 'Withholding at Source',
      rules: 'Non-bank interest paid by businesses is subject to 15% TDS.',
      voucherHint: 'Dr. Interest Expense A/c, Cr. Bank A/c (85%), Cr. TDS Payable A/c (15%)'
    },
    {
      section: 'Sec 88(1)',
      sectionNepali: 'दफा ८८(१)',
      nature: 'Service Fee to Non-VAT Individuals (भ्याटमा दर्ता नभएका व्यक्तिलाई परामर्श, मर्मत वा सेवा शुल्क)',
      payee: 'Resident unregistered natural individuals',
      rate: '15%',
      rateColor: 'text-rose-600 bg-rose-50 border-rose-200',
      depositCode: '११११२ / १११३१',
      depositCodeRaw: '11112',
      taxType: 'Advance Tax Withholding',
      rules: 'Applies to freelance, consulting, or technical fees paid to individuals without VAT registration.',
      voucherHint: 'Dr. Consultancy Expense A/c, Cr. Bank A/c (85%), Cr. TDS Payable A/c (15%)'
    },
    {
      section: 'Sec 88(1)(4)',
      sectionNepali: 'दफा ८८(१)(४)',
      nature: 'Service Fee to VAT-Registered Entity/Person (भ्याट बिल जारी गर्ने संस्था वा व्यक्तिलाई सेवा भुक्तानी)',
      payee: 'Resident person/entity holding valid VAT certificate & Tax Invoice',
      rate: '1.5%',
      rateColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      depositCode: '१११३१',
      depositCodeRaw: '11131',
      taxType: 'Concessional Withholding (सहुलियत दर)',
      rules: 'Calculated strictly on the Taxable Amount (exclusive of 13% VAT). Supplier issues Tax Invoice.',
      voucherHint: 'Dr. Service Expense A/c (Taxable), Dr. Input VAT A/c (13%), Cr. Bank A/c (98.5% + VAT), Cr. TDS Payable A/c (1.5%)'
    },
    {
      section: 'Sec 88(1)',
      sectionNepali: 'दफा ८८(१)',
      nature: 'House / Land / Office Rent Paid to Natural Person (प्राकृतिक व्यक्तिलाई घर/जग्गा वा भवन बहाल भुक्तानी)',
      payee: 'Resident individual house owner (घरधनी)',
      rate: '10%',
      rateColor: 'text-amber-700 bg-amber-50 border-amber-200',
      depositCode: '१११३१ (स्थानीय तह)',
      depositCodeRaw: '11131',
      taxType: 'Local Government Tax / Municipality',
      rules: 'Under the Local Government Operation Act 2074 & Income Tax Act, 10% rent tax is collected and deposited to the local municipality treasury.',
      voucherHint: 'Dr. Rent Expense A/c, Cr. Bank A/c (90%), Cr. House Rent Tax Payable A/c (10%)'
    },
    {
      section: 'Sec 88(1)',
      sectionNepali: 'दफा ८८(१)',
      nature: 'Sales Performance Bonus & Commission (डिलर वा वितरकलाई दिइने बिक्री कमिसन तथा बोनस)',
      payee: 'Authorized distributors, dealers, or agents',
      rate: '15%',
      rateColor: 'text-rose-600 bg-rose-50 border-rose-200',
      depositCode: '१११३३',
      depositCodeRaw: '11133',
      taxType: 'Withholding at Source',
      rules: 'Sales incentives, promotional bonuses, and commissions with source in Nepal require 15% deduction.',
      voucherHint: 'Dr. Sales Bonus Expense A/c, Cr. Bank A/c (85%), Cr. TDS Payable A/c (15%)'
    },
    {
      section: 'Sec 88A',
      sectionNepali: 'दफा ८८क',
      nature: 'Freight Transportation & Vehicle Hire with VAT Bill (भ्याट बिल सहित ढुवानी वा गाडी भाडा)',
      payee: 'VAT registered transport service provider',
      rate: '2.5%',
      rateColor: 'text-blue-700 bg-blue-50 border-blue-200',
      depositCode: '१११३१',
      depositCodeRaw: '11131',
      taxType: 'Withholding on Transportation',
      rules: 'Concessional 2.5% TDS applies to carriage/freight charges when accompanied by a valid VAT invoice.',
      voucherHint: 'Dr. Freight Inward A/c, Dr. Input VAT A/c, Cr. Bank A/c, Cr. TDS Payable A/c (2.5%)'
    },
    {
      section: 'Sec 88A',
      sectionNepali: 'दफा ८८क',
      nature: 'Freight Transportation without VAT Bill (भ्याट बिल बिनाको ढुवानी भुक्तानी - प्राकृतिक व्यक्ति)',
      payee: 'Unregistered natural truck/vehicle owner',
      rate: '10%',
      rateColor: 'text-amber-700 bg-amber-50 border-amber-200',
      depositCode: '१११३१',
      depositCodeRaw: '11131',
      taxType: 'Withholding on Transport',
      rules: 'Non-VAT vehicle carriage paid to individuals requires 10% withholding.',
      voucherHint: 'Dr. Carriage Expense A/c, Cr. Bank A/c (90%), Cr. TDS Payable A/c (10%)'
    },
    {
      section: 'Sec 88A',
      sectionNepali: 'दफा ८८क',
      nature: 'Commodity Sales Agent Commission (वस्तु बिक्री एजेन्टलाई कमिसन भुक्तानी)',
      payee: 'Commodity brokers, commercial agents',
      rate: '5%',
      rateColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
      depositCode: '१११३३',
      depositCodeRaw: '11133',
      taxType: 'Withholding on Agency Commission',
      rules: 'Fixed 5% deduction on commissions paid to sales brokers and agency representatives.',
      voucherHint: 'Dr. Commission Expense A/c, Cr. Bank A/c (95%), Cr. TDS Payable A/c (5%)'
    },
    {
      section: 'Sec 89(1)',
      sectionNepali: 'दफा ८९(१)',
      nature: 'Contract or Agreement Payments Exceeding Rs. 50,000 (रू. ५०,००० भन्दा बढीको ठेक्का वा कार्य सम्झौता)',
      payee: 'Contractor, fabricator, or construction service',
      rate: '1.5%',
      rateColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      depositCode: '१११३१',
      depositCodeRaw: '11131',
      taxType: 'Contract Withholding (ठेक्का कर)',
      rules: 'Applies to any contractual work payment exceeding the statutory threshold of Rs. 50,000 in aggregate.',
      voucherHint: 'Dr. Contract Work / Construction A/c, Cr. Bank A/c (98.5%), Cr. TDS Payable A/c (1.5%)'
    },
    {
      section: 'Sec 92',
      sectionNepali: 'दफा ९२',
      nature: 'Bank Deposit Interest for Resident Natural Persons (वाणिज्य बैंक बचत तथा मुद्दती निक्षेपको ब्याज)',
      payee: 'Resident individual account holder',
      rate: '5%',
      rateColor: 'text-purple-700 bg-purple-50 border-purple-200',
      depositCode: '१११३२',
      depositCodeRaw: '11132',
      taxType: 'Final Withholding Tax (अन्तिम कर कट्टी)',
      rules: 'Final tax deduction at source. Individual does NOT need to include this interest in their year-end annual tax return.',
      voucherHint: 'Dr. Bank A/c (95%), Dr. Advance TDS (Final) A/c (5%), Cr. Interest Income A/c (100%)'
    },
    {
      section: 'Sec 92',
      sectionNepali: 'दफा ९२',
      nature: 'Dividend Distributed by Resident Entities (कम्पनीद्वारा वितरित लाभांश भुक्तानी)',
      payee: 'Resident shareholders / investors',
      rate: '5%',
      rateColor: 'text-purple-700 bg-purple-50 border-purple-200',
      depositCode: '१११३४',
      depositCodeRaw: '11134',
      taxType: 'Final Withholding Tax (अन्तिम कर कट्टी)',
      rules: 'Final tax on dividends paid to resident natural persons and domestic corporations.',
      voucherHint: 'Dr. Retained Earnings / Dividend A/c, Cr. Bank A/c (95%), Cr. TDS Payable A/c (5%)'
    },
    {
      section: 'Sec 92',
      sectionNepali: 'दफा ९२',
      nature: 'Meeting Sitting Fees & Allowances (बैठक भत्ता तथा उपस्थिति पारिश्रमिक)',
      payee: 'Board members, committee experts, invited advisors',
      rate: '15%',
      rateColor: 'text-rose-600 bg-rose-50 border-rose-200',
      depositCode: '११११२',
      depositCodeRaw: '11112',
      taxType: 'Final Withholding Tax (अन्तिम कर)',
      rules: 'Sitting allowance paid per meeting to board members or committee participants is final tax.',
      voucherHint: 'Dr. Meeting Allowance Expense A/c, Cr. Bank A/c (85%), Cr. TDS Payable A/c (15%)'
    },
    {
      section: 'Sec 92',
      sectionNepali: 'दफा ९२',
      nature: 'Windfall Gains, Lotteries & Prizes (चिट्ठा, उपहार वा आकस्मिक लाभ भुक्तानी)',
      payee: 'Prize winner / beneficiary',
      rate: '25%',
      rateColor: 'text-rose-700 bg-rose-100 border-rose-300 font-black',
      depositCode: '१११३९',
      depositCodeRaw: '11139',
      taxType: 'Final Withholding Tax',
      rules: 'Windfall gain tax is deducted at source at 25% by the issuing entity before disbursing prize value.',
      voucherHint: 'Dr. Prize / Promotional Expense A/c, Cr. Bank A/c (75%), Cr. TDS Payable A/c (25%)'
    }
  ];

  const filteredRates = TDS_RATES_DATA.filter(
    (item) =>
      item.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nature.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.depositCodeRaw.includes(searchTerm)
  );

  const handleSelectCard = (tabId: NonNullable<typeof activeWindow>) => {
    setActiveWindow(tabId);
    if (tabId === 'rates') {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  };

  const handleDownloadAllVouchers = () => {
    let textContent = `================================================================================
NEPAL GOVERNMENT - INLAND REVENUE DEPARTMENT (IRD) COMPLIANT
STANDARD DOUBLE-ENTRY TDS JOURNAL VOUCHERS (FY 2083/84)
Statutory Framework: Income Tax Act, 2058 (दफा ८७, ८८, ८८क, ८९, ९०, ९२, ९५क)
================================================================================\n\n`;

    VOUCHERS_LIST.forEach((v) => {
      textContent += `VOUCHER NO: ${v.voucherNo}
TITLE: ${v.title}
STATUTORY REFERENCE: ${v.section} | REVENUE CODE: ${v.revenueCode}
AMOUNT / SPECIFICATION: ${v.amountBadge}
DEPOSIT DEADLINE: ${v.depositDeadline}
SUMMARY: ${v.summary}
--------------------------------------------------------------------------------
Particulars                                                Debit (Rs.)    Credit (Rs.)
--------------------------------------------------------------------------------\n`;
      v.lines.forEach((l) => {
        const part = l.particulars.padEnd(58, ' ');
        const drVal = (l.dr || '').padStart(12, ' ');
        const crVal = (l.cr || '').padStart(12, ' ');
        textContent += `${part}${drVal}  ${crVal}\n`;
      });
      textContent += `--------------------------------------------------------------------------------
Totals:                                                   ${v.totalDr.padStart(12, ' ')}  ${v.totalCr.padStart(12, ' ')}
Narration: ${v.narration}
================================================================================\n\n`;
    });

    textContent += `Prepared By: ___________________    Checked By: ___________________    Approved By: ___________________\n`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Standard_Double_Entry_TDS_Journal_Vouchers_FY2083_84.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const VOUCHERS_LIST = [
    {
      id: 'voucher-1',
      voucherNo: 'JV-2083/84-1',
      title: '1. Audit Fees (VAT Registered Auditor)',
      section: 'Section 88(1)(4)',
      amountBadge: 'Rs. 100,000 Taxable (+13% VAT)',
      summary: 'Statutory auditor billed audit fee of Rs. 100,000 + 13% VAT (Rs. 13,000). Total Invoice = Rs. 113,000. Statutory TDS @ 1.5% deducted on taxable amount (Rs. 1,500). Net payable = Rs. 111,500.',
      lines: [
        { particulars: 'Audit & Professional Fees Expense A/c .......... Dr.', dr: '100,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: 'Input VAT Receivable A/c (13%) ................. Dr.', dr: '13,000.00', cr: '', color: 'text-purple-900 font-bold' },
        { particulars: '  To TDS Payable A/c (Code 11131 @ 1.5%) ....... Cr.', dr: '', cr: '1,500.00', color: 'text-emerald-700 font-bold' },
        { particulars: '  To Statutory Auditor / Bank A/c .............. Cr.', dr: '', cr: '111,500.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 113,000.00',
      totalCr: 'Rs. 113,000.00',
      narration: '(Being statutory audit fees recorded against Tax Invoice after withholding 1.5% TDS under Section 88(1)(4))',
      revenueCode: '१११३१ (11131)',
      depositDeadline: 'Within 25th of next month (महिना समाप्त भएको २५ दिनभित्र)',
    },
    {
      id: 'voucher-2',
      voucherNo: 'JV-2083/84-2',
      title: '2. Software AMC & IT Support (VAT Registered Vendor)',
      section: 'Section 88(1)(4)',
      amountBadge: 'Rs. 200,000 Taxable (+13% VAT)',
      summary: 'Software vendor billed annual maintenance contract (AMC) Rs. 200,000 + 13% VAT (Rs. 26,000). Total Invoice = Rs. 226,000. TDS @ 1.5% on taxable amount = Rs. 3,000. Net payment = Rs. 223,000.',
      lines: [
        { particulars: 'IT Support & Software AMC Expense A/c .......... Dr.', dr: '200,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: 'Input VAT Receivable A/c (13%) ................. Dr.', dr: '26,000.00', cr: '', color: 'text-purple-900 font-bold' },
        { particulars: '  To TDS Payable A/c (Code 11131 @ 1.5%) ....... Cr.', dr: '', cr: '3,000.00', color: 'text-emerald-700 font-bold' },
        { particulars: '  To IT Vendor Payable / Bank A/c .............. Cr.', dr: '', cr: '223,000.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 226,000.00',
      totalCr: 'Rs. 226,000.00',
      narration: '(Being annual software AMC fee recorded after deducting 1.5% statutory TDS on VAT invoice as per Sec 88(1)(4))',
      revenueCode: '१११३१ (11131)',
      depositDeadline: 'Within 25th of next month',
    },
    {
      id: 'voucher-3',
      voucherNo: 'JV-2083/84-3',
      title: '3. Legal Advisory Service Fees (VAT Registered Firm)',
      section: 'Section 88(1)(4)',
      amountBadge: 'Rs. 50,000 Taxable (+13% VAT)',
      summary: 'Corporate legal counsel billed advisory retainer fees Rs. 50,000 + 13% VAT (Rs. 6,500). Total Invoice = Rs. 56,500. Statutory TDS @ 1.5% on taxable amount = Rs. 750. Net payment = Rs. 55,750.',
      lines: [
        { particulars: 'Legal & Professional Advisory Expense A/c ...... Dr.', dr: '50,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: 'Input VAT Receivable A/c (13%) ................. Dr.', dr: '6,500.00', cr: '', color: 'text-purple-900 font-bold' },
        { particulars: '  To TDS Payable A/c (Code 11131 @ 1.5%) ....... Cr.', dr: '', cr: '750.00', color: 'text-emerald-700 font-bold' },
        { particulars: '  To Legal Associates / Bank A/c ............... Cr.', dr: '', cr: '55,750.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 56,500.00',
      totalCr: 'Rs. 56,500.00',
      narration: '(Being corporate legal advisory fee recorded against VAT invoice after withholding 1.5% TDS under Sec 88(1)(4))',
      revenueCode: '१११३१ (11131)',
      depositDeadline: 'Within 25th of next month',
    },
    {
      id: 'voucher-4',
      voucherNo: 'JV-2083/84-4',
      title: '4. Office Rent (Paid to Natural Person / Individual Landlord)',
      section: 'Section 88(1) / Local Govt',
      amountBadge: 'Rs. 100,000 Gross Rent',
      summary: 'Paid monthly office building rent of Rs. 100,000 to an individual landlord by bank transfer after withholding 10% local house rent tax (घरबहाल कर रू. १०,०००). Net cheque = Rs. 90,000.',
      lines: [
        { particulars: 'Office Rent Expense A/c ........................ Dr.', dr: '100,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: '  To House Rent Tax Payable A/c (10%) .......... Cr.', dr: '', cr: '10,000.00', color: 'text-amber-700 font-bold' },
        { particulars: '  To Bank A/c (90% Net Cheque) ................. Cr.', dr: '', cr: '90,000.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 100,000.00',
      totalCr: 'Rs. 100,000.00',
      narration: '(Being office premises rent paid to individual landlord after withholding 10% municipal house rent tax under Sec 88(1))',
      revenueCode: 'स्थानीय तह (Municipal Code / 11112)',
      depositDeadline: 'Local Municipality or 25th of next month',
    },
    {
      id: 'voucher-5',
      voucherNo: 'JV-2083/84-5',
      title: '5. Office Rent (Paid to VAT-Registered Corporate Entity)',
      section: 'Section 88(1)(4)',
      amountBadge: 'Rs. 150,000 Taxable (+13% VAT)',
      summary: 'Corporate commercial complex billed office rent of Rs. 150,000 + 13% VAT (Rs. 19,500). Total Invoice = Rs. 169,500. Rent billed on VAT invoice by an entity attracts 1.5% TDS on taxable rent (Rs. 2,250). Net payment = Rs. 167,250.',
      lines: [
        { particulars: 'Office Rent Expense A/c ........................ Dr.', dr: '150,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: 'Input VAT Receivable A/c (13%) ................. Dr.', dr: '19,500.00', cr: '', color: 'text-purple-900 font-bold' },
        { particulars: '  To TDS Payable A/c (Code 11131 @ 1.5%) ....... Cr.', dr: '', cr: '2,250.00', color: 'text-emerald-700 font-bold' },
        { particulars: '  To Corporate Landlord / Bank A/c ............. Cr.', dr: '', cr: '167,250.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 169,500.00',
      totalCr: 'Rs. 169,500.00',
      narration: '(Being commercial rent paid to corporate landlord on VAT invoice after withholding 1.5% TDS as per Sec 88(1)(4))',
      revenueCode: '१११३१ (11131)',
      depositDeadline: 'Within 25th of next month',
    },
    {
      id: 'voucher-6',
      voucherNo: 'JV-2083/84-6',
      title: '6. Internet Subscription Fees (Worldlink - VAT Invoice)',
      section: 'Section 88(1)(4)',
      amountBadge: 'Rs. 25,000 Taxable (+13% VAT)',
      summary: 'Worldlink Communications billed corporate fiber internet fee Rs. 25,000 + 13% VAT (Rs. 3,250). Total Invoice = Rs. 28,250. Statutory TDS @ 1.5% on taxable amount = Rs. 375. Net payment = Rs. 27,875.',
      lines: [
        { particulars: 'Internet & Communication Expense A/c ........... Dr.', dr: '25,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: 'Input VAT Receivable A/c (13%) ................. Dr.', dr: '3,250.00', cr: '', color: 'text-purple-900 font-bold' },
        { particulars: '  To TDS Payable A/c (Code 11131 @ 1.5%) ....... Cr.', dr: '', cr: '375.00', color: 'text-emerald-700 font-bold' },
        { particulars: '  To Worldlink Communications / Bank A/c ....... Cr.', dr: '', cr: '27,875.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 28,250.00',
      totalCr: 'Rs. 28,250.00',
      narration: '(Being monthly internet subscription billed by Worldlink recorded after withholding 1.5% TDS under Sec 88(1)(4))',
      revenueCode: '१११३१ (11131)',
      depositDeadline: 'Within 25th of next month',
    },
    {
      id: 'voucher-7',
      voucherNo: 'JV-2083/84-7',
      title: '7. Construction Wages to Labor (Unorganized - No Bill)',
      section: 'Section 88 / 89',
      amountBadge: 'Rs. 60,000 Gross Wages',
      summary: 'Paid site renovation and construction labor wages of Rs. 60,000 directly without tax invoice or PAN registration. As per Section 88/89, unorganized non-VAT labor payments exceeding threshold attract 15% TDS (Rs. 9,000). Net cash/bank payout = Rs. 51,000.',
      lines: [
        { particulars: 'Construction & Renovation Labor Wages A/c ...... Dr.', dr: '60,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: '  To TDS Payable A/c (Code 11132 @ 15%) ........ Cr.', dr: '', cr: '9,000.00', color: 'text-rose-700 font-bold' },
        { particulars: '  To Cash / Bank A/c ........................... Cr.', dr: '', cr: '51,000.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 60,000.00',
      totalCr: 'Rs. 60,000.00',
      narration: '(Being direct labor wages for construction paid on muster roll after deducting 15% statutory TDS under Sec 88)',
      revenueCode: '१११३२ (11132)',
      depositDeadline: 'Within 25th of next month',
    },
    {
      id: 'voucher-8',
      voucherNo: 'JV-2083/84-8',
      title: '8. Vehicle Hire (VAT Registered Travel / Rental Company)',
      section: 'Section 88(1)(4)',
      amountBadge: 'Rs. 40,000 Taxable (+13% VAT)',
      summary: 'Vehicle rental agency issued Tax Invoice for company transport hire Rs. 40,000 + 13% VAT (Rs. 5,200). Total Invoice = Rs. 45,200. TDS @ 1.5% on taxable amount = Rs. 600. Net payment = Rs. 44,600.',
      lines: [
        { particulars: 'Vehicle Hire & Transport Expense A/c ........... Dr.', dr: '40,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: 'Input VAT Receivable A/c (13%) ................. Dr.', dr: '5,200.00', cr: '', color: 'text-purple-900 font-bold' },
        { particulars: '  To TDS Payable A/c (Code 11131 @ 1.5%) ....... Cr.', dr: '', cr: '600.00', color: 'text-emerald-700 font-bold' },
        { particulars: '  To Travel Rental Agency / Bank A/c ........... Cr.', dr: '', cr: '44,600.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 45,200.00',
      totalCr: 'Rs. 45,200.00',
      narration: '(Being transport vehicle rental billed on Tax Invoice recorded after withholding 1.5% statutory TDS as per Sec 88(1)(4))',
      revenueCode: '१११३१ (11131)',
      depositDeadline: 'Within 25th of next month',
    },
    {
      id: 'voucher-9',
      voucherNo: 'JV-2083/84-9',
      title: '9. Vehicle Hire (Paid to Natural Person / Private Car Owner)',
      section: 'Section 88(1)',
      amountBadge: 'Rs. 30,000 Gross Rent',
      summary: 'Hired private vehicle for field operations from an individual owner (non-VAT) for Rs. 30,000. As per Section 88(1), vehicle hire paid to natural persons is subject to 10% TDS (Rs. 3,000). Net cheque = Rs. 27,000.',
      lines: [
        { particulars: 'Vehicle Rental Expense A/c ..................... Dr.', dr: '30,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: '  To TDS Payable A/c (Code 11132 @ 10%) ........ Cr.', dr: '', cr: '3,000.00', color: 'text-amber-700 font-bold' },
        { particulars: '  To Bank A/c .................................. Cr.', dr: '', cr: '27,000.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 30,000.00',
      totalCr: 'Rs. 30,000.00',
      narration: '(Being vehicle hire charges paid to natural person after deducting 10% statutory TDS under Section 88(1))',
      revenueCode: '१११३२ (11132)',
      depositDeadline: 'Within 25th of next month',
    },
    {
      id: 'voucher-10',
      voucherNo: 'JV-2083/84-10',
      title: '10. Dividend Distributed to Company Shareholders',
      section: 'Section 92(1) / 88(2)',
      amountBadge: 'Rs. 500,000 Gross Dividend',
      summary: 'Company declared and distributed interim/final dividend of Rs. 500,000 to resident shareholders. Under Section 92(1) & 88(2), 5% final withholding tax applies on dividend payout (Rs. 25,000). Net disbursement = Rs. 475,000.',
      lines: [
        { particulars: 'Retained Earnings / Dividend Distributed A/c ... Dr.', dr: '500,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: '  To TDS Payable on Dividend A/c (Code 11134 @ 5%) Cr.', dr: '', cr: '25,000.00', color: 'text-rose-700 font-bold' },
        { particulars: '  To Bank A/c (Net Dividend Disbursed) ......... Cr.', dr: '', cr: '475,000.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 500,000.00',
      totalCr: 'Rs. 500,000.00',
      narration: '(Being dividend distribution recorded after deducting 5% final withholding tax under Section 92(1) of Income Tax Act)',
      revenueCode: '१११३४ (11134)',
      depositDeadline: 'Within 25th of next month',
    },
    {
      id: 'voucher-11',
      voucherNo: 'JV-2083/84-11',
      title: '11. Profit Drawings by Sole Proprietor (Equity Draw - No TDS)',
      section: 'Exempt / Capital Draw',
      amountBadge: 'Rs. 150,000 Drawings (No Tax)',
      summary: 'Sole proprietor withdrew Rs. 150,000 from business current account for personal usage. Under Nepal tax laws, drawings by sole proprietor represent internal equity/capital withdrawals and do NOT attract TDS.',
      lines: [
        { particulars: "Proprietor's Drawings A/c ...................... Dr.", dr: '150,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: '  To Bank A/c .................................. Cr.', dr: '', cr: '150,000.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 150,000.00',
      totalCr: 'Rs. 150,000.00',
      narration: '(Being personal cash drawings by sole proprietor from business funds - internal equity transfer, No TDS applicable)',
      revenueCode: 'N/A (Exempt from TDS)',
      depositDeadline: 'N/A (No Statutory Tax Liability)',
    },
    {
      id: 'voucher-12',
      voucherNo: 'JV-2083/84-12',
      title: '12. Bank Loan Interest Paid to Commercial Bank (No TDS)',
      section: 'Section 88(1) Proviso',
      amountBadge: 'Rs. 85,000 Loan Interest (No TDS)',
      summary: "Company paid monthly term loan interest of Rs. 85,000 debited directly by a Class 'A' Commercial Bank. Under Section 88(1) Proviso of Income Tax Act 2058, interest paid to resident banks and financial institutions is statutory exempt from TDS.",
      lines: [
        { particulars: 'Bank Term Loan Interest Expense A/c ............ Dr.', dr: '85,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: '  To Bank Loan / Current Account ............... Cr.', dr: '', cr: '85,000.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 85,000.00',
      totalCr: 'Rs. 85,000.00',
      narration: '(Being monthly interest on commercial bank term loan recorded - exempt from TDS under Section 88(1) Proviso)',
      revenueCode: 'N/A (Exempt under Sec 88(1))',
      depositDeadline: 'N/A (No Withholding Required)',
    },
    {
      id: 'voucher-13',
      voucherNo: 'JV-2083/84-13',
      title: '13. Monthly Staff Salary (Non-SSF / Simple Rate Sec 87 @ 1%)',
      section: 'Section 87 (Employment)',
      amountBadge: 'Rs. 70,000 Monthly Salary',
      summary: 'Monthly staff salary Rs. 70,000 (annual taxable income Rs. 840,000, within the basic threshold of Rs. 10 Lakh for FY 2083/84). Employee is not registered in SSF/ARF, so 1% Social Security tax applies under Section 87 (Rs. 700). Net salary transferred = Rs. 69,300.',
      lines: [
        { particulars: 'Salaries & Staff Allowances Expense A/c ........ Dr.', dr: '70,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: '  To TDS Payable on Salary A/c (Code 11111 @ 1%) Cr.', dr: '', cr: '700.00', color: 'text-emerald-700 font-bold' },
        { particulars: '  To Staff Bank Account (Net Salary Disbursed) . Cr.', dr: '', cr: '69,300.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 70,000.00',
      totalCr: 'Rs. 70,000.00',
      narration: '(Being monthly staff salary recorded after deducting 1% employment tax under Section 87 for FY 2083/84)',
      revenueCode: '१११११ (11111)',
      depositDeadline: 'Within 25th of next month (२५ गतेभित्र दाखिला)',
    },
    {
      id: 'voucher-14',
      voucherNo: 'JV-2083/84-14',
      title: '14. Remittance of Withheld TDS to Government Treasury (e-TDS)',
      section: 'Section 90 / 119',
      amountBadge: 'Rs. 45,000 Total TDS Remitted',
      summary: 'Deposited total accumulated monthly TDS of Rs. 45,000 (covering salary, rent, and vendor withholdings) into the Nepal Inland Revenue Department Treasury account via e-TDS portal at designated commercial bank.',
      lines: [
        { particulars: 'TDS Payable A/c (All Codes Consolidated) ....... Dr.', dr: '45,000.00', cr: '', color: 'text-emerald-800 font-bold' },
        { particulars: '  To Bank A/c .................................. Cr.', dr: '', cr: '45,000.00', color: 'text-slate-700 font-bold' },
      ],
      totalDr: 'Rs. 45,000.00',
      totalCr: 'Rs. 45,000.00',
      narration: '(Being remittance of monthly withheld TDS into Nepal Government Treasury account via e-TDS revenue voucher)',
      revenueCode: 'Consolidated e-TDS IRD Treasury',
      depositDeadline: 'Within 25th of following month',
    },
    {
      id: 'voucher-15',
      voucherNo: 'JV-2083/84-15',
      title: '15. Business Registration Renewal Fee to Local Ward (No TDS)',
      section: 'Statutory Govt Fee (Exempt)',
      amountBadge: 'Rs. 12,000 Ward Renewal Fee (No TDS)',
      summary: 'Paid annual business license renewal fee of Rs. 12,000 to Local Ward Office (स्थानीय वडा कार्यालय). Statutory regulatory fees, government duties, and local government municipal renewals are exempt from TDS.',
      lines: [
        { particulars: 'Business License & Ward Renewal Expense A/c .... Dr.', dr: '12,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: '  To Bank / Cash A/c ........................... Cr.', dr: '', cr: '12,000.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 12,000.00',
      totalCr: 'Rs. 12,000.00',
      narration: '(Being annual business registration renewal fee paid to local ward office against official revenue receipt, exempt from TDS)',
      revenueCode: 'N/A (Local Govt Revenue)',
      depositDeadline: 'N/A (No TDS Deductible)',
    },
    {
      id: 'voucher-16',
      voucherNo: 'JV-2083/84-16',
      title: '16. Meeting Allowances Paid to Board of Directors (BOD Meeting TDS)',
      section: 'Section 88(1)',
      amountBadge: 'Rs. 40,000 Meeting Allowance',
      summary: 'Paid Board of Directors meeting sitting allowances (बैठक भत्ता) of Rs. 40,000. Under Section 88(1), meeting fees paid by an entity attract 15% statutory TDS (Rs. 6,000). Net disbursement to directors = Rs. 34,000.',
      lines: [
        { particulars: 'Board Meeting & Sitting Allowance Expense A/c .. Dr.', dr: '40,000.00', cr: '', color: 'text-blue-900 font-bold' },
        { particulars: '  To TDS Payable on Meeting Fee A/c (Code 11132 @ 15%) Cr.', dr: '', cr: '6,000.00', color: 'text-rose-700 font-bold' },
        { particulars: '  To Bank A/c (Net Allowance to Directors) ..... Cr.', dr: '', cr: '34,000.00', color: 'text-slate-700' },
      ],
      totalDr: 'Rs. 40,000.00',
      totalCr: 'Rs. 40,000.00',
      narration: '(Being board of directors meeting sitting allowances recorded after deducting 15% statutory TDS under Sec 88(1))',
      revenueCode: '१११३२ (11132)',
      depositDeadline: 'Within 25th of next month',
    },
  ];

  const GUIDE_CARDS = [
    {
      id: 'flipbook' as const,
      stripe: 'bg-[#F6BD60]',
      titleNepali: 'भुक्तानीमा कर कट्टी दर',
      titleEnglish: 'Interactive TDS Flipbook',
      shortTabTitle: 'फ्लिपबुक',
      description: 'Access the interactive 3D digital booklet with page-turning experience covering statutory withholding tax rates and IRD guidelines.',
      cardBg: 'bg-[#FFFDF7]',
      cardBorder: 'border-amber-200/80 hover:border-amber-400',
      iconBg: 'bg-amber-50/80 border border-amber-200/60',
      btnBorder: 'border-slate-300 group-hover:border-amber-400',
      btnHover: 'group-hover:bg-amber-500 group-hover:text-white',
      btnText: 'Flipbook खोल्नुहोस्',
      activeBadgeBg: 'bg-amber-500 text-slate-950',
      accentDot: 'bg-[#F59E0B]',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M32 18C24 13 13 14 8 16V50C13 48 24 47 32 52C40 47 51 48 56 50V16C51 14 40 13 32 18Z" fill="#FDE68A" stroke="#D97706" strokeWidth="2.5" strokeLinejoin="round"/>
          <path d="M32 18V52" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M14 26C19 25 25 25 29 27" stroke="#B45309" strokeWidth="2" strokeLinecap="round"/>
          <path d="M14 33C19 32 25 32 29 34" stroke="#B45309" strokeWidth="2" strokeLinecap="round"/>
          <path d="M14 40C19 39 25 39 29 41" stroke="#B45309" strokeWidth="2" strokeLinecap="round"/>
          <path d="M35 27C39 25 45 25 50 26" stroke="#B45309" strokeWidth="2" strokeLinecap="round"/>
          <path d="M35 34C39 32 45 32 50 33" stroke="#B45309" strokeWidth="2" strokeLinecap="round"/>
          <path d="M35 41C39 39 45 39 50 40" stroke="#B45309" strokeWidth="2" strokeLinecap="round"/>
          <path d="M32 18V36L35 33L38 36V18" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5"/>
        </svg>
      )
    },
    {
      id: 'rates' as const,
      stripe: 'bg-[#38BDF8]',
      titleNepali: 'दफागत कर कट्टी दरहरू',
      titleEnglish: 'Statutory Rates Matrix',
      shortTabTitle: 'दफागत दर',
      description: 'Searchable matrix of tax rates across Sections 87, 88, 88A, 89, and 92 of Income Tax Act 2058 with salary tax simulator.',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200 hover:border-sky-400',
      iconBg: 'bg-sky-50 border border-sky-200/60',
      btnBorder: 'border-slate-300 group-hover:border-sky-400',
      btnHover: 'group-hover:bg-sky-500 group-hover:text-white',
      btnText: 'दरहरू खोज्नुहोस्',
      activeBadgeBg: 'bg-sky-500 text-white',
      accentDot: 'bg-[#0EA5E9]',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="14" width="26" height="38" rx="4" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5"/>
          <rect x="14" y="19" width="18" height="8" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5"/>
          <circle cx="17" cy="33" r="2" fill="#0369A1"/>
          <circle cx="23" cy="33" r="2" fill="#0369A1"/>
          <circle cx="29" cy="33" r="2" fill="#0369A1"/>
          <circle cx="17" cy="40" r="2" fill="#0369A1"/>
          <circle cx="23" cy="40" r="2" fill="#0369A1"/>
          <circle cx="29" cy="40" r="2" fill="#0369A1"/>
          <circle cx="17" cy="47" r="2" fill="#0369A1"/>
          <rect x="22" y="45.5" width="8" height="3" rx="1.5" fill="#0284C7"/>
          <circle cx="48" cy="20" r="10" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2"/>
          <text x="48" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369A1" fontFamily="sans-serif">%</text>
          <rect x="40" y="42" width="4" height="10" rx="1" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5"/>
          <rect x="46" y="36" width="4" height="16" rx="1" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5"/>
          <rect x="52" y="30" width="4" height="22" rx="1" fill="#0369A1" stroke="#075985" strokeWidth="1.5"/>
          <path d="M38 38L47 28L55 24" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'codes' as const,
      stripe: 'bg-[#8B5CF6]',
      titleNepali: 'राजस्व संकेत तालिका',
      titleEnglish: 'IRD Revenue Head-Codes',
      shortTabTitle: 'राजस्व कोड',
      description: 'Official Government of Nepal 5-digit treasury deposit codes (१११११, १११३१, १११३२) with nature and statutory descriptions.',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200 hover:border-purple-500',
      iconBg: 'bg-purple-50 border border-purple-200/60',
      btnBorder: 'border-slate-300 group-hover:border-purple-500',
      btnHover: 'group-hover:bg-purple-600 group-hover:text-white',
      btnText: 'तालिका हेर्नुहोस्',
      activeBadgeBg: 'bg-purple-600 text-white',
      accentDot: 'bg-[#8B5CF6]',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="10" width="40" height="44" rx="4" fill="#F3E8FF" stroke="#7C3AED" strokeWidth="2.5"/>
          <rect x="12" y="10" width="40" height="11" rx="4" fill="#DDD6FE"/>
          <line x1="12" y1="21" x2="52" y2="21" stroke="#7C3AED" strokeWidth="2"/>
          <line x1="26" y1="10" x2="26" y2="54" stroke="#7C3AED" strokeWidth="1.5"/>
          <line x1="12" y1="30" x2="52" y2="30" stroke="#7C3AED" strokeWidth="1.5"/>
          <line x1="12" y1="39" x2="52" y2="39" stroke="#7C3AED" strokeWidth="1.5"/>
          <line x1="12" y1="48" x2="52" y2="48" stroke="#7C3AED" strokeWidth="1.5"/>
          <path d="M16 15.5H22M16 25.5H22M16 34.5H22M16 43.5H22" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round"/>
          <path d="M30 15.5H48M30 25.5H45M30 34.5H47M30 43.5H44" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
          <path d="M44 48C48 48 51 46 51 42L49 43M51 42L53 45" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'etds' as const,
      stripe: 'bg-[#14B8A6]',
      titleNepali: 'ई-टीडीएस प्रक्रिया तथा प्रमाण-पत्र',
      titleEnglish: 'e-TDS Procedure & Portal',
      shortTabTitle: 'ई-टीडीएस',
      description: 'Step-by-step walkthrough for IRD online e-TDS entry, monthly voucher upload, and Form 88 certificate issuance.',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200 hover:border-teal-400',
      iconBg: 'bg-teal-50 border border-teal-200/60',
      btnBorder: 'border-slate-300 group-hover:border-teal-400',
      btnHover: 'group-hover:bg-teal-500 group-hover:text-white',
      btnText: 'प्रक्रिया हेर्नुहोस्',
      activeBadgeBg: 'bg-teal-600 text-white',
      accentDot: 'bg-[#14B8A6]',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 28C18 24 21 21 25 21C26 18 29 16 33 16C38 16 42 20 42 24C45 24 48 26 48 29C48 32 45 35 42 35H18C15 35 13 33 13 30C13 28 15 26 18 28Z" fill="#CCFBF1" stroke="#0D9488" strokeWidth="2"/>
          <text x="29" y="29" fontSize="13" fontWeight="bold" fill="#0F766E" fontFamily="sans-serif">e</text>
          <path d="M26 35V42L32 42" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="30" y="32" width="24" height="22" rx="2" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2"/>
          <line x1="34" y1="37" x2="48" y2="37" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="34" y1="41" x2="46" y2="41" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="48" cy="47" r="4.5" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
          <path d="M46 51L45 56L48 54L51 56L50 51" fill="#D97706"/>
        </svg>
      )
    },
    {
      id: 'vouchers' as const,
      stripe: 'bg-[#EC4899]',
      titleNepali: 'लेखा भौचर नमूनाहरू',
      titleEnglish: 'Journal Voucher Templates',
      shortTabTitle: 'लेखा भौचर',
      description: '16 standard double-entry journal vouchers compliant with IRD rules for rent, audit fees, freight, and IT AMC.',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200 hover:border-pink-400',
      iconBg: 'bg-pink-50 border border-pink-200/60',
      btnBorder: 'border-slate-300 group-hover:border-pink-400',
      btnHover: 'group-hover:bg-pink-500 group-hover:text-white',
      btnText: 'नमूना हेर्नुहोस्',
      activeBadgeBg: 'bg-pink-600 text-white',
      accentDot: 'bg-[#EC4899]',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="10" width="34" height="44" rx="3" fill="#FDF2F8" stroke="#DB2777" strokeWidth="2.5"/>
          <rect x="17" y="15" width="24" height="5" rx="1" fill="#FBCFE8" stroke="#DB2777" strokeWidth="1"/>
          <rect x="17" y="24" width="13" height="20" rx="1" fill="#FFF" stroke="#F472B6" strokeWidth="1.5"/>
          <rect x="31" y="24" width="10" height="20" rx="1" fill="#FFF" stroke="#F472B6" strokeWidth="1.5"/>
          <line x1="19" y1="28" x2="28" y2="28" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="33" x2="26" y2="33" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="33" y1="28" x2="39" y2="28" stroke="#BE185D" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="33" y1="33" x2="38" y2="33" stroke="#BE185D" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="19" y1="39" x2="39" y2="39" stroke="#9D174D" strokeWidth="1.5"/>
          <path d="M48 16L53 21L49 46L46 48L46 45L48 16Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5"/>
          <path d="M46 48L45 52L48 50L46 48Z" fill="#BE185D"/>
          <rect x="49" y="14" width="4" height="3" rx="1" fill="#D97706"/>
        </svg>
      )
    },
    {
      id: 'penalties' as const,
      stripe: 'bg-[#84CC16]',
      titleNepali: 'म्याद तथा जरिवाना व्यवस्था',
      titleEnglish: 'Deadlines & Penalties',
      shortTabTitle: 'जरिवाना व्यवस्था',
      description: 'Statutory 25th deposit deadline, Section 119 interest rates, and non-compliance fines under Section 120.',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200 hover:border-lime-500',
      iconBg: 'bg-lime-50 border border-lime-200/60',
      btnBorder: 'border-slate-300 group-hover:border-lime-500',
      btnHover: 'group-hover:bg-lime-600 group-hover:text-white',
      btnText: 'नियमावली पढ्नुहोस्',
      activeBadgeBg: 'bg-lime-600 text-white',
      accentDot: 'bg-[#84CC16]',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="18" width="34" height="32" rx="4" fill="#F7FEE7" stroke="#65A30D" strokeWidth="2.5"/>
          <path d="M12 22C12 19.8 13.8 18 16 18H42C44.2 18 46 19.8 46 22V26H12V22Z" fill="#84CC16"/>
          <rect x="18" y="15" width="3" height="6" rx="1.5" fill="#4D7C0F"/>
          <rect x="37" y="15" width="3" height="6" rx="1.5" fill="#4D7C0F"/>
          <circle cx="20" cy="32" r="2" fill="#4D7C0F"/>
          <circle cx="29" cy="32" r="2" fill="#4D7C0F"/>
          <circle cx="38" cy="32" r="2" fill="#4D7C0F"/>
          <circle cx="20" cy="40" r="2" fill="#4D7C0F"/>
          <circle cx="29" cy="40" r="2" fill="#4D7C0F"/>
          <circle cx="48" cy="18" r="8" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2"/>
          <path d="M48 14V18L51 20" stroke="#854D0E" strokeWidth="1.5" strokeLinecap="round"/>
          <g transform="rotate(-30 38 46)">
            <rect x="34" y="43" width="14" height="8" rx="2" fill="#991B1B" stroke="#7F1D1D" strokeWidth="1.5"/>
            <rect x="39" y="47" width="4" height="18" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.5"/>
          </g>
        </svg>
      )
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-50/70 overflow-hidden py-8 sm:py-10 font-sans">
      {/* Subtle Geometric Background Watermark matching Main Dashboard */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ===================================================================== */}
        {/* 1. 6-CARD DASHBOARD SCREEN (DISPLAYED WHEN NO WINDOW IS ACTIVE) */}
        {/* ===================================================================== */}
        {!activeWindow && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Navigation Row: Back Button */}
            {onBack ? (
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={onBack}
                  aria-label="Back to Library Catalogue"
                  title="Back to Library Catalogue"
                  className="p-2 sm:p-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-full border border-slate-300 shadow-2xs transition flex items-center justify-center cursor-pointer group hover:scale-105 shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
              </div>
            ) : null}

            {/* Main Title Heading - Identical Design to Main Dashboard */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                TDS Compliance Guide
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl mx-auto">
                Comprehensive statutory withholding tax guide under Nepal Income Tax Act, 2058. Select a learning module below to view the interactive flipbook, explore section-wise tax rates, lookup IRD revenue codes, or access standard accounting vouchers.
              </p>
            </div>

            {/* 6-Card Grid Matching Main Dashboard Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
              {GUIDE_CARDS.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleSelectCard(card.id)}
                  className={`group cursor-pointer ${card.cardBg} border ${card.cardBorder} rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden`}
                >
                  {/* Top Colored Stripe */}
                  <div className={`absolute top-0 left-0 right-0 h-2 ${card.stripe}`} />

                  <div className="pt-2 text-center flex flex-col items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      {card.titleNepali}
                    </h2>
                    {card.titleEnglish && (
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {card.titleEnglish}
                      </p>
                    )}

                    {/* Colorful Custom Illustration Badge */}
                    <div className="my-6 relative flex items-center justify-center">
                      <div
                        className={`w-24 h-24 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform`}
                      >
                        {card.icon}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[260px] text-center">
                      {card.description}
                    </p>
                  </div>

                  {/* Bottom Button */}
                  <div className="pt-6 flex justify-center w-full">
                    <button
                      type="button"
                      className={`w-full sm:w-auto min-w-[140px] px-5 py-2.5 rounded-xl border ${card.btnBorder} ${card.btnHover} bg-white text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-2xs flex items-center justify-center gap-1.5`}
                    >
                      <span>{card.btnText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* 2. DEDICATED WORKSPACE WINDOW WITHIN TDS COMPLIANCE GUIDE */}
        {/* ===================================================================== */}
        {activeWindow && (
          <div ref={contentAreaRef} className="space-y-4 animate-fadeIn">
            {/* WINDOW SHELL */}
            <div className="bg-white border-2 border-slate-300 rounded-3xl shadow-xl overflow-hidden">
            {/* WINDOW TOP TITLE BAR */}
            <div className="bg-white text-slate-900 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveWindow(null)}
                  aria-label="Previous"
                  title="Previous (पछाडि फर्कनुहोस्)"
                  className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-full border border-slate-300 shadow-2xs transition flex items-center justify-center cursor-pointer group hover:scale-105 shrink-0"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform text-slate-800" />
                </button>

                <div className="h-5 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      GUIDE_CARDS.find((c) => c.id === activeWindow)?.accentDot || 'bg-blue-500'
                    }`}
                  />
                  <h2 className="text-sm sm:text-base font-black tracking-tight text-slate-900 flex items-center gap-2">
                    {activeWindow === 'flipbook' && 'भुक्तानीमा कर कट्टी दर (TDS Rates)'}
                    {activeWindow === 'rates' && 'दफागत कर कट्टी दरहरू (TDS Rates Matrix - Income Tax Act 2058)'}
                    {activeWindow === 'codes' && 'राजस्व संकेत तालिका (All 42 IRD Revenue Head Codes)'}
                    {activeWindow === 'etds' && 'ई-टीडीएस प्रक्रिया तथा प्रमाण-पत्र (E-TDS Workflow & Certificate)'}
                    {activeWindow === 'vouchers' && 'लेखा भौचर नमूनाहरू (Standard Journal Voucher Templates)'}
                    {activeWindow === 'penalties' && 'म्याद तथा जरिवाना व्यवस्था (Statutory Deadlines & Penalties)'}
                  </h2>
                </div>
              </div>

              {/* Small download icon ONLY for TDS rates */}
              {(activeWindow === 'flipbook' || activeWindow === 'rates') && (
                <button
                  type="button"
                  onClick={() => downloadTdsRatesPDF(TDS_RATES_DATA)}
                  aria-label="Download TDS Rates PDF"
                  title="Download TDS Rates Schedule (TDS दर तालिका PDF डाउनलोड गर्नुहोस्)"
                  className="p-2 sm:p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-blue-700 rounded-full border border-slate-300 shadow-2xs transition flex items-center justify-center cursor-pointer group hover:scale-105 shrink-0"
                >
                  <Download className="w-4 h-4 text-slate-700 group-hover:text-blue-600 transition-colors" />
                </button>
              )}
            </div>

              {/* WINDOW BODY */}
              <div className="p-4 sm:p-6 bg-[#FCFBF9] min-h-[500px]">
                {/* TAB 0: OFFICIAL PDF FLIP-BOOK */}
                {activeWindow === 'flipbook' && (
                  <TdsPdfFlipBook />
                )}

                {/* TAB 1: TDS RATES MATRIX */}
                {activeWindow === 'rates' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Nepal TDS Statutory Rates Matrix (आयकर ऐन, २०५८)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Official withholding tax rates with IRD revenue deposit codes, nature of payment, and double-entry impact.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search section, rate, service..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white shadow-2xs font-medium"
              >
              </input>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-semibold text-[11px]">
                  <th className="py-3 px-3 w-28 border-r border-slate-700">दफा (Section)</th>
                  <th className="py-3 px-4 w-72 border-r border-slate-700">भुक्तानीको प्रकृति (Nature of Payment)</th>
                  <th className="py-3 px-3 w-24 text-center border-r border-slate-700">कर कट्टी दर (Rate)</th>
                  <th className="py-3 px-3 w-28 text-center border-r border-slate-700">राजस्व खाता संकेत</th>
                  <th className="py-3 px-3 w-36 border-r border-slate-700">करको प्रकृति</th>
                  <th className="py-3 px-4">लेखा भौचर प्रविष्टि (Journal Voucher Rule)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans text-slate-800">
                {filteredRates.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/40 transition">
                    {/* Section */}
                    <td className="py-3 px-3 border-r border-slate-200">
                      <span className="font-mono font-extrabold text-blue-700 block">
                        {item.section}
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        {item.sectionNepali}
                      </span>
                    </td>

                    {/* Nature */}
                    <td className="py-3 px-4 border-r border-slate-200">
                      <div className="font-semibold text-slate-900 leading-snug">
                        {item.nature}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-sans">
                        Payee: {item.payee}
                      </div>
                    </td>

                    {/* Rate */}
                    <td className="py-3 px-3 text-center border-r border-slate-200">
                      <span className={`inline-block px-2.5 py-1 rounded-md font-mono font-black text-xs border ${item.rateColor}`}>
                        {item.rate}
                      </span>
                    </td>

                    {/* Deposit Code (no copy button) */}
                    <td className="py-3 px-3 text-center border-r border-slate-200">
                      <span className="font-mono font-bold text-slate-900 block text-xs">
                        {item.depositCodeRaw}
                      </span>
                      <span className="text-[10px] font-sans text-slate-400 block mt-0.5">
                        {item.depositCode}
                      </span>
                    </td>

                    {/* Tax Type */}
                    <td className="py-3 px-3 border-r border-slate-200 text-[11px]">
                      <span className="font-medium text-slate-700">
                        {item.taxType}
                      </span>
                    </td>

                    {/* Journal Rule */}
                    <td className="py-3 px-4 text-[11px] font-mono text-slate-700 leading-relaxed bg-slate-50/40">
                      {item.voucherHint}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 87 Salary Slabs Card - Official Nepal IRD FY 2083/84 */}
          <div className="bg-[#FFFDF7] border border-amber-200/80 rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden space-y-6">
            {/* Top Amber Stripe matching Main Dashboard Layout */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#F6BD60]" />

            {/* Header & Direct Link to Government of Nepal Original Document */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-4 pt-1">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 border border-amber-500/30 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
                  §८७
                </div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                      दफा ८७: पारिश्रमिक आय कर कट्टी
                    </span>
                    <span className="text-xs font-bold px-3 py-0.5 rounded-full border bg-amber-100 text-amber-900 border-amber-300 font-sans">
                      आर्थिक वर्ष २०८३/०८४
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    आन्तरिक राजस्व विभाग • आयकर ऐन, २०५८ को अनुसूची-१ को दफा १ बमोजिम प्राकृतिक व्यक्तिको लागि लागू हुने करको दर
                  </p>
                </div>
              </div>

              {/* Direct Link to Government of Nepal Original Document */}
              <a
                href="https://ird.gov.np/content/13609/tax-rate-for-natural-persons-for-the/#flipbook-flipbookContainer/1/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-900 text-xs font-bold border border-amber-300 shadow-2xs transition hover:scale-105 shrink-0"
                title="नेपाल सरकार, आन्तरिक राजस्व विभागको आधिकारिक पोर्टलमा हेर्नुहोस्"
              >
                <span>आधिकारिक पोर्टल (IRD Nepal)</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
              </a>
            </div>

            {/* Two Official Statutory Tables (एकल र दम्पती) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Table 1: प्राकृतिक व्यक्ति (एकल) को हकमा */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    तालिका १: प्राकृतिक व्यक्ति (एकल) को हकमा
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500">
                    पहिलो रु. ५,००,०००/- सम्म
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-semibold text-[11px]">
                        <th className="py-2.5 px-3 w-12 text-center border-r border-slate-700">क्र.सं.</th>
                        <th className="py-2.5 px-3.5 border-r border-slate-700">करयोग्य आयको सीमा</th>
                        <th className="py-2.5 px-2.5 w-20 text-center border-r border-slate-700">कर दर</th>
                        <th className="py-2.5 px-3 w-32 text-right">कर रकम (अधिकतम)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans text-slate-800 text-[11px]">
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">१.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          पहिलो रू. ५,००,०००/- सम्म
                          <span className="block text-[10px] text-emerald-700 font-medium mt-0.5">
                            * SSF वा निवृत्तभरण कोष योगदानकर्ताको हकमा ०%
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-emerald-700 border-r border-slate-200 font-mono">
                          १%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          रू. ५,०००/-
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">२.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          त्यसपछिको रू. २,००,०००/- सम्म (रू. ५ लाखदेखि ७ लाखसम्म)
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-blue-700 border-r border-slate-200 font-mono">
                          १०%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          रू. २०,०००/-
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">३.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          त्यसपछिको रू. ३,००,०००/- सम्म (रू. ७ लाखदेखि १० लाखसम्म)
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-blue-700 border-r border-slate-200 font-mono">
                          २०%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          रू. ६०,०००/-
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">४.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          त्यसपछिको रू. १०,००,०००/- सम्म (रू. १० लाखदेखि २० लाखसम्म)
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-indigo-700 border-r border-slate-200 font-mono">
                          ३०%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          रू. ३,००,०००/-
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">५.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          त्यसपछिको रू. ३०,००,०००/- सम्म (रू. २० लाखदेखि ५० लाखसम्म)
                          <span className="block text-[10px] text-slate-500 font-sans mt-0.5">
                            (३०% मा २०% अतिरिक्त सरचार्ज = ३६%)
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-purple-700 border-r border-slate-200 font-mono">
                          ३६%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          रू. १०,८०,०००/-
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">६.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          रू. ५०,००,०००/- भन्दा माथि जतिसुकै आय भएमा
                          <span className="block text-[10px] text-slate-500 font-sans mt-0.5">
                            (३०% मा ३०% अतिरिक्त सरचार्ज = ३९%)
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-rose-700 border-r border-slate-200 font-mono">
                          ३९%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          थप आयमा ३९%
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300 text-[11px]">
                        <td colSpan={3} className="py-2 px-3 text-right border-r border-slate-300">
                          रू. ५० लाख करयोग्य आय हुँदा तिर्नुपर्ने जम्मा कर:
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-blue-900 font-black">
                          रू. १४,६५,०००/-
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Table 2: प्राकृतिक व्यक्ति (दम्पती) को हकमा */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    तालिका २: प्राकृतिक व्यक्ति (दम्पती) को हकमा
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500">
                    पहिलो रु. ६,००,०००/- सम्म
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-semibold text-[11px]">
                        <th className="py-2.5 px-3 w-12 text-center border-r border-slate-700">क्र.सं.</th>
                        <th className="py-2.5 px-3.5 border-r border-slate-700">करयोग्य आयको सीमा</th>
                        <th className="py-2.5 px-2.5 w-20 text-center border-r border-slate-700">कर दर</th>
                        <th className="py-2.5 px-3 w-32 text-right">कर रकम (अधिकतम)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans text-slate-800 text-[11px]">
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">१.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          पहिलो रू. ६,००,०००/- सम्म
                          <span className="block text-[10px] text-emerald-700 font-medium mt-0.5">
                            * SSF वा निवृत्तभरण कोष योगदानकर्ताको हकमा ०%
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-emerald-700 border-r border-slate-200 font-mono">
                          १%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          रू. ६,०००/-
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">२.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          त्यसपछिको रू. २,००,०००/- सम्म (रू. ६ लाखदेखि ८ लाखसम्म)
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-blue-700 border-r border-slate-200 font-mono">
                          १०%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          रू. २०,०००/-
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">३.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          त्यसपछिको रू. ३,००,०००/- सम्म (रू. ८ लाखदेखि ११ लाखसम्म)
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-blue-700 border-r border-slate-200 font-mono">
                          २०%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          रू. ६०,०००/-
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">४.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          त्यसपछिको रू. ९,००,०००/- सम्म (रू. ११ लाखदेखि २० लाखसम्म)
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-indigo-700 border-r border-slate-200 font-mono">
                          ३०%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          रू. २,७०,०००/-
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">५.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          त्यसपछिको रू. ३०,००,०००/- सम्म (रू. २० लाखदेखि ५० लाखसम्म)
                          <span className="block text-[10px] text-slate-500 font-sans mt-0.5">
                            (३०% मा २०% अतिरिक्त सरचार्ज = ३६%)
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-purple-700 border-r border-slate-200 font-mono">
                          ३६%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          रू. १०,८०,०००/-
                        </td>
                      </tr>
                      <tr className="hover:bg-amber-50/40">
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">६.</td>
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-medium">
                          रू. ५०,००,०००/- भन्दा माथि जतिसुकै आय भएमा
                          <span className="block text-[10px] text-slate-500 font-sans mt-0.5">
                            (३०% मा ३०% अतिरिक्त सरचार्ज = ३९%)
                          </span>
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-rose-700 border-r border-slate-200 font-mono">
                          ३९%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          थप आयमा ३९%
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 font-bold text-slate-900 border-t border-slate-300 text-[11px]">
                        <td colSpan={3} className="py-2 px-3 text-right border-r border-slate-300">
                          रू. ५० लाख करयोग्य आय हुँदा तिर्नुपर्ने जम्मा कर:
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-emerald-900 font-black">
                          रू. १४,३६,०००/-
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Statutory Exemptions & Rebate Provisions Matching Main Dashboard Layout */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-amber-200/70 space-y-3">
              <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>आन्तरिक राजस्व विभाग अनुसार प्रमुख कानुनी छुट तथा व्यवस्था (आयकर ऐन, २०५८ • अनुसूची-१ को दफा १):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-[11px] text-slate-700">
                <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">१. SSF १% सामाजिक सुरक्षा कर छुट</div>
                  <p className="text-slate-600 leading-relaxed">
                    योगदानमा आधारित सामाजिक सुरक्षा कोष (SSF) वा स्वीकृत निवृत्तभरण कोषमा योगदान गर्ने प्राकृतिक व्यक्ति तथा एकलौटी फर्मको हकमा पहिलो स्ल्याबमा १% कर लाग्दैन (०% कर)।
                  </p>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">२. महिला कर्मचारी कर छुट (१०% Rebate)</div>
                  <p className="text-slate-600 leading-relaxed">
                    पारिश्रमिक आय मात्र आर्जन गर्ने बासिन्दा प्राकृतिक महिला कर्मचारीलाई गणना भएको कुल कर रकममा १० प्रतिशत कर छुट (Rebate) प्रदान गरिनेछ।
                  </p>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">३. स्वीकृत अवकाश कोष योगदान</div>
                  <p className="text-slate-600 leading-relaxed">
                    स्वीकृत अवकाश कोषमा योगदान गर्दा वार्षिक अधिकतम रू. ५,००,०००/- वा निर्धारणयोग्य आयको १/३ मध्ये जुन घटी हुन्छ सो रकम करयोग्य आयबाट घटाउन पाइनेछ।
                  </p>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">४. जीवन तथा स्वास्थ्य बीमा प्रिमियम</div>
                  <p className="text-slate-600 leading-relaxed">
                    लगानी/जीवन बीमा बापत वार्षिक अधिकतम रू. ४०,०००/- र स्वास्थ्य बीमा बापत वार्षिक अधिकतम रू. २०,०००/- सम्म करयोग्य आयबाट कट्टी गर्न पाइनेछ।
                  </p>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">५. दुर्गम भत्ता तथा निजी भवन बीमा</div>
                  <p className="text-slate-600 leading-relaxed">
                    क, ख, ग, घ, ङ वर्गका दुर्गम क्षेत्रमा क्रमशः रू. ५०,०००/-, ४०,०००/-, ३०,०००/-, २०,०००/- र १०,०००/- सम्म तथा निजी आवास भवन बीमा बापत रू. १०,०००/- सम्म घटाउन पाइनेछ।
                  </p>
                </div>
                <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900">६. अपाङ्गता भएका व्यक्तिको थप छुट</div>
                  <p className="text-slate-600 leading-relaxed">
                    बासिन्दा प्राकृतिक व्यक्ति अपाङ्ग रहेछन् भने निजले पाउने प्रारम्भिक कर छुटको सीमामा थप ५० प्रतिशत रकम करयोग्य आयबाट घटाउन पाउने व्यवस्था छ।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: OFFICIAL IRD REVENUE CODES TABLE (ALL 42 CODES) */}
      {/* ===================================================================== */}
      {activeWindow === 'codes' && (
        <div className="space-y-6">
          <IrdRevenueCodesTable />
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: E-TDS WORKFLOW & WITHHOLDING CERTIFICATE */}
      {/* ===================================================================== */}
      {activeWindow === 'etds' && (
        <div className="space-y-6">
          {/* Step-by-Step E-TDS Filing & Deposit Process (Inland Revenue Department) Presentation */}
          <EtdsWorkflowPresentation />
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: DOUBLE-ENTRY JOURNAL VOUCHERS */}
      {/* ===================================================================== */}
      {activeWindow === 'vouchers' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Standard Double-Entry TDS Journal Vouchers (लेखा भौचर नमूनाहरू)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Exact compound journal vouchers under Income Tax Act, 2058 (FY 2083/84). Click the preview icon on any voucher to inspect complete debit/credit entries.
            </p>
          </div>

          {/* VOUCHER CARDS WITH PREVIEW ICON ONLY (AS EXPLICITLY REQUESTED) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VOUCHERS_LIST.map((voucher) => (
              <div
                key={voucher.id}
                className="p-5 bg-slate-50 hover:bg-purple-50/30 border border-slate-200 hover:border-purple-300 rounded-2xl transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3 group"
              >
                {/* Top Row: Details & PREVIEW ICON ONLY */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-200/80 text-slate-800 rounded font-bold">
                        {voucher.voucherNo}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold">
                        {voucher.section}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">
                        {voucher.amountBadge}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-900 transition-colors">
                      {voucher.title}
                    </h3>
                  </div>

                  {/* PREVIEW ICON ONLY (AS EXPLICITLY REQUESTED) */}
                  <button
                    type="button"
                    onClick={() => setPreviewVoucher(voucher)}
                    className="p-2 sm:p-2.5 rounded-xl bg-white group-hover:bg-purple-100 text-purple-700 border border-purple-200 transition-all shadow-2xs hover:shadow-sm cursor-pointer flex items-center justify-center shrink-0 hover:scale-105"
                    title={`Preview ${voucher.voucherNo} (भौचर प्रिभ्यू)`}
                    aria-label={`Preview ${voucher.voucherNo}`}
                  >
                    <Eye className="w-5 h-5 text-purple-700" />
                  </button>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {voucher.summary}
                </p>

                {/* Bottom Metadata */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Code: {voucher.revenueCode}</span>
                  <span className="text-amber-700 font-sans font-medium">{voucher.depositDeadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: STATUTORY TIMELINES & PENALTIES */}
      {/* ===================================================================== */}
      {activeWindow === 'penalties' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              कानुनी म्याद तथा जरिवाना
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
              Statutory Deadlines & Non-Compliance Penalties (दण्ड तथा जरिवाना)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict provisions under Income Tax Act Sections 90, 117, 118, and 119 for late filing or failure to withhold TDS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span className="font-bold text-xs text-amber-900 uppercase">
                  Deposit Deadline (दाखिला म्याद)
                </span>
              </div>
              <div className="text-2xl font-black text-amber-700">
                २५ गतेभित्र
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                TDS withheld during any Nepalese calendar month (e.g. Baishakh) must be deposited into the IRD treasury within the <strong>25th day of the following month</strong> (e.g. Jestha 25).
              </p>
            </div>

            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                <span className="font-bold text-xs text-rose-900 uppercase">
                  Interest on Late Deposit (ब्याज)
                </span>
              </div>
              <div className="text-2xl font-black text-rose-700">
                15% per annum
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Under Section 119, failure to remit withheld TDS within the due date incurs statutory interest at the rate of <strong>15% per annum</strong> computed on daily balance from the due date.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-xs text-slate-900 uppercase">
                  Fee for Failure to File (विवरण शुल्क)
                </span>
              </div>
              <div className="text-2xl font-black text-slate-800">
                Sec 117 Fines
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Under Section 117(1), failure to submit the monthly E-TDS return statement attracts a penalty of <strong>Rs. 100 per month</strong> or <strong>0.1% per annum</strong> of assessable income, whichever is higher.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <span className="font-bold text-slate-900">
              Joint Liability on Failure to Deduct (दफा ९० बमोजिम संयुक्त दायित्व):
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              If an entity fails to withhold tax at source as required under the Income Tax Act, the entity and its chief accounting officers become personally and jointly liable to pay the entire tax amount along with interest and statutory penalties to the government.
            </p>
          </div>
        </div>
      )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. JOURNAL VOUCHER PREVIEW MODAL */}
      {/* ===================================================================== */}
      {previewVoucher && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-3xl w-full overflow-hidden my-auto animate-scaleUp">
            {/* Modal Top Bar */}
            <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30 font-mono">
                      {previewVoucher.voucherNo}
                    </span>
                    <span className="text-xs text-purple-300 font-medium font-mono">
                      {previewVoucher.section}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white mt-0.5 line-clamp-1">
                    {previewVoucher.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewVoucher(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Close Preview (बन्द गर्नुहोस्)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Double Entry Journal Voucher Format */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 bg-[#FCFBF9]">
              {/* Document Heading */}
              <div className="text-center border-b border-slate-300 pb-3 space-y-0.5 font-sans">
                <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  गोश्वारा भौचर (Double-Entry Journal Voucher)
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  आयकर ऐन, २०५८ बमोजिम स्रोतमा कर कट्टी (TDS) तथा दाखिला प्रविष्टि
                </p>
              </div>

              {/* Voucher Meta details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase">भौचर नं. (Voucher No)</span>
                  <span className="font-bold font-mono text-slate-800">{previewVoucher.voucherNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase">आर्थिक वर्ष (Fiscal Year)</span>
                  <span className="font-bold font-mono text-slate-800">२०८३/८४</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium uppercase">राजस्व कोड (Revenue Code)</span>
                  <span className="font-bold font-mono text-purple-700">{previewVoucher.revenueCode}</span>
                </div>
              </div>

              {/* Summary of Transaction */}
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3 text-xs text-purple-950">
                <span className="font-bold block mb-1">कारोबारको विवरण (Transaction Summary):</span>
                <p className="leading-relaxed text-[11.5px]">{previewVoucher.summary}</p>
              </div>

              {/* Accounting Journal Table */}
              <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold text-[11px]">
                    <tr>
                      <th className="p-2.5 text-left border-r border-slate-200">खाताको नाम तथा विवरण (Particulars)</th>
                      <th className="p-2.5 text-right border-r border-slate-200 w-32">डेबिट रकम रू. (Dr.)</th>
                      <th className="p-2.5 text-right w-32">क्रेडिट रकम रू. (Cr.)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[12px]">
                    {previewVoucher.lines.map((line: any, lIdx: number) => (
                      <tr key={lIdx} className="hover:bg-slate-50/80">
                        <td className={`p-2.5 text-left border-r border-slate-200 ${line.color || 'text-slate-800'}`}>
                          {line.particulars}
                        </td>
                        <td className="p-2.5 text-right border-r border-slate-200 font-bold text-blue-900">
                          {line.dr || '-'}
                        </td>
                        <td className="p-2.5 text-right font-bold text-emerald-800">
                          {line.cr || '-'}
                        </td>
                      </tr>
                    ))}
                    {/* Balanced Totals */}
                    <tr className="bg-slate-100 font-black border-t-2 border-slate-400 text-[12px]">
                      <td className="p-2.5 text-right border-r border-slate-300 font-bold font-sans">
                        जम्मा (Total Amount):
                      </td>
                      <td className="p-2.5 text-right border-r border-slate-300 text-blue-900">
                        {previewVoucher.totalDr}
                      </td>
                      <td className="p-2.5 text-right text-emerald-900">
                        {previewVoucher.totalCr}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Narration */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700">कैफियत (Narration):</span>
                <p className="italic text-slate-600 mt-0.5">{previewVoucher.narration}</p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-300 text-[11px] text-slate-600 text-center font-sans">
                <div>
                  <div className="h-8 border-b border-dashed border-slate-400"></div>
                  <span className="font-bold block mt-1">तयार गर्ने (Prepared By)</span>
                  <span className="text-[10px] text-slate-400">लेखापाल / Accountant</span>
                </div>
                <div>
                  <div className="h-8 border-b border-dashed border-slate-400"></div>
                  <span className="font-bold block mt-1">जाँच गर्ने (Checked By)</span>
                  <span className="text-[10px] text-slate-400">आन्तरिक लेखापरीक्षक</span>
                </div>
                <div>
                  <div className="h-8 border-b border-dashed border-slate-400"></div>
                  <span className="font-bold block mt-1">स्वीकृत गर्ने (Approved By)</span>
                  <span className="text-[10px] text-slate-400">प्रमुख वित्त अधिकृत (CFO)</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-100 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  const entryText = `${previewVoucher.title}\nVoucher: ${previewVoucher.voucherNo}\n\n${previewVoucher.lines.map((l: any) => `${l.particulars} | Dr: ${l.dr || '-'} | Cr: ${l.cr || '-'}`).join('\n')}\n\nNarration: ${previewVoucher.narration}`;
                  handleCopy(entryText, `voucher-${previewVoucher.id}`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                {copiedText === `voucher-${previewVoucher.id}` ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Copy Journal Voucher Text</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPreviewVoucher(null)}
                className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                बन्द गर्नुहोस् (Close Preview)
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
