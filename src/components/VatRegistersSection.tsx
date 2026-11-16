import React, { useState, useMemo, useEffect } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Receipt,
  FileText,
  DollarSign,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  FolderOpen,
  Tag,
  Paperclip,
  Trash2,
  Download,
  Info,
  KeyRound,
  Lock,
  Unlock,
  Eye,
  Search,
  Filter,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Share2,
  Copy,
  Check,
  X
} from 'lucide-react';
import { SALES_INVOICES_150, SalesTaxInvoice } from '../data/salesInvoices150Data';
import { TaxInvoiceModal } from './TaxInvoiceModal';
import { downloadSalesRegisterExcel } from '../utils/vatExcelGenerator';

export interface VatInvoiceItem {
  id: string;
  miti: string;
  invoiceNo: string;
  partyName: string;
  partyPan: string;
  particulars: string;
  taxableAmount: number;
  exemptAmount: number;
  vatAmount: number;
  totalAmount: number;
  paymentType: 'Credit' | 'Bank' | 'Cash';
  resourceNote?: string;
}

export const VatRegistersSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchase' | 'reconciliation'>('sales');

  // =========================================================================
  // TRAINER PASSCODE & STUDENT DOWNLOAD SECURITY STATE
  // =========================================================================
  const [trainerPasscodeMaster] = useState('TRAINER@2083');
  const [publishedCode, setPublishedCode] = useState('VAT-2083-EXCEL');
  const [isCodePublished, setIsCodePublished] = useState(true);
  const [allowDirectDownload, setAllowDirectDownload] = useState(false);

  // Student Unlock state in session
  const [studentUnlocked, setStudentUnlocked] = useState(false);

  // Modals state
  const [showStudentPasscodeModal, setShowStudentPasscodeModal] = useState(false);
  const [pendingDownloadAction, setPendingDownloadAction] = useState<'excel' | 'print'>('excel');
  const [studentInputCode, setStudentInputCode] = useState('');
  const [studentCodeError, setStudentCodeError] = useState(false);

  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [trainerInputCode, setTrainerInputCode] = useState('');
  const [trainerAuthenticated, setTrainerAuthenticated] = useState(false);
  const [trainerError, setTrainerError] = useState(false);
  const [newCodeDraft, setNewCodeDraft] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Tax Invoice Viewer Modal
  const [activeModalInvoice, setActiveModalInvoice] = useState<SalesTaxInvoice | null>(null);

  // Global ESC key listener to exit any active modal
  useEffect(() => {
    const handleGlobalEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showStudentPasscodeModal) setShowStudentPasscodeModal(false);
        if (showTrainerModal) setShowTrainerModal(false);
      }
    };
    window.addEventListener('keydown', handleGlobalEsc);
    return () => window.removeEventListener('keydown', handleGlobalEsc);
  }, [showStudentPasscodeModal, showTrainerModal]);

  // =========================================================================
  // 150 SALES INVOICES REGISTER STATE
  // =========================================================================
  const [salesSearch, setSalesSearch] = useState('');
  const [salesFilterTerm, setSalesFilterTerm] = useState<string>('All');
  const [salesPage, setSalesPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Filtered 150 Sales Invoices
  const filteredSalesInvoices = useMemo(() => {
    return SALES_INVOICES_150.filter((inv) => {
      const matchTerm = salesFilterTerm === 'All' || inv.termsOfPayment === salesFilterTerm;
      if (!matchTerm) return false;
      if (!salesSearch.trim()) return true;
      const s = salesSearch.toLowerCase();
      return (
        inv.invoiceNo.toLowerCase().includes(s) ||
        inv.customerName.toLowerCase().includes(s) ||
        inv.customerPan.toLowerCase().includes(s) ||
        inv.date.toLowerCase().includes(s) ||
        inv.particulars.toLowerCase().includes(s)
      );
    });
  }, [salesSearch, salesFilterTerm]);

  // Paginated Invoices
  const totalSalesPages = Math.ceil(filteredSalesInvoices.length / pageSize) || 1;
  const paginatedSalesInvoices = useMemo(() => {
    const start = (salesPage - 1) * pageSize;
    return filteredSalesInvoices.slice(start, start + pageSize);
  }, [filteredSalesInvoices, salesPage, pageSize]);

  // Total sums of all 150 invoices
  const salesTotals = useMemo(() => {
    return SALES_INVOICES_150.reduce(
      (acc, item) => ({
        taxable: acc.taxable + item.taxableAmount,
        exempt: acc.exempt + item.exemptAmount,
        vat: acc.vat + item.vatAmount,
        total: acc.total + item.grandTotal,
      }),
      { taxable: 0, exempt: 0, vat: 0, total: 0 }
    );
  }, []);

  // Purchase Register Invoices
  const [purchaseInvoices] = useState<VatInvoiceItem[]>([
    {
      id: 'pur-1',
      miti: '2082/04/05',
      invoiceNo: 'TI-8839',
      partyName: 'Himalayan Wholesale Distributors Pvt. Ltd.',
      partyPan: '301294851',
      particulars: 'Trading Merchandise (Textile Goods)',
      taxableAmount: 150000,
      exemptAmount: 0,
      vatAmount: 19500,
      totalAmount: 169500,
      paymentType: 'Credit',
      resourceNote: 'Tax Invoice Attached (Paper Verified)',
    },
    {
      id: 'pur-2',
      miti: '2082/04/12',
      invoiceNo: 'SBD-4410',
      partyName: 'Sipradi Machinery & Spares Hub',
      partyPan: '600192843',
      particulars: 'Workshop Tool Kit & Capital Spares',
      taxableAmount: 80000,
      exemptAmount: 0,
      vatAmount: 10400,
      totalAmount: 90400,
      paymentType: 'Bank',
      resourceNote: 'Capital Asset Purchase - Full ITC Claimed',
    },
    {
      id: 'pur-3',
      miti: '2082/04/18',
      invoiceNo: 'KTM-1029',
      partyName: 'Nepal Agricultural Cooperative Union',
      partyPan: '100492819',
      particulars: 'Basic Agro Raw Grains (Exempt Goods)',
      taxableAmount: 0,
      exemptAmount: 45000,
      vatAmount: 0,
      totalAmount: 45000,
      paymentType: 'Cash',
      resourceNote: 'VAT Schedule 1 Exempt Goods',
    },
    {
      id: 'pur-4',
      miti: '2082/04/24',
      invoiceNo: 'NPM-7721',
      partyName: 'Nepal Paper & Packaging Mill',
      partyPan: '304918274',
      particulars: 'Corrugated Packing Cartons',
      taxableAmount: 35000,
      exemptAmount: 0,
      vatAmount: 4550,
      totalAmount: 39550,
      paymentType: 'Credit',
      resourceNote: 'Production Packaging Material',
    },
  ]);

  const purchaseTotals = useMemo(() => {
    return purchaseInvoices.reduce(
      (acc, item) => ({
        taxable: acc.taxable + item.taxableAmount,
        exempt: acc.exempt + item.exemptAmount,
        vat: acc.vat + item.vatAmount,
        total: acc.total + item.totalAmount,
      }),
      { taxable: 0, exempt: 0, vat: 0, total: 0 }
    );
  }, [purchaseInvoices]);

  const netVatPayable = salesTotals.vat - purchaseTotals.vat;

  // Handlers for Download & Unlock
  const handleTriggerExcelDownload = () => {
    if (allowDirectDownload || studentUnlocked) {
      downloadSalesRegisterExcel(SALES_INVOICES_150);
    } else {
      setPendingDownloadAction('excel');
      setStudentInputCode('');
      setStudentCodeError(false);
      setShowStudentPasscodeModal(true);
    }
  };

  const handleTriggerPrintUnlock = () => {
    if (allowDirectDownload || studentUnlocked) {
      window.print();
    } else {
      setPendingDownloadAction('print');
      setStudentInputCode('');
      setStudentCodeError(false);
      setShowStudentPasscodeModal(true);
    }
  };

  const handleVerifyStudentCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCodePublished && studentInputCode.trim().toUpperCase() === publishedCode.trim().toUpperCase()) {
      setStudentUnlocked(true);
      setShowStudentPasscodeModal(false);
      if (pendingDownloadAction === 'excel') {
        downloadSalesRegisterExcel(SALES_INVOICES_150);
      } else {
        window.print();
      }
    } else {
      setStudentCodeError(true);
    }
  };

  const handleTrainerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (trainerInputCode === trainerPasscodeMaster) {
      setTrainerAuthenticated(true);
      setTrainerError(false);
      setNewCodeDraft(publishedCode);
    } else {
      setTrainerError(true);
    }
  };

  const handlePublishNewCode = () => {
    if (newCodeDraft.trim()) {
      setPublishedCode(newCodeDraft.trim().toUpperCase());
      setIsCodePublished(true);
      setCopiedCode(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(publishedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Controls Bar: Tab Switcher & Trainer Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-slate-200 rounded-2xl p-2.5 shadow-2xs gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'sales'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Sales Register (बिक्री खाता)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono font-bold">
              150 Invoices
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('purchase')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'purchase'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Purchase Register (खरीद खाता)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-mono">
              {purchaseInvoices.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reconciliation')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'reconciliation'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Monthly VAT Return (Anusuchi 10)</span>
          </button>
        </div>

        {/* Trainer Access & Passcode Trigger */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              setTrainerError(false);
              setShowTrainerModal(true);
            }}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-2xs"
            title="Trainer Passcode & Security Settings (Trainer Only)"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-700" />
            <span>Trainer Controls</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-200/70 text-amber-900 rounded font-bold">
              Passcode Protected
            </span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* SECTION 1: SALES REGISTER (150 INVOICES - NO SUMMARY BOX) */}
      {/* ===================================================================== */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {/* Header Card (Total Output VAT Collected Box completely removed as requested) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  IRD Format • Anusuchi 9 (अनुसूची ९)
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  G. Shrestha & Associates • 150 Invoices Loaded
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1.5">
                Sales Register (बिक्री खाता — All 150 Tax Invoices)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-2xl">
                Official billing book issued by <strong>G. SHRESTHA & ASSOCIATES (VAT No. 123456789)</strong> from FY 2082/04/01 to FY 2083/04/26. Every transaction corresponds to an authentic sequential tax invoice.
              </p>
            </div>

            {/* Action Buttons: Download Excel (Passcode Protected) & View Invoices */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleTriggerExcelDownload}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                title="Download 150-Invoice Excel File (.xlsx)"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                <span>Download Sales Register (Excel)</span>
                {studentUnlocked || allowDirectDownload ? (
                  <Unlock className="w-3.5 h-3.5 text-emerald-200" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-emerald-200" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveModalInvoice(SALES_INVOICES_150[0])}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                title="Browse & View All 150 Tax Invoices"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Browse All 150 Invoices</span>
              </button>
            </div>
          </div>

          {/* Search, Filter & Pagination Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={salesSearch}
                  onChange={(e) => {
                    setSalesSearch(e.target.value);
                    setSalesPage(1);
                  }}
                  placeholder="Search invoice #, customer, PAN..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Payment Terms Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {['All', 'Cash', 'Cheque', 'CIPS', 'Credit'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSalesFilterTerm(term);
                      setSalesPage(1);
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                      salesFilterTerm === term
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between md:justify-end gap-3 text-slate-600 font-mono text-[11px]">
              <span>
                Showing {Math.min(filteredSalesInvoices.length, (salesPage - 1) * pageSize + 1)} -{' '}
                {Math.min(filteredSalesInvoices.length, salesPage * pageSize)} of{' '}
                {filteredSalesInvoices.length} Invoices
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={salesPage <= 1}
                  onClick={() => setSalesPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold text-slate-800">
                  {salesPage} / {totalSalesPages}
                </span>
                <button
                  type="button"
                  disabled={salesPage >= totalSalesPages}
                  onClick={() => setSalesPage((p) => Math.min(totalSalesPages, p + 1))}
                  className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setSalesPage(1);
                }}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-sans text-xs"
              >
                <option value={15}>15 / page</option>
                <option value={30}>30 / page</option>
                <option value={50}>50 / page</option>
                <option value={150}>All 150</option>
              </select>
            </div>
          </div>

          {/* Table Container for 150 Invoices */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-[11px] border-b border-slate-800">
                    <th className="py-3 px-3 w-12 text-center">Inv #</th>
                    <th className="py-3 px-3 whitespace-nowrap">Date (मिति)</th>
                    <th className="py-3 px-3.5 min-w-44">Customer / Buyer Name</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">Buyer PAN</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">Payment</th>
                    <th className="py-3 px-3.5">Particulars of Service</th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">Taxable Amount (रू.)</th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">13% VAT (रू.)</th>
                    <th className="py-3 px-3 text-right whitespace-nowrap">TDS 1.5% (रू.)</th>
                    <th className="py-3 px-3.5 text-right font-black whitespace-nowrap">Grand Total (रू.)</th>
                    <th className="py-3 px-3 text-center">Tax Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-mono text-[11px]">
                  {paginatedSalesInvoices.map((inv) => {
                    const tds15 = (inv.taxableAmount * 0.015).toFixed(2);
                    return (
                      <tr key={inv.id} className="hover:bg-emerald-50/40 transition">
                        <td className="py-2.5 px-3 font-extrabold text-blue-700 text-center">
                          {inv.invoiceNo}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-700 whitespace-nowrap">
                          {inv.date}
                        </td>
                        <td className="py-2.5 px-3.5 font-sans font-semibold text-slate-900">
                          <div>{inv.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {inv.customerAddress}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-600 whitespace-nowrap">
                          {inv.customerPan}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.termsOfPayment === 'Cheque'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : inv.termsOfPayment === 'CIPS'
                                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                : inv.termsOfPayment === 'Cash'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {inv.termsOfPayment}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-sans text-slate-600 text-[11px] max-w-56 truncate">
                          {inv.particulars}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                          {inv.taxableAmount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-emerald-700">
                          {inv.vatAmount.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500 font-medium">
                          {Number(tds15).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-black text-slate-950">
                          {inv.grandTotal.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => setActiveModalInvoice(inv)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-[10px] font-bold rounded-lg transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                            title="View official Tax Invoice (Esc to exit)"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Invoice #{inv.invoiceNo}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* 150 Invoices Full Summary Totals Footer */}
                <tfoot>
                  <tr className="bg-slate-100 font-mono font-black text-slate-900 text-xs border-t-2 border-slate-300">
                    <td colSpan={6} className="py-3 px-3.5 font-sans font-bold uppercase text-slate-700">
                      Total 150 Invoices Summary (कुल १५० बीजक जम्मा रकम):
                    </td>
                    <td className="py-3 px-3 text-right text-slate-900">
                      Rs. {salesTotals.taxable.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-700 font-black">
                      Rs. {salesTotals.vat.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600">
                      Rs. {Math.round(salesTotals.taxable * 0.015).toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-right text-emerald-900 font-black text-sm">
                      Rs. {salesTotals.total.toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* =================================================================== */}
          {/* SAMPLE JOURNAL ENTRY BELOW SALES REGISTER BOOK */}
          {/* =================================================================== */}
          <div className="bg-gradient-to-br from-emerald-50/70 to-slate-50 border-2 border-emerald-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  JV
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900">
                    Official Double-Entry Journal for 150 Sales Register Transactions
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    Standard Sales Voucher with 13% Output Tax Liability & 1.5% Service TDS Withholding
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-white text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200 self-start sm:self-auto">
                Sales Voucher (Outward Tax Invoice)
              </span>
            </div>

            {/* Formatted Double-Entry Voucher Table */}
            <div className="bg-white rounded-xl border border-emerald-200 p-4 font-mono text-xs shadow-2xs space-y-2.5">
              <div className="grid grid-cols-12 text-slate-500 font-bold border-b border-slate-100 pb-1.5 text-[11px]">
                <div className="col-span-8">Particulars (खाता विवरण)</div>
                <div className="col-span-2 text-right">Debit (Dr.) रू.</div>
                <div className="col-span-2 text-right">Credit (Cr.) रू.</div>
              </div>

              {/* Debit Debtors / Bank Net of TDS */}
              <div className="grid grid-cols-12 text-slate-900 font-bold items-center">
                <div className="col-span-8">
                  <span>Customer Debtors A/c / Bank A/c</span>
                  <span className="text-[11px] text-slate-400 block font-normal font-sans">
                    [Gross invoice receivable less 1.5% client TDS deduction]
                  </span>
                </div>
                <div className="col-span-2 text-right font-black text-slate-900">
                  {(salesTotals.total - Math.round(salesTotals.taxable * 0.015)).toLocaleString()}
                </div>
                <div className="col-span-2 text-right text-slate-400">—</div>
              </div>

              {/* Debit Advance TDS 1.5% Asset */}
              <div className="grid grid-cols-12 text-blue-700 font-bold items-center">
                <div className="col-span-8">
                  <span>Advance TDS Receivable A/c (Sec 88(1)(4) @ 1.5%)</span>
                  <span className="text-[11px] text-blue-500 block font-normal font-sans">
                    [Tax deducted by institutional clients under IRD ETDS Portal; Asset]
                  </span>
                </div>
                <div className="col-span-2 text-right font-black text-blue-700">
                  {Math.round(salesTotals.taxable * 0.015).toLocaleString()}
                </div>
                <div className="col-span-2 text-right text-slate-400">—</div>
              </div>

              {/* Credit Sales Revenue */}
              <div className="grid grid-cols-12 text-slate-800 font-bold items-center pt-1 border-t border-slate-100">
                <div className="col-span-8 pl-6">
                  <span>To Professional Audit & Advisory Revenue A/c</span>
                  <span className="text-[11px] text-slate-400 block font-normal font-sans">
                    [Total taxable service fees earned across 150 invoices]
                  </span>
                </div>
                <div className="col-span-2 text-right text-slate-400">—</div>
                <div className="col-span-2 text-right font-black text-slate-900">
                  {salesTotals.taxable.toLocaleString()}
                </div>
              </div>

              {/* Credit Output VAT */}
              <div className="grid grid-cols-12 text-emerald-800 font-bold items-center">
                <div className="col-span-8 pl-6">
                  <span>To VAT Payable A/c (Output Tax Liability 13%)</span>
                  <span className="text-[11px] text-emerald-600 block font-normal font-sans">
                    [13% tax collected on behalf of Government; Current Liability]
                  </span>
                </div>
                <div className="col-span-2 text-right text-slate-400">—</div>
                <div className="col-span-2 text-right font-black text-emerald-700">
                  {salesTotals.vat.toLocaleString()}
                </div>
              </div>

              {/* Narration */}
              <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 font-sans italic border border-slate-200 mt-2">
                <strong>(Narration:</strong> Being professional services billed under sequential Tax Invoices (001 to 150) with 13% Value Added Tax recorded in Sales Register as per IRD Anusuchi 9).
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 font-sans">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Accounting Rule:</strong> Output VAT collected is <strong>NOT</strong> business income. It is credited directly to <strong>VAT Payable (Current Liability)</strong> because it must be remitted to the IRD by the 25th of the following month.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 2: PURCHASE REGISTER */}
      {/* ===================================================================== */}
      {activeTab === 'purchase' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  IRD Format • Anusuchi 8 (अनुसूची ८)
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Input Tax Credit (ITC)
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1.5">
                Purchase Register (खरीद खाता)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-2xl">
                Statutory register mandated under Section 16 of the Nepal Value Added Tax Act 2052. All domestic purchases, imports, and capital asset acquisitions must be entered chronologically.
              </p>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold text-[11px] border-b border-slate-800">
                    <th className="py-3 px-3.5">Miti / Date</th>
                    <th className="py-3 px-3">Invoice No.</th>
                    <th className="py-3 px-3.5">Supplier Name</th>
                    <th className="py-3 px-3 text-center">PAN No.</th>
                    <th className="py-3 px-3">Particulars / Goods</th>
                    <th className="py-3 px-3 text-right">Taxable (रू.)</th>
                    <th className="py-3 px-3 text-right">13% Input VAT (रू.)</th>
                    <th className="py-3 px-3 text-right">Exempt (रू.)</th>
                    <th className="py-3 px-3.5 text-right font-black">Gross Total (रू.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-mono text-[11px]">
                  {purchaseInvoices.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition">
                      <td className="py-3 px-3.5 font-bold text-slate-700 whitespace-nowrap">
                        {item.miti}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-blue-700 whitespace-nowrap">
                        {item.invoiceNo}
                      </td>
                      <td className="py-3 px-3.5 font-sans font-semibold text-slate-900 min-w-44">
                        <div>{item.partyName}</div>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 whitespace-nowrap">
                        {item.partyPan}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-600 text-[11px] max-w-48 truncate">
                        {item.particulars}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-800">
                        {item.taxableAmount > 0 ? item.taxableAmount.toLocaleString() : '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-blue-700">
                        {item.vatAmount > 0 ? item.vatAmount.toLocaleString() : '—'}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500">
                        {item.exemptAmount > 0 ? item.exemptAmount.toLocaleString() : '—'}
                      </td>
                      <td className="py-3 px-3.5 text-right font-black text-slate-950">
                        {item.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-mono font-black text-slate-900 text-xs border-t-2 border-slate-300">
                    <td colSpan={5} className="py-3 px-3.5 font-sans font-bold uppercase text-slate-700">
                      Total Purchase Register Accumulation (जम्मा खरीद हिसाब):
                    </td>
                    <td className="py-3 px-3 text-right text-slate-900">
                      Rs. {purchaseTotals.taxable.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-blue-700 font-black">
                      Rs. {purchaseTotals.vat.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600">
                      Rs. {purchaseTotals.exempt.toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-right text-emerald-800 font-black text-sm">
                      Rs. {purchaseTotals.total.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SECTION 3: MONTHLY VAT SET-OFF */}
      {/* ===================================================================== */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                  Month-End Closing • Anusuchi 10 (अनुसूची १०)
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1.5">
                  Monthly VAT Return & Set-Off Mechanics (कर मिलान विवरण)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Offsetting Input Tax Credit (ITC) against Output Tax Liability across all 150 sales invoices.
                </p>
              </div>

              <span className="text-xs font-mono font-bold bg-purple-50 text-purple-800 px-3 py-1 rounded-xl border border-purple-200 self-start sm:self-auto shrink-0">
                Deposit Code: 11111
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800">
                  Total 150 Invoices Output VAT (A)
                </span>
                <div className="text-xl font-black font-mono text-emerald-950">
                  Rs. {salesTotals.vat.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500">Collected from clients on 150 invoices</p>
              </div>

              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-800">
                  Less: Input VAT Credit (B)
                </span>
                <div className="text-xl font-black font-mono text-blue-950">
                  - Rs. {purchaseTotals.vat.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500">Paid to vendors via Purchase Register</p>
              </div>

              <div
                className={`p-4 rounded-xl border space-y-1 ${
                  netVatPayable >= 0
                    ? 'bg-purple-50 border-purple-200 text-purple-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <span className="text-[10px] uppercase font-bold">
                  {netVatPayable >= 0 ? 'Net VAT Remittance to IRD (A - B)' : 'VAT Credit Carried Forward'}
                </span>
                <div className="text-xl font-black font-mono">
                  Rs. {Math.abs(netVatPayable).toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-600">
                  Deposit to IRD Revenue Code 11111 by 25th
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: STUDENT PASSCODE REQUIRED TO DOWNLOAD (STRICT TRAINER CODE) */}
      {/* ===================================================================== */}
      {showStudentPasscodeModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowStudentPasscodeModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowStudentPasscodeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-13 h-13 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                Trainer Passcode Required
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This official dataset (150-Invoice Sales Register & Tax Invoices) is protected for classroom training.
              </p>
            </div>

            <form onSubmit={handleVerifyStudentCode} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
                  Enter Session Passcode
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={studentInputCode}
                  onChange={(e) => {
                    setStudentInputCode(e.target.value);
                    setStudentCodeError(false);
                  }}
                  placeholder="Enter Passcode..."
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-center font-mono font-black text-base uppercase tracking-widest focus:bg-white focus:outline-hidden focus:border-emerald-600 transition"
                />
                {studentCodeError && (
                  <p className="text-xs text-rose-600 font-bold text-center mt-2 flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Invalid passcode. Please obtain the active code from your trainer.</span>
                  </p>
                )}
              </div>

              {/* Passcode strictly with trainer info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Classroom Rule:</strong> The download passcode is held exclusively by your trainer. When the trainer announces/publishes the code, enter it here to unlock downloads.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStudentPasscodeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel (Esc)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock & Download</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: TRAINER CONTROL PANEL (WHERE ONLY TRAINER HAS PASSCODE) */}
      {/* ===================================================================== */}
      {showTrainerModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTrainerModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Trainer Control Center
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Confidential trainer portal to manage and publish student download codes.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowTrainerModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!trainerAuthenticated ? (
              /* Trainer Authorization Screen */
              <form onSubmit={handleTrainerLogin} className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800">
                    Enter Trainer Master Passcode:
                  </span>
                  <input
                    type="password"
                    required
                    autoFocus
                    value={trainerInputCode}
                    onChange={(e) => {
                      setTrainerInputCode(e.target.value);
                      setTrainerError(false);
                    }}
                    placeholder="Enter Master Key (TRAINER@2083)"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                  />
                  {trainerError && (
                    <p className="text-xs text-rose-600 font-bold">
                      Invalid master passcode. Master key is: <strong>TRAINER@2083</strong>
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500">
                    Authorized instructors: Use master key <code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-800 font-bold">TRAINER@2083</code> to open passcode controls.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTrainerModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Cancel (Esc)
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Authorize as Trainer</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Trainer Active Management Dashboard */
              <div className="space-y-5">
                {/* Active Code Card */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold text-amber-900 tracking-wider">
                      Student Download Code (Trainer Copy)
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCodePublished
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {isCodePublished ? 'Published & Active' : 'Unpublished (Access Revoked)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                    <div className="font-mono text-xl font-black tracking-widest text-slate-900">
                      {publishedCode}
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy for Students</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Change Passcode */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Set & Publish New Student Code:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCodeDraft}
                      onChange={(e) => setNewCodeDraft(e.target.value.toUpperCase())}
                      placeholder="e.g. VAT-BATCH-2083"
                      className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl font-mono uppercase font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/20"
                    />
                    <button
                      type="button"
                      onClick={handlePublishNewCode}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs"
                    >
                      Publish Code
                    </button>
                  </div>
                </div>

                {/* Security Toggles */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <div className="font-bold text-slate-900">Publish Code Access</div>
                      <div className="text-[11px] text-slate-500">
                        When enabled, students entering the published code can download immediately.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isCodePublished}
                      onChange={(e) => setIsCodePublished(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                    <div>
                      <div className="font-bold text-slate-900">Open Direct Access (Bypass Code)</div>
                      <div className="text-[11px] text-slate-500">
                        Allow all students to download without entering a passcode.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowDirectDownload}
                      onChange={(e) => setAllowDirectDownload(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowTrainerModal(false)}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    Done & Close (Esc)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: TAX INVOICE PREVIEW MODAL (WITH ESC EXIT & 150 INVOICES JUMP) */}
      {/* ===================================================================== */}
      {activeModalInvoice && (
        <TaxInvoiceModal
          invoice={activeModalInvoice}
          onClose={() => setActiveModalInvoice(null)}
          onSelectInvoice={(inv) => setActiveModalInvoice(inv)}
          onNext={() => {
            const nextIdx = Math.min(
              SALES_INVOICES_150.length - 1,
              activeModalInvoice.invoiceNum
            );
            setActiveModalInvoice(SALES_INVOICES_150[nextIdx]);
          }}
          onPrev={() => {
            const prevIdx = Math.max(0, activeModalInvoice.invoiceNum - 2);
            setActiveModalInvoice(SALES_INVOICES_150[prevIdx]);
          }}
          totalInvoices={SALES_INVOICES_150.length}
          isUnlocked={studentUnlocked || allowDirectDownload}
          onRequestUnlock={() => {
            setPendingDownloadAction('print');
            setShowStudentPasscodeModal(true);
          }}
        />
      )}
    </div>
  );
};
