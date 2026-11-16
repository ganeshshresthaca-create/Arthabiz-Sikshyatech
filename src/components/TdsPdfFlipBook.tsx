import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  FileText,
  Building2,
  ShieldCheck,
  BookText,
  ExternalLink
} from 'lucide-react';
import { NepalEmblem } from './NepalEmblem';

interface Props {
  onOpenCalculator?: () => void;
}

export const TdsPdfFlipBook: React.FC<Props> = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode] = useState<'single' | 'double'>('single');
  const [zoomLevel] = useState<number>(100);
  const [isFullscreen] = useState<boolean>(false);
  const [, setCopiedText] = useState<string | null>(null);

  const totalPages = 6;

  // Keyboard navigation for page flip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, viewMode]);

  const handleNextPage = () => {
    if (viewMode === 'double') {
      setCurrentPage((prev) => Math.min(prev + 2, totalPages));
    } else {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
  };

  const handlePrevPage = () => {
    if (viewMode === 'double') {
      setCurrentPage((prev) => Math.max(prev - 2, 1));
    } else {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Render Page Content exactly matching the Official Nepal IRD PDF
  const renderPageContent = (pageNum: number) => {
    switch (pageNum) {
      case 1:
        return (
          <div className="space-y-4">
            {/* Page 1 Official Heading */}
            <div className="text-center space-y-1 pb-2">
              <div className="flex justify-center pb-1">
                <NepalEmblem className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-xs" />
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-wide">
                नेपाल सरकार
              </h2>
              <h3 className="text-sm font-bold text-slate-900">
                अर्थ मन्त्रालय
              </h3>
              <h4 className="text-sm font-black text-slate-900">
                आन्तरिक राजस्व विभाग
              </h4>
              <p className="text-xs font-semibold text-slate-800 leading-snug pt-1 px-4">
                आयकर ऐन, २०५८ को दफा ८७, ८८, ८८क. र ८९ बमोजिम भुक्तानीमा अग्रिम कर कट्टी तथा दफा ९५क. बमोजिम अग्रिम कर असुली सम्बन्धी व्यवस्था
              </p>
              <p className="text-xs font-bold text-slate-900">
                (२०८३/०८४)
              </p>
            </div>

            {/* Table */}
            <div className="border border-slate-900 text-xs">
              <div className="grid grid-cols-12 bg-slate-100 font-bold border-b border-slate-900 text-slate-900 text-center">
                <div className="col-span-2 py-2 px-1 border-r border-slate-900 flex items-center justify-center">
                  आकर्षित हुने दफा
                </div>
                <div className="col-span-8 py-2 px-2 border-r border-slate-900 flex items-center justify-center">
                  भुक्तानीमा कर कट्टी हुने भुक्तानी
                </div>
                <div className="col-span-2 py-2 px-1 flex items-center justify-center">
                  भुक्तानीमा कर कट्टीको दर %
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-900 text-slate-900 leading-tight">
                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८७ (१)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    रोजगारीको आय (पारिश्रमिक)
                  </div>
                  <div className="col-span-2 p-2 text-center text-[11px] font-medium flex items-center justify-center">
                    <a
                      href="https://ird.gov.np/content/13609/tax-rate-for-natural-persons-for-the/#flipbook-flipbookContainer/1/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-950 underline font-semibold transition hover:scale-105 inline-flex items-center justify-center gap-0.5"
                      title="नेपाल सरकार, आन्तरिक राजस्व विभाग - प्राकृतिक व्यक्तिको लागि लागू हुने करको दर (आधिकारिक राजपत्र)"
                    >
                      <span>अनुसुची १ को दफा १ मा तोकिएको दरले</span>
                      <ExternalLink className="w-3 h-3 inline shrink-0" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपालमा स्रोत भएको ब्याज भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपालमा स्रोत भएको प्राकृतिक स्रोत, रोयल्टी, सेवा शुल्क, कमिशन, बिक्री बोनस, अवकाश भुक्तानी आदि।
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)
                    <br />
                    ९२(१)(ज)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    बैठक भत्ता, पटके रूपमा गरिएको अध्यापन गराए बापत, प्रश्नपत्र तयार गरे वा उत्तर पुस्तिका जाँच गरेबापतको भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)(१)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपाल सरकारबाट भएको अवकाश भुक्तानी वा स्वीकृत अवकाश कोषबाट भएको योगदानमा आधारित अवकाश भुक्तानीबाट रू. ५,००,०००/- वा भुक्तानी रकमको ५० प्रतिशतमध्ये जुन बढी हुन्छ सो घटाई बाँकी रहने भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)(२)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    बासिन्दा रोजगार कम्पनीले गैर बासिन्दा व्यक्तिलाई भुक्तानी गरेको कमिशन
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)(३)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    वायुयानको लिज (पट्टा) बापतको रकम भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १०
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)(४)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    मूल्य अभिवृद्धि करमा दर्ता भएको सेवाप्रदायक बासिन्दा व्यक्तिलाई भुक्तानी गरेको सेवा शुल्कमा वा मूल्य अभिवृद्धि कर छुटको कारोबार गर्ने बासिन्दा निकायलाई भुक्तानी गरेको सेवा शुल्क
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १.५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)(५)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    बासिन्दा व्यक्तिले नेपालमा स्रोत भएको भाडा भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १०
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(१)(५)(क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    मूल्य अभिवृद्धि करमा दर्ता भई सवारी साधन भाडामा दिने व्यवसाय गर्ने व्यक्तिलाई त्यस्तो सवारी साधनको भाडा बापत भुक्तानी गर्ने रकम
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १.५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)(६)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900 space-y-1">
                    <div>सामूहिक लगानी कोष (म्युचुअल फण्ड) बाट वितरण गरिने प्रतिफल</div>
                    <div className="pl-3">- प्राकृतिक व्यक्तिलाई</div>
                    <div className="pl-3">- अन्य व्यक्तिलाई</div>
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex flex-col justify-end space-y-1">
                    <div>५</div>
                    <div>१५</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="border border-slate-900 text-xs">
              <div className="divide-y divide-slate-900 text-slate-900 leading-tight">
                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)(७)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    बासिन्दा व्यक्तिले भूउपग्रह, ब्याण्डविथ, अप्टिकल फाइबर, दूरसञ्चार सम्बन्धी उपकरण वा विद्युत प्रशारण लाइन प्रयोग गरे बापतको भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १०
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)(८)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900 space-y-1">
                    <div>ढुवानी सेवा बापतको तथा ढुवानी साधन भाडामा दिए बापतको भुक्तानी रकम</div>
                    <div className="font-semibold text-slate-950 pt-1">
                      तर मूल्य अभिवृद्धि करमा दर्ता भई ढुवानी सेवा प्रदान गर्ने वा ढुवानी साधन भाडामा दिने व्यवसाय गर्ने व्यक्तिलाई भुक्तानी गर्ने रकम
                    </div>
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex flex-col justify-between items-center py-2">
                    <div>२.५</div>
                    <div>१.५</div>
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(१)(९)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    बासिन्दा बैंक तथा वित्तीय संस्थाले नेपाल राष्ट्र बैंकले तोकेको क्षेत्रमा लगानी गर्न विदेशी बैंक वा अन्य वित्तीय संस्थाबाट विदेशी मुद्रामा ऋण बापतको ब्याज भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(१)(९क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    संवत २०८२ साल चैत्र महिना सम्म वित्तीय व्यवस्थापन (फाइनान्सियल क्लोजर) सम्पन्न हुने दुई सय मेगावाटभन्दा माथिका जलाशय तथा अर्धजलाशययुक्त जलविद्युत आयोजनले विदेशी वित्तीय संस्थाबाट विदेशी मुद्रामा लिएको ऋण वापतको ब्याज भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(१)(११)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    विदेशी विद्यालय वा विश्वविद्यालयलाई रजिष्ट्रेशन शुल्क, शिक्षण शुल्क तथा परीक्षा शुल्क बापतको भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(१)(१२)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    बासिन्दा बैङ्क तथा वित्तीय संस्थाले जीवन बीमा कम्पनीलाई निक्षेप बापत भुक्तानी गरेको ब्याज
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(१)(१३)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    साहित्यिक लेख वा रचना बापत बासिन्दा व्यक्तिलाई रोयल्टी भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १.५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(१)(१४)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    बासिन्दा प्राकृतिक व्यक्ति रहेको बीमा अभिकर्तालाई भुक्तानी गरेको सेवा शुल्क वा कमिशनमा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    २०
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(२)(क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    लाभांश
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(२)(ख)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    लगानी बीमाको लाभ
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(२)(ग)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    स्वीकृति नलिएको अवकाश कोषबाट लाभको भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(३)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपालमा स्रोत भएको र व्यवसाय सञ्चालनसँग सम्बन्धित नभएको खण्डमा बासिन्दा बैंक, वित्तीय संस्था, सहकारी वा ऋणपत्र जारी गर्ने अन्य कुनै निकाय वा प्रचलित कानुन बमोजिम सूचिकृत भएका कम्पनीले कुनै प्राकृतिक व्यक्तिलाई निक्षेप, ऋणपत्र, डिभेन्चर तथा सरकारी बण्डको बापत भुक्तानी गर्ने ब्याज
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ६
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८क.(१)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    आकस्मिक लाभ
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    २५
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="border border-slate-900 text-xs">
              <div className="divide-y divide-slate-900 text-slate-900 leading-tight">
                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८९(१)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    ठेक्का वा करार बापत रू. ५०,०००/- भन्दा बढी रकमको भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १.५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८९(३)(क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    गैर बासिन्दा व्यक्तिलाई भुक्तानी हुने ठेक्का वा करारमा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८९(३)(ख)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    गैर बासिन्दा बीमा कम्पनीलाई भुक्तानी हुने प्रिमियम वा गैर बासिन्दा बीमा कम्पनीबाट पुनर्बीमा बापत प्राप्त हुने प्रिमियम रकमबाट दिइने कमिशन
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १.५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८९(३)(ग)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    गैर बासिन्दा व्यक्तिलाई हुने अन्य भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center text-[10px] font-medium flex items-center justify-center leading-tight">
                    विभागले लिखित सूचना दिए बमोजिम
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(१)(५)(ख)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    प्राकृतिक व्यक्तिले घर बहाल बापत प्राप्त गरेको रकममा
                  </div>
                  <div className="col-span-2 p-2 text-center font-medium text-xs flex items-center justify-center">
                    कर कट्टी गर्नु नपर्ने
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(१)(१०)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    उपभोक्ताले वस्तु तथा सेवा खरिद गर्दा प्रचलित कानुन बमोजिम भुक्तानी कार्ड, इ-मनी (वालेट), मोबाइल बैंकिङ्ग जस्ता विद्युतीय भुक्तानीका उपकरणबाट भुक्तानी गरे बापत प्रदान गरिने प्रोत्साहन रकममा
                  </div>
                  <div className="col-span-2 p-2 text-center font-medium text-xs flex items-center justify-center">
                    कर कट्टी गर्नु नपर्ने
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(४)(क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    प्राकृतिक व्यक्तिले गरेको व्यवसाय सञ्चालनसँग सम्बन्धित बाहेकका अन्य कुनै भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-medium text-xs flex items-center justify-center">
                    कर कट्टी गर्नु नपर्ने
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(४)(क१)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    पत्रपत्रिकामा प्रकाशित लेख रचना बापतको भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-medium text-xs flex items-center justify-center">
                    कर कट्टी गर्नु नपर्ने
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(४)(ख)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    बासिन्दा बैंक वा अरु बासिन्दा वित्तीय संस्थालाई तिरेको ब्याज
                  </div>
                  <div className="col-span-2 p-2 text-center font-medium text-xs flex items-center justify-center">
                    कर कट्टी गर्नु नपर्ने
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ८८(४)(ख१)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    सहकारी बैङ्क तथा सहकारी संघ संस्थाले एक आपसमा ऋण लगानी बापत तिरेको ब्याज
                  </div>
                  <div className="col-span-2 p-2 text-center font-medium text-xs flex items-center justify-center">
                    कर कट्टी गर्नु नपर्ने
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(४)(ग)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    कर छुट पाएको भुक्तानी
                  </div>
                  <div className="col-span-2 p-2 text-center font-medium text-xs flex items-center justify-center">
                    कर कट्टी गर्नु नपर्ने
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८(४)(घ)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    क्रेडिट कार्ड जारी गर्ने बैंकलाई तिरेको इण्टररिजनल इण्टरचेन्ज शुल्क
                  </div>
                  <div className="col-span-2 p-2 text-center font-medium text-xs flex items-center justify-center">
                    कर कट्टी गर्नु नपर्ने
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ८८क.(२)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900 space-y-1">
                    <div>
                      साहित्य, कला, संस्कृति, खेलकुद, पत्रकारिता, विज्ञान, प्रविधि, कृषि तथा सार्वजनिक प्रशासन क्षेत्रमा योगदान पुर्याए बापत प्राप्त हुने राष्ट्रिय र अन्तर्राष्ट्रियस्तरका पाँच लाख रुपैयाँसम्मको पुरस्कार
                    </div>
                    <div className="font-semibold pt-1">
                      तर पुरस्कार रकम पाँच लाख रुपैयाँभन्दा बढी भएमा सो बढी भएको रकममा
                    </div>
                  </div>
                  <div className="col-span-2 p-2 text-center font-medium text-xs flex flex-col justify-between items-center py-2">
                    <div>कर कट्टी गर्नु नपर्ने</div>
                    <div className="font-bold text-sm">२५</div>
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(१)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    कमोडिटी फ्युचर मार्केट अन्तर्गत व्यापार गर्ने व्यक्तिबाट सो व्यवसायबाट प्राप्त गर्ने मुनाफा र लाभमा कमोडिटी फ्युचर मार्केट सेवा सञ्चालन गर्ने निकायले असुल गर्नुपर्ने अग्रिम कर
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १०
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="border border-slate-900 text-xs">
              <div className="divide-y divide-slate-900 text-slate-900 leading-tight">
                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(२)(क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपाल धितोपत्र बोर्डमा सूचीकरण भएको निकायको हितको निःसर्गबाट प्राप्त लाभको भुक्तानी बासिन्दा प्राकृतिक व्यक्तिको हकमा तीनसय पैंसठ्ठी दिनभन्दा बढी अवधि स्वामित्वमा रहेको हितको लाभ रकममा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ७.५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(२)(क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपाल धितोपत्र बोर्डमा सूचीकरण भएको निकायको हितको निःसर्गबाट प्राप्त लाभको भुक्तानी बासिन्दा प्राकृतिक व्यक्तिको हकमा तीनसय पैंसठ्ठी दिन वा सो भन्दा कम अवधि स्वामित्वमा रहेको हितको लाभ रकममा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १०
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(२)(क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपाल धितोपत्र बोर्डमा सूचीकरण भएको निकायको हितको निःसर्गबाट प्राप्त लाभको भुक्तानी बासिन्दा निकायको हकमा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १०
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(२)(क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपाल धितोपत्र बोर्डमा सूचीकरण भएको निकायको हितको निःसर्गबाट प्राप्त लाभको भुक्तानी अन्यको हकमा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    २५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(२)(ख)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपाल धितोपत्र बोर्डमा सूचीकरण नभएको निकायको हितको निःसर्गबाट प्राप्त लाभको भुक्तानी बासिन्दा प्राकृतिक व्यक्तिको हकमा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १०
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(२)(ख)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपाल धितोपत्र बोर्डमा सूचीकरण नभएको निकायको हितको निःसर्गबाट प्राप्त लाभको भुक्तानी बासिन्दा निकायको हकमा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(२)(ख)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपाल धितोपत्र बोर्डमा सूचीकरण नभएको निकायको हितको निःसर्गबाट प्राप्त लाभको भुक्तानी अन्यको हकमा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    २५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(५)(क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900 font-semibold">
                    प्राकृतिक व्यक्तिको जग्गा वा निजी भवन निःसर्ग बापत भएको पूँजीगत लाभमा सम्पत्तिको स्वामित्व पाँच वर्ष वा सो भन्दा बढी भएकोमा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ७.५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(५)(क१)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    नेपाल सरकारको निर्णयबाट कुनै प्राकृतिक व्यक्तिको जग्गा अधिग्रहण हुने भै अस्वेच्छिक रुपमा निःसर्ग भएको गैरव्यावसायिक करयोग्य सम्पत्ति (जग्गा तथा भवन) को हकमा दुई दश दशमलव पाँच प्रतिशतका दरले
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    २.५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(५)(ख)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900 font-semibold">
                    प्राकृतिक व्यक्तिको जग्गा वा निजी भवन निःसर्ग बापत भएको पूँजीगत लाभमा सम्पत्तिको स्वामित्व पाँच वर्षभन्दा कम भएकोमा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १०
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(५क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    उपदफा (५) मा जुनसुकै कुरा लेखिएको भए तापनि कुनै प्राकृतिक व्यक्तिले आफ्नो स्वामित्वको जग्गा वा निजी भवन नेपाल सरकार, प्रदेश सरकार वा स्थानीय तहलाई निःशुल्क प्रदान गर्दा सो जग्गा वा निजी भवनको निःसर्गमा
                  </div>
                  <div className="col-span-2 p-2 text-center font-semibold text-xs flex items-center justify-center">
                    पूँजीगत लाभकर नलाग्ने
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा ९५क.(६)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    दफा ९५क.(५) मा लेखिएदेखि बाहेक अन्य कुनै व्यक्तिको स्वामित्वको जग्गा वा भवन निःसर्ग भएको मूल्यमा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १.५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(६क)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    विदेशमा अध्ययन गर्न जाने विद्यार्थीलाई भाषा परीक्षा तथा मानकीकृत परीक्षण शुल्क बापत विदेशी मुद्राको सटही सुविधा उपलब्ध गराउने बासिन्दा बैंक वा वित्तीय संस्थाले त्यस्तो परीक्षा शुल्क बापतको रकममा विदेशी मुद्राको सटही सुविधा दिएको बखत
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १५
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="border border-slate-900 text-xs">
              <div className="divide-y divide-slate-900 text-slate-900 leading-tight">
                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(६ख)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    व्यवसाय सञ्चालनमा संलग्न नरहेको कुनै बासिन्दा प्राकृतिक व्यक्तिले नेपाल बाहिर सफ्टवेयर वा यस्तै प्रकृतिको अन्य विद्युतीय सेवा उपलब्ध गराए बापत विदेशी मुद्रामा भुक्तानी प्राप्त गरेको भए सम्बन्धित बैङ्क, वित्तीय संस्था तथा मुद्रा हस्तान्तरण (मनि ट्रान्सफर) गर्ने संस्थाले त्यस्तो भुक्तानी प्रदान गर्दा प्राप्त रकममा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(६ग)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    व्यवसाय सञ्चालनमा संलग्न नरहेको कुनै बासिन्दा प्राकृतिक व्यक्तिले व्यक्तिगत रुपमा नेपाल बाहिर परामर्श सेवा प्रदान गरे बापत विदेशी मुद्रामा कुनै भुक्तानी प्राप्त गरेको भएमा सम्बन्धित बैङ्क, वित्तीय संस्था तथा मुद्रा हस्तान्तरण (मनि ट्रान्सफर) गर्ने संस्थाले त्यस्तो भुक्तानी प्रदान गर्दा प्राप्त रकममा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(६घ)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    व्यवसाय सञ्चालनमा संलग्न नरहेको बासिन्दा प्राकृतिक व्यक्तिले सामाजिक सञ्जालमा श्रव्यदृश्य सामग्री अपलोड गरे बापत विदेशी मुद्रामा भुक्तानी प्राप्त गरेको भएमा सम्बन्धित बैङ्क, वित्तीय संस्था तथा मुद्रा हस्तान्तरण (मनि ट्रान्सफर) गर्ने संस्थाले त्यस्तो भुक्तानी प्रदान गर्दा प्राप्त रकममा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    ५
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(६ङ)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    बासिन्दा विद्युतीय व्यापार सञ्चालक (ई-कमर्स अपरेटर) ले आफ्नो प्लेटफर्ममा आवद्ध भई कुनै वस्तु, सेवा वा वस्तु र सेवा प्रदान गर्ने व्यक्तिलाई वस्तु, सेवा वा वस्तु र सेवा बिक्री वापतको रकम भुक्तानी गर्दा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-2 p-2 border-r border-slate-900 font-medium">
                    दफा
                    <br />
                    ९५क.(६च)
                  </div>
                  <div className="col-span-8 p-2 border-r border-slate-900">
                    बासिन्दा राइड-सेयरिङ सेवा सञ्चालन गर्ने व्यक्ति (राइड- सेयरिङ अपरेटर) ले आफ्नो प्लेटफर्ममा आवद्ध भई कुनै सेवा प्रदान गर्ने प्राकृतिक व्यक्तिलाई प्रदान गरेको सेवा बापतको रकममा
                  </div>
                  <div className="col-span-2 p-2 text-center font-bold text-sm flex items-center justify-center">
                    १
                  </div>
                </div>
              </div>
            </div>

            {/* Section 92 Header and List Part 1 */}
            <div className="pt-2 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-400 pb-1">
                अन्तिम रूपमा कर कट्टी हुने भुक्तानी (दफा ९२)
              </h3>
              <p className="text-xs text-slate-800 font-semibold">
                देहायका भुक्तानीलाई अन्तिम रूपमा कर कट्टी हुने भुक्तानी मानिनेछ :
              </p>

              <div className="space-y-1.5 text-xs text-slate-900 leading-snug pl-1">
                <div className="flex gap-2">
                  <span className="font-bold shrink-0">(क)</span>
                  <span>बासिन्दा कम्पनी वा साझेदारी फर्मले भुक्तानी गरेको लाभांश,</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold shrink-0">(ख)</span>
                  <span>व्यवसाय सञ्चालन गरिरहेको बाहेक अन्य प्राकृतिक व्यक्तिलाई नेपालमा स्रोत भएको जग्गा वा घर र सोसँग गाँसिएका जडानहरु र उपकरणहरु बापत भुक्तानी गरेको भाडा,</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold shrink-0">(ग)</span>
                  <span>बासिन्दा व्यक्तिले लगानी बीमा बापत भुक्तानी गरेको लाभ,</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold shrink-0">(घ)</span>
                  <span>बासिन्दा व्यक्तिले तिरेको स्वीकृति नलिएको अवकाश कोषको हित बापत भुक्तानी गरेको लाभ,</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-bold shrink-0">(ङ)</span>
                  <span>
                    दफा ८८ को उपदफा (३) मा उल्लिखित बैंक, वित्तीय संस्था वा ऋणपत्र जारी गर्ने अन्य कुनै निकाय वा प्रचलित कानुन बमोजिम सूचीकृत भएका कम्पनी वा सहकारीले भुक्तानी दिएको देहाय बमोजिमको ब्याज:
                  </span>
                </div>
                <div className="pl-6 space-y-1">
                  <div>
                    (१) नेपालमा स्रोत भएको र व्यवसाय सञ्चालनसँग सम्बन्धित नभएको प्राकृतिक व्यक्तिलाई भुक्तानी गरेको,
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-3 text-xs text-slate-900 leading-snug">
            {/* Continuation of Section 92 */}
            <div className="pl-6 space-y-1.5">
              <div>
                (२) दफा २ को खण्ड (ध) बमोजिमको कर छुट पाउने संस्थालाई भुक्तानी गरेको।
              </div>
            </div>

            <div className="space-y-2 pt-1 pl-1">
              <div className="flex gap-2">
                <span className="font-bold shrink-0">(च)</span>
                <span>दफा ८७, ८८, ८८क. वा ८९ बमोजिम गैर बासिन्दा व्यक्तिलाई दिइएको कर कट्टी हुनुपर्ने भुक्तानी,</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold shrink-0">(छ)</span>
                <span>
                  नेपाल सरकार वा स्वीकृत अवकाश कोष वा स्वीकृति नलिएको अवकाश कोषबाट भुक्तानी गरिएको अवकाश भुक्तानी समेत सबै प्रकारका अवकाश भुक्तानी (नियमित रूपमा भुक्तानी हुने निवृत्तभरण बाहेक),
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold shrink-0">(ज)</span>
                <span>
                  प्रति बैठक बीस हजार रुपैयाँसम्मको बैठक भत्ता, पटके रूपमा अध्यापन गराए बापत, प्रश्नपत्र तयार गरे वा उत्तर पुस्तिका जाँच गरेबापतको भुक्तानी,
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold shrink-0">(झ)</span>
                <span>आकस्मिक लाभ बापतको भुक्तानी,</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold shrink-0">(ञ)</span>
                <span>सामूहिक लगानी कोष (म्युचुअल फण्ड) बाट प्राकृतिक व्यक्तिलाई वितरण गरिने प्रतिफल रकम,</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold shrink-0">(ञ१)</span>
                <span>
                  दफा ९५क. को उपदफा (२) र (५) बमोजिम आय विवरण पेश गर्न नचाहने बासिन्दा प्राकृतिक व्यक्ति र गैर बासिन्दा व्यक्तिको लाभ रकम, उपदफा (६ख.), (६ग.) तथा (६घ.) बमोजिम विदेशी मुद्रामा भुक्तानी र उपदफा (६ङ) बमोजिमको सेवा बापतको भुक्तानी,
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold shrink-0">(ञ२)</span>
                <span>बासिन्दा प्राकृतिक व्यक्तिले विमा अभिकर्तालाई भुक्तानी गरेको सेवा शुल्क वा कमिशन,</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold shrink-0">(ट)</span>
                <span>
                  अनुसूची-१ को दफा १ को उपदफा (१३) बमोजिम कर दाखिल गर्ने प्राकृतिक व्यक्तिको सवारी वा ढुवानी साधनको भाडा वा ढुवानी सेवा बापतको भुक्तानी।
                </span>
              </div>
            </div>

            {/* Official Document Footer ending mark */}
            <div className="text-center pt-8 font-black text-slate-800 tracking-widest">
              ****
            </div>

            {/* Statutory Authentication Note */}
            <div className="mt-8 p-3 bg-amber-50/80 border border-amber-300 rounded-lg text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>आधिकारिक कानुनी प्रमाणीकरण (Legal Notice):</span>
              </div>
              <p>
                यो पुस्तिका नेपाल सरकार, अर्थ मन्त्रालय, आन्तरिक राजस्व विभागद्वारा आर्थिक वर्ष २०८३/०८४ का लागि जारी गरिएको आधिकारिक अग्रिम कर कट्टी (TDS) तथा अग्रिम कर असुली सम्बन्धी आधिकारिक राजपत्र निर्देशिका हो।
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`text-slate-900 font-sans transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto p-4 sm:p-8 bg-slate-50' : ''
      }`}
    >
      {/* Interactive Flippable Book Stage - Light Clean Side Background (No Black) */}
      <div className="relative flex flex-col items-center justify-center py-6 bg-slate-50/90 rounded-2xl border border-slate-200/80 p-2 sm:p-6 overflow-hidden shadow-xs">
        {/* Previous Page Flip Floating Button */}
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`absolute left-2 sm:left-4 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center shadow-md border transition-all cursor-pointer ${
            currentPage === 1
              ? 'bg-slate-200/50 text-slate-400 border-slate-200 pointer-events-none'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:scale-110 active:scale-95'
          }`}
          title="Previous Page (Arrow Left)"
        >
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>

        {/* Next Page Flip Floating Button */}
        <button
          type="button"
          onClick={handleNextPage}
          disabled={viewMode === 'double' ? currentPage >= totalPages - 1 : currentPage === totalPages}
          className={`absolute right-2 sm:right-4 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center shadow-md border transition-all cursor-pointer ${
            (viewMode === 'double' ? currentPage >= totalPages - 1 : currentPage === totalPages)
              ? 'bg-slate-200/50 text-slate-400 border-slate-200 pointer-events-none'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 hover:scale-110 active:scale-95'
          }`}
          title="Next Page (Arrow Right)"
        >
          <ChevronRight className="w-6 h-6 text-slate-700" />
        </button>

        {/* Flippable Pages Sheet Container */}
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200 flex items-center justify-center w-full"
        >
          {viewMode === 'single' ? (
            /* Single Page View */
            <div className="w-full max-w-2xl bg-white text-slate-900 rounded-sm shadow-[0_12px_36px_rgba(0,0,0,0.12)] p-6 sm:p-10 border border-slate-300 relative min-h-[750px] flex flex-col justify-between select-text">
              {/* Paper Top Corner & Header Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-200 pb-2 mb-4">
                <span>आन्तरिक राजस्व विभाग • अग्रिम कर कट्टी तालिका (२०८३/०८४)</span>
                <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  पृष्ठ {currentPage} / {totalPages}
                </span>
              </div>

              {/* Main Official Content of Page */}
              <div className="grow">
                {renderPageContent(currentPage)}
              </div>
            </div>
          ) : (
            /* Double-Page Spread View */
            <div className="w-full max-w-5xl flex flex-col md:flex-row bg-[#FAF8F5] p-2 sm:p-3 rounded-lg shadow-xl border-2 border-slate-300 gap-1 sm:gap-2">
              {/* Left Page */}
              <div className="flex-1 bg-white text-slate-900 rounded-l-xs shadow-md p-5 sm:p-8 border-r border-slate-300 relative min-h-[750px] flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-200 pb-2 mb-4">
                  <span>आन्तरिक राजस्व विभाग</span>
                  <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    पृष्ठ {currentPage}
                  </span>
                </div>
                <div className="grow">
                  {renderPageContent(currentPage)}
                </div>
              </div>

              {/* Center Book Spine Crease Effect */}
              <div className="hidden md:block w-3 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 shadow-inner" />

              {/* Right Page */}
              <div className="flex-1 bg-white text-slate-900 rounded-r-xs shadow-md p-5 sm:p-8 relative min-h-[750px] flex flex-col justify-between">
                {currentPage + 1 <= totalPages ? (
                  <>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-200 pb-2 mb-4">
                      <span>अग्रिम कर कट्टी (२०८३/०८४)</span>
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        पृष्ठ {currentPage + 1}
                      </span>
                    </div>
                    <div className="grow">
                      {renderPageContent(currentPage + 1)}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 font-mono text-xs space-y-2">
                    <BookText className="w-8 h-8 text-slate-300" />
                    <span>[अन्तिम पृष्ठ समाप्त]</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
