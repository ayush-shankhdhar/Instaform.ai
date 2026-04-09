import { NextResponse } from "next/server";
import user from '@/models/user';
import jsonwebtoken from "jsonwebtoken";
import connectToDB from "@/lib/db";

export const GET = async (req, { params }) => {
    await connectToDB();
    try {
        const { token } = await params;
        const AuthData = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        await user.findOneAndUpdate(
            { email: AuthData.email },
            {
                email: AuthData.email,
                name: AuthData.name,
                password: "oauth_user_no_password"
            },
            { new: true, upsert: true }
        );
        const unifiedToken = jsonwebtoken.sign(AuthData.email, process.env.JWT_SECRET);
        const redirectUrl = `${process.env.NEXTAUTH_URL}/google/${unifiedToken}`;
        return NextResponse.redirect(redirectUrl);
    } catch (error) {
        console.error("Callback error:", error);
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
    }
}