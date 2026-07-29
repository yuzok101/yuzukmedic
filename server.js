import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json());

// Configure CORS: allow your GitHub Pages origin and localhost for testing
const allowedOrigins = ["https://yuzok101.github.io", "http://localhost:5500", "http://localhost:3000"];
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like curl or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Basic rate limiting for the /api/ route
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error("Missing GOOGLE_API_KEY env var. Set it before starting the server.");
  process.exit(1);
}

const DEFAULT_SYSTEM_PROMPT = `אתה נציג שירות וירטואלי עבור האתר "קורסי עזרה ראשונה" (https://yuzok101.github.io/yuzukmedic/).
תפקידך לענות על שאלות הגולשים, לתת מידע על הקורסים הקרובים ולהפנות אותם לעמודים הרלוונטיים באתר.

מידע על קורסים וקישורים באתר:
- דף הבית והרשמה לקורסים: https://yuzok101.github.io/yuzukmedic/
- קורסים זמינים: קורס מגישי עזרה ראשונה (84 שעות), קורס החייאה ורענונים תקופתיים.
- קביעת תור/הרשמה/יצירת קשר: הפנה את הגולש ליצירת קשר או להרשמה בטופס באתר.

הוראות להתנהגות:
1. ענה תמיד באדיבות, בקצרה ובשפה ברורה.
2. בכל תשובה שבה נדרשת הרשמה, צפייה בתאריכים או יצירת קשר - הוסף קישור מתאים בפורמט HTML.
3. אם שואלים מתי הקורסים הקרובים, תענה שהתאריכים והמועדים מעודכנים בדף הבית והוסף קישור להרשמה.
4. אם אינך יודע את התשובה, הפנה אותם להשארת פרטים בדף הבית.`;

app.post("/api/generate", async (req, res) => {
  try {
    const userText = (req.body.text || "").toString();
    const systemPrompt = (req.body.systemPrompt || DEFAULT_SYSTEM_PROMPT).toString();

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(API_KEY)}`;
    const body = {
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nשאלה של הגולש: ${userText}` }] }
      ]
    };

    const gRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await gRes.json();
    if (!gRes.ok) {
      console.error("Google API error:", data);
      return res.status(502).json({ error: "Google API error", details: data });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});


// בדיקת המודלים הזמינים
app.get("/models", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(API_KEY)}`
    );

    const data = await response.json();

    if (data.models) {
      const models = data.models.map(m => ({
        name: m.name,
        supportedGenerationMethods: m.supportedGenerationMethods
      }));

      return res.json(models);
    }

    return res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.get("/keycheck", (req, res) => {
  const key = process.env.GOOGLE_API_KEY || "";
  res.json({
    exists: !!key,
    start: key.substring(0, 8),
    end: key.substring(key.length - 6)
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI proxy server listening on ${PORT}`));
