(function() {
    // 1. עיצוב ה-CSS לבאנר
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

    function initBanner() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        function d(y, m, day) {
            return new Date(y, m - 1, day);
        }

        // טבלת טווחי תאריכים לכל החגים לשנים הקרובות (כולל שבוע לפני / כל משך החג בסוכות ופסח)
        const holidays = [
            // --- שנת 2026 ---
            { start: d(2026,9,5), end: d(2026,9,13), img: "חגים/rosh-hashana.jpg" }, // ראש השנה
            { start: d(2026,9,14), end: d(2026,9,22), img: "חגים/kippur.jpg" },     // יום כיפור
            { start: d(2026,9,24), end: d(2026,10,5), img: "חגים/sukkot.jpg" },    // סוכות
            { start: d(2026,12,2), end: d(2026,12,12), img: "חגים/chanukah.jpg" }, // חנוכה
            { start: d(2026,3,25), end: d(2026,4,9), img: "חגים/pesach.jpg" },     // פסח
            { start: d(2026,5,14), end: d(2026,5,22), img: "חגים/shavuot.jpg" },   // שבועות
            { start: d(2026,7,14), end: d(2026,7,22), img: "חגים/tisha-beav.jpg" }, // תשעה באב

            // --- שנת 2027 ---
            { start: d(2027,9,24), end: d(2027,10,3), img: "חגים/rosh-hashana.jpg" },
            { start: d(2027,10,4), end: d(2027,10,12), img: "חגים/kippur.jpg" },
            { start: d(2027,10,14), end: d(2027,10,25), img: "חגים/sukkot.jpg" },
            { start: d(2027,12,17), end: d(2027,12,27), img: "חגים/chanukah.jpg" },
            { start: d(2027,4,14), end: d(2027,4,29), img: "חגים/pesach.jpg" },
            { start: d(2027,6,3), end: d(2027,6,11), img: "חגים/shavuot.jpg" },
            { start: d(2027,7,4), end: d(2027,7,12), img: "חגים/tisha-beav.jpg" },

            // --- שנת 2028 ---
            { start: d(2028,9,13), end: d(2028,9,22), img: "חגים/rosh-hashana.jpg" },
            { start: d(2028,9,23), end: d(2028,10,1), img: "חגים/kippur.jpg" },
            { start: d(2028,10,3), end: d(2028,10,14), img: "חגים/sukkot.jpg" },
            { start: d(2028,12,5), end: d(2028,12,15), img: "חגים/chanukah.jpg" },
            { start: d(2028,4,2), end: d(2028,4,17), img: "חגים/pesach.jpg" },
            { start: d(2028,5,22), end: d(2028,5,30), img: "חגים/shavuot.jpg" },
            { start: d(2028,7,22), end: d(2028,7,30), img: "חגים/tisha-beav.jpg" },

            // --- שנת 2029 ---
            { start: d(2029,9,2), end: d(2029,9,11), img: "חגים/rosh-hashana.jpg" },
            { start: d(2029,9,12), end: d(2029,9,20), img: "חגים/kippur.jpg" },
            { start: d(2029,9,22), end: d(2029,10,3), img: "חגים/sukkot.jpg" },
            { start: d(2029,11,24), end: d(2029,12,4), img: "חגים/chanukah.jpg" },
            { start: d(2029,3,22), end: d(2029,4,6), img: "חגים/pesach.jpg" },
            { start: d(2029,5,11), end: d(2029,5,19), img: "חגים/shavuot.jpg" },
            { start: d(2029,7,11), end: d(2029,7,19), img: "חגים/tisha-beav.jpg" },

            // --- שנת 2030 ---
            { start: d(2030,9,20), end: d(2030,9,29), img: "חגים/rosh-hashana.jpg" },
            { start: d(2030,9,30), end: d(2030,10,8), img: "חגים/kippur.jpg" },
            { start: d(2030,10,10), end: d(2030,10,21), img: "חגים/sukkot.jpg" },
            { start: d(2030,12,13), end: d(2030,12,23), img: "חגים/chanukah.jpg" },
            { start: d(2030,4,11), end: d(2030,4,26), img: "חגים/pesach.jpg" },
            { start: d(2030,5,30), end: d(2030,6,7), img: "חגים/shavuot.jpg" },
            { start: d(2030,6,30), end: d(2030,7,8), img: "חגים/tisha-beav.jpg" }
        ];

        let activeImage = "";

        for (let hol of holidays) {
            if (today >= hol.start && today <= hol.end) {
                activeImage = hol.img;
                break;
            }
        }

        if (activeImage) {
            const banner = document.createElement("div");
            banner.className = "holiday-banner";
            banner.innerHTML = `
                <img src="${activeImage}" alt="חג שמח" onerror="this.style.display='none'">
                <button class="close-btn" onclick="this.parentElement.remove()" title="סגור">✕</button>
            `;
            document.body.prepend(banner);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBanner);
    } else {
        initBanner();
    }
})();
