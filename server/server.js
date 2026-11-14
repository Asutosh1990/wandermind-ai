import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const PORT = process.env.PORT || 5000;
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:3b";

// ==================================================
// 1. DESTINATION DATA
// ==================================================

const destinations = [
    {
        id: "munnar",
        name: "Munnar",
        region: "Kerala, India",
        country: "India",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900",
        budget: 13500,
        days: 3,
        season: "September to March",
        moods: ["Nature", "Peaceful", "Romantic", "Offbeat"],
        tags: ["nature", "hills", "mountains", "tea gardens", "scenic"],
        themes: ["nature", "hills", "mountains", "peaceful", "romantic"],
        description: "A peaceful hill destination known for tea gardens, misty mountains and scenic viewpoints.",
        reason: "A good choice for travellers looking for nature, relaxation and cooler weather.",
        crowdLevel: "Moderate"
    },
    {
        id: "coorg",
        name: "Coorg",
        region: "Karnataka, India",
        country: "India",
        image: "https://images.unsplash.com/photo-1511497584788-876760111969?w=900",
        budget: 16000,
        days: 3,
        season: "October to March",
        moods: ["Nature", "Peaceful", "Adventure", "Romantic"],
        tags: ["nature", "hills", "mountains", "forest", "waterfalls", "coffee"],
        themes: ["nature", "hills", "mountains", "forest", "waterfalls", "adventure", "peaceful"],
        description: "A green hill region with coffee plantations, forests, waterfalls and scenic stays.",
        reason: "Suitable for a relaxing nature break, especially for couples and small groups.",
        crowdLevel: "Moderate"
    },
    {
        id: "varkala",
        name: "Varkala",
        region: "Kerala, India",
        country: "India",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900",
        budget: 15000,
        days: 3,
        season: "October to March",
        moods: ["Nature", "Peaceful", "Romantic", "Food"],
        tags: ["beach", "coastal", "sea", "cliffs", "cafes"],
        themes: ["beach", "coastal", "nature", "romantic", "peaceful"],
        description: "A coastal destination with dramatic cliffs, beaches, cafes and relaxed seaside experiences.",
        reason: "A good match for travellers who want beach time, food and a laid-back atmosphere.",
        crowdLevel: "Moderate"
    },
    {
        id: "wayanad",
        name: "Wayanad",
        region: "Kerala, India",
        country: "India",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900",
        budget: 17000,
        days: 3,
        season: "October to May",
        moods: ["Nature", "Peaceful", "Adventure", "Offbeat"],
        tags: ["nature", "hills", "mountains", "forest", "waterfalls", "wildlife"],
        themes: ["nature", "hills", "mountains", "forest", "waterfalls", "wildlife", "adventure", "peaceful"],
        description: "A green destination with forests, waterfalls, wildlife and mountain scenery.",
        reason: "Ideal for travellers seeking a nature-focused trip away from busy city life.",
        crowdLevel: "Low"
    },
    {
        id: "bali",
        name: "Bali",
        region: "Indonesia",
        country: "Indonesia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900",
        budget: 45000,
        days: 5,
        season: "April to October",
        moods: ["Nature", "Adventure", "Romantic", "Peaceful"],
        tags: ["beach", "nature", "mountains", "waterfalls", "island"],
        themes: ["beach", "coastal", "nature", "mountains", "waterfalls", "adventure", "romantic"],
        description: "An Indonesian island known for beaches, temples, rice terraces, waterfalls and volcanic scenery.",
        reason: "Offers a mix of nature, beaches, adventure and cultural experiences.",
        crowdLevel: "Moderate"
    },
    {
        id: "bangkok",
        name: "Bangkok",
        region: "Thailand",
        country: "Thailand",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=900",
        budget: 40000,
        days: 4,
        season: "November to February",
        moods: ["Food", "Culture", "Adventure"],
        tags: ["city", "food", "culture", "shopping", "temples"],
        themes: ["city", "food", "culture", "adventure"],
        description: "A lively city known for street food, temples, markets and shopping.",
        reason: "A good choice for travellers interested in food, culture and city experiences.",
        crowdLevel: "High"
    },
    {
        id: "singapore",
        name: "Singapore",
        region: "Singapore",
        country: "Singapore",
        image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=900",
        budget: 55000,
        days: 4,
        season: "February to April",
        moods: ["Food", "Culture", "Adventure"],
        tags: ["city", "gardens", "food", "culture", "attractions"],
        themes: ["city", "food", "culture", "adventure", "nature"],
        description: "A modern city-state with gardens, food experiences, shopping and family attractions.",
        reason: "Suitable for travellers looking for a convenient city holiday with varied attractions.",
        crowdLevel: "High"
    },
    {
        id: "dubai",
        name: "Dubai",
        region: "United Arab Emirates",
        country: "United Arab Emirates",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900",
        budget: 60000,
        days: 4,
        season: "November to March",
        moods: ["Adventure", "Food", "Culture"],
        tags: ["city", "desert", "shopping", "food", "adventure"],
        themes: ["city", "adventure", "food", "culture", "desert"],
        description: "A destination known for modern attractions, desert experiences, shopping and dining.",
        reason: "A good fit for travellers interested in city attractions and desert activities.",
        crowdLevel: "High"
    },
    {
        id: "phuket",
        name: "Phuket",
        region: "Thailand",
        country: "Thailand",
        image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=900",
        budget: 48000,
        days: 5,
        season: "November to April",
        moods: ["Nature", "Adventure", "Romantic", "Peaceful"],
        tags: ["beach", "island", "coastal", "nature", "water sports"],
        themes: ["beach", "coastal", "nature", "adventure", "romantic"],
        description: "A Thai island destination known for beaches, island trips and water activities.",
        reason: "Suitable for travellers looking for beaches, island experiences and adventure.",
        crowdLevel: "Moderate"
    },
    {
        id: "colombo",
        name: "Colombo",
        region: "Sri Lanka",
        country: "Sri Lanka",
        image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=900",
        budget: 35000,
        days: 4,
        season: "December to March",
        moods: ["Culture", "Food", "Nature", "Offbeat"],
        tags: ["coastal", "culture", "food", "city", "history"],
        themes: ["coastal", "culture", "food", "nature", "offbeat"],
        description: "A coastal city with cultural attractions, markets, local food and nearby seaside experiences.",
        reason: "A practical option for travellers interested in food, culture and coastal exploration.",
        crowdLevel: "Moderate"
    }
];

// ==================================================
// 2. DESTINATION GUIDES
// ==================================================

const destinationGuides = {
    munnar: {
        overview: "Munnar is a hill destination in Kerala known for tea plantations, misty mountain views and cool weather.",
        highlights: [
            "Tea plantations",
            "Eravikulam National Park",
            "Mattupetty Dam",
            "Top Station",
            "Scenic mountain viewpoints"
        ],
        bestTime: "September to March",
        travelTips: [
            "Carry light woollens.",
            "Start early for popular viewpoints.",
            "Keep some flexibility for weather conditions."
        ]
    },
    coorg: {
        overview: "Coorg is a green hill region in Karnataka known for coffee estates, forests, waterfalls and relaxed stays.",
        highlights: [
            "Coffee plantations",
            "Abbey Falls",
            "Raja's Seat",
            "Dubare Elephant Camp",
            "Forest and plantation stays"
        ],
        bestTime: "October to March",
        travelTips: [
            "Consider staying near Madikeri for convenient access.",
            "Check waterfall conditions during monsoon.",
            "Allow travel time between attractions."
        ]
    },
    varkala: {
        overview: "Varkala is a coastal destination in Kerala known for its cliffs, beaches, cafes and relaxed atmosphere.",
        highlights: [
            "Varkala Cliff",
            "Papanasam Beach",
            "Local cafes",
            "Sunset viewpoints",
            "Coastal walks"
        ],
        bestTime: "October to March",
        travelTips: [
            "Check sea conditions before swimming.",
            "Explore the cliff area on foot.",
            "Book accommodation early during peak season."
        ]
    },
    wayanad: {
        overview: "Wayanad is a nature-focused destination in Kerala known for forests, waterfalls, wildlife and mountain scenery.",
        highlights: [
            "Edakkal Caves",
            "Banasura Sagar Dam",
            "Soochipara Waterfalls",
            "Pookode Lake",
            "Wildlife and forest experiences"
        ],
        bestTime: "October to May",
        travelTips: [
            "Plan your route because attractions are spread out.",
            "Check local access and weather conditions.",
            "Carry comfortable walking shoes."
        ]
    }
};

// ==================================================
// 3. GENERAL HELPERS
// ==================================================

function hasValue(value) {
    return value !== undefined && value !== null && value !== "";
}

function validPositiveNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : null;
}

function uniqueStrings(values = []) {
    return [
        ...new Set(
            values
                .filter(value => typeof value === "string")
                .map(value => value.trim())
                .filter(Boolean)
        )
    ];
}

function normaliseTravelScope(value) {
    const scope = String(value || "").toLowerCase().trim();

    if (
        ["india", "domestic", "within india", "in india"].includes(scope)
    ) {
        return "India";
    }

    if (
        ["international", "abroad", "outside india", "foreign"].includes(scope)
    ) {
        return "International";
    }

    return "Any";
}

function detectTravelScopeFromPrompt(prompt = "") {
    const text = prompt.toLowerCase();

    if (
        /\b(international|abroad|outside india|foreign trip|outside the country)\b/.test(text)
    ) {
        return "International";
    }

    if (
        /\b(india|domestic|within india|in india)\b/.test(text)
    ) {
        return "India";
    }

    return null;
}

function parseBudgetFromPrompt(prompt = "") {
    const text = prompt.toLowerCase().replace(/,/g, "");

    const patterns = [
        /(?:₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|k|thousand)?/i,
        /(\d+(?:\.\d+)?)\s*(lakh|lakhs|k|thousand)\s*(?:rupees|rs|inr)?/i,
        /budget\s*(?:of|is|around|about|under|below|less than)?\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)/i
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);

        if (!match) continue;

        let amount = Number(match[1]);
        const unit = String(match[2] || "").toLowerCase();

        if (unit === "lakh" || unit === "lakhs") {
            amount *= 100000;
        } else if (unit === "k" || unit === "thousand") {
            amount *= 1000;
        }

        if (Number.isFinite(amount) && amount > 0) {
            return Math.round(amount);
        }
    }

    return null;
}

function parseDurationFromPrompt(prompt = "") {
    const text = prompt.toLowerCase();

    const patterns = [
        /(\d+)\s*(?:days?|d)\b/,
        /(\d+)\s*(?:nights?)\b/,
        /(?:for|of)\s*(\d+)\s*(?:days?|d)\b/
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);

        if (match) {
            return Number(match[1]);
        }
    }

    if (/\bweekend\b/.test(text)) return 2;
    if (/\bone week\b/.test(text)) return 7;

    return null;
}

// ==================================================
// 4. TRAVEL THEME AND MOOD EXTRACTION
// ==================================================

const THEME_KEYWORDS = [
    {
        theme: "nature",
        keywords: [
            "nature", "natural beauty", "greenery", "scenic",
            "landscape", "lakes", "lake", "valley", "outdoors"
        ]
    },
    {
        theme: "hills",
        keywords: ["hill", "hills", "hill station"]
    },
    {
        theme: "mountains",
        keywords: [
            "mountain", "mountains", "mountainous",
            "snow", "snowfall", "himalaya", "himalayas"
        ]
    },
    {
        theme: "forest",
        keywords: ["forest", "forests", "jungle", "woods"]
    },
    {
        theme: "waterfalls",
        keywords: ["waterfall", "waterfalls", "falls"]
    },
    {
        theme: "wildlife",
        keywords: ["wildlife", "safari", "animals", "birds"]
    },
    {
        theme: "beach",
        keywords: ["beach", "beaches", "seaside"]
    },
    {
        theme: "coastal",
        keywords: ["coast", "coastal", "sea", "ocean", "island"]
    },
    {
        theme: "adventure",
        keywords: [
            "adventure", "trek", "trekking", "hiking",
            "camping", "rafting", "water sports"
        ]
    },
    {
        theme: "culture",
        keywords: ["culture", "heritage", "history", "temple", "museum"]
    },
    {
        theme: "food",
        keywords: ["food", "cuisine", "street food", "restaurants"]
    },
    {
        theme: "romantic",
        keywords: ["romantic", "honeymoon"]
    },
    {
        theme: "peaceful",
        keywords: ["peaceful", "quiet", "calm", "relax", "relaxing"]
    },
    {
        theme: "offbeat",
        keywords: ["offbeat", "hidden gem", "less touristy", "unexplored"]
    },
    {
        theme: "city",
        keywords: ["city", "urban", "shopping", "nightlife"]
    }
];

function containsKeyword(text, keyword) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(`\\b${escaped}\\b`, "i");
    return pattern.test(text);
}

function extractTravelThemes(prompt = "") {
    const text = prompt.toLowerCase();
    const themes = [];

    for (const item of THEME_KEYWORDS) {
        if (item.keywords.some(keyword => containsKeyword(text, keyword))) {
            themes.push(item.theme);
        }
    }

    return uniqueStrings(themes);
}

function extractMoodsFromPrompt(prompt = "") {
    const text = prompt.toLowerCase();
    const moods = [];

    const moodRules = [
        {
            mood: "Nature",
            keywords: ["nature", "greenery", "forest", "mountain", "hills", "waterfall"]
        },
        {
            mood: "Peaceful",
            keywords: ["peaceful", "quiet", "calm", "relax", "less crowded"]
        },
        {
            mood: "Adventure",
            keywords: ["adventure", "trek", "trekking", "hiking", "camping", "rafting"]
        },
        {
            mood: "Romantic",
            keywords: ["romantic", "honeymoon", "couple"]
        },
        {
            mood: "Food",
            keywords: ["food", "cuisine", "street food", "restaurants"]
        },
        {
            mood: "Culture",
            keywords: ["culture", "heritage", "history", "temple", "museum"]
        },
        {
            mood: "Offbeat",
            keywords: ["offbeat", "hidden gem", "less touristy", "unexplored"]
        }
    ];

    for (const rule of moodRules) {
        if (rule.keywords.some(keyword => text.includes(keyword))) {
            moods.push(rule.mood);
        }
    }

    return uniqueStrings(moods);
}

function extractCrowdPreference(prompt = "") {
    const text = prompt.toLowerCase();

    if (
        /\b(less crowded|not crowded|avoid crowds|quiet places|peaceful places)\b/.test(text)
    ) {
        return "Less crowded";
    }

    if (
        /\b(crowded|busy places|lively places)\b/.test(text)
    ) {
        return "Crowded";
    }

    return null;
}

function extractTravellers(prompt = "") {
    const text = prompt.toLowerCase();

    if (/\b(couple|partner|wife|husband|spouse|two of us)\b/.test(text)) {
        return "Couple";
    }

    if (/\b(family|kids|children|parents)\b/.test(text)) {
        return "Family";
    }

    if (/\b(friends|group|bachelor)\b/.test(text)) {
        return "Friends";
    }

    if (/\b(solo|alone|by myself)\b/.test(text)) {
        return "Solo";
    }

    return null;
}

function extractDepartureLocation(prompt = "") {
    const match = prompt.match(
        /\b(?:from|starting from|departing from)\s+([a-zA-Z\s]+?)(?:\s+(?:for|with|under|around|on|in)\b|[,.;]|$)/i
    );

    return match ? match[1].trim() : null;
}

// ==================================================
// 5. PREFERENCE VALIDATION AND MERGING
// ==================================================

function validatePreferences(preferences = {}) {
    const validMoods = [
        "Nature",
        "Peaceful",
        "Adventure",
        "Romantic",
        "Food",
        "Culture",
        "Offbeat"
    ];

    const validThemes = THEME_KEYWORDS.map(item => item.theme);

    const moods = Array.isArray(preferences.moods)
        ? preferences.moods.filter(mood =>
            validMoods.some(valid =>
                valid.toLowerCase() === String(mood).toLowerCase()
            )
        )
        : [];

    const travelThemes = Array.isArray(preferences.travelThemes)
        ? preferences.travelThemes
            .map(theme => String(theme).toLowerCase().trim())
            .filter(theme => validThemes.includes(theme))
        : [];

    return {
        budget: validPositiveNumber(preferences.budget),
        duration: validPositiveNumber(preferences.duration),
        moods: uniqueStrings(moods),
        travelThemes: uniqueStrings(travelThemes),
        crowdPreference: preferences.crowdPreference || "Any",
        travellers: preferences.travellers || "Any",
        departureLocation: preferences.departureLocation || "",
        travelScope: normaliseTravelScope(preferences.travelScope)
    };
}

function preferencesWithDefaults(preferences = {}) {
    const validated = validatePreferences(preferences);

    return {
        budget: validated.budget,
        duration: validated.duration,
        moods: validated.moods,
        travelThemes: validated.travelThemes,
        crowdPreference: validated.crowdPreference,
        travellers: validated.travellers,
        departureLocation: validated.departureLocation,
        travelScope: validated.travelScope
    };
}

function mergePreferences(previous = {}, extracted = {}, supplied = {}) {
    const previousValid = validatePreferences(previous);
    const extractedValid = validatePreferences(extracted);
    const suppliedValid = validatePreferences(supplied);

    return {
        budget:
            suppliedValid.budget ??
            extractedValid.budget ??
            previousValid.budget,

        duration:
            suppliedValid.duration ??
            extractedValid.duration ??
            previousValid.duration,

        moods: uniqueStrings([
            ...previousValid.moods,
            ...extractedValid.moods,
            ...suppliedValid.moods
        ]),

        travelThemes: uniqueStrings([
            ...previousValid.travelThemes,
            ...extractedValid.travelThemes,
            ...suppliedValid.travelThemes
        ]),

        crowdPreference:
            supplied.crowdPreference ||
            extracted.crowdPreference ||
            previous.crowdPreference ||
            "Any",

        travellers:
            supplied.travellers ||
            extracted.travellers ||
            previous.travellers ||
            "Any",

        departureLocation:
            supplied.departureLocation ||
            extracted.departureLocation ||
            previous.departureLocation ||
            "",

        travelScope:
            normaliseTravelScope(
                supplied.travelScope ||
                extracted.travelScope ||
                previous.travelScope
            )
    };
}

// ==================================================
// 6. OLLAMA HELPERS
// ==================================================

function cleanJsonResponse(response = "") {
    let cleaned = String(response)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }

    return cleaned;
}

async function callOllama(prompt, options = {}) {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            prompt,
            stream: false,
            format: options.format || undefined,
            options: {
                temperature: options.temperature ?? 0.2,
                num_predict: options.num_predict ?? 700
            }
        }),
        signal: AbortSignal.timeout(options.timeout || 120000)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama error ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    return data.response || "";
}

// ==================================================
// 7. AI PREFERENCE EXTRACTION
// ==================================================

async function extractPreferences(
    userPrompt = "",
    suppliedPreferences = {},
    previousPreferences = {}
) {
    const deterministic = {
        budget: parseBudgetFromPrompt(userPrompt),
        duration: parseDurationFromPrompt(userPrompt),
        moods: extractMoodsFromPrompt(userPrompt),
        travelThemes: extractTravelThemes(userPrompt),
        crowdPreference: extractCrowdPreference(userPrompt),
        travellers: extractTravellers(userPrompt),
        departureLocation: extractDepartureLocation(userPrompt),
        travelScope: detectTravelScopeFromPrompt(userPrompt)
    };

    let aiExtracted = {};

    const extractionPrompt = `
You are a travel preference extraction assistant.

Extract only information explicitly stated in the latest user message.

Latest user message:
"${userPrompt}"

Return valid JSON only, using this schema:
{
  "budget": null,
  "duration": null,
  "moods": [],
  "travelThemes": [],
  "crowdPreference": "Any",
  "travellers": "Any",
  "departureLocation": "",
  "travelScope": "Any"
}

Rules:
- Budget must be a number in INR.
- Budget means total trip budget, not per-night accommodation budget.
- Duration must be a number of days.
- moods can contain Nature, Peaceful, Adventure, Romantic, Food, Culture, Offbeat.
- travelThemes can contain nature, hills, mountains, forest, waterfalls, wildlife, beach, coastal, adventure, culture, food, romantic, peaceful, offbeat, city.
- crowdPreference can be Any, Less crowded, or Crowded.
- travellers can be Any, Couple, Family, Friends, or Solo.
- travelScope can be India, International, or Any.
- If a field is not mentioned in the latest message, use null, [], or Any as appropriate.
- Do not invent preferences.
`;

    try {
        const raw = await callOllama(extractionPrompt, {
            timeout: 120000,
            num_predict: 350,
            temperature: 0
        });

        aiExtracted = JSON.parse(cleanJsonResponse(raw));
    } catch (error) {
        console.warn(
            "Ollama preference extraction failed; using deterministic extraction:",
            error.message
        );
    }

    const extracted = {
        ...aiExtracted,

        // Deterministic parsing takes precedence when the user
        // explicitly states a budget or duration.
        budget: deterministic.budget ?? aiExtracted.budget ?? null,
        duration: deterministic.duration ?? aiExtracted.duration ?? null,

        moods: uniqueStrings([
            ...(Array.isArray(aiExtracted.moods) ? aiExtracted.moods : []),
            ...deterministic.moods
        ]),

        travelThemes: uniqueStrings([
            ...(Array.isArray(aiExtracted.travelThemes)
                ? aiExtracted.travelThemes
                : []),
            ...deterministic.travelThemes
        ]),

        crowdPreference:
            deterministic.crowdPreference ||
            aiExtracted.crowdPreference ||
            "Any",

        travellers:
            deterministic.travellers ||
            aiExtracted.travellers ||
            "Any",

        departureLocation:
            deterministic.departureLocation ||
            aiExtracted.departureLocation ||
            "",

        travelScope:
            deterministic.travelScope ||
            aiExtracted.travelScope ||
            "Any"
    };

    return mergePreferences(
        previousPreferences,
        extracted,
        suppliedPreferences
    );
}

// ==================================================
// 8. RECOMMENDATION THEME PROFILES
// ==================================================

const DESTINATION_THEME_PROFILES = {
    munnar: {
        nature: 5,
        hills: 5,
        mountains: 5,
        forest: 3,
        waterfalls: 2,
        wildlife: 1,
        beach: 0,
        coastal: 0,
        highlights: [
            "Misty mountains",
            "Tea gardens",
            "Scenic viewpoints"
        ]
    },

    coorg: {
        nature: 5,
        hills: 4,
        mountains: 3,
        forest: 5,
        waterfalls: 4,
        wildlife: 2,
        beach: 0,
        coastal: 0,
        highlights: [
            "Coffee plantations",
            "Forests",
            "Waterfalls"
        ]
    },

    wayanad: {
        nature: 5,
        hills: 4,
        mountains: 4,
        forest: 5,
        waterfalls: 5,
        wildlife: 5,
        beach: 0,
        coastal: 0,
        highlights: [
            "Forests",
            "Waterfalls",
            "Wildlife"
        ]
    },

    varkala: {
        nature: 3,
        hills: 0,
        mountains: 0,
        forest: 1,
        waterfalls: 0,
        wildlife: 1,
        beach: 5,
        coastal: 5,
        highlights: [
            "Beaches",
            "Coastal cliffs",
            "Seaside cafes"
        ]
    },

    bali: {
        nature: 4,
        hills: 3,
        mountains: 3,
        forest: 3,
        waterfalls: 4,
        wildlife: 2,
        beach: 5,
        coastal: 5,
        highlights: [
            "Beaches",
            "Waterfalls",
            "Scenic landscapes"
        ]
    },

    phuket: {
        nature: 3,
        hills: 1,
        mountains: 1,
        forest: 2,
        waterfalls: 2,
        wildlife: 1,
        beach: 5,
        coastal: 5,
        highlights: [
            "Beaches",
            "Islands",
            "Coastal scenery"
        ]
    },

    bangkok: {
        nature: 1,
        hills: 0,
        mountains: 0,
        forest: 0,
        waterfalls: 0,
        wildlife: 0,
        beach: 0,
        coastal: 0,
        highlights: [
            "City experiences",
            "Food",
            "Culture"
        ]
    },

    singapore: {
        nature: 2,
        hills: 0,
        mountains: 0,
        forest: 1,
        waterfalls: 0,
        wildlife: 2,
        beach: 1,
        coastal: 1,
        highlights: [
            "Gardens",
            "City experiences",
            "Culture"
        ]
    },

    dubai: {
        nature: 1,
        hills: 0,
        mountains: 1,
        forest: 0,
        waterfalls: 0,
        wildlife: 0,
        beach: 2,
        coastal: 2,
        highlights: [
            "Desert experiences",
            "City attractions",
            "Shopping"
        ]
    },

    colombo: {
        nature: 2,
        hills: 0,
        mountains: 0,
        forest: 1,
        waterfalls: 0,
        wildlife: 1,
        beach: 3,
        coastal: 4,
        highlights: [
            "Coastal scenery",
            "Culture",
            "Food"
        ]
    }
};

function normaliseTheme(theme) {
    const value = String(theme || "").toLowerCase().trim();

    const aliases = {
        hill: "hills",
        "hill station": "hills",
        mountain: "mountains",
        mountainous: "mountains",
        forest: "forest",
        forests: "forest",
        waterfall: "waterfalls",
        waterfalls: "waterfalls",
        beach: "beach",
        beaches: "beach",
        seaside: "coastal",
        coast: "coastal",
        coastal: "coastal"
    };

    return aliases[value] || value;
}

function getDestinationThemeStrength(destination, theme) {
    const id = String(destination.id || "").toLowerCase();
    const profile = DESTINATION_THEME_PROFILES[id];
    const normalisedTheme = normaliseTheme(theme);

    if (profile && profile[normalisedTheme] !== undefined) {
        return profile[normalisedTheme];
    }

    const searchableText = [
        destination.name,
        destination.region,
        destination.description,
        destination.reason,
        ...(Array.isArray(destination.tags) ? destination.tags : []),
        ...(Array.isArray(destination.themes) ? destination.themes : [])
    ]
        .join(" ")
        .toLowerCase();

    const keywords = {
        nature: ["nature", "greenery", "scenic", "landscape", "lake"],
        hills: ["hill", "hills", "hill station"],
        mountains: ["mountain", "mountains", "mountainous", "snow"],
        forest: ["forest", "forests", "jungle"],
        waterfalls: ["waterfall", "waterfalls"],
        wildlife: ["wildlife", "safari", "animals"],
        beach: ["beach", "beaches", "island"],
        coastal: ["coastal", "coast", "sea", "seaside"]
    };

    const terms = keywords[normalisedTheme] || [normalisedTheme];

    return terms.some(term => searchableText.includes(term)) ? 3 : 0;
}

// ==================================================
// 9. PERSONALIZED RECOMMENDATION ENGINE
// ==================================================

function getFallbackRecommendations(preferences = {}) {
    const requestedThemes = uniqueStrings(
        (Array.isArray(preferences.travelThemes)
            ? preferences.travelThemes
            : []
        ).map(normaliseTheme)
    );

    const requestedMoods = Array.isArray(preferences.moods)
        ? preferences.moods
        : [];

    const requestedDuration = Number(preferences.duration) || 0;
    const requestedBudget = Number(preferences.budget) || 0;

    const travelScope = String(
        preferences.travelScope || "Any"
    ).toLowerCase();

    const crowdPreference = String(
        preferences.crowdPreference || "Any"
    ).toLowerCase();

    const wantsHillsOrMountains = requestedThemes.some(theme =>
        ["hills", "mountains"].includes(theme)
    );

    const recommendations = destinations
        .map(destination => {
            // ------------------------------------------
            // TRAVEL SCOPE FILTER
            // ------------------------------------------

            const destinationCountry = String(
                destination.country || ""
            ).toLowerCase();

            if (
                travelScope === "india" &&
                destinationCountry !== "india"
            ) {
                return null;
            }

            if (
                ["international", "abroad"].includes(travelScope) &&
                destinationCountry === "india"
            ) {
                return null;
            }

            // ------------------------------------------
            // TOTAL TRIP BUDGET FILTER
            // ------------------------------------------

            const destinationBaseBudget = Number(destination.budget) || 0;
            const destinationBaseDays = Number(destination.days) || 1;

            const tripDays = requestedDuration || destinationBaseDays;

            const estimatedTripBudget = Math.ceil(
                (destinationBaseBudget / destinationBaseDays) * tripDays
            );

            // The user's budget is the maximum total trip budget.
            // Never include destinations that exceed it.
            if (
                requestedBudget > 0 &&
                estimatedTripBudget > requestedBudget
            ) {
                return null;
            }

            // ------------------------------------------
            // THEME MATCHING
            // ------------------------------------------

            const matchedThemes = [];
            let totalThemeStrength = 0;

            requestedThemes.forEach(theme => {
                const strength = getDestinationThemeStrength(
                    destination,
                    theme
                );

                totalThemeStrength += strength;

                if (strength > 0) {
                    matchedThemes.push(theme);
                }
            });

            let themeScore = 0;

            if (requestedThemes.length > 0) {
                const averageThemeStrength =
                    totalThemeStrength / requestedThemes.length;

                themeScore = (averageThemeStrength / 5) * 60;
            }

            // ------------------------------------------
            // MOOD MATCHING
            // ------------------------------------------

            const destinationMoods = Array.isArray(destination.moods)
                ? destination.moods.map(mood =>
                    String(mood).toLowerCase()
                )
                : [];

            const matchedMoods = requestedMoods.filter(mood =>
                destinationMoods.includes(String(mood).toLowerCase())
            );

            let moodScore = 0;

            if (requestedMoods.length > 0) {
                moodScore =
                    (matchedMoods.length / requestedMoods.length) * 15;
            }

            // ------------------------------------------
            // BUDGET SCORE
            // ------------------------------------------

            let budgetScore = 10;

            if (requestedBudget > 0) {
                const budgetUsage =
                    estimatedTripBudget / requestedBudget;

                budgetScore = Math.max(
                    0,
                    10 - budgetUsage * 3
                );
            }

            // ------------------------------------------
            // DURATION SCORE
            // ------------------------------------------

            let durationScore = 10;

            if (requestedDuration > 0) {
                const durationDifference = Math.abs(
                    destinationBaseDays - requestedDuration
                );

                durationScore = Math.max(
                    0,
                    10 - durationDifference * 2
                );
            }

            // ------------------------------------------
            // CROWD PREFERENCE SCORE
            // ------------------------------------------

            let crowdScore = 0;

            const destinationCrowd = String(
                destination.crowdLevel || ""
            ).toLowerCase();

            if (
                crowdPreference.includes("less") ||
                crowdPreference.includes("quiet")
            ) {
                if (destinationCrowd === "low") {
                    crowdScore = 5;
                } else if (destinationCrowd === "moderate") {
                    crowdScore = 2;
                } else if (destinationCrowd === "high") {
                    crowdScore = -3;
                }
            }

            // ------------------------------------------
            // CONTRADICTION PENALTY
            // ------------------------------------------

            let contradictionPenalty = 0;

            const beachStrength = getDestinationThemeStrength(
                destination,
                "beach"
            );

            const coastalStrength = getDestinationThemeStrength(
                destination,
                "coastal"
            );

            if (
                wantsHillsOrMountains &&
                beachStrength >= 4 &&
                coastalStrength >= 4
            ) {
                contradictionPenalty = 25;
            }

            // ------------------------------------------
            // HILL AND MOUNTAIN FIT BONUS
            // ------------------------------------------

            let destinationFitBonus = 0;

            if (wantsHillsOrMountains) {
                const hillStrength = getDestinationThemeStrength(
                    destination,
                    "hills"
                );

                const mountainStrength = getDestinationThemeStrength(
                    destination,
                    "mountains"
                );

                destinationFitBonus =
                    ((hillStrength + mountainStrength) / 10) * 5;
            }

            // ------------------------------------------
            // FINAL SCORE
            // ------------------------------------------

            const rawScore =
                themeScore +
                moodScore +
                budgetScore +
                durationScore +
                crowdScore +
                destinationFitBonus -
                contradictionPenalty;

            const score = Math.max(
                0,
                Math.min(100, Math.round(rawScore))
            );

            // ------------------------------------------
            // MATCH EXPLANATION
            // ------------------------------------------

            const profile = DESTINATION_THEME_PROFILES[
                String(destination.id || "").toLowerCase()
            ];

            const matchedFeatures = profile?.highlights || [];

            let matchReason = `${destination.name} is a possible match`;

            if (matchedThemes.length > 0) {
                matchReason +=
                    ` because it matches your interests in ${matchedThemes.join(", ")}`;
            }

            if (matchedMoods.length > 0) {
                matchReason +=
                    `. It also matches your ${matchedMoods.join(", ")} travel preferences`;
            }

            if (matchedFeatures.length > 0) {
                matchReason +=
                    `. Highlights include ${matchedFeatures.join(", ")}`;
            }

            if (requestedBudget > 0) {
                matchReason +=
                    `. Estimated total trip budget: ₹${estimatedTripBudget.toLocaleString("en-IN")}`;
            }

            matchReason += ".";

            return {
                ...destination,
                estimatedTripBudget,
                score,
                matchScore: score,
                matchReason,
                reason: matchReason,
                matchedMoods,
                matchedThemes,
                matchedFeatures
            };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score);

    return recommendations;
}

// ==================================================
// 10. FOLLOW-UP QUESTION HELPER
// ==================================================

function buildFollowUpQuestion(preferences = {}) {
    if (!preferences.budget) {
        return "What is your total trip budget in INR?";
    }

    if (!preferences.duration) {
        return "How many days are you planning to travel?";
    }

    return null;
}

// ==================================================
// 11. TRAVEL CONTEXT FOR AI
// ==================================================

function getTravelContext(destination, preferences = {}) {
    return {
        destination: destination.name,
        region: destination.region,
        country: destination.country,
        budget: destination.estimatedTripBudget || destination.budget,
        duration: preferences.duration || destination.days,
        travelThemes: preferences.travelThemes || [],
        moods: preferences.moods || [],
        travellers: preferences.travellers || "Any",
        departureLocation: preferences.departureLocation || "",
        season: destination.season,
        description: destination.description,
        highlights:
            DESTINATION_THEME_PROFILES[destination.id]?.highlights || []
    };
}

// ==================================================
// 12. DESTINATION DETAIL HELPERS
// ==================================================

function fallbackGuide(destination) {
    const guide = destinationGuides[destination.id];

    if (guide) {
        return {
            ...guide,
            destination: destination.name
        };
    }

    return {
        destination: destination.name,
        overview: destination.description,
        highlights: DESTINATION_THEME_PROFILES[destination.id]?.highlights || destination.tags || [],
        bestTime: destination.season,
        travelTips: [
            "Check local weather before travelling.",
            "Plan transport between attractions in advance.",
            "Confirm current opening times before visiting."
        ]
    };
}

function normaliseDestinationDetails(details, destination) {
    if (!details || typeof details !== "object") {
        return fallbackGuide(destination);
    }

    return {
        destination: destination.name,
        overview: details.overview || destination.description,
        highlights: Array.isArray(details.highlights)
            ? details.highlights
            : fallbackGuide(destination).highlights,
        bestTime: details.bestTime || destination.season,
        travelTips: Array.isArray(details.travelTips)
            ? details.travelTips
            : fallbackGuide(destination).travelTips
    };
}

// ==================================================
// 13. ITINERARY HELPERS
// ==================================================

function fallbackItinerary(destination, duration) {
    const days = [];

    const highlights =
        DESTINATION_THEME_PROFILES[destination.id]?.highlights ||
        destination.tags ||
        [destination.name];

    for (let day = 1; day <= duration; day++) {
        const firstActivity = highlights[(day - 1) % highlights.length];
        const secondActivity = highlights[day % highlights.length];

        days.push({
            day,
            title: `Explore ${destination.name} - Day ${day}`,
            activities: [
                {
                    time: "Morning",
                    activity: `Explore ${firstActivity}`
                },
                {
                    time: "Afternoon",
                    activity: `Visit or experience ${secondActivity}`
                },
                {
                    time: "Evening",
                    activity: "Enjoy local food and relax"
                }
            ]
        });
    }

    return {
        destination: destination.name,
        duration,
        days
    };
}

// Always return exactly the requested number of days.
function normaliseItinerary(itinerary, destination, duration) {
    const fallback = fallbackItinerary(destination, duration);

    if (!itinerary || typeof itinerary !== "object") {
        return fallback;
    }

    const aiDays = Array.isArray(itinerary.days)
        ? itinerary.days
        : [];

    const normalisedDays = [];

    for (let index = 0; index < duration; index++) {
        const aiDay = aiDays[index];
        const fallbackDay = fallback.days[index];

        if (!aiDay || typeof aiDay !== "object") {
            normalisedDays.push(fallbackDay);
            continue;
        }

        normalisedDays.push({
            day: index + 1,
            title: aiDay.title || fallbackDay.title,
            activities:
                Array.isArray(aiDay.activities) &&
                aiDay.activities.length > 0
                    ? aiDay.activities
                        .filter(activity =>
                            activity &&
                            typeof activity.activity === "string"
                        )
                        .map(activity => ({
                            time: activity.time || "Flexible",
                            activity: activity.activity
                        }))
                    : fallbackDay.activities
        });
    }

    return {
        destination: destination.name,
        duration,
        title: itinerary.title || `${duration} Days in ${destination.name}`,
        summary: itinerary.summary || "",
        days: normalisedDays,
        travelTips: Array.isArray(itinerary.travelTips)
            ? itinerary.travelTips
            : []
    };
}

// Create a consistent estimated budget breakdown.
// These are planning estimates, not live travel prices.
function createBudgetSummary(totalEstimated) {
    const total = Math.max(0, Math.round(totalEstimated));

    const accommodation = Math.round(total * 0.35);
    const food = Math.round(total * 0.25);
    const localTransport = Math.round(total * 0.15);
    const activities = Math.round(total * 0.20);

    // Use the remainder to ensure the categories add up exactly.
    const other =
        total -
        accommodation -
        food -
        localTransport -
        activities;

    return {
        accommodation,
        food,
        localTransport,
        activities,
        other,
        totalEstimated: total
    };
}


// ==================================================
// 14. HEALTH CHECK
// ==================================================

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "WanderMind AI backend is running.",
        model: OLLAMA_MODEL,
        ollamaUrl: OLLAMA_URL
    });
});

// ==================================================
// 15. TEST OLLAMA
// ==================================================

app.post("/api/test-ollama", async (req, res) => {
    try {
        const prompt = req.body?.prompt || "Reply with: Ollama is working.";

        const response = await callOllama(prompt, {
            timeout: 120000,
            num_predict: 100
        });

        res.json({
            success: true,
            source: "ollama",
            model: OLLAMA_MODEL,
            response
        });
    } catch (error) {
        console.error("Ollama test error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to connect to Ollama.",
            error: error.message
        });
    }
});

// ==================================================
// 16. BASIC RECOMMENDATION ENDPOINT
// ==================================================

app.post("/api/recommend", (req, res) => {
    try {
        const preferences = preferencesWithDefaults(req.body?.preferences || {});

        const followUpQuestion = buildFollowUpQuestion(preferences);

        if (followUpQuestion) {
            return res.json({
                success: true,
                needsMoreInfo: true,
                question: followUpQuestion,
                preferences
            });
        }

        const recommendations = getFallbackRecommendations(preferences);

        return res.json({
            success: true,
            needsMoreInfo: false,
            source: "personalised recommendation engine",
            preferences,
            totalResults: recommendations.length,
            message: recommendations.length
                ? "Here are destinations ranked using your preferences."
                : "No destinations currently match your budget and travel preferences.",
            recommendations
        });
    } catch (error) {
        console.error("Recommendation error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to generate recommendations.",
            error: error.message
        });
    }
});

// ==================================================
// 17. AI RECOMMENDATION ENDPOINT
// ==================================================

app.post("/api/ai-recommend", async (req, res) => {
    try {
        const {
            prompt = "",
            preferences = {},
            previousPreferences = {}
        } = req.body || {};

        const extractedPreferences = await extractPreferences(
            prompt,
            preferences,
            previousPreferences
        );

        const followUpQuestion = buildFollowUpQuestion(
            extractedPreferences
        );

        if (followUpQuestion) {
            return res.json({
                success: true,
                needsMoreInfo: true,
                question: followUpQuestion,
                source: "ollama + preference extraction",
                model: OLLAMA_MODEL,
                preferences: extractedPreferences,
                recommendations: []
            });
        }

        const recommendations = getFallbackRecommendations(
            extractedPreferences
        );

        return res.json({
            success: true,
            needsMoreInfo: false,
            source: "ollama + personalised recommendation engine",
            model: OLLAMA_MODEL,
            preferences: extractedPreferences,
            totalResults: recommendations.length,
            message: recommendations.length
                ? "Destinations ranked using your accumulated travel preferences."
                : "No destinations match your current preferences and total trip budget. Try adjusting your budget, duration or travel preferences.",
            recommendations: recommendations.slice(0, 10)
        });
    } catch (error) {
        console.error("AI recommendation error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to generate AI recommendations.",
            error: error.message
        });
    }
});

// ==================================================
// 18. DESTINATION DETAILS ENDPOINT
// ==================================================

app.post("/api/destination-details", async (req, res) => {
    try {
        const { destinationId, destinationName } = req.body || {};

        const destination = destinations.find(item =>
            item.id === destinationId ||
            item.name.toLowerCase() === String(destinationName || "").toLowerCase()
        );

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found."
            });
        }

        const fallback = fallbackGuide(destination);

        const prompt = `
You are a travel guide assistant.

Create a useful travel guide for ${destination.name}.

Destination information:
${JSON.stringify(getTravelContext(destination), null, 2)}

Return valid JSON only:
{
  "overview": "Short destination overview",
  "highlights": ["Highlight 1", "Highlight 2"],
  "bestTime": "Best time to visit",
  "travelTips": ["Tip 1", "Tip 2"]
}

Use realistic, helpful information.
Do not invent exact prices, opening hours or transport schedules.
`;

        try {
            const raw = await callOllama(prompt, {
                timeout: 120000,
                num_predict: 600
            });

            const parsed = JSON.parse(cleanJsonResponse(raw));
            const details = normaliseDestinationDetails(parsed, destination);

            return res.json({
                success: true,
                source: "ollama",
                model: OLLAMA_MODEL,
                destination,
                details
            });
        } catch (aiError) {
            console.warn(
                "Destination details AI fallback:",
                aiError.message
            );

            return res.json({
                success: true,
                source: "local fallback",
                destination,
                details: fallback
            });
        }
    } catch (error) {
        console.error("Destination details error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load destination details.",
            error: error.message
        });
    }
});

// ==================================================
// 19. GENERATE ITINERARY ENDPOINT
// ==================================================

app.post("/api/generate-itinerary", async (req, res) => {
    try {
        const {
            destinationId,
            destinationName,
            duration,
            budget,
            preferences = {},
            conversation = [],
            requestedDuration,
            maximumBudget
        } = req.body || {};

        // ------------------------------------------
        // 1. FIND DESTINATION
        // ------------------------------------------

        const destination = destinations.find(item =>
            item.id === destinationId ||
            item.name.toLowerCase() ===
                String(destinationName || "").toLowerCase()
        );

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: "Destination not found."
            });
        }

        // ------------------------------------------
        // 2. READ LATEST USER MESSAGE PREFERENCES
        // ------------------------------------------

        let chatDuration = null;
        let chatBudget = null;

        if (Array.isArray(conversation)) {
            for (const message of conversation) {
                if (
                    message?.role !== "user" ||
                    typeof message?.content !== "string"
                ) {
                    continue;
                }

                const messageDuration =
                    parseDurationFromPrompt(message.content);

                const messageBudget =
                    parseBudgetFromPrompt(message.content);

                // Later user messages override earlier values.
                if (messageDuration !== null) {
                    chatDuration = messageDuration;
                }

                if (messageBudget !== null) {
                    chatBudget = messageBudget;
                }
            }
        }

        // ------------------------------------------
        // 3. DETERMINE FINAL DURATION AND BUDGET
        // ------------------------------------------

        const tripDuration =
            validPositiveNumber(chatDuration) ??
            validPositiveNumber(requestedDuration) ??
            validPositiveNumber(preferences.duration) ??
            validPositiveNumber(duration) ??
            destination.days;

        const tripBudget =
            validPositiveNumber(chatBudget) ??
            validPositiveNumber(maximumBudget) ??
            validPositiveNumber(preferences.budget) ??
            validPositiveNumber(budget);

        if (
            !Number.isInteger(tripDuration) ||
            tripDuration < 1 ||
            tripDuration > 30
        ) {
            return res.status(400).json({
                success: false,
                message: "Please choose a trip duration between 1 and 30 days."
            });
        }

        // ------------------------------------------
        // 4. ESTIMATE TOTAL TRIP COST
        // ------------------------------------------

        // Destination budgets represent estimated total
        // costs for the destination's default duration.
        const estimatedTripBudget = Math.ceil(
            (destination.budget / destination.days) * tripDuration
        );

        // Strict maximum total trip budget validation.
        if (
            tripBudget !== null &&
            estimatedTripBudget > tripBudget
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `The estimated trip cost of ₹${estimatedTripBudget.toLocaleString("en-IN")} exceeds your maximum budget of ₹${tripBudget.toLocaleString("en-IN")}. Please choose another destination or increase your budget.`,
                estimatedTripBudget,
                budgetLimit: tripBudget
            });
        }

        // ------------------------------------------
        // 5. CREATE BUDGET BREAKDOWN
        // ------------------------------------------

        // The helper ensures all categories add up
        // exactly to the estimated total.
        const budgetSummary =
            createBudgetSummary(estimatedTripBudget);

        // ------------------------------------------
        // 6. PREPARE USER PREFERENCES
        // ------------------------------------------

        const itineraryPreferences = {
            ...preferences,

            duration: tripDuration,
            budget: tripBudget,

            moods: Array.isArray(preferences.moods)
                ? preferences.moods
                : [],

            travelThemes: Array.isArray(preferences.travelThemes)
                ? preferences.travelThemes
                : [],

            travellers: preferences.travellers || "Any",

            departureLocation:
                preferences.departureLocation || "",

            crowdPreference:
                preferences.crowdPreference || "Any",

            travelScope: normaliseTravelScope(
                preferences.travelScope
            )
        };

        // ------------------------------------------
        // 7. PREPARE CONVERSATION HISTORY
        // ------------------------------------------

        const conversationContext = Array.isArray(conversation)
            ? conversation
                .filter(message =>
                    message &&
                    ["user", "assistant"].includes(message.role)
                )
                .map(message =>
                    `${message.role}: ${String(message.content || "")}`
                )
                .join("\n")
            : "";

        const travelContext = getTravelContext(
            destination,
            itineraryPreferences
        );

        // ------------------------------------------
        // 8. CREATE FALLBACK ITINERARY
        // ------------------------------------------

        const fallback = normaliseItinerary(
            fallbackItinerary(destination, tripDuration),
            destination,
            tripDuration
        );

        fallback.budgetSummary = budgetSummary;

        // ------------------------------------------
        // 9. BUILD AI PROMPT
        // ------------------------------------------

        const prompt = `
You are an experienced travel itinerary planner for WanderMind AI.

Create a realistic and useful itinerary for the destination below.

DESTINATION:
${JSON.stringify(travelContext, null, 2)}

USER PREFERENCES:
${JSON.stringify(itineraryPreferences, null, 2)}

CONVERSATION HISTORY:
${conversationContext || "No additional conversation provided."}

STRICT TRIP REQUIREMENTS:

Destination: ${destination.name}

Number of days: EXACTLY ${tripDuration}

Maximum total trip budget:
${tripBudget !== null
    ? `INR ${tripBudget}`
    : "No maximum budget provided."}

Estimated total trip budget:
INR ${estimatedTripBudget}

Budget breakdown:
${JSON.stringify(budgetSummary, null, 2)}

IMPORTANT INSTRUCTIONS:

1. Generate exactly ${tripDuration} days.
2. Day numbers must start at 1 and end at ${tripDuration}.
3. Never generate an extra day.
4. Never change the requested duration.
5. Use the latest user preferences and conversation history.
6. Consider the departure location:
   ${itineraryPreferences.departureLocation || "Not specified"}.
7. Consider the user's moods:
   ${itineraryPreferences.moods.join(", ") || "Not specified"}.
8. Consider the user's interests:
   ${itineraryPreferences.travelThemes.join(", ") || "Not specified"}.
9. Consider the crowd preference:
   ${itineraryPreferences.crowdPreference}.
10. Consider the traveller type:
    ${itineraryPreferences.travellers}.
11. Plan activities that are appropriate for the destination.
12. Avoid repeating activities unnecessarily.
13. Avoid unrealistic travel between distant attractions.
14. Do not invent exact ticket prices, opening hours or transport schedules.
15. Do not exceed the maximum total trip budget.
16. Return valid JSON only.

RETURN THIS JSON STRUCTURE:

{
    "title": "Trip title",
    "summary": "Short trip summary",
    "days": [
        {
            "day": 1,
            "title": "Day 1 title",
            "activities": [
                {
                    "time": "Morning",
                    "activity": "Activity description"
                },
                {
                    "time": "Afternoon",
                    "activity": "Activity description"
                },
                {
                    "time": "Evening",
                    "activity": "Activity description"
                }
            ]
        }
    ],
    "travelTips": [
        "Travel tip 1",
        "Travel tip 2"
    ]
}

Remember: Return exactly ${tripDuration} day objects.
Do not include Markdown or explanations outside the JSON.
`;

        // ------------------------------------------
        // 10. CALL OLLAMA
        // ------------------------------------------

        try {
            const raw = await callOllama(prompt, {
                timeout: 180000,
                num_predict: 1800,
                temperature: 0.2
            });

            const cleaned = cleanJsonResponse(raw);
            const parsed = JSON.parse(cleaned);

            // Normalise the AI response.
            // This guarantees exactly the requested number of days.
            const itinerary = normaliseItinerary(
                parsed,
                destination,
                tripDuration
            );

            // Always attach budget breakdown from backend.
            itinerary.budgetSummary = budgetSummary;

            // ------------------------------------------
            // 11. FINAL VALIDATION
            // ------------------------------------------

            if (itinerary.days.length !== tripDuration) {
                throw new Error(
                    "Unable to create the requested number of itinerary days."
                );
            }

            if (
                tripBudget !== null &&
                itinerary.budgetSummary.totalEstimated > tripBudget
            ) {
                throw new Error(
                    "Generated itinerary exceeds the maximum trip budget."
                );
            }

            return res.json({
                success: true,
                source: "ollama",
                model: OLLAMA_MODEL,

                destination: destination.name,
                duration: tripDuration,

                estimatedTripBudget,
                budgetLimit: tripBudget,

                itinerary
            });

        } catch (aiError) {
            console.warn(
                "Itinerary AI fallback:",
                aiError.message
            );

            // ------------------------------------------
            // 12. RETURN FALLBACK ITINERARY
            // ------------------------------------------

            // The fallback already contains exactly the
            // requested number of days and budget breakdown.
            return res.json({
                success: true,
                source: "local fallback",
                model: OLLAMA_MODEL,

                destination: destination.name,
                duration: tripDuration,

                estimatedTripBudget,
                budgetLimit: tripBudget,

                itinerary: fallback
            });
        }

    } catch (error) {
        console.error(
            "Generate itinerary error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Unable to generate itinerary.",
            error: error.message
        });
    }
});




// ==================================================
// 20. START SERVER
// ==================================================

app.listen(PORT, () => {
    console.log("----------------------------------------");
    console.log("WanderMind AI backend is running");
    console.log(`Server: http://localhost:${PORT}`);
    console.log(`Ollama: ${OLLAMA_URL}`);
    console.log(`Model: ${OLLAMA_MODEL}`);
    console.log("----------------------------------------");
});