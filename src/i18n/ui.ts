export const languages = {
  en: 'English',
  ne: 'नेपाली',
} as const;

export const defaultLang = 'en' as const;

export type Lang = keyof typeof languages;

type Dict = Record<string, string>;

export const ui: Record<Lang, Dict> = {
  en: {
    'site.tagline':
      'AI Engineer working on production ML systems. Writing about retrieval, agents, and the parts of the job that aren’t modeling.',

    'nav.writing': 'Writing',
    'nav.work': 'Work',
    'nav.about': 'About',
    'nav.skipToContent': 'Skip to content',

    'home.kicker': 'AI Engineer · TitanCloud',
    'home.title.before': 'Building production ML systems that ',
    'home.title.italic': 'actually ship',
    'home.title.after': '.',
    'home.dek':
      'Most of the work of an LLM pipeline happens upstream of the model. I write about the layers that filter, route, and validate before a single token is spent — and I build them for a living.',
    'home.cta.writing': 'Read selected writing →',
    'home.cta.work': 'See the work',
    'home.cta.about': 'About',

    'section.recentWriting': 'Recent Writing',
    'section.selectedWork': 'Selected Work',
    'section.about': 'About',
    'section.contact': 'Contact',

    'cta.allEssays': 'All essays →',
    'cta.allProjects': 'All projects →',
    'cta.readMore': 'Read the longer version →',
    'cta.getInTouch': 'Get in touch',
    'cta.backToWriting': '← All writing',
    'cta.backToWork': '← All work',
    'cta.read': 'Read →',
    'cta.caseStudy': 'Case study →',
    'cta.foundMistake.before': 'Found a mistake? ',
    'cta.foundMistake.link': 'tell me',
    'cta.foundMistake.after': '.',
    'cta.subscribeRss': 'Subscribe via RSS',

    'meta.essay': 'Essay',
    'meta.caseStudy': 'Case study',
    'meta.minRead': 'min read',
    'meta.min': 'min',
    'meta.updated': 'updated',
    'meta.period': 'Period',
    'meta.stack': 'Stack',

    'home.about.body.1':
      'I’m an AI Engineer at TitanCloud. I hold an MS in Data Science from Gannon University, completed December 2025 with a 4.0 GPA.',
    'home.about.body.2':
      'Before TitanCloud I shipped on-device computer vision at BitsKraft and ran the shared ML infrastructure for a research group of seven faculty. I care more about the boring layers of a system than the model at the bottom — because the model is rarely what’s broken.',

    'home.contact.headline.before': 'Looking for a full-time AI / ML role starting mid-2026. ',
    'home.contact.headline.italic': 'F-1 OPT, open to relocation.',
    'home.contact.body':
      'Best way to reach me is email. I read everything and reply to most things within a day or two.',

    'writing.title': 'Writing',
    'writing.kicker': 'Essays · Updated monthly',
    'writing.intro':
      'On building production ML — the four layers before the LLM, the routing decisions upstream of the model, and field reports from a three-agent IDP pipeline.',
    'writing.subscribe.before': 'Subscribe via ',
    'writing.subscribe.rss': 'RSS',
    'writing.subscribe.middle': ' · or follow on ',
    'writing.subscribe.linkedin': 'LinkedIn',
    'writing.subscribe.after': '.',

    'work.title': 'Work',
    'work.kicker': 'Projects & Roles',
    'work.intro':
      'Where I’ve spent the last few years — a document IDP pipeline at TitanCloud, manufacturing CV research at Gannon, mobile ML at BitsKraft.',

    'about.kicker': 'About',
    'about.title.before': 'I build the parts of an ML system that ',
    'about.title.italic': 'aren’t the model',
    'about.title.after': '.',

    'notice.notTranslated.title': 'Not yet translated',
    'notice.notTranslated.body':
      'This piece isn’t available in Nepali yet. You can read the English version using the link below.',
    'notice.notTranslated.cta': 'Read in English →',

    '404.kicker': '404',
    '404.title.before': 'This page doesn’t exist ',
    '404.title.italic': 'yet',
    '404.title.after': '.',
    '404.dek':
      'Maybe it was here, maybe it never was. Try the front page or the writing index.',
    '404.home': 'Home',

    'footer.builtIn.before': 'Written, designed, and built in ',
    'footer.builtIn.place': 'Erie, PA',
    'footer.builtIn.after': '.',
    'footer.rss': 'RSS',
    'footer.linkedin': 'LinkedIn',
    'footer.github': 'GitHub',
    'footer.email': 'Email',

    'lang.switch.label': 'Read in नेपाली',
    'lang.switch.aria': 'Switch language to Nepali',
  },

  ne: {
    'site.tagline':
      'उत्पादनस्तरको एमएल प्रणाली बनाउने एआई इन्जिनियर। रिट्रिभल, एजेन्ट, र मोडलिङबाहेकका कामका बारेमा लेख्ने।',

    'nav.writing': 'लेखहरू',
    'nav.work': 'काम',
    'nav.about': 'परिचय',
    'nav.skipToContent': 'सामग्रीमा जानुहोस्',

    'home.kicker': 'एआई इन्जिनियर · TitanCloud',
    'home.title.before': 'वास्तवै ',
    'home.title.italic': 'चल्ने',
    'home.title.after': ' उत्पादनस्तरको एमएल प्रणाली बनाउँदै।',
    'home.dek':
      'एलएलएम पाइपलाइनको अधिकांश काम मोडेलभन्दा माथिल्लो तहमा हुन्छ। म ती तहहरूका बारेमा लेख्छु जसले एउटै टोकन खर्च हुनुअघि फिल्टर, राउट र भ्यालिडेट गर्छन् — र म तिनै तहहरू बनाउने काम गर्छु।',
    'home.cta.writing': 'चुनिएका लेखहरू पढ्नुहोस् →',
    'home.cta.work': 'काम हेर्नुहोस्',
    'home.cta.about': 'परिचय',

    'section.recentWriting': 'हालसालैका लेखहरू',
    'section.selectedWork': 'चुनिएका कामहरू',
    'section.about': 'परिचय',
    'section.contact': 'सम्पर्क',

    'cta.allEssays': 'सबै लेखहरू →',
    'cta.allProjects': 'सबै परियोजनाहरू →',
    'cta.readMore': 'लामो संस्करण पढ्नुहोस् →',
    'cta.getInTouch': 'सम्पर्क गर्नुहोस्',
    'cta.backToWriting': '← सबै लेखहरू',
    'cta.backToWork': '← सबै काम',
    'cta.read': 'पढ्नुहोस् →',
    'cta.caseStudy': 'केस स्टडी →',
    'cta.foundMistake.before': 'गल्ती भेट्नुभयो? ',
    'cta.foundMistake.link': 'मलाई भन्नुहोस्',
    'cta.foundMistake.after': '।',
    'cta.subscribeRss': 'RSS मार्फत सब्सक्राइब गर्नुहोस्',

    'meta.essay': 'लेख',
    'meta.caseStudy': 'केस स्टडी',
    'meta.minRead': 'मिनेटको पढाइ',
    'meta.min': 'मिनेट',
    'meta.updated': 'अपडेट',
    'meta.period': 'अवधि',
    'meta.stack': 'स्ट्याक',

    'home.about.body.1':
      'म TitanCloud मा एआई इन्जिनियर हुँ। मेरो Gannon विश्वविद्यालयबाट एमएस डेटा साइन्स डिसेम्बर २०२५ मा ४.० जीपीएसहित पूरा भएको छ।',
    'home.about.body.2':
      'TitanCloud अघि मैले BitsKraft मा अन-डिभाइस कम्प्युटर भिजन मोडेलहरू सिप गरें, र सात जना प्राध्यापकहरूको अनुसन्धान समूहको साझा एमएल पूर्वाधार सम्हालें। मोडेलभन्दा प्रणालीका “निरस” तहहरू मलाई बढी मनपर्छन् — किनभने वास्तविक प्रणाली बिग्रिँदा प्रायः मोडेल बिग्रेको हुँदैन।',

    'home.contact.headline.before':
      'मध्य २०२६ देखि सुरु हुने पूर्णकालीन एआई / एमएल भूमिकाको खोजीमा छु। ',
    'home.contact.headline.italic': 'F-1 OPT, सरुवाका लागि तयार।',
    'home.contact.body':
      'मलाई सम्पर्क गर्ने सजिलो तरिका इमेल हो। म सबै पढ्छु, र अधिकांश सन्देशको जवाफ एक-दुई दिनभित्र दिन्छु।',

    'writing.title': 'लेखहरू',
    'writing.kicker': 'लेखहरू · हरेक महिना अपडेट हुने',
    'writing.intro':
      'उत्पादनस्तरको एमएल बनाउने बारेमा — एलएलएमभन्दा अघिका चार तहहरू, मोडेलभन्दा माथिको राउटिङ निर्णयहरू, र तीन-एजेन्ट IDP पाइपलाइनबाटका प्रत्यक्ष अनुभवहरू।',
    'writing.subscribe.before': 'सब्सक्राइब गर्नुहोस् ',
    'writing.subscribe.rss': 'RSS',
    'writing.subscribe.middle': ' · वा फलो गर्नुहोस् ',
    'writing.subscribe.linkedin': 'LinkedIn',
    'writing.subscribe.after': ' मा।',

    'work.title': 'काम',
    'work.kicker': 'परियोजना र भूमिकाहरू',
    'work.intro':
      'पछिल्ला केही वर्ष मैले काम गरेका ठाउँहरू — TitanCloud मा डक्युमेन्ट IDP पाइपलाइन, Gannon मा निर्माण कम्प्युटर भिजन अनुसन्धान, र BitsKraft मा मोबाइल एमएल।',

    'about.kicker': 'परिचय',
    'about.title.before': 'म एमएल प्रणालीका ती भागहरू बनाउँछु जुन ',
    'about.title.italic': 'मोडेल होइनन्',
    'about.title.after': '।',

    'notice.notTranslated.title': 'अहिलेसम्म अनुवाद उपलब्ध छैन',
    'notice.notTranslated.body':
      'यो लेख अहिलेसम्म नेपालीमा उपलब्ध छैन। तपाईं तलको लिङ्कबाट अङ्ग्रेजी संस्करण पढ्न सक्नुहुन्छ।',
    'notice.notTranslated.cta': 'अङ्ग्रेजीमा पढ्नुहोस् →',

    '404.kicker': '४०४',
    '404.title.before': 'यो पेज ',
    '404.title.italic': 'अहिलेसम्म',
    '404.title.after': ' अस्तित्वमा छैन।',
    '404.dek':
      'कहिले थियो होला, कहिले थिएन होला। गृहपेज वा लेख सूचीमा जानुहोस्।',
    '404.home': 'गृह',

    'footer.builtIn.before': 'लेखिएको, डिजाइन गरिएको, र बनाइएको ',
    'footer.builtIn.place': 'इरी, पीए',
    'footer.builtIn.after': ' मा।',
    'footer.rss': 'RSS',
    'footer.linkedin': 'LinkedIn',
    'footer.github': 'GitHub',
    'footer.email': 'इमेल',

    'lang.switch.label': 'Read in English',
    'lang.switch.aria': 'भाषा अङ्ग्रेजीमा परिवर्तन गर्नुहोस्',
  },
};
