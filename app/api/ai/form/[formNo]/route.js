import connectToDB from '@/lib/db';
import Form from '@/models/Form';
import { NextResponse } from 'next/server';

export const GET = async (req, { params }) => {
    await connectToDB();
    try {
        const { formNo } = await params;
        if (!formNo) {
            return NextResponse.json({ error: "No FormNumber received" }, { status: 200 });
        }
        const response = await Form.findOne({ formNo });
        if (!response) {
            return NextResponse.json({ error: "Invalid Form Number" }, { status: 200 });
        }
        return new NextResponse(response.body, {
            status: 200,
            headers: { "Content-Type": "text/html" },
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
