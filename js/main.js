/* =========================================================
   אורלי בר · interactions v2
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const clamp = (a, b, v) => Math.min(b, Math.max(a, v));

  const IMG = 'https://orlybar.co.il/wp-content/uploads/';
  const src = (item) => IMG + (typeof item === 'string' ? item : item.f);
  const catOf = (item) => item.c;
  const pad = (n) => String(n).padStart(2, '0');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const motion = hasGSAP && !reduce;
  const isMobile = () => window.innerWidth < 768;

  root.classList.add('js');
  if (!motion) root.classList.add('reduce');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* =======================================================
     DATA (all images and copy come from the existing site)
     ======================================================= */
  const LIVING = 'סלון ופינת אוכל', KITCHEN = 'מטבח', BED = 'חדר שינה', TEEN = 'חדר נער', BATH = 'חדר רחצה', STYLE = 'סטיילינג';
  const P = (f, c) => ({ f: '2025/' + f, c });
  const PH = {
    salon: P('06/סלון.webp', LIVING),
    salonClose: P('06/סלון-מקרוב.webp', LIVING),
    armchair: P('06/סטיליינג-כורסא.webp', STYLE),
    dining: P('06/5453-1.webp', LIVING),
    flowers: P('06/פרחים-סטיילינג.webp', STYLE),
    kitchen2: P('06/מטבח-2.webp', KITCHEN),
    pink: P('06/סטיילינג-וורוד.webp', STYLE),
    kitchen3: P('06/מטבח-3.webp', KITCHEN),
    kitchen5: P('06/מטבח-5.webp', KITCHEN),
    handles: P('07/ידיות-מטבח.jpg', KITCHEN),
    kitchen: P('06/מטבח.webp', KITCHEN),
    blessing: P('06/סטיילינג-ברכת-הבית.webp', STYLE),
    mirror: P('06/סטיילינג-מראה.webp', STYLE),
    bathLight: P('06/IMG_2346-Edit.webp', BATH),
    bathDark: P('06/IMG_2343-Edit-Edit-e1748962730718.webp', BATH),
    open: P('06/IMG_2334-Edit-Edit.webp', LIVING),
    bathRound: P('06/IMG_2337-Edit-Edit.webp', BATH),
    bathDark2: P('06/IMG_2343-Edit-Edit-1.webp', BATH),
    perfume: P('06/שידה-חדר-שינה-1-1.webp', BED),
    dresser: P('06/שידה-חדר-שינה-.webp', BED),
    shabbat: P('06/שבת-שלום-סטיילינג.webp', STYLE),
    bed6: P('06/חדר-שינה-6.webp', BED),
    bed5: P('06/חדר-שינה-5.webp', BED),
    bed4: P('06/חדר-שינה-4.webp', BED),
    bed2: P('06/חדר-שינה-2.webp', BED),
    bed1: P('06/חדר-שינה-1.webp', BED),
    teen1: P('06/חדר-נער1.webp', TEEN),
    teenTree: P('06/עץ-חדר-נער.webp', TEEN),
    teen: P('06/חדר-נער.webp', TEEN),
    perfume2: P('06/שידה-חדר-שינה-1.webp', BED),
    kitchenBlack: P('06/DSC07568-1-e1748963995444.webp', KITCHEN)
  };
  const GALLERY = Object.values(PH); // same order as the original projects page

  // hero fan: the middle swatch is the hero photo of the original site and opens into the room
  const HERO = P('05/modern-hom1e-12decoration-e1748516799522.webp', KITCHEN);
  const HERO_POS = [0.22, 0.5]; // object-position used by the middle swatch and the full-screen photo
  const FAN = [PH.bathDark, PH.bed5, PH.salonClose, PH.armchair, HERO, PH.flowers, PH.kitchen3, PH.teen1, PH.bathRound];

  // the middle cell is the widest, most open space in the gallery
  const ZOOM = [PH.salonClose, PH.kitchen3, PH.bed6, PH.armchair, PH.open, PH.bathRound, PH.teen, PH.flowers, PH.dining];
  const REEL = [PH.kitchen, PH.bathDark, PH.bed5, PH.kitchen5, PH.mirror, PH.teen1, PH.kitchenBlack, PH.pink, PH.bathLight, PH.dresser];
  // the deck shows the photos two by two (five throws instead of ten)
  const PAIRS = REEL.reduce((acc, p, i) => { if (i % 2 === 0) acc.push([p]); else acc[acc.length - 1].push(p); return acc; }, []);
  const pairName = (pr) => [...new Set(pr.map(catOf))].join(' · ');

  // icons: the first two are the original site's line icons
  const ICONS = {
    plan: '<svg viewBox="0 0 50.002 49.044" aria-hidden="true"><path d="M15,20.232v34.1a.623.623,0,0,0,.622.622H28.7v3.853a.622.622,0,1,0,1.245,0V54.332q0-.033,0-.065t0-.065V51.7a.622.622,0,1,0-1.245,0V53.71H16.245V44.944H28.7v2.009a.622.622,0,1,0,1.245,0V44.322a.623.623,0,0,0-.622-.622H16.245V20.855H31.253v16.4H26.474a.622.622,0,0,0,0,1.245h10.8a.622.622,0,0,0,0-1.245H32.5v-16.4H47.5v16.4H42.725a.622.622,0,0,0,0,1.245h10.8a.622.622,0,0,0,0-1.245H48.749v-16.4H63.757v16.4H58.978a.622.622,0,1,0,0,1.245h4.779v5.2H53.909a.623.623,0,0,0-.622.622v3.554a.622.622,0,0,0,1.245,0V44.944h9.225v10.61H54.532V52.624a.622.622,0,0,0-1.245,0v7.107a.622.622,0,1,0,1.245,0V56.8h9.225V67.41H54.532V64.479a.622.622,0,0,0-1.245,0V67.41H29.945V63.557a.622.622,0,1,0-1.245,0v4.475a.623.623,0,0,0,.622.622H64.38A.623.623,0,0,0,65,68.032v-47.8a.623.623,0,0,0-.622-.622H15.622a.623.623,0,0,0-.622.622Z" transform="translate(-15 -19.61)"/></svg>',
    sofa: '<svg viewBox="0 0 78.987 61.843" aria-hidden="true"><path d="M205.2,208.383a8.486,8.486,0,0,1,2.21,2.3.963.963,0,1,1-1.614,1.053,6.567,6.567,0,0,0-1.71-1.778.963.963,0,1,1,1.114-1.572Z" transform="translate(-159.67 -189.772)"/><path d="M38.6,153.309h7.061V109.183c0-.016,0-.031,0-.047,0-7.618-5.877-13.816-13.1-13.816-6.945,0-12.642,5.729-13.072,12.941a8.5,8.5,0,0,1,7.5,8.428v1.505a.963.963,0,0,1-.963.963H21.728a3.516,3.516,0,0,1-6.83,0H10.963a.963.963,0,0,1-.963-.963v-1.505a8.5,8.5,0,0,1,7.55-8.436c.438-8.272,7-14.86,15-14.86,8.259,0,14.982,7.016,15.027,15.656,0,.022,0,.045,0,.067v44.192h6.064a.963.963,0,0,1,0,1.927H38.6a.963.963,0,1,1,0-1.926Zm-20.283-33.4a1.6,1.6,0,0,0,1.33-.753H16.983A1.6,1.6,0,0,0,18.313,119.911Zm-6.386-3.222v.542H25.051v-.542a6.562,6.562,0,0,0-13.124,0Z" transform="translate(24.377 -93.393)"/><path d="M141.743,319.536v-6.374a4.06,4.06,0,0,1,4.086-4.023h17.627a4.048,4.048,0,0,1,2.89,1.193c.079.08.154.163.226.248a4.1,4.1,0,0,1,3.13-1.44h17.727a4.06,4.06,0,0,1,4.086,4.023v6.392a4.658,4.658,0,0,1,4.247,4.6v11.228a.963.963,0,0,1-.963.963h-7.468a.963.963,0,0,1-.963-.963V334.1l-39.777.012v1.271a.963.963,0,0,1-.963.963h-7.468a.963.963,0,0,1-.963-.963V324.155A4.662,4.662,0,0,1,141.743,319.536Zm23.238-7.845a2.135,2.135,0,0,0-1.525-.626H145.829a2.131,2.131,0,0,0-2.159,2.1v6.715a4.63,4.63,0,0,1,2.919,4.277v.377l19.021,0,0-11.268a2.186,2.186,0,0,0-.627-1.568Zm22.447-.626H169.7a2.131,2.131,0,0,0-2.159,2.1l0,11.363,18.829-.005v-.366a4.637,4.637,0,0,1,3.221-4.387v-6.605a2.131,2.131,0,0,0-2.16-2.1Zm.865,23.354h5.542V324.155a2.772,2.772,0,0,0-5.542,0Zm-1.927-2.246v-5.725l-19.791.005h0l-19.984.006v5.727Zm-47.246,2.247h5.542V324.155a2.772,2.772,0,0,0-5.542,0Z" transform="translate(-137.194 -274.503)"/></svg>',
    focus: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M21 6a15 15 0 1 0 9.4 26.7l10.5 10.5a1.3 1.3 0 0 0 1.8-1.8L32.2 30.9A15 15 0 0 0 21 6zm0 2.6a12.4 12.4 0 1 1 0 24.8 12.4 12.4 0 0 1 0-24.8zm0 6.2a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 2.6a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2z"/></svg>'
  };

  const SERVICES = [
    {
      name: 'תכנון ועיצוב פנים', icon: ICONS.plan,
      short: 'תהליך ליווי עמוק ומדויק של יצירת סביבה ביתית שתתאים ותשקף את הייחודיות של הנפשות בבית',
      img: '2025/06/interior-architect-project-with-pencil-colour-spectrum-renovation-concept-3.webp',
      bg: PH.kitchen.f,
      body: [
        'עיצוב הפנים הוא לא רק על יצירת חזות חיצונית מושכת- זהו תהליך עמוק ורב-ממדי של יצירת סביבה המשקפת את הנפש והייחודיות של האדם. כאשר אנו מתכננים ומעצבים מרחבים, אנו למעשה מעצבים את החוויה הפנימית של מי שחי בהם.',
        'כל פרט בעיצוב - הצבעים שנבחרו, דרך הריהוט והתאורה ועד לפרטים הקטנים ביותר - הוא הזדמנות להעצים את הרוח, להעלות את המצב הרוחני ולאפשר התבוננות חדשה על העולם. כאשר אנו מקדישים את הלב והנפש לתכנון הסביבה, אנו יכולים ליצור מרחבים המעוררים השראה, מרגיעים את הנפש ומאפשרים התפתחות אישית.',
        'בעבודתי כמעצבת הפנים שלכם, אני רואה את עצמי כיוצרת של חוויות חושיות ורגשיות. אני מקשיבה בעומק לצרכים הייחודיים שלכם, כדי להבין את אישיותכם ואת חלומותיכם, את הדרך בה תרצו להרגיש בתוך ביתו.',
        'מתוך הבנה זו אני יכולה ליצור עיצובים המשקפים את נשמתכם וכן יאפשרו לכם להתפתח ובנוסף לחיות את החלום.',
        'בתהליך של תכנון ועיצוב פנים- באם זה עיצוב בית פרטי, עיצוב דופלקס או עיצוב וילה אלווה אתכם בכל התהליך עד להגשמת כל החלומות!'
      ]
    },
    {
      name: 'הום סטיילינג', icon: ICONS.sofa,
      short: 'תהליך עיצוב שמטרתו לשדרג את המראה והאווירה בחלל שלכם בצורה מותאמת אישית',
      img: PH.pink.f,
      bg: PH.armchair.f,
      body: [
        'הום סטיילינג הוא תהליך עיצוב שמטרתו לשדרג את המראה והאווירה בחלל שלכם בצורה מותאמת אישית.',
        'אני רוצה להגשים את זה בדיוק כפי שתמיד חלמתם, תוך שמירה על פונקציונליות ונוחות.',
        'כמעצבת שלכם, אני אתמקד בהבנת הצרכים והטעמים האישיים שלכם, ואכוון אתכם בבחירות צבעים, רהיטים, טקסטיל, תאורה ואביזרים דקורטיביים.',
        'העבודה תהיה ממוקדת בלא רק להיראות יפה, אלא גם להיות פרקטית.',
        'בשיתוף פעולה מלא, בו אני אעזור לכם ליצור חלל שמרגיש כמו הבית האידיאלי עבורכם.',
        'אני אהיה שם בכל שלב, מהשלב הראשוני של ההכוונה ועד לתוצאה הסופית - הבית המעוצב שלכם!',
        'אני מבטיחה שהתוצאה הסופית תהיה לא רק מעוצבת ומרשימה, אלא גם שתהפוך את החלל למקום שהכי נעים לחזור אליו ולשהות בו.'
      ]
    },
    {
      name: 'ייעוץ פוקוס', icon: ICONS.focus,
      short: 'ננתח את הבעיה או הצורך הספציפי בחלל ונגיע לפתרונות עיצוביים ממוקדים ומותאמים אישית',
      img: PH.handles.f,
      bg: PH.mirror.f,
      body: [
        'יעוץ בעיצוב פנים הוא שירות ממוקד, שבו אני המעצבת- מנתחת את הבעיה או צורך ספציפי בחלל ומספקת פתרונות עיצוביים ממוקדים מותאמים אישית. הייעוץ יכול לפעול בכמה תחומים, למשל:',
        ['שדרוג חלל מסוים', 'התאמת סגנון עיצובי', 'שיפור הפונקציונליות', 'בחירת צבעים, חומרים או רהיטים', 'הדרכה לבחירת פריטים דקורטיביים'],
        'בתהליך הייעוץ אבצע סקירה של החלל, אקשיב לצרכים וההעדפות שלכם ואספק הצעות ממוקדות פתרונות פרקטיים שיכולים לשדרג את החלל באופן מהיר ויעיל.',
        'כמו כן יכול לכלול הצגת סקיצות, הדמיות או פשוט המחשה.',
        'המטרה של ייעוץ בעיצוב פנים היא לעזור לכם להגיע להחלטות עיצוביות ממוקדות ואפקטיביות, ולהשיג את התוצאה הרצויה ללא תקופה ארוכה ומורכבת.',
        'מדובר בפתרון אידיאלי עבור לקוחות שמחפשים פתרונות ממוקדים ומעשיים. בדיוק בשביל הגשה זו, אני כאן עבורכם ♥'
      ]
    }
  ];

  const VALUES = [
    { word: 'thanksgiving', title: 'הודיה', img: PH.salon.f, text: 'אני מכירה בברכה שיש בידיי להביא לחיי האנשים שאותם אני בוחרת והם בחרו בי ומחויבת להשתמש בה באחריות ובהקשבה. ההודיה היא מקור לחיבור עמוק ולהשראה מתמדת.' },
    { word: 'bonding', title: 'חיבור', img: PH.dining.f, text: 'אני מאמינה בחיבור עמוק בין האדם לסביבתו, בין הפנימי לחיצוני. תכנון הפנים הוא הזדמנות לגשר על פערים אלה ולאפשר חוויה הוליסטית של מרחב ונפש. אני מקשיבה לעומק כדי להבין את הצרכים הייחודיים של כל אדם ולהעניק לו סביבה המשקפת את מהותו.' },
    { word: 'passion', title: 'תשוקה', img: PH.bathDark.f, text: 'העבודה שלי מונעת על ידי תשוקה בלתי נלאית ליצירת חוויות מרפאות ומעצימות. אני מתמסרת בכל ליבי לתהליך התכנון והעיצוב, מחפשת פתרונות יצירתיים ומשקיעה את כל הלב והנשמה כדי להביא לידי ביטוי את הייחודיות של כל לקוח ולקוח.' },
    { word: 'satisfaction', title: 'סיפוק', img: PH.kitchen.f, text: 'המטרה העליונה שלי היא להעניק סיפוק עמוק ללקוחותיי. לא רק סיפוק חזותי, אלא סיפוק רוחני, רגשי וחושי. אני רואה את עצמי כיוצרת של חוויות טרנספורמטיביות, המאפשרות לאנשים להתפתח, להתעלות ולחוות את עצמם בצורה חדשה דרך העיצוב והגשמת החלום בביתם.' }
  ];

  // images are the ones the original site shows on each article card
  const ARTICLES = [
    { t: 'מה הם הטרנדים הכי חמים בעיצוב פנים לשנת 2025?', ex: 'העולם משתנה - והעיצוב משתנה יחד איתו. שנת 2025 מביאה...', slug: 'מה-הם-הטרנדים-הכי-חמים-בעיצוב-פנים-לשנת/', img: PH.kitchen2.f },
    { t: 'איך בוחרים מעצבת פנים באזור השרון?', ex: 'תחילה , הגדירו בזיהוי הצרכים שלכם: האם מדובר בהום סטייליג?...', slug: 'איך-בוחרים-מעצבת-פנים-באזור-השרון/', img: PH.dining.f },
    { t: '5 טיפים לעיצוב הבית', ex: 'הגדרת סגנון ברור לפני שמתחילים לבחור צבעים או רהיטים, חשוב...', slug: '5-טיפים-לעיצוב-הבית/', img: PH.handles.f },
    { t: 'מה ההבדל בין עיצוב פנים לסטיילינג?', ex: 'כשמדברים על עיצוב הבית, לא מעט אנשים מתבלבלים בין שני...', slug: 'מה-ההבדל-בין-עיצוב-פנים-לסטיילינג/', img: PH.teenTree.f },
    { t: 'איך בוחרים קונספט לעסק או לבית?', ex: 'לוח השראה ולוח חומרים לוח השראה הוא לוח שאיתו מתחילים...', slug: 'מה-הם-הטרנדים-הכי-חמים-בעיצוב-פנים-לשנ-2/', img: PH.flowers.f }
  ];
  const artHref = (a) => 'https://orlybar.co.il/' + encodeURI(a.slug);
  // where each note sits on the board (desktop), percentages of the board + its tilt
  const BOARD = [
    { l: 66, t: 6, r: -3, lg: true },
    { l: 40, t: 3, r: 4 },
    { l: 13, t: 8, r: -5 },
    { l: 48, t: 50, r: -2 },
    { l: 22, t: 52, r: 5 }
  ];

  /* =======================================================
     RENDER
     ======================================================= */
  const fanCenter = () => (FAN.length - 1) / 2;
  const fanStep = () => (isMobile() ? 9.5 : 12.5);
  const baseAngle = (i) => (fanCenter() - i) * fanStep(); // RTL: swatch 01 opens to the right

  function renderFan() {
    const c = fanCenter();
    $('.fan').innerHTML = FAN.map((p, i) => `
      <div class="swatch${i === c ? ' swatch--main' : ''}" role="listitem" data-i="${i}" style="z-index:${20 + FAN.length - Math.abs(i - c)};transform:rotate(${baseAngle(i)}deg)">
        <div class="swatch__intro"><div class="swatch__tilt">
          <div class="swatch__in">
            <span class="swatch__img"><img src="${src(p)}" alt=""${i === c ? ` style="object-position:${HERO_POS[0] * 100}% ${HERO_POS[1] * 100}%"` : ''}></span>
            <span class="swatch__label"><b>${pad(i + 1)}</b><span>${catOf(p)}</span></span>
            <span class="swatch__hole" aria-hidden="true"></span>
          </div>
        </div></div>
      </div>`).join('') + '<span class="fan__rivet" aria-hidden="true"></span>';
  }

  function renderPanels() {
    $('.panels').innerHTML = SERVICES.map((s, i) => `
      <article class="panel${i === 0 ? ' is-active' : ''}" data-i="${i}">
        <div class="panel__bg"><img src="${src(s.bg)}" alt="" loading="lazy"></div>
        <div class="panel__shade"></div>
        <button class="panel__hit" type="button" aria-expanded="${i === 0}" aria-label="${s.name}"></button>
        <div class="panel__closed" aria-hidden="true">
          <span class="panel__num">${pad(i + 1)}</span>
          <span class="panel__vname">${s.name}</span>
          <span class="panel__mini">${s.icon}</span>
        </div>
        <div class="panel__open">
          <span class="panel__icon">${s.icon}<span>${pad(i + 1)}</span></span>
          <h3 class="panel__name">${s.name}</h3>
          <p class="panel__short">${s.short}</p>
          <button class="btn btn--accent magnetic" type="button" data-svc="${i}"><span class="btn__label">לפרטים נוספים</span><span class="btn__arrow" aria-hidden="true">←</span></button>
        </div>
      </article>`).join('');
  }

  function renderValues() {
    $('.values__words').innerHTML = VALUES.map((v, i) => `<h3 class="vword" data-split="chars"${i ? ' aria-hidden="true"' : ''}>${v.title}</h3>`).join('');
    $('.values__paras').innerHTML = VALUES.map((v) => `<p class="vpara">${v.text}</p>`).join('');
    $('.values__frame').innerHTML = VALUES.map((v) => `<div class="vimg"><img src="${src(v.img)}" alt="" loading="lazy"></div>`).join('');
    $('.values__nav').innerHTML = VALUES.map((v, i) => `<button class="vnav" type="button" data-k="${i}">${v.title}<span class="vnav__track"><span class="vnav__fill"></span></span></button>`).join('');
    $('.values__bgword').innerHTML = VALUES.map((v) => `<span class="vbg">${v.word}</span>`).join('');
  }

  function renderZoom() {
    $('.zoom__grid').innerHTML = ZOOM.map((p, i) => `
      <figure class="zoom__cell${i === 4 ? ' zoom__cell--main' : ''}">
        <div class="zoom__in"><img src="${src(p)}" alt="${catOf(p)}" loading="${i === 4 ? 'eager' : 'lazy'}"></div>
      </figure>`).join('');
  }

  // the projects deck: framed photos on a stack, plus the shared counter, line and caption
  function renderGallery() {
    $('.gal').innerHTML = `
      <div class="deck">
        <div class="deck__pin">
          <div class="deck__side">
            <div class="gal-ui">
              <div class="gal-ui__row">
                <span class="gal-ui__count"><b class="gal-ui__cur">01</b> / <span class="gal-ui__total">${pad(PAIRS.length)}</span></span>
                <span class="gal-ui__progress"><span></span></span>
              </div>
              <p class="gal-ui__caption" aria-live="polite"><span>${pairName(PAIRS[0])}</span></p>
              <a href="#gallery" class="link-line" data-open-gallery><span class="roll-me">לגלריית פרויקטים</span><svg viewBox="0 0 40 12" aria-hidden="true"><path d="M40 6H2m0 0 5-5M2 6l5 5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></a>
            </div>
          </div>
          <div class="deck__stage">
            <div class="deck__stack">
              <a class="dcard dcard--end" href="#gallery" data-open-gallery data-cursor="פתחו" style="z-index:1">לגלריית פרויקטים<small aria-hidden="true">←</small></a>
              ${REEL.map((p, j) => `
              <button class="dcard" type="button" data-j="${j}" data-cursor="צפו" style="z-index:${REEL.length - j + 2}" aria-label="הגדלת תמונה: ${catOf(p)}">
                <img src="${src(p)}" alt="" loading="lazy">
                <span class="dcard__cap"><b>${pad(j + 1)}</b><span>${catOf(p)}</span></span>
              </button>`).join('')}
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderBoard() {
    $('.board').insertAdjacentHTML('beforeend', ARTICLES.map((a, i) => {
      const pos = BOARD[i];
      return `
      <article class="note${pos.lg ? ' note--lg' : ''}" style="left:${pos.l}%;top:${pos.t}%;--r:${pos.r}deg" data-cursor="גררו">
        <div class="note__in">
          <div class="note__card">
            <span class="note__tape" aria-hidden="true"></span>
            <div class="note__img"><img src="${src(a.img)}" alt="" loading="lazy" draggable="false"><span class="note__num">${pad(i + 1)}</span></div>
            <h3 class="note__title">${a.t}</h3>
            <p class="note__ex">${a.ex}</p>
            <a class="note__link" href="${artHref(a)}" target="_blank" rel="noopener">להמשך קריאה ←</a>
          </div>
        </div>
      </article>`;
    }).join(''));
  }

  function renderFooterArticles() {
    // same order as the original footer: newest first
    const order = [4, 0, 3, 2, 1];
    $('.footer__arts').innerHTML = order.map((k) => `<a href="${artHref(ARTICLES[k])}" target="_blank" rel="noopener">${ARTICLES[k].t}</a>`).join('');
  }

  /* =======================================================
     TEXT HELPERS
     ======================================================= */
  function split(el) {
    if (el.dataset.done) return el;
    el.dataset.done = '1';
    const mode = el.dataset.split || (el.hasAttribute('data-scrub') ? 'scrub' : 'words');
    const label = el.textContent.trim().replace(/\s+/g, ' ');
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            if (mode === 'scrub') {
              w.className = 'sw';
              w.textContent = part;
            } else {
              w.className = 'w';
              w.setAttribute('aria-hidden', 'true');
              const wi = document.createElement('span');
              wi.className = 'wi';
              if (mode === 'chars') {
                Array.from(part).forEach((ch) => {
                  const c = document.createElement('span');
                  c.className = 'c';
                  c.textContent = ch;
                  wi.appendChild(c);
                });
              } else {
                wi.textContent = part;
              }
              w.appendChild(wi);
            }
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    };
    walk(el);
    if (mode !== 'scrub') {
      el.classList.add('mask');
      const sr = document.createElement('span');
      sr.className = 'sr';
      sr.textContent = label;
      el.appendChild(sr);
    }
    return el;
  }

  function rollify(el) {
    const target = el.querySelector('.btn__label') || (el.classList.contains('btn') ? null : el);
    if (!target || target.querySelector('.roll')) return;
    const t = target.textContent.trim();
    target.innerHTML = `<span class="roll"><span data-t="${t}">${t}</span></span>`;
  }

  // position of an element inside an ancestor, ignoring transforms
  function rectIn(el, ancestor) {
    let x = 0, y = 0, n = el;
    while (n && n !== ancestor) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { left: x, top: y, width: el.offsetWidth, height: el.offsetHeight };
  }

  /* =======================================================
     SMOOTH SCROLL
     ======================================================= */
  let lenis = null;
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    if (!reduce && typeof window.Lenis !== 'undefined') {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.95 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }
  const getY = () => (lenis ? lenis.scroll : window.scrollY);

  let menuOpen = false, galleryOpen = false, lbOpen = false, drawerOpen = false, booting = motion;
  function syncLock() {
    const locked = booting || menuOpen || galleryOpen || lbOpen || drawerOpen;
    root.classList.toggle('is-locked', locked);
    if (lenis) locked ? lenis.stop() : lenis.start();
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.7, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else if (typeof target === 'number') window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  /* =======================================================
     LOADER
     ======================================================= */
  const imgReady = (img) => new Promise((res) => {
    if (!img || img.complete) return res();
    img.addEventListener('load', res, { once: true });
    img.addEventListener('error', res, { once: true });
  });

  function runLoader() {
    const loader = $('.loader');
    if (!motion) { if (loader) loader.remove(); return Promise.resolve(); }
    window.scrollTo(0, 0);
    syncLock();
    const num = $('.loader__num');
    const bar = $('.loader__bar span');
    const c = { v: 0 };
    const assets = Promise.race([
      Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), imgReady($('.hero__img')), imgReady($('.swatch--main img'))]),
      new Promise((r) => setTimeout(r, 3500))
    ]);
    gsap.from('.loader__mark', { clipPath: 'inset(0% 0% 0% 100%)', duration: 1.6, ease: 'expo.inOut' });
    gsap.from('.loader__name', { y: 20, opacity: 0, duration: 1, delay: .5, ease: 'power3.out' });
    const counting = new Promise((r) => gsap.to(c, {
      v: 100, duration: 1.9, ease: 'power3.inOut',
      onUpdate() { num.textContent = Math.round(c.v); bar.style.transform = `scaleX(${c.v / 100})`; },
      onComplete: r
    }));
    return Promise.all([assets, counting]).then(() => new Promise((resolve) => {
      gsap.timeline({ onComplete: () => loader.remove() })
        .to('.loader__inner, .loader__count', { y: -40, opacity: 0, duration: .55, ease: 'power3.in' })
        .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=.15')
        .add(resolve, '-=.75');
    }));
  }

  /* =======================================================
     HERO: the swatch fan
     ======================================================= */
  const pin = $('.hero__pin');
  let heroProgress = 0;

  function setIntroStates() {
    gsap.set('.hero__title .c', { yPercent: 118 });
    // the heart is drawn as one gold line during the intro
    const hl = $('.heart__line');
    const hlen = hl.getTotalLength();
    gsap.set(hl, { strokeDasharray: hlen, strokeDashoffset: hlen });
    gsap.set('.hero__eyebrow', { y: 20, opacity: 0 });
    gsap.set('.hero__cta', { y: 24, clipPath: 'inset(0% 0% 100% 0%)' }); // opacity belongs to the scroll timeline
    gsap.set('.fan__rivet', { scale: 0, opacity: 0 });
    // the fan starts closed and below the fold: the intro wrapper undoes each swatch's angle
    $$('.swatch').forEach((s) => gsap.set($('.swatch__intro', s), { rotation: -baseAngle(+s.dataset.i), y: window.innerHeight * .75 }));
    gsap.set('.nav', { yPercent: -130 });
  }

  // a small point of light travels once around the heart, every few seconds
  function heartGlint() {
    const g = $('.heart__glint');
    const len = g.getTotalLength();
    const seg = len * .1;
    gsap.set(g, { strokeDasharray: `${seg} ${len}`, strokeDashoffset: seg });
    gsap.timeline({ repeat: -1, repeatDelay: 4.5, delay: .6 })
      .to(g, { opacity: 1, duration: .35 }, 0)
      .fromTo(g, { strokeDashoffset: seg }, { strokeDashoffset: seg - len, duration: 2.6, ease: 'power1.inOut' }, 0)
      .to(g, { opacity: 0, duration: .45 }, 2.2);
  }

  function heroIntro() {
    if (!motion) return;
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to('.hero__eyebrow', { y: 0, opacity: 1, duration: 1.2 }, .2)
      .to('.hero__title .c', { yPercent: 0, duration: 1.5, stagger: .05 }, .3)
      .to('.swatch__intro', { y: 0, duration: 1.4, stagger: { each: .05, from: 'center' } }, .35)
      .to('.fan__rivet', { scale: 1, opacity: 1, duration: .9, ease: 'back.out(3)' }, 1.05)
      .to('.swatch__intro', { rotation: 0, duration: 1.7, ease: 'expo.inOut', stagger: { each: .03, from: 'center' } }, 1.05)
      .to('.heart__line', { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut', onComplete: heartGlint }, 1.0)
      .to('.hero__cta', { y: 0, clipPath: 'inset(0% 0% -20% 0%)', duration: 1.2, stagger: .1 }, 1.7)
      .to('.nav', { yPercent: 0, duration: 1.3, onComplete: () => gsap.set('.nav', { clearProps: 'transform' }) }, .9);
  }

  function heroScroll() {
    const main = $('.swatch--main');
    const sides = $$('.swatch:not(.swatch--main)');
    if (!motion) return;

    const media = $('.hero__media');
    const mimg = $('.hero__img');
    const cardRect = () => rectIn($('.swatch__img', main), pin);
    const clipFrom = () => {
      const r = cardRect(), W = pin.clientWidth, H = pin.clientHeight;
      return `inset(${r.top.toFixed(1)}px ${(W - r.left - r.width).toFixed(1)}px ${(H - r.top - r.height).toFixed(1)}px ${r.left.toFixed(1)}px round 3px)`;
    };
    // transform that makes the full-screen photo look exactly like the photo inside the middle swatch
    const coverMap = () => {
      const W = pin.clientWidth, H = pin.clientHeight;
      const iw = mimg.naturalWidth || 1920, ih = mimg.naturalHeight || 1080;
      const [px, py] = HERO_POS;
      const S = Math.max(W / iw, H / ih), fw = iw * S, fh = ih * S;
      const fcx = (W - fw) * px + fw / 2, fcy = (H - fh) * py + fh / 2;
      const r = cardRect();
      const Sc = Math.max(r.width / iw, r.height / ih), cw = iw * Sc, ch = ih * Sc;
      const ccx = r.left + (r.width - cw) * px + cw / 2, ccy = r.top + (r.height - ch) * py + ch / 2;
      const k = Sc / S;
      return { k, x: ccx - W / 2 - (fcx - W / 2) * k, y: ccy - H / 2 - (fcy - H / 2) * k };
    };

    // upright screens: pan so the kitchen cabinets keep a narrow strip on the left (20%) and the rest is white wall
    const wallPan = () => {
      const W = pin.clientWidth, H = pin.clientHeight;
      const iw = mimg.naturalWidth || 1920, ih = mimg.naturalHeight || 1080;
      const shown = iw * Math.max(W / iw, H / ih);
      if (shown - W < 2) return 50; // wide screens see the whole width already
      const kitchenEnd = .37 * shown; // the cabinets end at about 37% of the photo
      return clamp(0, 100, ((kitchenEnd - .2 * W) / (shown - W)) * 100);
    };

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true,
        onUpdate: (st) => { heroProgress = st.progress; updateNav(); }
      }
    })
      // 1. the fan closes and the words step back
      .fromTo('.hero__cta', { autoAlpha: 1 }, { autoAlpha: 0, duration: .08 }, 0)
      .fromTo('.hero__top', { yPercent: 0, opacity: 1, filter: 'blur(0px)' }, { yPercent: -40, opacity: 0, filter: 'blur(8px)', duration: .2 }, 0)
      .fromTo(sides, { rotation: (k, el) => baseAngle(+el.dataset.i) }, { rotation: 0, duration: .22, ease: 'power2.inOut' }, 0)
      .fromTo(sides, { y: 0, opacity: 1 }, { y: () => window.innerHeight * .3, opacity: 0, duration: .14, ease: 'power2.in' }, .1)
      .fromTo('.fan__rivet', { opacity: 1 }, { opacity: 0, duration: .08 }, .12)
      .fromTo(main, { opacity: 1 }, { opacity: 0, duration: .08 }, .17)
      // 2. the middle swatch becomes the room
      .fromTo(media, { autoAlpha: 0 }, { autoAlpha: 1, duration: .001 }, 0)
      .fromTo(media, { clipPath: clipFrom }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: .42, ease: 'power2.inOut' }, .16)
      .fromTo(mimg, { scale: () => coverMap().k, x: () => coverMap().x, y: () => coverMap().y }, { scale: 1, x: 0, y: 0, duration: .42, ease: 'power2.inOut' }, .16)
      .fromTo(mimg, { filter: 'saturate(1)' }, { filter: 'saturate(1.08)', duration: .3 }, .3)
      // 3. the sentence rises over the room
      // no darkening: the photo pans to its white wall (visible on upright screens; wide screens already show it)
      .fromTo(mimg, { objectPosition: '22% 50%' }, { objectPosition: () => `${wallPan()}% 50%`, duration: .14, ease: 'power2.inOut' }, .5)
      .fromTo('.hero__statement', { autoAlpha: 0 }, { autoAlpha: 1, duration: .02 }, .58)
      .fromTo('.hero__statement .line .c', { yPercent: 118 }, { yPercent: 0, duration: .16, stagger: .006, ease: 'power2.out' }, .6)
      .fromTo('.hero__statement .statement__small .wi', { yPercent: 118 }, { yPercent: 0, duration: .12, stagger: .006, ease: 'power2.out' }, .76)
      .to({}, { duration: .1 });

    // touch screens: the fan breathes open and closed a little by itself
    if (!finePointer) {
      const c = fanCenter();
      sides.forEach((s) => {
        const d = (+s.dataset.i - c) / c;
        gsap.to($('.swatch__tilt', s), { rotation: -d * 2.6, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 3.4 + Math.abs(d) * .15 });
      });
    }
    // the fan leans with the mouse (the middle swatch stays still so the room lines up)
    if (finePointer) {
      const c = fanCenter();
      const tilts = sides.map((s) => {
        const d = (+s.dataset.i - c) / c;
        return { d, set: gsap.quickTo($('.swatch__tilt', s), 'rotation', { duration: 1.2, ease: 'power3' }) };
      });
      $('.hero').addEventListener('mousemove', (e) => {
        if (heroProgress > .02) return;
        const mx = (e.clientX / window.innerWidth - .5) * 2;
        const my = e.clientY / window.innerHeight;
        tilts.forEach((t) => t.set(-mx * 4 * Math.abs(t.d) - t.d * 5 * Math.max(0, my - .5)));
      });
    }
  }

  /* =======================================================
     SERVICES: listening wave + panels
     ======================================================= */
  function wave() {
    const cv = $('.wave');
    if (!cv || !cv.getContext) return;
    const ctx = cv.getContext('2d');
    let W = 0, H = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    let mx = -9999, energy = 0, target = 0, visible = false, t = 0, lastY = getY(), vel = 0;
    const sec = $('.services');
    sec.addEventListener('mousemove', (e) => { mx = e.clientX - cv.getBoundingClientRect().left; target = 1; });
    sec.addEventListener('mouseleave', () => { target = 0; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(cv);

    const auto = () => !finePointer || isMobile(); // phones and touch screens: a very gentle voice moves by itself
    const draw = () => {
      const y = getY();
      vel += ((y - lastY) - vel) * .1; lastY = y;
      t += .016;
      if (auto()) { mx = W * (.5 + .38 * Math.sin(t * .35)); target = .32; }
      energy += (target - energy) * .05;
      ctx.clearRect(0, 0, W, H);
      const gap = 7, n = Math.floor(W / gap), mid = H / 2, spread = Math.max(120, W * .1);
      const scrollE = Math.min(Math.abs(vel) * .015, .35);
      ctx.lineCap = 'round';
      ctx.lineWidth = 2;
      for (let i = 0; i < n; i++) {
        const x = i * gap + gap / 2;
        const prox = Math.exp(-((x - mx) ** 2) / (2 * spread * spread)) * energy;
        const voice = Math.abs(Math.sin(t * 3.1 + i * .47) * Math.sin(t * 1.7 + i * .13));
        const idle = .08 + .06 * (Math.sin(t * 1.4 + i * .18) + 1) / 2;
        const a = Math.min(1, idle + (prox * .9 + scrollE) * voice);
        const hgt = Math.max(1.2, a * mid * .96);
        ctx.strokeStyle = `rgba(202,161,104,${(.28 + .72 * Math.min(1, prox + scrollE + .1)).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(x, mid - hgt); ctx.lineTo(x, mid + hgt); ctx.stroke();
      }
    };
    if (!motion) { t = 2; draw(); return; }
    gsap.ticker.add(() => { if (visible) draw(); });
  }

  function panels() {
    const items = $$('.panel');
    const activate = (i) => items.forEach((p, k) => {
      const on = k === i;
      p.classList.toggle('is-active', on);
      $('.panel__hit', p).setAttribute('aria-expanded', String(on));
      $('.panel__open', p).inert = !on;
    });
    activate(0);
    items.forEach((p, i) => {
      if (finePointer) p.addEventListener('mouseenter', () => activate(i));
      $('.panel__hit', p).addEventListener('click', () => activate(i));
      if (finePointer && motion) {
        const img = $('.panel__bg img', p);
        const xTo = gsap.quickTo(img, 'xPercent', { duration: 1.2, ease: 'power3' });
        const yTo = gsap.quickTo(img, 'yPercent', { duration: 1.2, ease: 'power3' });
        p.addEventListener('mousemove', (e) => {
          const r = p.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width - .5) * -3);
          yTo(((e.clientY - r.top) / r.height - .5) * -3);
        });
      }
    });
    $$('[data-svc]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); openService(+b.dataset.svc); }));
    if (motion) {
      gsap.from(items, {
        clipPath: 'inset(100% 0% 0% 0% round 3px)', duration: 1.5, stagger: .12, ease: 'expo.out',
        scrollTrigger: { trigger: '.panels', start: 'top 82%', once: true },
        onComplete() { gsap.set(items, { clearProps: 'clipPath' }); }
      });
    }
  }

  /* =======================================================
     VALUES: pinned stage
     ======================================================= */
  function values() {
    const sec = $('.values');
    const N = VALUES.length;
    const words = $$('.vword'), paras = $$('.vpara'), imgs = $$('.vimg'), navs = $$('.vnav'), bgs = $$('.vbg');
    const fills = navs.map((n) => $('.vnav__fill', n));
    const cur = $('.values__cur');
    const bgwrap = $('.values__bgword');
    let active = -1;

    if (hasGSAP) { gsap.set($$('.vword .c'), { yPercent: 118 }); gsap.set(paras, { autoAlpha: 0 }); }

    const show = (i) => {
      if (i === active || !hasGSAP) return;
      const prev = active;
      active = i;
      const dir = prev < 0 || i > prev ? 1 : -1;
      const d = motion ? 1 : 0;
      if (prev >= 0) {
        gsap.to($$('.c', words[prev]), { yPercent: -118 * dir, duration: .55 * d, stagger: .02 * d, ease: 'power3.in', overwrite: true });
        gsap.to(paras[prev], { autoAlpha: 0, y: -16 * dir, duration: .4 * d, overwrite: true });
        bgs[prev].classList.remove('is-on');
        words[prev].setAttribute('aria-hidden', 'true');
      }
      words[i].removeAttribute('aria-hidden');
      gsap.fromTo($$('.c', words[i]), { yPercent: 118 * dir }, { yPercent: 0, duration: 1.1 * d, stagger: .035 * d, ease: 'expo.out', delay: prev >= 0 ? .22 * d : 0, overwrite: true });
      gsap.fromTo(paras[i], { autoAlpha: 0, y: 22 * dir }, { autoAlpha: 1, y: 0, duration: .9 * d, ease: 'power3.out', delay: (prev >= 0 ? .35 : .15) * d, overwrite: true });
      bgs[i].classList.add('is-on');
      navs.forEach((n, k) => { n.classList.toggle('is-on', k === i); n.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      gsap.fromTo(cur, { yPercent: 70 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6 * d, ease: 'power3.out', onStart: () => { cur.textContent = pad(i + 1); } });
    };

    const update = (p) => {
      const x = p * N;
      show(Math.min(N - 1, Math.floor(x)));
      imgs.forEach((im, k) => {
        if (!k) return;
        const l = clamp(0, 1, (x - k + .22) / .44);
        im.style.clipPath = `inset(${((1 - l) * 100).toFixed(2)}% 0% 0% 0%)`;
        im.firstElementChild.style.transform = `scale(${(1.25 - .25 * l).toFixed(4)})`;
      });
      imgs[0].firstElementChild.style.transform = `scale(${(1.06 - .06 * Math.min(1, x)).toFixed(4)})`;
      fills.forEach((f, k) => { f.style.transform = `scaleX(${clamp(0, 1, x - k).toFixed(3)})`; });
      bgwrap.style.transform = `translateX(${((p - .5) * -26).toFixed(2)}%)`;
    };

    if (!motion) {
      update(0.01);
      navs.forEach((n, k) => n.addEventListener('click', () => update((k + .5) / N)));
      return;
    }

    const st = ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: (s) => update(s.progress) });
    ScrollTrigger.create({ trigger: sec, start: 'top 70%', once: true, onEnter: () => { if (active < 0) show(0); } });
    navs.forEach((n, k) => n.addEventListener('click', () => scrollToTarget(st.start + ((k + .5) / N) * (st.end - st.start))));

    if (finePointer) {
      const frame = $('.values__frame');
      const rx = gsap.quickTo(frame, 'rotationX', { duration: 1.2, ease: 'power3' });
      const ry = gsap.quickTo(frame, 'rotationY', { duration: 1.2, ease: 'power3' });
      sec.addEventListener('mousemove', (e) => {
        ry((e.clientX / window.innerWidth - .5) * 9);
        rx((e.clientY / window.innerHeight - .5) * -7);
      });
    }
  }

  /* =======================================================
     ZOOM GRID: the middle project grows to full screen
     ======================================================= */
  let zoomProgress = 0;
  function zoomGrid() {
    if (!motion) return;
    const grid = $('.zoom__grid');
    const main = $('.zoom__cell--main');
    const others = $$('.zoom__cell:not(.zoom__cell--main)');
    const target = () => Math.max(window.innerWidth / main.offsetWidth, window.innerHeight / main.offsetHeight) * 1.02;
    gsap.from($$('.zoom__in'), {
      clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', stagger: { each: .07, from: 'center' },
      scrollTrigger: { trigger: '.zoom', start: 'top 75%', once: true }
    });
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.zoom', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true, onUpdate: (st) => { zoomProgress = st.progress; } }
    })
      .fromTo(grid, { scale: 1 }, { scale: target, duration: .55, ease: 'power2.inOut' }, .04)
      .fromTo(main, { borderRadius: 3 }, { borderRadius: 0, duration: .4 }, .1)
      .fromTo('.zoom__cell--main img', { scale: 1.15 }, { scale: 1, duration: .6 }, .04)
      .fromTo(others, { opacity: 1 }, { opacity: 0, duration: .36 }, .2)
      .fromTo('.zoom__shade', { opacity: 0 }, { opacity: 1, duration: .2 }, .52)
      .fromTo('.zoom__text', { autoAlpha: 0 }, { autoAlpha: 1, duration: .02 }, .59)
      .fromTo('.zoom__text .c', { yPercent: 118 }, { yPercent: 0, duration: .2, stagger: .006, ease: 'power2.out' }, .6)
      .to({}, { duration: .14 });
  }

  /* =======================================================
     PROJECTS DECK: counter + photos thrown off a stack
     ======================================================= */
  function galUI(rootEl) {
    const cur = $('.gal-ui__cur', rootEl);
    const bar = $('.gal-ui__progress span', rootEl);
    const cap = $('.gal-ui__caption span', rootEl);
    let last = 0;
    return {
      set(i, p) {
        bar.style.transform = `scaleX(${clamp(0, 1, p).toFixed(3)})`;
        if (i === last) return;
        const dir = i > last ? 1 : -1;
        last = i;
        cur.textContent = pad(i + 1);
        cap.textContent = pairName(PAIRS[i]);
        if (motion) gsap.fromTo([cur, cap], { yPercent: 70 * dir, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'power3.out', overwrite: true });
      }
    };
  }

  // deck: a stack of framed photos, each scroll step throws the top one aside
  // two single framed photos lie side by side; each scroll step throws the pair off the stack together
  function deck() {
    const sec = $('.deck');
    const cards = $$('.dcard:not(.dcard--end)', sec);
    const endCard = $('.dcard--end', sec);
    const N = PAIRS.length;
    const ui = galUI(sec);
    const ROT = [-3.2, 2.6, -1.8, 3.4, -2.4, 1.6, -3.4, 2.2, -1.4, 3];
    cards.forEach((c, j) => c.addEventListener('click', () => openLightbox(REEL, j)));
    let lastP = 0;
    const layout = (p) => {
      lastP = p;
      const s = p * N; // how many pairs have been thrown
      const W = window.innerWidth, H = window.innerHeight;
      const cw = cards[0].offsetWidth;
      const half = cw / 2 + Math.max(10, cw * .05); // each card sits half a card plus a gap from the centre
      cards.forEach((c, j) => {
        const i = Math.floor(j / 2), side = j % 2 ? -1 : 1; // RTL: first of the pair on the right
        const d = i - s, base = ROT[j % ROT.length], dir = i % 2 ? 1 : -1;
        let x = side * half, y = 0, r = base, sc = 1, o = 1;
        if (d < 0) {
          const l = Math.min(1, -d);
          x = side * half - l * W * (side > 0 ? 1.05 : .95);
          y = dir * Math.sin(l * Math.PI / 2) * H * .16 + side * l * H * .03;
          r = base - l * (24 + (j % 3) * 8);
          o = 1 - Math.max(0, l - .72) / .28;
        } else {
          const depth = Math.min(d, 4);
          sc = 1 - depth * .045;
          x = side * half * sc;
          y = depth * 15;
          o = d > 4.5 ? 0 : 1;
        }
        c.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${r.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
        c.style.opacity = o.toFixed(3);
        c.style.visibility = o <= 0 ? 'hidden' : 'visible';
      });
      const depthEnd = Math.min(Math.max(N - s, 0), 4);
      endCard.style.transform = `translate3d(0,${(depthEnd * 15).toFixed(1)}px,0) scale(${(1 - depthEnd * .045).toFixed(4)})`;
      endCard.style.opacity = N - s > 1 ? 0 : 1; // only shows once the last pair is leaving
      ui.set(Math.min(N - 1, Math.floor(s + .5)), p);
    };
    layout(0);
    window.addEventListener('resize', () => layout(lastP));
    if (!motion) return;
    ScrollTrigger.create({ trigger: sec, start: 'top top', end: 'bottom bottom', onUpdate: (st) => layout(st.progress) });
    gsap.from('.deck__stack', { y: 120, opacity: 0, rotation: -4, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: sec, start: 'top 70%', once: true } });
  }

  /* =======================================================
     ARTICLES: draggable mood board
     ======================================================= */
  function board() {
    const boardEl = $('.board');
    const notes = $$('.note', boardEl);
    const desktop = () => window.innerWidth >= 1024; // below that the board is a swipe row (see the CSS)
    if (motion) {
      gsap.from($$('.note__in', boardEl), {
        y: -90, scale: 1.2, opacity: 0, rotation: '+=14', duration: 1.3, stagger: .13, ease: 'back.out(1.5)',
        scrollTrigger: { trigger: boardEl, start: 'top 72%', once: true }
      });
      gsap.from('.chip-swatch, .board__strip', {
        scale: 0, rotation: -60, duration: 1.1, stagger: .1, ease: 'back.out(2)', delay: .5,
        scrollTrigger: { trigger: boardEl, start: 'top 72%', once: true }
      });
    }
    let z = 30;
    notes.forEach((note) => {
      const link = $('.note__link', note);
      let down = false, moved = false, sx = 0, sy = 0, ox = 0, oy = 0, lx = 0, ly = 0, vx = 0, vy = 0;
      note.addEventListener('pointerdown', (e) => {
        if (!desktop() || e.button !== 0 || !hasGSAP) return;
        down = true; moved = false; vx = vy = 0;
        sx = lx = e.clientX; sy = ly = e.clientY;
        ox = gsap.getProperty(note, 'x'); oy = gsap.getProperty(note, 'y');
        note.style.zIndex = ++z;
        try { note.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
      });
      note.addEventListener('pointermove', (e) => {
        if (!down) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!moved && Math.hypot(dx, dy) > 6) { moved = true; note.classList.add('is-drag'); }
        if (!moved) return;
        vx = e.clientX - lx; vy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
        gsap.set(note, { x: ox + dx, y: oy + dy });
        gsap.to(note, { rotation: clamp(-14, 14, vx * .8), duration: .35, overwrite: 'auto' });
      });
      const end = () => {
        if (!down) return;
        down = false;
        note.classList.remove('is-drag');
        if (!moved) { window.open(link.href, '_blank', 'noopener'); return; }
        // a gentle throw that keeps the note on the board
        const br = boardEl.getBoundingClientRect(), nr = note.getBoundingClientRect();
        const cx = gsap.getProperty(note, 'x'), cy = gsap.getProperty(note, 'y');
        const x = clamp(cx + (br.left - nr.left) - nr.width * .2, cx + (br.right - nr.right) + nr.width * .2, cx + vx * 10);
        const y = clamp(cy + (br.top - nr.top) - 10, cy + (br.bottom - nr.bottom) + 10, cy + vy * 10);
        gsap.to(note, { x, y, rotation: 0, duration: 1.1, ease: 'power3.out' });
      };
      note.addEventListener('pointerup', end);
      note.addEventListener('pointercancel', () => { down = false; note.classList.remove('is-drag'); if (hasGSAP) gsap.to(note, { rotation: 0, duration: .5 }); });
      // mouse clicks are handled on release above; keyboard keeps the native link
      link.addEventListener('click', (e) => { if (desktop() && e.detail > 0) e.preventDefault(); });
    });
  }

  /* =======================================================
     ABOUT: love band + bio
     ======================================================= */
  function about() {
    if (!motion) return;
    // the banner is never scaled (that blurred it): it is revealed like a curtain drawn toward Orly
    gsap.from('.love__bg', {
      clipPath: 'inset(0% 0% 0% 100%)', duration: 1.8, ease: 'expo.inOut',
      scrollTrigger: { trigger: '.love', start: 'top 78%', once: true }
    });
    gsap.timeline({ scrollTrigger: { trigger: '.bio__visual', start: 'top 82%', end: 'center 50%', scrub: 1 } })
      .fromTo('.bio__frame', { clipPath: 'inset(100% 0% 0% 0% round 3px)' }, { clipPath: 'inset(0% 0% 0% 0% round 3px)', ease: 'power2.out' }, 0)
      .fromTo('.bio__img', { scale: 1.35 }, { scale: 1, ease: 'power2.out' }, 0)
      ;
  }

  /* =======================================================
     CONTACT: the blurred heading comes into soft focus, the invitation rises over it
     ======================================================= */
  function contact() {
    if (!motion) return;
    gsap.fromTo('.contact__ghost', { opacity: 0, letterSpacing: '.18em' }, {
      opacity: 1, letterSpacing: '.015em', duration: 2, ease: 'expo.out',
      scrollTrigger: { trigger: '.contact', start: 'top 70%', once: true }
    });
    gsap.from('.room', { y: 40, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.room', start: 'top 85%', once: true } });
  }

  /* =======================================================
     FOOTER: curtain reveal + lamp light
     ======================================================= */
  function footerFx() {
    const wrap = $('.footer-wrap');
    const f = $('.footer');
    const fit = () => {
      f.classList.remove('is-fixed');
      const h = f.offsetHeight;
      wrap.style.height = h + 'px';
      f.classList.toggle('is-fixed', motion && !isMobile() && h < window.innerHeight * .92);
    };
    fit();
    window.addEventListener('resize', fit);
    if (document.fonts) document.fonts.ready.then(fit);

    const light = { x: 50, y: 45 };
    const apply = () => { f.style.setProperty('--lx', light.x.toFixed(2) + '%'); f.style.setProperty('--ly', light.y.toFixed(2) + '%'); };
    if (finePointer && hasGSAP) {
      const xTo = gsap.quickTo(light, 'x', { duration: .9, ease: 'power3', onUpdate: apply });
      const yTo = gsap.quickTo(light, 'y', { duration: .9, ease: 'power3', onUpdate: apply });
      f.addEventListener('mousemove', (e) => {
        const r = f.getBoundingClientRect();
        xTo(((e.clientX - r.left) / r.width) * 100);
        yTo(((e.clientY - r.top) / r.height) * 100);
      });
    } else if (motion) {
      gsap.timeline({ repeat: -1, yoyo: true, onUpdate: apply })
        .to(light, { x: 20, y: 30, duration: 4, ease: 'sine.inOut' })
        .to(light, { x: 80, y: 60, duration: 5, ease: 'sine.inOut' });
    }
    if (motion) {
      gsap.from('.footer__col, .footer__bottom > *', {
        y: 40, opacity: 0, duration: 1.1, stagger: .08, ease: 'power3.out',
        scrollTrigger: { trigger: wrap, start: 'top 88%', once: true }
      });
    }
  }

  /* =======================================================
     GENERIC REVEALS
     ======================================================= */
  function reveals() {
    if (!motion) return;
    $$('[data-split="chars"], [data-split="words"]').forEach((el) => {
      if (el.closest('.hero') || el.closest('.zoom') || el.closest('.values')) return;
      const chars = el.dataset.split === 'chars';
      gsap.from(chars ? $$('.c', el) : $$('.wi', el), {
        yPercent: 118, duration: 1.3, ease: 'expo.out', stagger: chars ? .03 : .07,
        scrollTrigger: { trigger: el, start: 'top 87%', once: true }
      });
    });
    $$('[data-fade]').forEach((el) => {
      gsap.from(el, { y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
    $$('[data-scrub]').forEach((el) => {
      const big = el.classList.contains('big-statement');
      gsap.fromTo($$('.sw', el), { opacity: .14 }, {
        opacity: 1, stagger: .1, ease: 'none',
        scrollTrigger: { trigger: el, start: big ? 'top 78%' : 'top 82%', end: big ? 'bottom 52%' : 'bottom 55%', scrub: true }
      });
    });
  }

  /* =======================================================
     NAV / PROGRESS / FAB
     ======================================================= */
  const nav = $('#nav');
  const hero = $('.hero');
  const zoomEl = $('.zoom');
  const darkSections = $$('[data-nav="dark"]');
  const progressBar = $('.progress span');
  const fab = $('.fab');
  let lastY = 0;
  const zoomIsDark = (probe) => {
    if (!motion || zoomProgress < .42) return false;
    const r = zoomEl.getBoundingClientRect();
    return r.top <= probe && r.bottom > probe;
  };

  function updateNav() {
    const y = getY();
    const vh = window.innerHeight;
    const hr = hero.getBoundingClientRect();
    let dark;
    if (menuOpen) dark = true;
    else if (hr.bottom > 40) dark = false; // the hero stays light all the way (ink on the white wall)
    else dark = zoomIsDark(40) || darkSections.some((s) => { const r = s.getBoundingClientRect(); return r.top <= 40 && r.bottom > 40; });
    nav.classList.toggle('nav--dark', dark);
    const solid = hr.bottom <= 80;
    nav.classList.toggle('nav--solid', solid && !menuOpen);
    if (!solid || menuOpen) nav.classList.remove('nav--hidden');
    else if (y > lastY + 3) nav.classList.add('nav--hidden');
    else if (y < lastY - 3) nav.classList.remove('nav--hidden');
    lastY = y;
    const max = document.documentElement.scrollHeight - vh;
    progressBar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    fab.classList.toggle('is-on', y > vh * .8);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);

  /* mobile menu */
  const burger = $('.nav__burger');
  const menu = $('#menu');
  const menuOrigin = () => (isMobile() ? '92% 3%' : '10% 3%'); // the circle grows from the menu button
  function toggleMenu(open = !menuOpen) {
    menuOpen = open;
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
    menu.setAttribute('aria-hidden', String(!open));
    syncLock();
    updateNav();
    if (!hasGSAP) { menu.style.visibility = open ? 'visible' : 'hidden'; menu.style.clipPath = open ? 'none' : ''; return; }
    if (open) {
      gsap.set(menu, { visibility: 'visible' });
      gsap.to(menu, { clipPath: `circle(150% at ${menuOrigin()})`, duration: .95, ease: 'expo.inOut', overwrite: true });
      gsap.fromTo('.menu__links a, .menu__phone', { y: 70, opacity: 0 }, { y: 0, opacity: 1, stagger: .07, duration: 1, ease: 'expo.out', delay: .3 });
    } else {
      gsap.to(menu, { clipPath: `circle(0% at ${menuOrigin()})`, duration: .75, ease: 'expo.inOut', overwrite: true, onComplete: () => gsap.set(menu, { visibility: 'hidden' }) });
    }
  }
  burger.addEventListener('click', () => toggleMenu());

  /* =======================================================
     CURSOR + MAGNETIC
     ======================================================= */
  function cursor() {
    if (!finePointer || !motion) return;
    root.classList.add('has-cursor');
    const el = $('.cursor');
    const ring = $('.cursor__ring');
    const dot = $('.cursor__dot');
    const label = $('.cursor__label');
    const rx = gsap.quickTo(ring, 'x', { duration: .5, ease: 'power3' });
    const ry = gsap.quickTo(ring, 'y', { duration: .5, ease: 'power3' });
    const dx = gsap.quickTo(dot, 'x', { duration: .08 });
    const dy = gsap.quickTo(dot, 'y', { duration: .08 });
    el.classList.add('is-hidden');
    window.addEventListener('mousemove', (e) => { rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); el.classList.remove('is-hidden'); }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => el.classList.add('is-hidden'));
    document.addEventListener('mouseover', (e) => {
      const t = e.target;
      const link = t.closest('a, button:not(.panel__hit), input, label, .chip');
      const lab = t.closest('[data-cursor]');
      if (lab && lab.dataset.cursor && !(link && lab.contains(link) && link !== lab && link.matches('a'))) {
        label.textContent = lab.dataset.cursor;
        el.classList.add('is-label');
        el.classList.remove('is-link');
      } else {
        el.classList.remove('is-label');
        el.classList.toggle('is-link', !!link);
      }
      const darkZone = !!t.closest('[data-nav="dark"], .menu, .lightbox, .drawer__scrim, .panel')
        || (!!t.closest('.zoom') && zoomProgress > .42);
      root.classList.toggle('cursor-dark', darkZone);
    });
  }

  // buttons stay exactly in place on hover (the owner asked for no magnetic movement)
  function magnetic() {
    return;
    $$('.magnetic').forEach((el) => {
      if (el.dataset.mag) return;
      el.dataset.mag = '1';
      const xTo = gsap.quickTo(el, 'x', { duration: .9, ease: 'elastic.out(1, .35)' });
      const yTo = gsap.quickTo(el, 'y', { duration: .9, ease: 'elastic.out(1, .35)' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .3);
        yTo((e.clientY - r.top - r.height / 2) * .4);
      });
      el.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* =======================================================
     DRAWERS (about + service details)
     ======================================================= */
  let openDrawerEl = null, drawerFocus = null;
  if (hasGSAP) gsap.set('.drawer__panel', { xPercent: -100 });

  function openDrawer(dr) {
    if (drawerOpen || !dr) return;
    drawerFocus = document.activeElement;
    drawerOpen = true;
    openDrawerEl = dr;
    syncLock();
    dr.setAttribute('aria-hidden', 'false');
    const panel = $('.drawer__panel', dr);
    panel.scrollTop = 0;
    if (hasGSAP) {
      gsap.set(dr, { visibility: 'visible' });
      gsap.to($('.drawer__scrim', dr), { opacity: 1, duration: .6, ease: 'power2.out', overwrite: true });
      gsap.fromTo(panel, { xPercent: -100 }, { xPercent: 0, duration: motion ? 1 : 0, ease: 'expo.inOut', overwrite: true });
      if (motion) {
        gsap.fromTo($('.drawer__media img', dr), { scale: 1.3 }, { scale: 1, duration: 1.6, ease: 'expo.out', delay: .3 });
        gsap.fromTo($$('.drawer__body > *', dr), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .045, ease: 'expo.out', delay: .45 });
      }
    } else {
      dr.style.visibility = 'visible'; panel.style.transform = 'none'; $('.drawer__scrim', dr).style.opacity = 1;
    }
    setTimeout(() => $('.drawer__close', dr).focus({ preventScroll: true }), 50);
  }
  function closeDrawer() {
    if (!drawerOpen || !openDrawerEl) return;
    const dr = openDrawerEl;
    drawerOpen = false;
    openDrawerEl = null;
    dr.setAttribute('aria-hidden', 'true');
    const panel = $('.drawer__panel', dr);
    if (hasGSAP) {
      gsap.to($('.drawer__scrim', dr), { opacity: 0, duration: .5, ease: 'power2.in', overwrite: true });
      gsap.to(panel, { xPercent: -100, duration: motion ? .75 : 0, ease: 'expo.inOut', overwrite: true, onComplete: () => gsap.set(dr, { visibility: 'hidden' }) });
    } else {
      dr.style.visibility = 'hidden';
    }
    syncLock();
    if (drawerFocus) drawerFocus.focus({ preventScroll: true });
  }

  function openService(i) {
    const s = SERVICES[i];
    const dr = $('#svc-drawer');
    const img = $('.drawer__media img', dr);
    img.src = src(s.img);
    img.alt = s.name;
    dr.setAttribute('aria-label', s.name);
    $('.drawer__body', dr).innerHTML = `
      <span class="drawer__num">${pad(i + 1)}</span>
      <h3 class="drawer__title">${s.name}</h3>
      ${s.body.map((b) => Array.isArray(b) ? `<ul>${b.map((li) => `<li>${li}</li>`).join('')}</ul>` : `<p>${b}</p>`).join('')}
      <a href="#contact" class="btn magnetic" data-close-drawer><span class="btn__label">ליצירת קשר</span><span class="btn__arrow" aria-hidden="true">←</span></a>`;
    $$('.btn', dr).forEach(rollify);
    magnetic();
    openDrawer(dr);
  }

  /* =======================================================
     GALLERY + LIGHTBOX
     ======================================================= */
  const gallery = $('#gallery');
  const grid = $('.gallery__grid');
  const chips = $('.chips');
  let gList = GALLERY;
  let galleryBuilt = false;
  let lastFocus = null;

  function renderChips() {
    const counts = {};
    GALLERY.forEach((p) => { const c = catOf(p); counts[c] = (counts[c] || 0) + 1; });
    const cats = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    chips.innerHTML = [
      `<button class="chip is-active" type="button" data-cat="הכל" aria-pressed="true">הכל<sup>${GALLERY.length}</sup></button>`,
      ...cats.map((c) => `<button class="chip" type="button" data-cat="${c}" aria-pressed="false">${c}<sup>${counts[c]}</sup></button>`)
    ].join('');
    chips.addEventListener('click', (e) => {
      const b = e.target.closest('.chip');
      if (!b) return;
      $$('.chip', chips).forEach((c) => { const on = c === b; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
      renderGrid(b.dataset.cat);
    });
  }
  function renderGrid(cat = 'הכל') {
    gList = cat === 'הכל' ? GALLERY : GALLERY.filter((p) => catOf(p) === cat);
    grid.innerHTML = gList.map((p, i) => `
      <button class="g-item" type="button" data-i="${i}" aria-label="הגדלת תמונה: ${catOf(p)}">
        <img src="${src(p)}" alt="${catOf(p)}" loading="lazy"><span>${catOf(p)}</span>
      </button>`).join('');
    gallery.scrollTop = 0;
    if (motion) gsap.from($$('.g-item', grid).slice(0, 18), { y: 50, opacity: 0, duration: 1, stagger: .035, ease: 'expo.out' });
  }
  grid.addEventListener('click', (e) => { const b = e.target.closest('.g-item'); if (b) openLightbox(gList, +b.dataset.i); });

  function openGallery() {
    if (galleryOpen) return;
    lastFocus = document.activeElement;
    if (!galleryBuilt) { renderChips(); renderGrid(); galleryBuilt = true; }
    galleryOpen = true;
    syncLock();
    gallery.setAttribute('aria-hidden', 'false');
    if (hasGSAP) {
      gsap.set(gallery, { visibility: 'visible', clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.to(gallery, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.05, ease: 'expo.inOut' });
      if (motion) gsap.from('.gallery__title, .chip, .gallery__close', { y: 30, opacity: 0, duration: .9, stagger: .025, ease: 'expo.out', delay: .45 });
    } else {
      gallery.style.visibility = 'visible'; gallery.style.clipPath = 'none';
    }
    setTimeout(() => $('.gallery__close').focus({ preventScroll: true }), 50);
  }
  function closeGallery() {
    if (!galleryOpen) return;
    galleryOpen = false;
    gallery.setAttribute('aria-hidden', 'true');
    if (hasGSAP) {
      gsap.to(gallery, { clipPath: 'inset(0% 0% 100% 0%)', duration: .85, ease: 'expo.inOut', onComplete: () => gsap.set(gallery, { visibility: 'hidden', clipPath: 'inset(100% 0% 0% 0%)' }) });
    } else {
      gallery.style.visibility = 'hidden';
    }
    syncLock();
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  $('.gallery__close').addEventListener('click', closeGallery);

  const lb = $('.lightbox');
  const lbImg = $('.lightbox__img');
  const lbCity = $('.lightbox__city');
  const lbIdx = $('.lightbox__idx');
  let lbList = [], lbIndex = 0, lbFocus = null;
  function lbShow(dir = 0) {
    const p = lbList[lbIndex];
    lbImg.src = src(p);
    lbImg.alt = catOf(p);
    lbCity.textContent = catOf(p);
    lbIdx.textContent = `${pad(lbIndex + 1)} / ${pad(lbList.length)}`;
    if (motion) gsap.fromTo(lbImg, { x: dir * -60, opacity: 0, scale: .97 }, { x: 0, opacity: 1, scale: 1, duration: .7, ease: 'expo.out' });
  }
  function openLightbox(list, i) {
    lbFocus = document.activeElement;
    lbList = list; lbIndex = i;
    lbOpen = true;
    syncLock();
    lb.setAttribute('aria-hidden', 'false');
    lbShow(0);
    if (hasGSAP) gsap.to(lb, { autoAlpha: 1, duration: .45, ease: 'power2.out' });
    else { lb.style.opacity = 1; lb.style.visibility = 'visible'; }
    setTimeout(() => $('.lightbox__close').focus({ preventScroll: true }), 30);
  }
  function closeLightbox() {
    lbOpen = false;
    lb.setAttribute('aria-hidden', 'true');
    if (hasGSAP) gsap.to(lb, { autoAlpha: 0, duration: .35, ease: 'power2.in' });
    else { lb.style.opacity = 0; lb.style.visibility = 'hidden'; }
    syncLock();
    if (lbFocus) lbFocus.focus({ preventScroll: true });
  }
  const lbNext = () => { lbIndex = (lbIndex + 1) % lbList.length; lbShow(1); };
  const lbPrev = () => { lbIndex = (lbIndex - 1 + lbList.length) % lbList.length; lbShow(-1); };
  $('.lightbox__next').addEventListener('click', lbNext);
  $('.lightbox__prev').addEventListener('click', lbPrev);
  $('.lightbox__close').addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  let swipeX = null;
  lb.addEventListener('pointerdown', (e) => { swipeX = e.clientX; });
  lb.addEventListener('pointerup', (e) => {
    if (swipeX === null) return;
    const d = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(d) > 50) (d > 0 ? lbNext : lbPrev)();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lbOpen) closeLightbox();
      else if (galleryOpen) closeGallery();
      else if (drawerOpen) closeDrawer();
      else if (menuOpen) toggleMenu(false);
    }
    if (lbOpen && e.key === 'ArrowLeft') lbNext();
    if (lbOpen && e.key === 'ArrowRight') lbPrev();
  });

  /* =======================================================
     ANCHORS
     ======================================================= */
  document.addEventListener('click', (e) => {
    const od = e.target.closest('[data-open-drawer]');
    if (od) { e.preventDefault(); openDrawer($('#' + od.dataset.openDrawer)); return; }
    if (e.target.closest('[data-close-drawer]')) closeDrawer();
    const g = e.target.closest('[data-open-gallery]');
    if (g) {
      e.preventDefault();
      if (menuOpen) toggleMenu(false);
      openGallery();
      return;
    }
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = id === '#top' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (menuOpen) toggleMenu(false);
    scrollToTarget(target);
  });

  /* =======================================================
     FORM (front-end only for now)
     ======================================================= */
  function form() {
    const f = $('.form');
    const status = $('.form__status');
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const { name, email, phone } = f.elements;
      [name, email, phone].forEach((i) => i.closest('.field').classList.remove('is-error'));
      let ok = true;
      if (!name.value.trim()) { name.closest('.field').classList.add('is-error'); ok = false; }
      if (!/^[0-9+\-\s()]{9,}$/.test(phone.value.trim())) { phone.closest('.field').classList.add('is-error'); ok = false; }
      if (email.value.trim() && !/^\S+@\S+\.\S+$/.test(email.value.trim())) { email.closest('.field').classList.add('is-error'); ok = false; }
      if (!ok) {
        status.style.color = '#C2553A';
        status.textContent = 'נא למלא שם מלא ומספר טלפון תקין';
        if (motion) gsap.fromTo(f, { x: -10 }, { x: 0, duration: .6, ease: 'elastic.out(1, .3)' });
        return;
      }
      status.style.color = '';
      status.textContent = 'תודה! הפרטים התקבלו, אחזור אליכם בהקדם.';
      f.reset();
    });
  }

  /* =======================================================
     BOOT
     ======================================================= */
  renderFan();
  renderPanels();
  renderValues();
  renderZoom();
  renderGallery();
  renderBoard();
  renderFooterArticles();
  $$('.roll-me, .btn').forEach(rollify);
  $$('[data-split], [data-scrub]').forEach(split);

  if (motion) setIntroStates();
  heroScroll();
  wave();
  panels();
  values();
  zoomGrid();
  deck();
  about();
  board();
  contact();
  footerFx();
  reveals();
  cursor();
  magnetic();
  form();
  updateNav();

  runLoader().then(() => {
    booting = false;
    syncLock();
    heroIntro();
    if (hasGSAP) ScrollTrigger.refresh();
    updateNav();
  });

  if (hasGSAP && document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => { if (hasGSAP) ScrollTrigger.refresh(); });
})();
