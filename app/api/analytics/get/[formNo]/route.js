import connectToDB from "@/lib/db";
import { NextResponse } from "next/server";
const user = require('@/models/user');
const analytics = require('@/models/analytics');
const jwt = require('jsonwebtoken');

export const POST = async (req, { params }) => {
    await connectToDB();
    try {
        const { formNo } = await params;
        const { token } = await req.json();
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
        const userResponse = await user.findOne({ email });
        if (!userResponse) {
            return NextResponse.json({ error: "Un-Authorised Access" }, { status: 200 });
        }
        if (!formNo) {
            return NextResponse.json({ error: "No FormNumber received" }, { status: 200 });
        }
        const response = await analytics.findOne({ formNo });
        if (!response) {
            return NextResponse.json({ msg: "No Analytics Available" }, { status: 200 });
        }
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}