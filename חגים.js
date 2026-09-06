(function() {
    // 1. עיצוב ה-CSS לפופ-אפ מרשים עם אנימציית כניסה
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes popupOpen {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }

        .holiday-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.65);
            z-index: 99998;
            backdrop-filter: blur(3px);
        }

        .holiday-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ffffff;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            z-index: 99999;
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-sizing: border-box;
            animation: popupOpen 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .holiday-modal img {
            max-width: 100%;
            max-height: 75vh;
            border-radius: 8px;
            display: block;
            object-fit: contain;
        }

        .holiday-modal .close-btn {
            position: absolute;
            top: -12px;
            left: -12px;
            background-color: #1a365d;
            color: #ffffff;
            border: 2px solid #ffffff;
            width: 36px;
            height: 36px;
            cursor: pointer;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            transition: background-color 0.2s, transform 0.2s;
        }

        .holiday-modal .close-btn:hover {
            background-color: #e53e3e;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    function initBanner() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        function d(y, m, day) {
            return new Date(y, m - 1, day);
        }

        // טבלת טווחי תאריכים ל-10 שנים הקרובות
        const holidays = [
            // --- שנת 2026 ---
            { start: d(2026,9,5), end: d(2026,9,13), img: "חגים/rosh-hashana.jpg" },
            { start: d(2026,9,14), end: d(2026,9,22), img: "חגים/kippur.jpg" },
            { start: d(2026,9,24), end: d(2026,10,5), img: "חגים/sukkot.jpg" },
            { start: d(2026,12,2), end: d(2026,12,12), img: "חגים/chanukah.jpg" },
            { start: d(2026,3,25), end: d(2026,4,9), img: "חגים/pesach.jpg" },
            { start: d(2026,5,14), end: d(2026,5,22), img: "חגים/shavuot.jpg" },
            { start: d(2026,7,14), end: d(2026,7,22), img: "חגים/tisha-beav.jpg" },

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
            const overlay = document.createElement("div");
            overlay.className = "holiday-overlay";

            const modal = document.createElement("div");
            modal.className = "holiday-modal";
            modal.innerHTML = `
                <img src="${activeImage}" alt="חג שמח" onerror="this.style.display='none'">
                <button class="close-btn" title="סגור">✕</button>
            `;

            const closePopup = function() {
                overlay.remove();
                modal.remove();
            };

            modal.querySelector(".close-btn").addEventListener("click", closePopup);
            overlay.addEventListener("click", closePopup);

            document.body.appendChild(overlay);
            document.body.appendChild(modal);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBanner);
    } else {
        initBanner();
    }
})();
