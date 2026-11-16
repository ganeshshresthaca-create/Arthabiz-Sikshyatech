import React, { useState, useMemo } from 'react';
import { Copy, Check, Building2, HelpCircle, Layers } from 'lucide-react';
import { IRD_REVENUE_CODES, IrdRevenueCodeItem } from '../data/irdRevenueCodes';

export const IrdRevenueCodesTable: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Revenue Codes (सबै ४२ शीर्षकहरू)' },
    { id: 'income_individual', label: 'Individual & Employment TDS (१११११ - ११११९ पारिश्रमिक तथा व्यक्तिगत)' },
    { id: 'corporate', label: 'Corporate Income Tax (१११२० - १११२९ निकाय तथा कम्पनी)' },
    { id: 'investment_rent', label: 'Rent, Interest & Dividend TDS (१११३१ - १११३९ बहाल, ब्याज तथा लाभांश)' },
    { id: 'social_security', label: 'Social Security Fund 1% (११२०० - ११२११ सामाजिक सुरक्षा कर)' },
    { id: 'service_luxury', label: 'Service & Education Fees (११४१२ - १४२१५ शिक्षा, स्वास्थ्य तथा विलासिता)' },
    { id: 'vat', label: 'Value Added Tax - VAT (३३३११ - ३३३१७ मूल्य अभिवृद्धि कर)' },
    { id: 'excise', label: 'Excise Duty (३३३३१ - ३३३३४ अन्तःशुल्क)' },
  ];

  const filteredCodes = useMemo(() => {
    return IRD_REVENUE_CODES.filter((item) => {
      if (selectedCategory === 'all') return true;
      return item.category === selectedCategory;
    });
  }, [selectedCategory]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Table Header Section with Dropdown Selection (No search box, No horizontal button scrolling) */}
      <div className="border-b border-slate-200 pb-5 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              आन्तरिक राजस्व विभाग (IRD Official)
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              FY 2083/84
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            <span>राजस्व शीर्षक तथा धरौटी/कर दाखिला खाता संकेत</span>
            <span className="text-xs font-normal text-slate-500 hidden sm:inline">(TDS & Tax Deposit Account Codes)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            नेपाल सरकार आन्तरिक राजस्व विभागद्वारा निर्धारित विभिन्न प्रकृतिका कर, अग्रिम कर कट्टी (TDS), मूल्य अभिवृद्धि कर तथा अन्तःशुल्क दाखिला गर्ने आधिकारिक राजस्व संकेतहरू।
          </p>
        </div>

        {/* Dropdown Selection for TDS Type (Replaces horizontal click buttons so no left/right scrolling is needed) */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Layers className="w-4 h-4 text-blue-600 shrink-0" />
            <label htmlFor="tds-type-dropdown">
              राजस्व शीर्षक प्रकार छनोट गर्नुहोस् (Select TDS / Revenue Type):
            </label>
          </div>

          <div className="relative w-full sm:w-80">
            <select
              id="tds-type-dropdown"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-white border-2 border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs transition cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Official Revenue Code Table matching User's Uploaded PDF Formatting */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-semibold text-[11px]">
              <th className="py-3 px-3 w-14 text-center border-r border-slate-700">सि.नं.</th>
              <th className="py-3 px-3.5 w-32 border-r border-slate-700">राजस्व संकेत (Code)</th>
              <th className="py-3 px-4 w-72 border-r border-slate-700">राजस्व आधार शीर्षक, मूल शीर्षक, शीर्षक तथा उपशीर्षक</th>
              <th className="py-3 px-3 w-28 text-center border-r border-slate-700">पुरानो संकेत</th>
              <th className="py-3 px-4">व्याख्या (Coverage & Description)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 font-sans">
            {filteredCodes.map((item) => (
              <tr key={item.sn} className="hover:bg-blue-50/40 transition">
                {/* Serial Number */}
                <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-500 border-r border-slate-200">
                  <span className="font-bold">{item.snNepali}</span>
                  <span className="block text-[10px] text-slate-400">({item.sn})</span>
                </td>

                {/* Revenue Code with Instant Copy */}
                <td className="py-2.5 px-3.5 border-r border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-extrabold text-sm text-blue-700 tracking-wider">
                      {item.code}
                    </span>
                    <button
                      onClick={() => handleCopy(item.code)}
                      className="p-1 text-slate-400 hover:text-blue-700 hover:bg-blue-100 rounded transition cursor-pointer"
                      title={`Copy ${item.code}`}
                    >
                      {copiedCode === item.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    नेपाली: {item.codeNepali}
                  </span>
                </td>

                {/* Revenue Title */}
                <td className="py-2.5 px-4 font-semibold text-slate-900 border-r border-slate-200 leading-snug">
                  {item.title}
                </td>

                {/* Old Code */}
                <td className="py-2.5 px-3 text-center font-mono text-slate-600 border-r border-slate-200 bg-slate-50/50">
                  {item.oldCode !== '-' ? (
                    <>
                      <span className="font-bold text-xs">{item.oldCode}</span>
                      <span className="block text-[10px] text-slate-400">({item.oldCodeNepali})</span>
                    </>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>

                {/* Explanation / Scope */}
                <td className="py-2.5 px-4 text-[11px] sm:text-xs text-slate-700 leading-relaxed">
                  {item.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Practical Voucher Advice Footer */}
      <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex items-start gap-3">
        <HelpCircle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">
            महत्वपूर्ण लेखा टिप्पणी (Important Practical Accounting Note for TDS Deposits):
          </p>
          <p className="text-[11px] leading-relaxed text-amber-800">
            कम्पनी तथा संस्थाले काटेको अग्रिम कर (TDS) नेपाल सरकारको राजस्व खातामा दाखिला गर्दा सम्बन्धित प्रकृतिको राजस्व संकेत अनिवार्य रूपमा उल्लेख गर्नुपर्दछ। उदाहरणका लागि, कर्मचारीको पारिश्रमिकबाट कट्टी गरिएको कर दाखिला गर्दा <strong>११११२</strong>, घरबहाल वा उपकरण भाडाको कर दाखिला गर्दा <strong>१११३१</strong>, र १% सामाजिक सुरक्षा कर दाखिला गर्दा <strong>११२११</strong> राजस्व संकेत प्रयोग गरिन्छ।
          </p>
        </div>
      </div>
    </div>
  );
};
