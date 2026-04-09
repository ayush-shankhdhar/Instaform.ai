import connectToDB from '@/lib/db';
import { NextResponse } from 'next/server';
const form = require('@/models/Form');
const user = require('@/models/user');
const jwt = require('jsonwebtoken');

export const POST = async (req, { params }) => {
    await connectToDB();
    try {
        const { formNo } = await params;
        const { token, body } = await req.json();
        if (!token) {
            return NextResponse.json({ error: "Un-Authorised Access" }, { status: 200 });
        }
        if (!body) {
            return NextResponse.json({ error: "No form body provided" }, { status: 200 });
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
        const formResponse = await form.findOne({ formNo });
        if (!formResponse) {
            return NextResponse.json({ error: "Form not found" }, { status: 200 });
        }
        if (!formResponse.owner.equals(userResponse._id)) {
            return NextResponse.json({ error: "Un-Authorised to edit this form" }, { status: 200 });
        }
        await form.findOneAndUpdate({ formNo }, { body });
        return NextResponse.json({ msg: "Form updated successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
