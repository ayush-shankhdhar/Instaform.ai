import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
const analytics = require('@/models/analytics');

export const POST = async (req) => {
    await connectToDB();
    try {
        const refer = req.headers.get('referer');
        const formData = await req.formData();
        const jsonData = Object.fromEntries(formData.entries());
        const formNo = `form_${refer.slice(-6)}`;
        await analytics.findOneAndUpdate(
            { formNo: formNo },
            {
                $setOnInsert: { formNo: formNo },
                $push: { responses: jsonData }
            },
            { new: true, upsert: true }
        );

        return new NextResponse(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Success</title>
                <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
            </head>
            <body class="bg-[#0a0a0f] min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <div class="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                        <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h1 class="text-3xl font-bold text-white mb-2">Form Submitted!</h1>
                    <p class="text-gray-400 text-lg">Thank you for your response.</p>
                </div>
            </body>
            </html>`,
            { headers: { "Content-Type": "text/html" } }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}