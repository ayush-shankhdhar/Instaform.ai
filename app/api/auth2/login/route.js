import connectToDB from '@/lib/db';
import { NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
const user = require('@/models/user');
const bcrypt = require('bcryptjs');

export const POST = async (req) => {
    await connectToDB();
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 200 });
        }
        const response = await user.findOne({ email });
        if (!response) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 200 });
        }
        const isMatch = await bcrypt.compare(password, response.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 200 });
        }
        const token = jwt.sign(email, process.env.JWT_SECRET);
        return NextResponse.json({ msg: "Success", token }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}