import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

const app = express();
app.set('trust proxy', true); // trust proxy (Render, Cloud Run) so express-rate-limit reads correct client IP
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

// Preferred models to try (in order). gemini-2.5-flash preferred; fallbacks: 2.0, 1.5
const MODEL_PREFERENCE = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
];

async function callGenerateContent(model, apiKey, userText, systemPrompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const body = {
    contents: [
      { role: "user", parts: [{ text: `${systemPrompt}\n\nשאלה של הגולש: ${userText}` }] }
    ]
  };

  let gRes;
  let data;
  try {
    gRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  } catch (networkErr) {
    // network-level error (DNS, timeout, etc.)
    console.error(`Network error calling Google model ${model}:`, networkErr);
    throw { type: 'network', model, error: networkErr };
  }

  try {
    data = await gRes.json();
  } catch (parseErr) {
    console.error(`Failed to parse JSON from Google response for model ${model}. status=${gRes.status} ${gRes.statusText}`, parseErr);
    throw { type: 'parse', model, status: gRes.status, statusText: gRes.statusText };
  }

  // Log full details (for debugging in server logs). Do NOT log API_KEY.
  console.error("Google API call for model:", model, "HTTP status:", gRes.status, gRes.statusText);
  console.error("Google API response body:", JSON.stringify(data));

  return { gRes, data };
}

app.post("/api/generate", async (req, res) => {
  try {
    const userText = (req.body.text || "").toString();
    const systemPrompt = (req.body.systemPrompt || DEFAULT_SYSTEM_PROMPT).toString();

    const attempts = [];
    let finalReply = null;
    let lastError = null;

    for (const model of MODEL_PREFERENCE) {
      try {
        const { gRes, data } = await callGenerateContent(model, API_KEY, userText, systemPrompt);

        if (!gRes.ok) {
          // record attempt
          attempts.push({ model, status: gRes.status, statusText: gRes.statusText, error: data?.error || data });

          // If 404 specifically, try next model. For other statuses (403/429/etc.) still record and try next to allow fallbacks
          lastError = { model, status: gRes.status, statusText: gRes.statusText, body: data };
          continue; // try next model in preference list
        }

        // success path: extract reply
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                      data?.candidates?.[0]?.output ||
                      // some responses might use data.output
                      (Array.isArray(data?.output) ? data.output.map(o => o.content?.map(c=>c.text||'').join('\n')).join('\n') : null) ||
                      '';

        attempts.push({ model, status: gRes.status, statusText: gRes.statusText });
        finalReply = reply;
        break; // stop after first successful model

      } catch (err) {
        // network/parse level errors
        console.error('Error while calling model', model, err);
        attempts.push({ model, error: err });
        lastError = err;
        continue; // try next
      }
    }

    if (finalReply !== null) {
      return res.json({ reply: finalReply, attempts });
    }

    // If we get here, all attempts failed
    console.error('All model attempts failed:', attempts);
    const clientMessage = lastError?.body?.error?.message || lastError?.error?.message || 'No usable response from Google Generative API';
    return res.status(502).json({ error: 'Google API error', message: clientMessage, attempts });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`AI proxy server listening on ${PORT}`));
