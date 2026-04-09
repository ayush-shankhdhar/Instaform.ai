import connectToDB from '@/lib/db';
import { NextResponse } from 'next/server';
const user = require('@/models/user');
const form = require('@/models/Form');
const jwt = require('jsonwebtoken');

export const POST = async (req) => {
    await connectToDB();
    try {
        const { token } = await req.json();
        if (!token) {
            return NextResponse.json({ error: "Un-Authorised Access" }, { status: 200 });
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
        const owner = userResponse._id;
        const Forms = await form.find({ owner });
        return NextResponse.json(Forms, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}