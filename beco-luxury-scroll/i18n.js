/* BECO luxury concept — bilingual content. One source of truth per string,
   swapped wholesale on toggle (not mixed on-screen), so RTL mirroring stays clean. */
window.BECO_I18N = {
  en: {
    dir: 'ltr',
    lang: 'en',
    toggleLabel: 'AR',
    nav: { specialities: 'Specialities', craft: 'Craft', enquire: 'Enquire' },
    hero: {
      eyebrow: 'Ajman Showroom — Stone &amp; Ceramic',
      titleLines: ['Crafting', 'Timeless Elegance'],
      sub: 'Marble, ceramic, sanitary ware and cabinetry — sculpted into a single, seamless surface.',
      cta1: 'View specialities',
      cta2: 'Enquire',
      scroll: 'Scroll to reveal'
    },
    specialities: {
      eyebrow: 'Our Specialities',
      title: 'Four materials.<br /><em>One standard.</em>',
      items: [
        { name: 'Marble', ar: 'رخام', desc: 'Book-matched slabs, cut and edge-finished in-house.' },
        { name: 'Ceramic', ar: 'سيراميك', desc: 'Porcelain slabs, floor and wall tiles, mosaics.' },
        { name: 'Sanitary Ware', ar: 'أدوات صحية', desc: 'Vessel sinks, mixers and complete bathroom suites.' },
        { name: 'Cabinets', ar: 'خزائن', desc: 'Vanities and storage, built to your dimensions.' }
      ]
    },
    craft: {
      eyebrow: 'Craft &amp; Supply',
      title: 'From a single slab<br />to the <em>whole villa</em>',
      body: 'Homeowners come to Al Rashidiya for one perfect piece; architects and contractors come for quantities, cutting and site delivery across the UAE. Either way, nothing leaves our floor that we would not fit in our own homes.',
      stats: [
        { num: '2', unit: '', label: 'floors of showroom' },
        { num: '4', unit: '', label: 'departments under one roof' },
        { num: '4.3', unit: '★', label: 'rating on Google Maps' },
        { num: '7', unit: '', label: 'days open every week' }
      ]
    },
    cta: {
      eyebrow: 'For Architects &amp; Designers',
      title: 'Start with a slab,<br /><em>not a sample</em>',
      sub: "Tell us about the project — we'll bring the material to you.",
      name: 'Name', phone: 'Phone / WhatsApp', type: 'Project type', message: 'Message',
      types: ['Residential', 'Commercial', 'Hospitality'],
      submit: 'Send enquiry',
      or: 'or',
      whatsapp: 'WhatsApp us directly'
    },
    footer: {
      address: 'Al Rashidiya 3, Ajman — near Safeer Mall, UAE',
      rights: 'BECO Building Materials Trading L.L.C. All rights reserved.'
    }
  },
  ar: {
    dir: 'rtl',
    lang: 'ar',
    toggleLabel: 'EN',
    nav: { specialities: 'التخصصات', craft: 'الحرفية', enquire: 'تواصل معنا' },
    hero: {
      eyebrow: 'صالة عرض عجمان — حجر وسيراميك',
      titleLines: ['صياغة', 'الأناقة الخالدة'],
      sub: 'رخام، سيراميك، أدوات صحية وخزائن — منحوتة في سطح واحد متكامل.',
      cta1: 'استعرض التخصصات',
      cta2: 'تواصل معنا',
      scroll: 'مرّر للأسفل للاستكشاف'
    },
    specialities: {
      eyebrow: 'تخصصاتنا',
      title: 'أربع مواد.<br /><em>معيار واحد.</em>',
      items: [
        { name: 'رخام', ar: 'Marble', desc: 'ألواح متطابقة الأوردة، تُقطّع وتُشطّب لدينا.' },
        { name: 'سيراميك', ar: 'Ceramic', desc: 'ألواح بورسلين، بلاط أرضيات وجدران، وموزاييك.' },
        { name: 'أدوات صحية', ar: 'Sanitary Ware', desc: 'أحواض، خلاطات، وأطقم حمامات كاملة.' },
        { name: 'خزائن', ar: 'Cabinets', desc: 'وحدات تخزين ومغاسل مصممة حسب مقاسك.' }
      ]
    },
    craft: {
      eyebrow: 'الحرفية والتوريد',
      title: 'من لوح واحد<br />إلى <em>الفيلا كاملة</em>',
      body: 'يأتي أصحاب المنازل إلى الراشدية لقطعة واحدة مثالية؛ ويأتي المهندسون والمقاولون للكميات والتقطيع والتوصيل في جميع أنحاء الإمارات. في الحالتين، لا يغادر معرضنا شيء لا نضعه في منازلنا.',
      stats: [
        { num: '2', unit: '', label: 'طابقين من المعرض' },
        { num: '4', unit: '', label: 'أقسام تحت سقف واحد' },
        { num: '4.3', unit: '★', label: 'تقييم على خرائط جوجل' },
        { num: '7', unit: '', label: 'أيام عمل أسبوعياً' }
      ]
    },
    cta: {
      eyebrow: 'للمهندسين ومصممي الديكور',
      title: 'ابدأ باللوح،<br /><em>لا بالعينة</em>',
      sub: 'أخبرنا عن مشروعك — سنُحضر المادة إليك.',
      name: 'الاسم', phone: 'الهاتف / واتساب', type: 'نوع المشروع', message: 'الرسالة',
      types: ['سكني', 'تجاري', 'فندقي'],
      submit: 'إرسال الطلب',
      or: 'أو',
      whatsapp: 'راسلنا مباشرة عبر واتساب'
    },
    footer: {
      address: 'الراشدية 3، عجمان — بالقرب من سفير مول، الإمارات',
      rights: 'بيكو لتجارة مواد البناء ذ.م.م. جميع الحقوق محفوظة.'
    }
  }
};
