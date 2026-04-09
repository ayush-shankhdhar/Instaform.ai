import connectToDB from '@/lib/db';
import { NextResponse } from 'next/server';
const jwt = require('jsonwebtoken');
const User = require('@/models/user');

export const POST = async (req) => {
    await connectToDB();
    try {
        const { token } = await req.json();
        if (!token) {
            return NextResponse.json(
                { error: "Un-Authorized Access" },
                { status: 401 }
            );
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 401 }
            );
        }
        const userResponse = await User.findOne(
            { email: decoded },
            { password: 0 }
        );
        if (!userResponse) {
            return NextResponse.json(
                { error: "Un-Authorized Access" },
                { status: 401 }
            );
        }
        return NextResponse.json(userResponse, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
};