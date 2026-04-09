import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
const Analytics = require('@/models/analytics');
const user = require('@/models/user');
const Form = require('@/models/Form');
const jwt = require('jsonwebtoken');

export const POST = async (req) => {
    await connectToDB();
    try {
        const body = await req.json();
        const { formNo, token } = body;
        if (!token) {
            return NextResponse.json({ error: "Un-Authorised Access" }, { status: 200 });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 200 });
        }
        const email = typeof decoded === 'string' ? decoded : decoded.email;
        if (!email) {
            return NextResponse.json({ error: "Un-Authorised Access" }, { status: 200 });
        }
        const userResponse = await user.findOne({ email });
        if (!userResponse) {
            return NextResponse.json({ error: "Un-Authorised Access" }, { status: 200 });
        }
        const form = await Form.findOne({ formNo });
        if (!form) {
            return NextResponse.json({ error: "Invalid Form number" }, { status: 200 });
        }
        if (!form.owner.equals(userResponse._id)) {
            return NextResponse.json({ error: "Un-Authorised Access" }, { status: 200 });
        }
        const analytics = await Analytics.findOne({ formNo });
        if (!analytics || analytics.responses.length === 0) {
            return NextResponse.json({ error: "No responses found" }, { status: 200 });
        }
        const data = analytics.responses;
        const keys = Object.keys(data[0]);
        let csv = keys.join(",") + "\n";
        data.forEach(obj => {
            const temp = keys.map(key => {
                const val = String(obj[key] || "").replace(/"/g, '""');
                return val.includes(",") ? `"${val}"` : val;
            }).join(",");
            csv += temp + "\n";
        });
        const headers = new Headers();
        headers.append("Content-Type", "text/csv");
        headers.append("Content-Disposition", `attachment; filename=Responses_${formNo}.csv`);
        return new Response(csv, { headers });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}