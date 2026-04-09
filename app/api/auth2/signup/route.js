import connectToDB from '@/lib/db';
import { NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
const user = require('@/models/user');
const bcrypt = require('bcryptjs');

export const POST = async (req) => {
    await connectToDB();
    try {
        const { name, email, password } = await req.json();
        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 200 });
        }
        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 200 });
        }
        const userexist = await user.findOne({ email });
        if (userexist) {
            return NextResponse.json({ error: "Email already exists" }, { status: 200 });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await user.create({ name, email, password: hashedPassword });
        const token = jwt.sign(email, process.env.JWT_SECRET);
        return NextResponse.json({ msg: "Signup Successful", token }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}