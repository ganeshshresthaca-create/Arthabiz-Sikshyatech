export interface IrdRevenueCodeItem {
  sn: number;
  snNepali: string;
  code: string;
  codeNepali: string;
  title: string;
  oldCode: string;
  oldCodeNepali: string;
  description: string;
  category: 'income_individual' | 'corporate' | 'investment_rent' | 'social_security' | 'service_luxury' | 'vat' | 'excise';
}

export const IRD_REVENUE_CODES: IrdRevenueCodeItem[] = [
  // Page 1
  {
    sn: 1,
    snNepali: '१',
    code: '11111',
    codeNepali: '१११११',
    title: 'एकलौटी फर्म तथा व्यक्तिगत आयमा लाग्ने कर',
    oldCode: '11111',
    oldCodeNepali: '१११११',
    description: 'एकलौटी फर्म तथा व्यक्तिगत आयमा लाग्ने कर यसमा पर्दछ ।',
    category: 'income_individual'
  },
  {
    sn: 2,
    snNepali: '२',
    code: '11112',
    codeNepali: '११११२',
    title: 'पारिश्रमिक कर (TDS on Salary & Employment Income)',
    oldCode: '11112',
    oldCodeNepali: '११११२',
    description: 'कुनै प्राकृतिक व्यक्तिले रोजगारीबाट प्राप्त गरेको तलब, ज्याला, मजदुरी, पारिश्रमिक, भत्ता एवं सुविधा, अवकाश भुक्तानी, रोजगारीका सम्बन्धमा गरिएका अन्य भुक्तानी, अध्ययन, अध्यापन आदि विभिन्न स्रोतबाट हुने आयमा लाग्ने कर यसमा पर्दछ।',
    category: 'income_individual'
  },
  {
    sn: 3,
    snNepali: '३',
    code: '11113',
    codeNepali: '११११३',
    title: 'पूँजीगत लाभ कर (व्यक्तिगत)',
    oldCode: '11113',
    oldCodeNepali: '११११३',
    description: 'घर, जग्गा, शेयर आदि सम्पत्तिको बिक्री, पट्टा, हक हस्तान्तरण लगायत विभिन्न किसिमका निःसर्गबाट भएको पूँजीगत लाभमा व्यक्ति तथा एकलौटी फर्मलाई लाग्ने कर यसमा पर्दछ ।',
    category: 'income_individual'
  },
  {
    sn: 4,
    snNepali: '४',
    code: '11115',
    codeNepali: '११११५',
    title: 'आकस्मिक लाभ कर (Windfall Gain Tax)',
    oldCode: '11135',
    oldCodeNepali: '१११३५',
    description: 'कुनै व्यक्तिले जुवा, चिट्ठा, बाजी, उपहार, दान, अपुताली, सुराकी, पुरस्कार लगायतका आकस्मिक लाभबाट प्राप्त भएको आयमा लाग्ने कर यसमा पर्दछ ।',
    category: 'income_individual'
  },
  {
    sn: 5,
    snNepali: '५',
    code: '11119',
    codeNepali: '११११९',
    title: 'एकलौटी व्यवसायको आयमा लाग्ने अन्य कर',
    oldCode: '-',
    oldCodeNepali: '-',
    description: 'माथि उल्लेखित शीर्षकहरूमा नपरेका यस अन्तर्गत पर्ने अन्य करहरू यसमा पर्दछ ।',
    category: 'income_individual'
  },
  {
    sn: 6,
    snNepali: '६',
    code: '11120',
    codeNepali: '१११२०',
    title: 'निकायको आयमा लाग्ने कर (नियन्त्रण शीर्षक)',
    oldCode: '11120',
    oldCodeNepali: '१११२०',
    description: 'व्यावसायिक निकाय तथा संस्थानको आयमा लाग्ने कर यसमा पर्दछ । यो शीर्षकमा रकम जम्मा गर्न मिल्दैन ।',
    category: 'corporate'
  },
  {
    sn: 7,
    snNepali: '७',
    code: '11121',
    codeNepali: '१११२१',
    title: 'निकायको मुनाफामा लाग्ने कर - सरकारी संस्थान',
    oldCode: '11121',
    oldCodeNepali: '१११२१',
    description: 'सरकारको पूर्ण वा अधिकांश (५० प्रतिशत भन्दा बढी) स्वामित्व भएका सरकारी निकाय तथा त्यस्ता निकायको व्यवस्थापकीय नियन्त्रण भएको निकायको आयमा लाग्ने कर यसमा पर्दछ।',
    category: 'corporate'
  },
  {
    sn: 8,
    snNepali: '८',
    code: '11122',
    codeNepali: '१११२२',
    title: 'निकायको मुनाफामा लाग्ने कर (पब्लिक लिमिटेड कम्पनी)',
    oldCode: '11122',
    oldCodeNepali: '१११२२',
    description: 'कुनै विशेष ऐन वा कम्पनी ऐन अन्तर्गत दर्ता भएका पब्लिक लिमिटेड कम्पनी र सरकारको ५० प्रतिशत भन्दा कम स्वामित्व भएका कम्पनीको आयमा लाग्ने कर यसमा पर्दछ ।',
    category: 'corporate'
  },
  {
    sn: 9,
    snNepali: '९',
    code: '11123',
    codeNepali: '१११२३',
    title: 'निकायको मुनाफामा लाग्ने कर (प्राइभेट लिमिटेड कम्पनी)',
    oldCode: '11123',
    oldCodeNepali: '१११२३',
    description: 'कम्पनी ऐन अन्तर्गत दर्ता भएका प्राइभेट लिमिटेड कम्पनी तथा आयकर ऐन बमोजिम तोकिएको कम्पनीको आयमा लाग्ने कर यसमा पर्दछ ।',
    category: 'corporate'
  },

  // Page 2
  {
    sn: 10,
    snNepali: '१०',
    code: '11124',
    codeNepali: '१११२४',
    title: 'निकायको मुनाफामा लाग्ने कर (अन्य संस्था: साझेदारी, सहकारी, ट्रष्ट)',
    oldCode: '11124',
    oldCodeNepali: '१११२४',
    description: 'माथि उल्लेखित उपशीर्षक १११२१ देखि १११२३ भित्र परेका बाहेक अन्य संस्थाहरू: साझेदारी फर्म, सहकारी संस्था, ट्रष्ट, संघ/संस्था, विदेशी कम्पनी एवं अन्य निकायको आयमा लाग्ने कर यसमा पर्दछ।',
    category: 'corporate'
  },
  {
    sn: 11,
    snNepali: '११',
    code: '11125',
    codeNepali: '१११२५',
    title: 'पूँजीगत लाभ कर – निकाय (Corporate Capital Gain Tax)',
    oldCode: '11125',
    oldCodeNepali: '१११२५',
    description: 'घर, जग्गा, शेयर आदि सम्पत्तिको बिक्री, पट्टा, हक हस्तान्तरण लगायत विभिन्न किसिमका निःसर्गबाट भएको पूँजीगत लाभमा निकायलाई लाग्ने कर यसमा पर्दछ ।',
    category: 'corporate'
  },
  {
    sn: 12,
    snNepali: '१२',
    code: '11126',
    codeNepali: '१११२६',
    title: 'आकस्मिक लाभ कर (निकाय)',
    oldCode: '11135',
    oldCodeNepali: '१११३५',
    description: 'कुनै निकायले चिट्ठा, उपहार, दान, अपुताली, पुरस्कार लगायतका आकस्मिक लाभबाट प्राप्त भएको आयमा लाग्ने कर यसमा पर्दछ ।',
    category: 'corporate'
  },
  {
    sn: 13,
    snNepali: '१३',
    code: '11129',
    codeNepali: '१११२९',
    title: 'निकायको आयमा लाग्ने अन्य कर',
    oldCode: '-',
    oldCodeNepali: '-',
    description: 'माथि उल्लेखित शीर्षकहरूमा नपरेका यस अन्तर्गत पर्ने अन्य करहरू यसमा पर्दछ ।',
    category: 'corporate'
  },
  {
    sn: 14,
    snNepali: '१४',
    code: '11130',
    codeNepali: '१११३०',
    title: 'लगानीको आय तथा अन्य आयमा लाग्ने कर (नियन्त्रण शीर्षक)',
    oldCode: '11130',
    oldCodeNepali: '१११३०',
    description: 'माथि उल्लेखित शीर्षक १११११ देखि १११२५ भित्र परेका बाहेक अन्य आयमा लाग्ने कर यसमा पर्दछ । यो शीर्षकमा रकम जम्मा गर्न मिल्दैन।',
    category: 'investment_rent'
  },
  {
    sn: 15,
    snNepali: '१५',
    code: '11131',
    codeNepali: '१११३१',
    title: 'सम्पत्ति, बहाल तथा पट्टा वापतको आयमा लाग्ने कर (Rent & Lease TDS)',
    oldCode: '11131',
    oldCodeNepali: '१११३१',
    description: 'घर जग्गा भाडा वा लिजमा दिई प्राप्त गरेको आयमा लाग्ने कर तथा सवारी साधन तथा अन्य अचल सम्पत्ति बहाल वा पट्टा वा दीर्घकालीन करारमा दिए वापतको आयमा लाग्ने, सवारी साधन तथा अन्य अचल सम्पत्ति बहाल वा पट्टा वा दीर्घकालीन करारमा दिए वापतको आयमा लाग्ने कर यसमा पर्दछ ।',
    category: 'investment_rent'
  },
  {
    sn: 16,
    snNepali: '१६',
    code: '11132',
    codeNepali: '१११३२',
    title: 'ब्याजमा लाग्ने कर (Interest TDS)',
    oldCode: '11132',
    oldCodeNepali: '१११३२',
    description: 'बैंक, वित्त कम्पनी वा अन्य निकाय वा व्यक्तिबाट भुक्तानी गरिने वा प्राप्त हुने ब्याजमा लाग्ने कर यसमा पर्दछ।',
    category: 'investment_rent'
  },
  {
    sn: 17,
    snNepali: '१७',
    code: '11133',
    codeNepali: '१११३३',
    title: 'लाभांशमा लाग्ने कर (Dividend TDS)',
    oldCode: '11133',
    oldCodeNepali: '१११३३',
    description: 'कुनै पनि कम्पनी वा निकायमा लगानी गरेवापत प्राप्त हुने लाभांशमा लाग्ने कर यसमा पर्दछ ।',
    category: 'investment_rent'
  },
  {
    sn: 18,
    snNepali: '१८',
    code: '11134',
    codeNepali: '१११३४',
    title: 'लगानी सम्बन्धी अन्य आयमा लाग्ने कर',
    oldCode: '11134',
    oldCodeNepali: '१११३४',
    description: 'लगानी सम्बन्धी अन्य आयमा लाग्ने कर यसमा पर्दछ ।',
    category: 'investment_rent'
  },
  {
    sn: 19,
    snNepali: '१९',
    code: '11139',
    codeNepali: '१११३९',
    title: 'अन्य आयमा लाग्ने कर',
    oldCode: '11139',
    oldCodeNepali: '१११३९',
    description: 'माथि उल्लेखित शीर्षक नं. हरूमा नपरेका अन्य आयमा लाग्ने कर यसमा पर्दछ।',
    category: 'investment_rent'
  },
  {
    sn: 20,
    snNepali: '२०',
    code: '11200',
    codeNepali: '११२००',
    title: 'पारिश्रमिक तथा ज्यालामा आधारित कर (मूल शीर्षक)',
    oldCode: '11200',
    oldCodeNepali: '११२००',
    description: 'पारिश्रमिक तथा ज्यालामा आधारित भएर लगाइने करहरू यसमा पर्दछन्। यो मूल शीर्षकमा रकम जम्मा गर्न मिल्दैन ।',
    category: 'social_security'
  },

  // Page 3
  {
    sn: 21,
    snNepali: '२१',
    code: '11210',
    codeNepali: '११२१०',
    title: 'पारिश्रमिक तथा ज्यालामा आधारित सामाजिक सुरक्षा कर (नियन्त्रण)',
    oldCode: '-',
    oldCodeNepali: '-',
    description: 'पारिश्रमिक तथा ज्यालामा आधारित भएर लगाइने करहरू यसमा पर्दछ । यो शीर्षकमा रकम जम्मा गर्न मिल्दैन ।',
    category: 'social_security'
  },
  {
    sn: 22,
    snNepali: '२२',
    code: '11211',
    codeNepali: '११२११',
    title: 'पारिश्रमिक तथा ज्यालामा आधारित सामाजिक सुरक्षा कर (१% Social Security Tax)',
    oldCode: '11211',
    oldCodeNepali: '११२११',
    description: 'कुनै प्राकृतिक व्यक्तिले रोजगारीबाट प्राप्त गरेको तलब, ज्याला, मजदुरी, पारिश्रमिक, भत्ता एवं सुविधा, अवकाश भुक्तानी, रोजगारीका सम्बन्धमा गरिएका अन्य भुक्तानी, अध्ययन, अध्यापन आदि विभिन्न स्रोतबाट हुने समग्र आयमा एकमुष्टरूपमा तोकिएबमोजिम लिइने सामाजिक सुरक्षा कर यसमा पर्दछ।',
    category: 'social_security'
  },
  {
    sn: 23,
    snNepali: '२३',
    code: '11412',
    codeNepali: '११४१२',
    title: 'विलासिता शुल्क (Luxury Tax)',
    oldCode: '-',
    oldCodeNepali: '-',
    description: 'पाँच तारे वा सो भन्दा माथिका तारे होटेल तथा लक्जरी रिसोर्टले प्रदान गर्ने सेवा, आयातित मदिरा, निश्चित मूल्य भन्दा बढीका हिरा, मोती पत्थरजडित सुन वा बहुमूल्य गरगहना जस्ता विलासिताका वस्तु तथा सेवाको खरिदमा लाग्ने शुल्क यसमा पर्दछ ।',
    category: 'service_luxury'
  },
  {
    sn: 24,
    snNepali: '२४',
    code: '11442',
    codeNepali: '११४४२',
    title: 'स्वास्थ्य सेवा कर (Health Service Tax)',
    oldCode: '11442',
    oldCodeNepali: '११४४२',
    description: 'सरकार तथा सामुदायिक अस्पतालले प्रदान गर्ने स्वास्थ्य सेवा बाहेक अन्य स्वास्थ्य संस्थाले प्रदान गर्ने स्वास्थ्य सेवामा लाग्ने कर यसमा पर्दछ ।',
    category: 'service_luxury'
  },
  {
    sn: 25,
    snNepali: '२५',
    code: '11443',
    codeNepali: '११४४३',
    title: 'शिक्षा सेवा कर (शैक्षिक संस्था) (Education Service Tax - Domestic)',
    oldCode: '11443',
    oldCodeNepali: '११४४३',
    description: 'निजी शैक्षिक संस्थाले प्रदान गर्ने तोकिएका शैक्षिक सेवाहरूमा लाग्ने शिक्षण शुल्कमा लाग्ने सेवा शुल्क वापतको रकम यसमा पर्दछ ।',
    category: 'service_luxury'
  },
  {
    sn: 26,
    snNepali: '२६',
    code: '11444',
    codeNepali: '११४४४',
    title: 'शिक्षा सेवा कर (वैदेशिक अध्ययन) (Abroad Study Education Tax)',
    oldCode: '11444',
    oldCodeNepali: '११४४४',
    description: 'विदेशमा अध्ययन गर्न जाने विद्यार्थीहरूले बुझाउनुपर्ने शिक्षण शुल्कमा लाग्ने सेवा शुल्क वापतको रकम यसमा पर्दछ ।',
    category: 'service_luxury'
  },
  {
    sn: 27,
    snNepali: '२७',
    code: '11445',
    codeNepali: '११४४५',
    title: 'विद्युतीय सेवा कर (Digital Service Tax - DST)',
    oldCode: '-',
    oldCodeNepali: '-',
    description: 'गैर बासिन्दा व्यक्तिले नेपालका उपभोक्तालाई उपलब्ध गराएको विज्ञापन सेवा, चलचित्र, तथ्याङ्क, डाउनलोड, क्लाउड, गेमिङ, मोबाइल एप, ईन्टरनेट तथा सफ्टवेयर अध्यावधिक, शिक्षा तथा परामर्श सेवा लगायतका विद्युतीय सेवाको कारोबार मुल्यमा लगाइने कर यसमा पर्दछ ।',
    category: 'service_luxury'
  },
  {
    sn: 28,
    snNepali: '२८',
    code: '11454',
    codeNepali: '११४५४',
    title: 'सडक निर्माण तथा संभार कर',
    oldCode: '11454',
    oldCodeNepali: '११४५४',
    description: 'सवारी साधन दर्ताका बखत यातायात व्यवस्था कार्यालयमा सवारी साधनको किसिम अनुसार संकलन गरिने कर यसमा पर्दछन् ।',
    category: 'service_luxury'
  },

  // Page 4
  {
    sn: 29,
    snNepali: '२९',
    code: '14193',
    codeNepali: '१४१९३',
    title: 'वैदेशिक पर्यटन शुल्क (Foreign Tourism Levy)',
    oldCode: '-',
    oldCodeNepali: '-',
    description: 'विदेशमा पर्यटन भ्रमणका लागि जाने नेपाली पर्यटकले गर्ने भुक्तानी रकममा लाग्ने शुल्क यसमा पर्दछ । यस्तो शुल्क वैदेशिक भ्रमण प्याकेज बिक्रेताले प्याकेज बिक्रीका बखत र फर्म वा कम्पनीले व्यवसाय प्रवर्धनका सिलसिलामा आफू सम्बद्ध प्राकृतिक व्यक्तिलाई वैदेशिक भ्रमणमा लैजाँदा लाग्ने खर्च लेखाङ्कनका बखत असुल गर्नुपर्ने पर्दछ ।',
    category: 'service_luxury'
  },
  {
    sn: 30,
    snNepali: '३०',
    code: '14194',
    codeNepali: '१४१९४',
    title: 'वैदेशिक रोजगार सेवा शुल्क',
    oldCode: '-',
    oldCodeNepali: '-',
    description: 'वैदेशिक रोजगार व्यवसाय सञ्चालन गर्न इजाजत प्राप्त व्यक्ति वा संस्थाले वैदेशिक रोजगारमा जाने व्यक्तिबाट असुल गरेको रकमबाट कानून बमोजिम कट्टी गरिने शुल्क यसमा पर्दछ ।',
    category: 'service_luxury'
  },
  {
    sn: 31,
    snNepali: '३१',
    code: '14214',
    codeNepali: '१४२१४',
    title: 'दूरसञ्चार सेवा शुल्क (Telecommunication Service Charge - TSC)',
    oldCode: '14214',
    oldCodeNepali: '१४२१४',
    description: 'दूरसञ्चार सेवा शुल्कवापतको रकम यसमा पर्दछ ।',
    category: 'service_luxury'
  },
  {
    sn: 32,
    snNepali: '३२',
    code: '14215',
    codeNepali: '१४२१५',
    title: 'टेलिफोन स्वामित्वको शुल्क',
    oldCode: '14215',
    oldCodeNepali: '१४२१५',
    description: 'टेलिफोन स्वामित्ववापतको रकम यसमा पर्दछ ।',
    category: 'service_luxury'
  },
  {
    sn: 33,
    snNepali: '३३',
    code: '33311',
    codeNepali: '३३३११',
    title: 'मूल्य अभिवृद्धि कर - उत्पादन (VAT Production)',
    oldCode: '33111',
    oldCodeNepali: '३३१११',
    description: 'उत्पादनकर्ताले वस्तु उत्पादन गरी बिक्री गर्दा लाग्ने मूल्य अभिवृद्धि कर यसमा पर्दछ ।',
    category: 'vat'
  },
  {
    sn: 34,
    snNepali: '३४',
    code: '33313',
    codeNepali: '३३३१३',
    title: 'मूल्य अभिवृद्धि कर - वस्तु बिक्री र वितरण (VAT Goods Sales & Distribution)',
    oldCode: '33113',
    oldCodeNepali: '३३११३',
    description: 'थोक तथा खुद्रा विक्रेताबाट मूल्य अभिवृद्धि कर वापत तिर्नुपर्ने रकम यसमा पर्दछ ।',
    category: 'vat'
  },
  {
    sn: 35,
    snNepali: '३५',
    code: '33314',
    codeNepali: '३३३१४',
    title: 'मूल्य अभिवृद्धि कर - परामर्श तथा ठेक्का (VAT Consulting & Contracts)',
    oldCode: '33114',
    oldCodeNepali: '३३११४',
    description: 'सबै प्रकारका ठेक्का व्यावसायिक तथा परामर्श सेवामा लाग्ने मूल्य अभिवृद्धि कर यसमा पर्दछ । मूल्य अभिवृद्धि कर लागु हुनु अगाडि असुल हुन बाँकी रहेका ठेक्का कर असुल भएमा यसैमा जम्मा गर्नुपर्दछ ।',
    category: 'vat'
  },
  {
    sn: 36,
    snNepali: '३६',
    code: '33315',
    codeNepali: '३३३१५',
    title: 'मूल्य अभिवृद्धि कर - पर्यटन सेवा संकलन (VAT Tourism Services)',
    oldCode: '33115',
    oldCodeNepali: '३३११५',
    description: 'पर्यटन व्यवसायसँग सम्बन्धित होटल, ट्राभल एजेन्सी, पदयात्रा (ट्रेकिङ), जलयात्रा (र्याफ्टिङ) समेतका व्यवसायमा लाग्ने मूल्य अभिवृद्धि कर यसमा पर्दछ । मूल्य अभिवृद्धि कर लागु हुनु अगाडि असुल हुन बाँकी रहेका होटल कर असुल भएमा यसैमा जम्मा गर्नुपर्दछ ।',
    category: 'vat'
  },

  // Page 5
  {
    sn: 37,
    snNepali: '३७',
    code: '33316',
    codeNepali: '३३३१६',
    title: 'मूल्य अभिवृद्धि कर - संचार सेवा, विमा, हवाई उडान र अन्य सेवा संकलन',
    oldCode: '33116',
    oldCodeNepali: '३३११६',
    description: 'सबै प्रकारका सञ्चार सेवा (सरकारी हुलाक सेवा बाहेक), बीमा र तोकिएका अन्य सेवाको बिक्रीमा लगाइने मूल्य अभिवृद्धि कर र हवाई उडान कर वापतको रकम यसमा पर्दछ । मूल्य अभिवृद्धि कर लागु हुनु अगाडि असुल हुन बाँकी रहेका मनोरन्जन कर असुल भएमा यसैमा जम्मा गर्नुपर्दछ ।',
    category: 'vat'
  },
  {
    sn: 38,
    snNepali: '३८',
    code: '33317',
    codeNepali: '३३३१७',
    title: 'मूल्य अभिवृद्धि कर - बेदर्तावालाबाट गर्ने संकलन (Reverse Charge VAT & Non-registered)',
    oldCode: '33117',
    oldCodeNepali: '३३११७',
    description: 'नेपाल बाहिरको दर्ता नभएको कुनै व्यक्तिबाट सेवा प्राप्त गर्दा उठाउनु पर्ने मूल्य अभिवृद्धि कर, काठ बिक्रीमा लगाइने मूल्य अभिवृद्धि कर, स्थानीय तह वा नेपाल स्थित अन्तर्राष्ट्रिय संघ संस्था वा नियोग वा सरकार वा मूल्य अभिवृद्धि कर नलाग्ने वस्तुको कारोबार गर्ने सार्वजनिक संस्थानले सङ्कलन/दाखिला गर्ने मूल्य अभिवृद्धि कर यसमा पर्दछ ।',
    category: 'vat'
  },
  {
    sn: 39,
    snNepali: '३९',
    code: '33331',
    codeNepali: '३३३३१',
    title: 'अन्तःशुल्क - सुर्तीजन्य पदार्थ (Excise Duty on Tobacco)',
    oldCode: '33131',
    oldCodeNepali: '३३१३१',
    description: 'सबै प्रकारका सुर्तीजन्य पदार्थको उत्पादनमा लाग्ने अन्तःशुल्क यसमा पर्दछ ।',
    category: 'excise'
  },
  {
    sn: 40,
    snNepali: '४०',
    code: '33332',
    codeNepali: '३३३३२',
    title: 'अन्तःशुल्क - मदिरा (Excise Duty on Liquor & Wine)',
    oldCode: '33132',
    oldCodeNepali: '३३१३२',
    description: 'मदिरा (वाईन र हल्का पेय पदार्थ समेत) को उत्पादनमा लाग्ने अन्तःशुल्क रकम यसमा पर्दछ ।',
    category: 'excise'
  },
  {
    sn: 41,
    snNepali: '४१',
    code: '33333',
    codeNepali: '३३३३३',
    title: 'अन्तःशुल्क - बियर (Excise Duty on Beer)',
    oldCode: '33133',
    oldCodeNepali: '३३१३३',
    description: 'वियरको उत्पादनमा लाग्ने अन्तःशुल्क यसमा पर्दछ ।',
    category: 'excise'
  },
  {
    sn: 42,
    snNepali: '४२',
    code: '33334',
    codeNepali: '३३३३४',
    title: 'अन्तःशुल्क - अन्य औद्योगिक उत्पादन (Excise on Other Industrial Production)',
    oldCode: '33134',
    oldCodeNepali: '३३१३४',
    description: 'माथि उल्लेखित उपशीर्षक ३३३३१, ३३३३२ र ३३३३३ मा परेको बाहेक अन्य औद्योगिक उत्पादनमा लाग्ने अन्तःशुल्क यसमा पर्दछ ।',
    category: 'excise'
  }
];
