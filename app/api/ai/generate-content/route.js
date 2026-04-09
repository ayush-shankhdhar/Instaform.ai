import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
const user = require('@/models/user');
const form = require('@/models/Form');
const jwt = require('jsonwebtoken');

const SYSTEM_PROMPT = `You are an expert HTML form designer. Generate a complete, standalone HTML page with a beautiful, production-ready form based on the user's prompt.

STRICT RULES:
1. Output ONLY raw HTML. No markdown, no code fences, no commentary, no \`\`\`, no language identifiers.
2. The form's action must be "/api/analytics/submit" with method="POST".
3. Every form MUST include an email field (type="email", required) for contact purposes.
4. Include a <title> tag that describes the form.
5. Use the Tailwind CSS CDN: <script src="https://unpkg.com/@tailwindcss/browser@4"></script>

DESIGN REQUIREMENTS — Make it visually stunning:
- Use a modern, dark-themed design (bg-gray-950 or bg-slate-950 page background).
- The form card should have a subtle dark background (bg-gray-900/bg-slate-900) with rounded-2xl corners, shadow-2xl, and a ring-1 ring-white/10 border.
- Center the form vertically and horizontally using min-h-screen flex items-center justify-center.
- Max width of the form should be max-w-lg or max-w-xl depending on complexity.
- Form heading should be large (text-3xl or text-4xl), font-bold, and use a gradient text effect: bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent.
- Subtitle/description below the heading in text-gray-400.
- Input fields: bg-gray-800, border border-gray-700, rounded-xl, px-4 py-3, text-white, focus:ring-2 focus:ring-purple-500 focus:border-transparent, placeholder-gray-500. Make them full-width.
- Labels: text-sm font-medium text-gray-300, with mb-1.5 spacing.
- Use proper spacing: space-y-5 or space-y-6 between form groups.
- Submit button: w-full, py-3, rounded-xl, font-semibold, text-white, bg-gradient-to-r from-purple-600 to-pink-600, hover:from-purple-500 hover:to-pink-500, transition-all duration-300, shadow-lg shadow-purple-500/25.
- Add subtle animations where appropriate.
- For select dropdowns: same styling as inputs, appearance-none with custom styling.
- For textareas: same styling as inputs, with min-h-[120px].
- For radio buttons and checkboxes: use accent-purple-500, with proper label spacing.
- For rating systems: use a creative visual approach (stars, scale buttons, etc).
- Group related fields together with subtle section dividers or group headings.
- Add a footer note under the submit button in text-xs text-gray-500.
- Give body class min-h-screen (not h-screen).
- Add padding to the overall container (p-4) for mobile responsiveness.

CONTENT QUALITY:
- Generate real, meaningful placeholder text and labels — NOT generic "Field 1", "Field 2".
- For quizzes: write complete, interesting questions with proper answer options and even spacing.
- For surveys: use a mix of input types (text, select, radio, checkbox, textarea, range).
- For registration forms: include helpful validation hints below inputs.
- Add helpful descriptions or instructions at the top of the form.
- Make the form feel professional and complete, as if designed by a senior UI designer.

If the prompt is not related to forms, respond with exactly: "Invalid Prompt."

USER PROMPT: `;

function generateFormNumber() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `form_${randomNumber}`;
}

export const POST = async (req) => {
    await connectToDB();
    try {
        const { prompt, token } = await req.json();
        if (!token) {
            return NextResponse.json({ error: "Un-Authorised Access" }, { status: 200 });
        }
        if (!prompt) {
            return NextResponse.json({ error: "No prompt received" }, { status: 200 });
        }
        let email;
        try {
            email = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 200 });
        }
        const userResponse = await user.findOne({ email });
        if (!userResponse) {
            return NextResponse.json({ error: "Un-Authorised Access" }, { status: 200 });
        }
        const result = await model.generateContent(SYSTEM_PROMPT + prompt);
        const responseText = result.response.candidates[0].content.parts[0].text;
        if (responseText.includes("Invalid Prompt.")) {
            return NextResponse.json({ error: "Invalid Prompt." }, { status: 200 });
        }
        let cleanHTML = responseText
            .replace(/^```html?\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();
        let formNo;
        let exists = true;
        while (exists) {
            formNo = generateFormNumber();
            const found = await form.findOne({ formNo });
            if (!found) exists = false;
        }
        const match = cleanHTML.match(/<title>(.*?)<\/title>/i);
        const formName = match ? match[1] : "Untitled Form";
        await form.create({ owner: userResponse._id, body: cleanHTML, formNo, formName });
        return NextResponse.json({ msg: "Success", formNo }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
