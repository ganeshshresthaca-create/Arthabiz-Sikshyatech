import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Percent,
  Check,
  Copy,
  Printer,
  Sparkles,
  Info,
  Building2,
  FileText,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle,
  Receipt,
  UserX,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react';

export type FiscalYear = '2083_84' | '2082_83';
export type BillType = 'vat' | 'pan' | 'none';

export interface TdsRateOption {
  id: string;
  section: string;
  nameNepali: string;
  nameEnglish: string;
  category: 'services' | 'rent' | 'freight' | 'contract' | 'investment' | 'digital' | 'capital_gain' | 'employment' | 'other';
  rate2083_84: number;
  rate2082_83: number;
  defaultBillType: BillType;
  allowedBillTypes: BillType[];
  revenueCode: string;
  revenueCodeNepali: string;
  isFinal: boolean;
  notes: string;
  fyChangeNote?: string;
}

export const TDS_RATE_OPTIONS: TdsRateOption[] = [
  // --- 1. Services & Consultancy ---
  {
    id: 'sec88-service-vat',
    section: 'दफा ८८(१)(४)',
    nameNepali: 'मूल्य अभिवृद्धि कर (VAT) मा दर्ता सेवा शुल्क (IT, मर्मत, परामर्श)',
    nameEnglish: 'Service Fee to VAT-Registered Entity / Individual (With VAT Bill)',
    category: 'services',
    rate2083_84: 1.5,
    rate2082_83: 1.5,
    defaultBillType: 'vat',
    allowedBillTypes: ['vat'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'सेवा प्रदायक भ्याटमा दर्ता भई कर बिजक जारी गरेको अवस्थामा करयोग्य रकममा १.५% मात्र अग्रिम कर कट्टी गरिन्छ।'
  },
  {
    id: 'sec88-service-pan',
    section: 'दफा ८८(१)',
    nameNepali: 'प्यान (PAN) दर्ता भएको सेवा शुल्क / गैर-भ्याट परामर्श शुल्क',
    nameEnglish: 'Service Fee / Consultancy to PAN Registered Entity (Non-VAT Bill)',
    category: 'services',
    rate2083_84: 15,
    rate2082_83: 15,
    defaultBillType: 'pan',
    allowedBillTypes: ['pan', 'none'],
    revenueCode: '11112 / 11131',
    revenueCodeNepali: '११११२ / १११३१',
    isFinal: false,
    notes: 'भ्याटमा दर्ता नभएको तर प्यान दर्ता भएको संस्था वा व्यक्तिलाई सेवा शुल्क भुक्तानी गर्दा १५% अग्रिम कर कट्टी हुन्छ।'
  },
  {
    id: 'sec88-service-unregistered',
    section: 'दफा ८८(१)',
    nameNepali: 'प्राकृतिक व्यक्तिलाई सेवा शुल्क (बिल नभएको / परामर्श शुल्क)',
    nameEnglish: 'Service Fee to Unregistered Natural Individual (No Bill / Casual)',
    category: 'services',
    rate2083_84: 15,
    rate2082_83: 15,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11112',
    revenueCodeNepali: '११११२',
    isFinal: false,
    notes: 'व्यक्तिगत रूपमा गरिएको सेवा वा परामर्शमा १५% अग्रिम कर कट्टी गरिन्छ।'
  },
  {
    id: 'sec88-meeting-allowance',
    section: 'दफा ८८(१) / ९२',
    nameNepali: 'बैठक भत्ता, पटके अध्यापन, प्रश्नपत्र तयार तथा उत्तरपुस्तिका जाँच',
    nameEnglish: 'Meeting Allowance & Occasional Teaching / Exam Checking (Natural Person)',
    category: 'services',
    rate2083_84: 15,
    rate2082_83: 15,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11112',
    revenueCodeNepali: '११११२',
    isFinal: true,
    notes: 'बैठक भत्ता तथा पटके अध्यापनमा १५% अन्तिम कर कट्टी हुन्छ (Final Withholding Tax)।'
  },
  {
    id: 'sec88-literary-royalty',
    section: 'दफा ८८(१)(१३)',
    nameNepali: 'साहित्यिक लेख वा रचना बापत बासिन्दा व्यक्तिलाई रोयल्टी',
    nameEnglish: 'Royalty for Literary Writing / Creative Works to Resident Individual',
    category: 'services',
    rate2083_84: 1.5,
    rate2082_83: 1.5,
    defaultBillType: 'pan',
    allowedBillTypes: ['pan', 'none'],
    revenueCode: '11135',
    revenueCodeNepali: '१११३५',
    isFinal: false,
    notes: 'साहित्यिक तथा सिर्जनात्मक कृतिको रोयल्टीमा सहुलियत दर १.५% मात्र टिडिएस लाग्दछ।'
  },
  {
    id: 'sec88-general-royalty',
    section: 'दफा ८८(१)',
    nameNepali: 'प्राकृतिक स्रोत तथा बौद्धिक सम्पत्ति रोयल्टी (पेटेन्ट, ट्रेडमार्क, सफ्टवेयर)',
    nameEnglish: 'Natural Resource & Intellectual Property Royalty (Non-Literary)',
    category: 'services',
    rate2083_84: 15,
    rate2082_83: 15,
    defaultBillType: 'pan',
    allowedBillTypes: ['pan', 'vat', 'none'],
    revenueCode: '11135',
    revenueCodeNepali: '१११३५',
    isFinal: false,
    notes: 'प्राकृतिक स्रोत उत्खनन वा औद्योगिक बौद्धिक सम्पत्ति प्रयोग बापत १५% अग्रिम कर कट्टी हुन्छ।'
  },
  {
    id: 'sec88-insurance-agent',
    section: 'दफा ८८(१)(१४)',
    nameNepali: 'बासिन्दा प्राकृतिक व्यक्ति बीमा अभिकर्तालाई कमिसन / सेवा शुल्क',
    nameEnglish: 'Commission / Service Fee to Resident Natural Person Insurance Agent',
    category: 'services',
    rate2083_84: 20,
    rate2082_83: 20,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11112',
    revenueCodeNepali: '११११२',
    isFinal: false,
    notes: 'व्यक्तिगत बीमा एजेन्टलाई भुक्तानी गरिने कमिसनमा २०% अग्रिम कर कट्टी हुन्छ।'
  },

  // --- 2. House & Vehicle Rent ---
  {
    id: 'sec88-house-rent-individual',
    section: 'दफा ८८(१)',
    nameNepali: 'प्राकृतिक व्यक्तिको घर/जग्गा/भवन बहाल (House Rent - Individual)',
    nameEnglish: 'House / Land Rent to Resident Natural Individual (Local Government Tax)',
    category: 'rent',
    rate2083_84: 10,
    rate2082_83: 10,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11131 (स्थानीय तह)',
    revenueCodeNepali: '१११३१',
    isFinal: true,
    notes: 'स्थानीय सरकार सञ्चालन ऐन २०७४ बमोजिम प्राकृतिक व्यक्तिलाई भुक्तानी हुने घरबहालमा १०% कर स्थानीय तहमा दाखिला गरिन्छ।'
  },
  {
    id: 'sec88-vehicle-rent-vat',
    section: 'दफा ८८(१)(५क)',
    nameNepali: 'सवारी साधन तथा उपकरण भाडा (VAT बिल सहित)',
    nameEnglish: 'Vehicle & Equipment Hire with 13% VAT Invoice',
    category: 'rent',
    rate2083_84: 1.5,
    rate2082_83: 1.5,
    defaultBillType: 'vat',
    allowedBillTypes: ['vat'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'भ्याटमा दर्ता भई सवारी साधन भाडामा दिने व्यवसाय गर्ने व्यक्तिलाई भुक्तानी गर्दा १.५% अग्रिम कर कट्टी हुन्छ।'
  },
  {
    id: 'sec88-vehicle-rent-nonvat',
    section: 'दफा ८८(१)(५क)',
    nameNepali: 'सवारी साधन तथा उपकरण भाडा (PAN बिल वा बिल नभएको)',
    nameEnglish: 'Vehicle & Equipment Hire without VAT Invoice (PAN / No Bill)',
    category: 'rent',
    rate2083_84: 10,
    rate2082_83: 10,
    defaultBillType: 'pan',
    allowedBillTypes: ['pan', 'none'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'भ्याट बिल नभएको सवारी साधन वा उपकरण भाडामा १०% टिडिएस कट्टी हुन्छ।'
  },
  {
    id: 'sec88-aircraft-lease',
    section: 'दफा ८८(१)(३)',
    nameNepali: 'वायुयानको लिज (पट्टा) बापतको रकम भुक्तानी',
    nameEnglish: 'Aircraft Lease Payment',
    category: 'rent',
    rate2083_84: 10,
    rate2082_83: 10,
    defaultBillType: 'pan',
    allowedBillTypes: ['pan', 'vat'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'वायुयान लिज भाडामा १०% अग्रिम कर कट्टी लाग्दछ।'
  },

  // --- 3. Freight & Transportation ---
  {
    id: 'sec88-freight-vat',
    section: 'दफा ८८(१)(८)',
    nameNepali: 'ढुवानी सेवा तथा ढुवानी साधन भाडा (VAT बिल सहित - १.५%)',
    nameEnglish: 'Freight & Transportation with 13% VAT Bill (Registered Carrier)',
    category: 'freight',
    rate2083_84: 1.5,
    rate2082_83: 1.5,
    defaultBillType: 'vat',
    allowedBillTypes: ['vat'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'भ्याटमा दर्ता भई ढुवानी सेवा प्रदान गर्ने वा ढुवानी साधन भाडामा दिने व्यक्तिलाई १.५% मात्र टिडिएस लाग्दछ।'
  },
  {
    id: 'sec88-freight-general-vat',
    section: 'दफा ८८(१)(८)',
    nameNepali: 'ढुवानी सेवा बापतको रकम (सामान्य दर - २.५%)',
    nameEnglish: 'Freight / Transportation Service (General Rate @ 2.5%)',
    category: 'freight',
    rate2083_84: 2.5,
    rate2082_83: 2.5,
    defaultBillType: 'vat',
    allowedBillTypes: ['vat', 'pan'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'सामान्य ढुवानी सेवामा २.५% अग्रिम कर कट्टी गरिन्छ।'
  },
  {
    id: 'sec88-freight-nonvat',
    section: 'दफा ८८(१)(८)',
    nameNepali: 'ढुवानी सेवा (PAN बिल वा बिल नभएको - प्राकृतिक व्यक्ति १०%)',
    nameEnglish: 'Freight Transportation without VAT Bill (PAN / Individual Carrier @ 10%)',
    category: 'freight',
    rate2083_84: 10,
    rate2082_83: 10,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'भ्याट बिल बिनाको ढुवानी सेवामा १०% अग्रिम कर कट्टी गरिन्छ।'
  },
  {
    id: 'sec88a-commission',
    section: 'दफा ८८क.(१)',
    nameNepali: 'वस्तु बिक्री एजेन्ट वा डिलर कमिशन (Commodity Broker / Commission)',
    nameEnglish: 'Commodity Sales Agent / Broker Commission',
    category: 'services',
    rate2083_84: 5,
    rate2082_83: 5,
    defaultBillType: 'pan',
    allowedBillTypes: ['pan', 'vat', 'none'],
    revenueCode: '11133',
    revenueCodeNepali: '१११३३',
    isFinal: false,
    notes: 'वस्तु बिक्री एजेन्ट वा डिलरलाई प्रदान गरिने कमिशनमा ५% टिडिएस लाग्दछ।'
  },

  // --- 4. Contracts & Agreements ---
  {
    id: 'sec89-contract-vat',
    section: 'दफा ८९(१)',
    nameNepali: 'रू. ५०,००० भन्दा बढीको ठेक्का वा कार्य सम्झौता (VAT बिल सहित)',
    nameEnglish: 'Work Contract / Agreement Exceeding Rs. 50,000 (With VAT Invoice)',
    category: 'contract',
    rate2083_84: 1.5,
    rate2082_83: 1.5,
    defaultBillType: 'vat',
    allowedBillTypes: ['vat'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'रू. ५० हजारभन्दा बढीको निर्माण वा आपूर्ति ठेक्कामा १.५% अग्रिम कर कट्टी हुन्छ।'
  },
  {
    id: 'sec89-contract-pan',
    section: 'दफा ८९(१)',
    nameNepali: 'रू. ५०,००० भन्दा बढीको ठेक्का वा सम्झौता (PAN बिल)',
    nameEnglish: 'Contract / Agreement Exceeding Rs. 50,000 (PAN Bill)',
    category: 'contract',
    rate2083_84: 1.5,
    rate2082_83: 1.5,
    defaultBillType: 'pan',
    allowedBillTypes: ['pan', 'none'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'प्यान बिल अन्तर्गतको रू. ५०,००० भन्दा माथिको ठेक्का भुक्तानीमा १.५% अग्रिम कर।'
  },
  {
    id: 'sec89-nonresident-contract',
    section: 'दफा ८९(३)(क)',
    nameNepali: 'गैर बासिन्दा व्यक्तिसँगको ठेक्का वा करार भुक्तानी',
    nameEnglish: 'Contract / Agreement Payment to Non-Resident Entity',
    category: 'contract',
    rate2083_84: 5,
    rate2082_83: 5,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'गैर बासिन्दा निर्माण वा सेवा व्यवसायीलाई भुक्तानी गर्दा ५% कर कट्टी हुन्छ।'
  },

  // --- 5. Interest & Investment ---
  {
    id: 'sec88-3-deposit-interest',
    section: 'दफा ८८(३)',
    nameNepali: 'प्राकृतिक व्यक्तिको बैंक/वित्तीय संस्था/सहकारी निक्षेप तथा ऋणपत्रको ब्याज',
    nameEnglish: 'Non-Business Deposit, Debenture & Bond Interest to Natural Person',
    category: 'investment',
    rate2083_84: 6,
    rate2082_83: 5,
    defaultBillType: 'none',
    allowedBillTypes: ['none'],
    revenueCode: '11132',
    revenueCodeNepali: '१११३२',
    isFinal: true,
    notes: 'आर्थिक वर्ष २०८३/०८४ मा प्राकृतिक व्यक्तिको निक्षेप ब्याजमा ६% कायम गरिएको छ (अघिल्लो वर्ष ५% रहेको)।',
    fyChangeNote: 'FY 2083/84: ६% | FY 2082/83: ५%'
  },
  {
    id: 'sec92-bank-interest',
    section: 'दफा ९२',
    nameNepali: 'प्राकृतिक व्यक्तिको बैंक बचत ब्याज (Final Withholding)',
    nameEnglish: 'Bank Deposit Interest to Resident Natural Person (Sec 92 Final)',
    category: 'investment',
    rate2083_84: 5,
    rate2082_83: 5,
    defaultBillType: 'none',
    allowedBillTypes: ['none'],
    revenueCode: '11132',
    revenueCodeNepali: '१११३२',
    isFinal: true,
    notes: 'व्यक्तिगत बैंक ब्याजमा अन्तिम कर (Final Withholding) कट्टी हुन्छ।'
  },
  {
    id: 'sec88-corporate-interest',
    section: 'दफा ८८(१)',
    nameNepali: 'निजी ऋण/संस्थाको ऋण लगानी ब्याज (Private Loan / Corporate Interest)',
    nameEnglish: 'Private Loan / Lender Interest Payment (Non-Bank Source)',
    category: 'investment',
    rate2083_84: 15,
    rate2082_83: 15,
    defaultBillType: 'pan',
    allowedBillTypes: ['pan', 'none'],
    revenueCode: '11132',
    revenueCodeNepali: '१११३२',
    isFinal: false,
    notes: 'बैंक बाहेक व्यक्ति वा निकायबाट लिएको ऋणको ब्याज भुक्तानीमा १५% अग्रिम कर कट्टी हुन्छ।'
  },
  {
    id: 'sec88-dividend',
    section: 'दफा ८८(२)(क) / ९२',
    nameNepali: 'बासिन्दा कम्पनी वा साझेदारी फर्मले वितरण गरेको लाभांश (Dividend)',
    nameEnglish: 'Dividend Distributed by Resident Company / Entity',
    category: 'investment',
    rate2083_84: 5,
    rate2082_83: 5,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11134',
    revenueCodeNepali: '१११३४',
    isFinal: true,
    notes: 'कम्पनीले शेयरधनीलाई वितरण गर्ने लाभांशमा ५% अन्तिम कर कट्टी लाग्दछ।'
  },
  {
    id: 'sec88-mutual-fund',
    section: 'दफा ८८(१)(६)',
    nameNepali: 'सामूहिक लगानी कोष (Mutual Fund) प्रतिफल - प्राकृतिक व्यक्ति',
    nameEnglish: 'Mutual Fund Return Distributed to Natural Person',
    category: 'investment',
    rate2083_84: 5,
    rate2082_83: 5,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11134',
    revenueCodeNepali: '१११३४',
    isFinal: true,
    notes: 'म्युचुअल फण्डको प्रतिफल प्राकृतिक व्यक्तिलाई ५% र अन्य संस्थालाई १५% कर कट्टी हुन्छ।'
  },
  {
    id: 'sec88-hydro-foreign-loan',
    section: 'दफा ८८(१)(९क)',
    nameNepali: '२०० मेगावाट माथिका जलविद्युत आयोजनाको विदेशी ऋण ब्याज (चैत्र २०८२ सम्म क्लोजर)',
    nameEnglish: 'Foreign Currency Loan Interest for >200MW Hydro Project',
    category: 'investment',
    rate2083_84: 5,
    rate2082_83: 5,
    defaultBillType: 'none',
    allowedBillTypes: ['none'],
    revenueCode: '11132',
    revenueCodeNepali: '१११३२',
    isFinal: false,
    notes: '२०८२ चैत्रसम्म फाइनान्सियल क्लोजर हुने २०० मेगावाट माथिका हाइड्रोको विदेशी ऋण ब्याजमा ५% टिडिएस।'
  },

  // --- 6. Modern Digital Economy & Export ---
  {
    id: 'sec95a-software-export',
    section: 'दफा ९५क.(६ख)',
    nameNepali: 'नेपाल बाहिर सफ्टवेयर वा विद्युतीय सेवा उपलब्ध गराए बापत विदेशी मुद्रा भुक्तानी',
    nameEnglish: 'Software & Digital Services Export Received in Foreign Currency',
    category: 'digital',
    rate2083_84: 5,
    rate2082_83: 5,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: true,
    notes: 'नेपाल बाहिर सफ्टवेयर तथा आइटी सेवा दिए बापत बैंक वा मनि ट्रान्सफर मार्फत प्राप्त रकममा ५% अग्रिम कर।'
  },
  {
    id: 'sec95a-foreign-consultancy',
    section: 'दफा ९५क.(६ग)',
    nameNepali: 'नेपाल बाहिर परामर्श सेवा प्रदान गरे बापत विदेशी मुद्रा भुक्तानी',
    nameEnglish: 'Foreign Consultancy Services Received in Foreign Currency',
    category: 'digital',
    rate2083_84: 5,
    rate2082_83: 5,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: true,
    notes: 'व्यक्तिगत रुपमा नेपाल बाहिर परामर्श सेवा प्रदान गरे बापत विदेशी मुद्रामा ५% कर कट्टी।'
  },
  {
    id: 'sec95a-social-media',
    section: 'दफा ९५क.(६घ)',
    nameNepali: 'सामाजिक सञ्जालमा श्रव्यदृश्य सामग्री (YouTube, TikTok आदि) अपलोड आम्दानी',
    nameEnglish: 'Social Media Audio-Visual Content Upload Earnings (Foreign Currency)',
    category: 'digital',
    rate2083_84: 5,
    rate2082_83: 5,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: true,
    notes: 'सामाजिक सञ्जाल सामग्रीबाट प्राप्त विदेशी मुद्रामा सम्बन्धित बैंक वा मनि ट्रान्सफरले ५% कर असुल गर्दछ।'
  },
  {
    id: 'sec95a-ecommerce',
    section: 'दफा ९५क.(६ङ)',
    nameNepali: 'विद्युतीय व्यापार सञ्चालक (E-commerce Operator) ले बिक्रेतालाई भुक्तानी',
    nameEnglish: 'E-commerce Operator Payment to Marketplace Sellers',
    category: 'digital',
    rate2083_84: 1,
    rate2082_83: 1,
    defaultBillType: 'pan',
    allowedBillTypes: ['pan', 'vat', 'none'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'ई-कमर्स प्लेटफर्म मार्फत वस्तु वा सेवा बिक्री गर्दा अपरेटरले १% अग्रिम कर कट्टी गर्दछ।'
  },
  {
    id: 'sec95a-ridesharing',
    section: 'दफा ९५क.(६च)',
    nameNepali: 'राइड-सेयरिङ अपरेटर (Ride-sharing Operator) ले राइडर/चालकलाई भुक्तानी',
    nameEnglish: 'Ride-sharing Operator Payment to Drivers / Service Providers',
    category: 'digital',
    rate2083_84: 1,
    rate2082_83: 1,
    defaultBillType: 'none',
    allowedBillTypes: ['none', 'pan'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'पठाओ, इनड्राइभ जस्ता राइड सेयरिङ कम्पनीले राइडरलाई सेवा शुल्क भुक्तानी गर्दा १% कर कट्टी गर्दछ।'
  },

  // --- 7. Capital Gains & Property ---
  {
    id: 'sec95a-listed-shares-long',
    section: 'दफा ९५क.(२)(क)',
    nameNepali: 'सूचीकृत शेयर पूँजीगत लाभ (३६५ दिनभन्दा बढी स्वामित्व - Long Term)',
    nameEnglish: 'NEPSE Listed Securities Capital Gain (> 365 Days Holding)',
    category: 'capital_gain',
    rate2083_84: 7.5,
    rate2082_83: 7.5,
    defaultBillType: 'none',
    allowedBillTypes: ['none'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: true,
    notes: '३६५ दिनभन्दा बढी समय स्वामित्वमा रहेको सूचीकृत शेयरको नाफामा ७.५% पूँजीगत लाभकर लाग्दछ।'
  },
  {
    id: 'sec95a-listed-shares-short',
    section: 'दफा ९५क.(२)(क)',
    nameNepali: 'सूचीकृत शेयर पूँजीगत लाभ (३६५ दिन वा कम स्वामित्व - Short Term)',
    nameEnglish: 'NEPSE Listed Securities Capital Gain (<= 365 Days Holding)',
    category: 'capital_gain',
    rate2083_84: 10,
    rate2082_83: 10,
    defaultBillType: 'none',
    allowedBillTypes: ['none'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: true,
    notes: '३६५ दिन वा सोभन्दा कम अवधि स्वामित्वमा रहेको सूचीकृत शेयरको नाफामा १०% पूँजीगत लाभकर लाग्दछ।'
  },
  {
    id: 'sec95a-land-house-5yr-plus',
    section: 'दफा ९५क.(५)(क)',
    nameNepali: 'जग्गा वा निजी भवन बिक्री लाभ (५ वर्ष वा सोभन्दा बढी स्वामित्व)',
    nameEnglish: 'Real Estate / Land & House Capital Gain (>= 5 Years Ownership)',
    category: 'capital_gain',
    rate2083_84: 7.5,
    rate2082_83: 7.5,
    defaultBillType: 'none',
    allowedBillTypes: ['none'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: true,
    notes: '५ वर्ष वा बढी स्वामित्व रहेको घर/जग्गा बिक्रीमा भएको पूँजीगत लाभमा ७.५% लाभकर लाग्दछ।'
  },
  {
    id: 'sec95a-land-house-under-5yr',
    section: 'दफा ९५क.(५)(ख)',
    nameNepali: 'जग्गा वा निजी भवन बिक्री लाभ (५ वर्षभन्दा कम स्वामित्व)',
    nameEnglish: 'Real Estate / Land & House Capital Gain (< 5 Years Ownership)',
    category: 'capital_gain',
    rate2083_84: 10,
    rate2082_83: 10,
    defaultBillType: 'none',
    allowedBillTypes: ['none'],
    revenueCode: '11131',
    revenueCodeNepali: '१११३१',
    isFinal: true,
    notes: '५ वर्षभन्दा कम स्वामित्व रहेको घर/जग्गा बिक्रीको लाभमा १०% लाभकर लाग्दछ।'
  },

  // --- 8. Others (Windfall, Retirement, Custom) ---
  {
    id: 'sec88a-windfall',
    section: 'दफा ८८क.(१)',
    nameNepali: 'आकस्मिक लाभ (चिठ्ठा, उपहार, पुरस्कार - Windfall Gain)',
    nameEnglish: 'Windfall Gain (Lottery, Prizes, Winning Games)',
    category: 'other',
    rate2083_84: 25,
    rate2082_83: 25,
    defaultBillType: 'none',
    allowedBillTypes: ['none'],
    revenueCode: '11139',
    revenueCodeNepali: '१११३९',
    isFinal: true,
    notes: 'रू. ५ लाखभन्दा बढीको पुरस्कार वा चिट्ठा उपहारमा २५% अन्तिम कर कट्टी हुन्छ।'
  },
  {
    id: 'sec88-retirement',
    section: 'दफा ८८(१)(१)',
    nameNepali: 'स्वीकृत अवकाश कोष वा सरकारबाट अवकाश भुक्तानी',
    nameEnglish: 'Retirement Payment from Approved Fund / Govt',
    category: 'employment',
    rate2083_84: 5,
    rate2082_83: 5,
    defaultBillType: 'none',
    allowedBillTypes: ['none'],
    revenueCode: '11112',
    revenueCodeNepali: '११११२',
    isFinal: true,
    notes: 'रू. ५ लाख वा ५०% जुन बढी हुन्छ घटाई बाँकी रकममा ५% कर लाग्दछ।'
  },
  {
    id: 'custom-rate',
    section: 'ऐच्छिक दर',
    nameNepali: 'अन्य / ऐच्छिक कर कट्टी दर (Custom TDS Rate)',
    nameEnglish: 'Custom / Specific TDS Rate',
    category: 'other',
    rate2083_84: 1.5,
    rate2082_83: 1.5,
    defaultBillType: 'vat',
    allowedBillTypes: ['vat', 'pan', 'none'],
    revenueCode: '11131 / 11112',
    revenueCodeNepali: '१११३१',
    isFinal: false,
    notes: 'प्रयोगकर्ताले आवश्यकता अनुसार करको प्रतिशत परिवर्तन गर्न सक्नुहुन्छ।'
  }
];

export const TdsCalculator: React.FC = () => {
  // 1. Fiscal Year state: '2083_84' | '2082_83'
  const [fiscalYear, setFiscalYear] = useState<FiscalYear>('2083_84');

  // 2. Bill Received Type toggle: 'vat' | 'pan' | 'none'
  const [billType, setBillType] = useState<BillType>('vat');

  // 3. Transaction Nature Option state
  const [selectedOptionId, setSelectedOptionId] = useState<string>('sec88-service-vat');

  // 4. Amount & Calculation parameters
  const [grossAmount, setGrossAmount] = useState<number>(100000);
  const [isVatInclusive, setIsVatInclusive] = useState<boolean>(true);
  const [customRate, setCustomRate] = useState<number>(1.5);
  const [copiedVoucher, setCopiedVoucher] = useState<boolean>(false);

  // Active transaction option
  const selectedOption = useMemo(() => {
    return TDS_RATE_OPTIONS.find((o) => o.id === selectedOptionId) || TDS_RATE_OPTIONS[0];
  }, [selectedOptionId]);

  // Determine effective statutory rate based on Fiscal Year and custom option
  const activeRate = useMemo(() => {
    if (selectedOptionId === 'custom-rate') {
      return customRate;
    }
    return fiscalYear === '2083_84' ? selectedOption.rate2083_84 : selectedOption.rate2082_83;
  }, [selectedOptionId, customRate, fiscalYear, selectedOption]);

  // Handle switching Bill Type:
  // Automatically guide the user to the matching transaction or validate rates
  const handleBillTypeChange = (newBillType: BillType) => {
    setBillType(newBillType);

    // Contextual auto-switch for common services/rents:
    if (newBillType === 'vat') {
      if (selectedOption.id === 'sec88-service-pan' || selectedOption.id === 'sec88-service-unregistered') {
        setSelectedOptionId('sec88-service-vat');
      } else if (selectedOption.id === 'sec88-vehicle-rent-nonvat') {
        setSelectedOptionId('sec88-vehicle-rent-vat');
      } else if (selectedOption.id === 'sec88-freight-nonvat') {
        setSelectedOptionId('sec88-freight-vat');
      }
    } else if (newBillType === 'pan') {
      if (selectedOption.id === 'sec88-service-vat') {
        setSelectedOptionId('sec88-service-pan');
      } else if (selectedOption.id === 'sec88-vehicle-rent-vat') {
        setSelectedOptionId('sec88-vehicle-rent-nonvat');
      } else if (selectedOption.id === 'sec88-freight-vat') {
        setSelectedOptionId('sec88-freight-nonvat');
      }
    } else if (newBillType === 'none') {
      if (selectedOption.id === 'sec88-service-vat') {
        setSelectedOptionId('sec88-service-unregistered');
      } else if (selectedOption.id === 'sec88-vehicle-rent-vat') {
        setSelectedOptionId('sec88-vehicle-rent-nonvat');
      } else if (selectedOption.id === 'sec88-freight-vat') {
        setSelectedOptionId('sec88-freight-nonvat');
      }
    }
  };

  // Transaction options list
  const filteredOptions = TDS_RATE_OPTIONS;

  // Calculation Breakdown:
  // Under Nepal Income Tax Act: TDS is calculated strictly on the taxable base excluding VAT!
  const calculation = useMemo(() => {
    let baseTaxableAmount = 0;
    let vatAmount = 0;
    let totalInvoiceAmount = 0;
    const isVatBill = billType === 'vat';

    if (isVatBill) {
      if (isVatInclusive) {
        // e.g. Rs 113,000 inclusive => Base = 100,000, VAT = 13,000
        baseTaxableAmount = Math.round((grossAmount / 1.13) * 100) / 100;
        vatAmount = Math.round((grossAmount - baseTaxableAmount) * 100) / 100;
        totalInvoiceAmount = grossAmount;
      } else {
        // Base = 100,000 exclusive => VAT = 13,000, Total = 113,000
        baseTaxableAmount = grossAmount;
        vatAmount = Math.round((grossAmount * 0.13) * 100) / 100;
        totalInvoiceAmount = Math.round((grossAmount + vatAmount) * 100) / 100;
      }
    } else {
      // PAN Bill or No Bill => 0% VAT
      baseTaxableAmount = grossAmount;
      vatAmount = 0;
      totalInvoiceAmount = grossAmount;
    }

    // TDS is computed on baseTaxableAmount
    const tdsAmount = Math.round(((baseTaxableAmount * activeRate) / 100) * 100) / 100;

    // Net payable to payee = Total Invoice Amount - TDS Amount
    const netPayable = Math.round((totalInvoiceAmount - tdsAmount) * 100) / 100;

    return {
      baseTaxableAmount,
      vatAmount,
      totalInvoiceAmount,
      activeRate,
      tdsAmount,
      netPayable,
      isVatBill
    };
  }, [grossAmount, billType, isVatInclusive, activeRate]);

  const handleCopyVoucher = () => {
    const billTypeText =
      billType === 'vat'
        ? 'VAT Bill (मूल्य अभिवृद्धि कर बिजक)'
        : billType === 'pan'
        ? 'PAN Bill (प्यान बिजक / Non-VAT)'
        : 'No Bill / Unregistered (बिल बिना / प्राकृतिक व्यक्ति)';

    const text = `--- TDS ACCOUNTING JOURNAL VOUCHER (${fiscalYear === '2083_84' ? 'FY 2083/84' : 'FY 2082/83'}) ---
Bill Received: ${billTypeText}
Nature: ${selectedOption.nameNepali} (${selectedOption.section})
--------------------------------------
Debit: Expense / Purchase A/c       = NPR ${calculation.baseTaxableAmount.toLocaleString()}
${calculation.isVatBill ? `Debit: VAT Receivable A/c (13%)  = NPR ${calculation.vatAmount.toLocaleString()}\n` : ''}Credit: TDS Payable A/c (${calculation.activeRate}%)   = NPR ${calculation.tdsAmount.toLocaleString()} [Code: ${selectedOption.revenueCode}]
Credit: Bank / Creditor A/c (Net)   = NPR ${calculation.netPayable.toLocaleString()}
--------------------------------------
Total Invoice Amount: NPR ${calculation.totalInvoiceAmount.toLocaleString()}
IRD Revenue Code: ${selectedOption.revenueCode}`;

    navigator.clipboard.writeText(text);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans">
      {/* ===================================================================== */}
      {/* 1. TOP DUAL CONTROLS BAR: FISCAL YEAR SELECTOR & BILL TYPE TOGGLE */}
      {/* ===================================================================== */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span>TDS Calculator</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              As per Income Tax Act, 2058
            </p>
          </div>

          {/* Fiscal Year Filter Selector */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-300 shrink-0">
            <Calendar className="w-4 h-4 text-blue-700" />
            <div className="text-xs font-bold text-slate-700">
              आर्थिक वर्ष:
            </div>
            <select
              value={fiscalYear}
              onChange={(e) => setFiscalYear(e.target.value as FiscalYear)}
              className="py-1.5 px-3 bg-white border-2 border-blue-400 rounded-lg text-xs font-black text-blue-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-2xs"
            >
              <option value="2083_84">आ.व. २०८३/०८४</option>
              <option value="2082_83">आ.व. २०८२/०८३</option>
            </select>
          </div>
        </div>

        {/* 3-Way Segmented Bill Received Type Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>बिलको प्रकार छनोट गर्नुहोस्:</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Option 1: VAT Bill */}
            <button
              type="button"
              onClick={() => handleBillTypeChange('vat')}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex items-start gap-3 ${
                billType === 'vat'
                  ? 'bg-blue-50/90 border-blue-600 ring-2 ring-blue-500/30 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                billType === 'vat'
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-slate-400 bg-white'
              }`}>
                {billType === 'vat' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-black text-slate-900">
                    १. भ्याट बिजक (VAT Bill)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  १३% मूल्य अभिवृद्धि कर बिजक (Tax Invoice). सहुलियत टिडिएस दर (e.g. १.५%) लागू हुन्छ।
                </p>
                <span className="inline-block text-[9.5px] font-bold text-blue-800 bg-blue-100/80 px-1.5 py-0.2 rounded mt-1">
                  १३% VAT Decomposed • Concessional TDS
                </span>
              </div>
            </button>

            {/* Option 2: PAN Bill */}
            <button
              type="button"
              onClick={() => handleBillTypeChange('pan')}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex items-start gap-3 ${
                billType === 'pan'
                  ? 'bg-amber-50/90 border-amber-600 ring-2 ring-amber-500/30 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                billType === 'pan'
                  ? 'bg-amber-600 border-amber-600 text-white'
                  : 'border-slate-400 bg-white'
              }`}>
                {billType === 'pan' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-black text-slate-900">
                    २. प्यान बिजक (PAN Bill)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  प्यान दर्ता फर्म वा संस्था (Non-VAT Bill). ०% भ्याट तथा मानक टिडिएस दर लागू हुन्छ।
                </p>
                <span className="inline-block text-[9.5px] font-bold text-amber-900 bg-amber-100/80 px-1.5 py-0.2 rounded mt-1">
                  0% VAT • Standard PAN Rates (e.g. 15%)
                </span>
              </div>
            </button>

            {/* Option 3: No Bill / Unregistered */}
            <button
              type="button"
              onClick={() => handleBillTypeChange('none')}
              className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer relative overflow-hidden flex items-start gap-3 ${
                billType === 'none'
                  ? 'bg-purple-50/90 border-purple-600 ring-2 ring-purple-500/30 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                billType === 'none'
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'border-slate-400 bg-white'
              }`}>
                {billType === 'none' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-purple-700" />
                  <span className="text-xs font-black text-slate-900">
                    ३. बिल बिना / प्राकृतिक व्यक्ति (No Bill)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  घरधनी (Rent), निजी व्यक्ति, ब्याज वा बिना बिल भुक्तानी। प्राकृतिक व्यक्ति कर कट्टी।
                </p>
                <span className="inline-block text-[9.5px] font-bold text-purple-900 bg-purple-100/80 px-1.5 py-0.2 rounded mt-1">
                  0% VAT • Individual / Rent 10% / Interest
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MAIN 2-COLUMN COMPUTATION WORKSPACE */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Transaction Nature & Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>१. भुक्तानीको प्रकृति छनोट</span>
              </h3>
            </div>

            {/* Payment Nature Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                भुक्तानीको प्रकार तथा आकर्षित हुने दफा (Nature of Payment & Applicable Section):
              </label>
              <select
                value={selectedOptionId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedOptionId(newId);
                  const opt = TDS_RATE_OPTIONS.find((o) => o.id === newId);
                  if (opt) {
                    setBillType(opt.defaultBillType);
                  }
                }}
                className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs cursor-pointer"
              >
                {filteredOptions.map((opt) => {
                  const rate = fiscalYear === '2083_84' ? opt.rate2083_84 : opt.rate2082_83;
                  return (
                    <option key={opt.id} value={opt.id}>
                      {opt.section} — {opt.nameNepali} ({rate}%) [{opt.defaultBillType.toUpperCase()} Bill]
                    </option>
                  );
                })}
              </select>

              {/* Selected Rate Highlights Badge */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2.5 text-xs text-blue-950 mt-2">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-1 w-full">
                  <div className="flex items-center gap-2 flex-wrap justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold font-mono text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-300 text-sm">
                        दर: {activeRate}%
                      </span>
                      <span className="font-bold text-slate-800">{selectedOption.nameEnglish}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        राजस्व संकेत: {selectedOption.revenueCode}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        selectedOption.isFinal
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {selectedOption.isFinal ? 'अन्तिम कर (Final)' : 'अग्रिम कर (Advance)'}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-normal pt-0.5">
                    {selectedOption.notes}
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Rate Input if custom selected */}
            {selectedOptionId === 'custom-rate' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <label className="text-xs font-bold text-amber-900 block">
                  कस्टम कर कट्टी दर % (Enter Custom TDS %):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={customRate}
                    onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
                    className="w-32 p-2 text-sm bg-white border border-amber-300 rounded-lg font-mono font-bold"
                  />
                  <span className="text-xs text-amber-800 font-semibold">% TDS Withholding Rate</span>
                </div>
              </div>
            )}

            {/* Gross Amount Input */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  २. इनभ्वाइस / बिल रकम (Invoice Amount NPR):
                </label>
                <span className="text-xs font-mono font-bold text-blue-700">
                  NPR {grossAmount.toLocaleString()}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-xs sm:text-sm font-mono">
                  रू.
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={grossAmount || ''}
                  onChange={(e) => setGrossAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="Enter amount (e.g. 100000)"
                  className="w-full pl-10 pr-4 py-2.5 text-base sm:text-lg font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-2xs"
                />
              </div>
            </div>

            {/* VAT Provisions Handling (Active only when VAT Bill is toggled) */}
            {billType === 'vat' ? (
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                    ३. भ्याट स्थिति (13% VAT Calculation):
                  </label>
                  <span className="text-[11px] font-bold text-blue-700">
                    VAT Registered Tax Invoice
                  </span>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-blue-950 block">
                    इनभ्वाइस रकममा १३% भ्याटको अवस्था (Select VAT Status):
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setIsVatInclusive(true)}
                      className={`p-2 rounded-lg border text-center transition cursor-pointer ${
                        isVatInclusive
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      १३% भ्याट सहित (VAT Inclusive)
                      <span className="block text-[10px] opacity-80">
                        Gross = Base + 13% VAT
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsVatInclusive(false)}
                      className={`p-2 rounded-lg border text-center transition cursor-pointer ${
                        !isVatInclusive
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      १३% भ्याट बाहेक (VAT Exclusive)
                      <span className="block text-[10px] opacity-80">
                        Gross = Taxable Base
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    {billType === 'pan' ? (
                      <strong>प्यान बिजक (PAN Bill):</strong>
                    ) : (
                      <strong>बिल बिना (No Bill):</strong>
                    )}{' '}
                    मूल्य अभिवृद्धि कर (VAT) लागू हुँदैन (0% VAT)। सम्पूर्ण रकमलाई नै करयोग्य आधार रकम मानी निर्धारित टिडिएस कट्टी गरिन्छ।
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Computation & Double-Entry Accounting Voucher (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Computation Summary Card */}
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  भुक्तानी तथा कर कट्टी विवरण
                </h3>
              </div>
              <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                TDS: {calculation.activeRate}%
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Fiscal Year & Bill Type Tags */}
              <div className="flex items-center justify-between py-1 border-b border-slate-100 text-slate-500 font-mono text-[11px]">
                <span>लागू आ.व. तथा बिल प्रकार:</span>
                <span className="font-bold text-slate-800">
                  {fiscalYear === '2083_84' ? 'FY 2083/84' : 'FY 2082/83'} • {billType.toUpperCase()}
                </span>
              </div>

              {/* Taxable Base */}
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">करयोग्य आधार रकम (Taxable Base Amount):</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  रू. {calculation.baseTaxableAmount.toLocaleString()}
                </span>
              </div>

              {/* VAT if applicable */}
              {calculation.isVatBill && (
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-emerald-800">
                  <span>१३% मूल्य अभिवृद्धि कर (13% VAT):</span>
                  <span className="font-mono font-bold">
                    + रू. {calculation.vatAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Total Invoice */}
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 text-slate-700 font-semibold">
                <span>कुल इनभ्वाइस रकम (Total Invoice Amount):</span>
                <span className="font-mono font-bold">
                  रू. {calculation.totalInvoiceAmount.toLocaleString()}
                </span>
              </div>

              {/* TDS Highlight Box */}
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-950">
                <div>
                  <span className="text-[10px] font-bold uppercase text-rose-700 block">
                    कट्टी गर्नुपर्ने अग्रिम कर (TDS Withheld @ {calculation.activeRate}%):
                  </span>
                  <span className="text-xs font-medium text-rose-800">
                    {selectedOption.section} • संकेत: {selectedOption.revenueCode}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-lg text-rose-700">
                    - रू. {calculation.tdsAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Net Payment Highlight Box */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl flex items-center justify-between text-emerald-950 shadow-2xs">
                <div>
                  <span className="text-[11px] font-extrabold uppercase text-emerald-800 block">
                    पार्टीलाई भुक्तानी दिइने खुद रकम (Net Payable to Payee):
                  </span>
                  <span className="text-[10px] text-emerald-700">
                    {calculation.isVatBill ? 'Taxable Net + VAT Amount' : 'Net Disbursed via Bank/Cheque'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-black text-xl text-emerald-800">
                    रू. {calculation.netPayable.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Double Entry Accounting Journal Voucher Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  लेखा प्रविष्टि भौचर (Double-Entry Journal)
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  TDS Accounting Journal Voucher
                </h4>
              </div>
              <button
                type="button"
                onClick={handleCopyVoucher}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-lg transition border border-white/20 flex items-center gap-1 cursor-pointer"
                title="Copy Journal Voucher"
              >
                {copiedVoucher ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 text-[11px]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Copy Voucher</span>
                  </>
                )}
              </button>
            </div>

            {/* Voucher Grid */}
            <div className="font-mono text-xs space-y-2 bg-black/40 p-4 rounded-xl border border-white/10">
              {/* Debit Expense */}
              <div className="flex items-center justify-between text-slate-200">
                <span>Dr. Expense / Purchase A/c</span>
                <span className="font-bold text-emerald-400">
                  रू. {calculation.baseTaxableAmount.toLocaleString()}
                </span>
              </div>

              {/* Debit VAT */}
              {calculation.isVatBill && (
                <div className="flex items-center justify-between text-cyan-300">
                  <span>Dr. VAT Receivable A/c (13%)</span>
                  <span className="font-bold">
                    रू. {calculation.vatAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Credit TDS */}
              <div className="flex items-center justify-between text-amber-300 pl-4 border-t border-white/10 pt-1.5">
                <span>To TDS Payable A/c ({calculation.activeRate}%) [Code: {selectedOption.revenueCode}]</span>
                <span className="font-bold">
                  रू. {calculation.tdsAmount.toLocaleString()}
                </span>
              </div>

              {/* Credit Bank / Payee */}
              <div className="flex items-center justify-between text-white pl-4">
                <span>To Bank / Creditor A/c (Net)</span>
                <span className="font-bold text-emerald-400">
                  रू. {calculation.netPayable.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Statutory Reminder */}
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                कानूनी म्याद: कट्टी गरिएको TDS आगामी महिनाको २५ गतेभित्र IRD e-TDS पोर्टल मार्फत दाखिला गर्नुपर्दछ।
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
