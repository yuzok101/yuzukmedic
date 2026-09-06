(function() {
    // טעינת ספריית הלוח העברי (Hebcal) באופן דינמי
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@hebcal/core@5/dist/bundle.min.js';
    script.onload = initBanner;
    document.head.appendChild(script);

    function initBanner() {
        // 1. עיצוב ה-CSS לבאנר עם כפתור סגירה בצד שמאל למעלה
        const style = document.createElement('style');
        style.innerHTML = `
            .holiday-banner {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background-color: #1a365d;
                color: #ffffff;
                text-align: center;
                padding: 15px 20px;
                z-index: 9999;
                font-family: inherit;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 15px;
                box-sizing: border-box;
            }
            .holiday-banner img {
                max-height: 45px;
                border-radius: 4px;
            }
            .holiday-banner .close-btn {
                position: absolute;
                left: 15px;
                top: 50%;
                transform: translateY(-50%);
                background: transparent;
                border: 1px solid #ffffff;
                color: #ffffff;
                width: 28px;
                height: 28px;
                cursor: pointer;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 14px;
            }
            .holiday-banner .close-btn:hover {
                background-color: rgba(255,255,255,0.2);
            }
        `;
        document.head.appendChild(style);

        // 2. בדיקת התאריך הלועזי והעברי להיום
        const now = new Date();
        const hDate = new Hebcal.HDate(now);
        const hYear = hDate.getFullYear();

        // הגדרת תאריכי החגים העבריים ויצירת טווח ההצגה שלהם
        const holidaysConfig = [
            {
                // ראש השנה (א' בתשרי): שבוע לפני ועד סוף החג (ב' בתשרי)
                start: new Hebcal.HDate(1, Hebcal.month.TISHREI, hYear).prev(7).greg(),
                end: new Hebcal.HDate(2, Hebcal.month.TISHREI, hYear).greg(),
                image: "חגים/rosh-hashana.jpg"
            },
            {
                // יום כיפור (י' בתשרי): שבוע לפני ועד מוצאי הצום
                start: new Hebcal.HDate(10, Hebcal.month.TISHREI, hYear).prev(7).greg(),
                end: new Hebcal.HDate(10, Hebcal.month.TISHREI, hYear).greg(),
                image: "חגים/kippur.jpg"
            },
            {
                // סוכות (ט"ו בתשרי): 3 ימים לפני וכל משך החג (עד כ"ב בתשרי)
                start: new Hebcal.HDate(15, Hebcal.month.TISHREI, hYear).prev(3).greg(),
                end: new Hebcal.HDate(22, Hebcal.month.TISHREI, hYear).greg(),
                image: "חגים/sukkot.jpg"
            },
            {
                // חנוכה (כ"ה בכסלו): שבוע לפני ועד סוף החג (ב' בטבת)
                start: new Hebcal.HDate(25, Hebcal.month.KISLEV, hYear).prev(7).greg(),
                end: new Hebcal.HDate(2, Hebcal.month.TEVET, hYear).greg(),
                image: "חגים/chanukah.jpg"
            },
            {
                // פסח (ט"ו בניסן): שבוע לפני וכל משך החג (כ"א בניסן)
                start: new Hebcal.HDate(15, Hebcal.month.NISAN, hYear).prev(7).greg(),
                end: new Hebcal.HDate(21, Hebcal.month.NISAN, hYear).greg(),
                image: "חגים/pesach.jpg"
            },
            {
                // שבועות (ו' בסיון): שבוע לפני ועד סוף החג (ז' בסיון)
                start: new Hebcal.HDate(6, Hebcal.month.SIVAN, hYear).prev(7).greg(),
                end: new Hebcal.HDate(7, Hebcal.month.SIVAN, hYear).greg(),
                image: "חגים/shavuot.jpg"
            },
            {
                // תשעה באב (ט' באב): שבוע לפני ועד סוף הצום
                start: new Hebcal.HDate(9, Hebcal.month.AV, hYear).prev(7).greg(),
                end: new Hebcal.HDate(9, Hebcal.month.AV, hYear).greg(),
                image: "חגים/tisha-beav.jpg"
            }
        ];

        let activeImage = "";
        now.setHours(0, 0, 0, 0);

        // בדיקה האם היום נופל בטווח של אחד החגים
        for (let hol of holidaysConfig) {
            if (hol.start && hol.end && now >= hol.start && now <= hol.end) {
                activeImage = hol.image;
                break;
            }
        }

        // יצירת הבאנר והצגתו אם נמצא חג פעיל
        if (activeImage) {
            const banner = document.createElement("div");
            banner.className = "holiday-banner";
            banner.innerHTML = `
                <img src="${activeImage}" alt="חג שמח">
                <button class="close-btn" onclick="this.parentElement.remove()" title="סגור">✕</button>
            `;
            document.body.prepend(banner);
        }
    }
})();
