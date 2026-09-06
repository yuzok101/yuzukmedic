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

    // 2. מילון התאמה בין שמות החגים של Hebcal לקבצי התמונות שלך בתיקייה "חגים"
    const holidayImages = {
        "Rosh Hashana": "חגים/rosh-hashana.jpg",
        "Yom Kippur": "חגים/kippur.jpg",
        "Sukkot": "חגים/sukkot.jpg",
        "Shmini Atzeret": "חגים/sukkot.jpg", // נכלל בחגי סוכות
        "Chanukah": "חגים/chanukah.jpg",
        "Pesach": "חגים/pesach.jpg",
        "Shavuot": "חגים/shavuot.jpg",
        "Tish'a B'Av": "חגים/tisha-beav.jpg"
    };

    // 3. פנייה לשרת Hebcal לקבלת לוח החגים השנתי המעודכן
    document.addEventListener("DOMContentLoaded", function() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const year = today.getFullYear();
        
        // שליפת אירועים לטווחי החודשים הנוכחיים מה-API של Hebcal
        fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&year=${year}&month=x&geonameid=281184` /* 281184 = ירושלים / ישראל */)
            .then(response => response.json())
            .then(data => {
                if (!data || !data.items) return;

                let activeImage = "";

                data.items.forEach(item => {
                    if (holidayImages[item.title] || Object.keys(holidayImages).some(h => item.title.includes(h))) {
                        const holidayDate = new Date(item.date);
                        holidayDate.setHours(0, 0, 0, 0);

                        // הגדרת טווח הצגה לפי סוג החג שביקשת
                        let daysBefore = 7; // ברירת מחדל שבוע לפני
                        let isMultiDay = false;

                        if (item.title.includes("Sukkot") || item.title.includes("Pesach")) {
                            daysBefore = item.title.includes("Sukkot") ? 3 : 7;
                            isMultiDay = true; // כל משך החג
                        }

                        // חישוב תאריך התחלה ותאריך סיום לבאנר
                        let startDate = new Date(holidayDate);
                        startDate.setDate(startDate.getDate() - daysBefore);

                        let endDate = new Date(holidayDate);
                        if (isMultiDay) {
                            // הוספת משך ימי החג (סוכות/פסח נמשכים כ-7-8 ימים)
                            endDate.setDate(endDate.getDate() + (item.title.includes("Sukkot") ? 7 : 7));
                        }

                        // בדיקה האם היום נמצא בטווח
                        if (today >= startDate && today <= endDate) {
                            // מציאת התמונה המתאימה מתוך המילון
                            for (let key in holidayImages) {
                                if (item.title.includes(key)) {
                                    activeImage = holidayImages[key];
                                    break;
                                }
                            }
                        }
                    }
                });

                // אם נמצא חג פעיל בתאריך הנוכחי - הצג את הבאנר
                if (activeImage) {
                    const banner = document.createElement("div");
                    banner.className = "holiday-banner";
                    banner.innerHTML = `
                        <img src="${activeImage}" alt="חג שמח">
                        <button class="close-btn" onclick="this.parentElement.remove()" title="סגור">✕</button>
                    `;
                    document.body.prepend(banner);
                }
            })
            .catch(err => console.log("Holiday banner error:", err));
    });
})();
