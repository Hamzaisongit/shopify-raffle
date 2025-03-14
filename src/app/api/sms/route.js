import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json(); // Parse request body

        // Extract variables from request body
        const { mobileNumber, payload } = body;

        if (!mobileNumber || !payload) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Call sendSMS function
        const response = await sendSMS(mobileNumber, payload);

        return NextResponse.json({ success: true, response }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function sendSMS(mobileNumber, payload) {
    const API_URL = "https://control.msg91.com/api/v5/flow";
    const AUTH_KEY = "439652AUVFUKv5l6798a81eP1";  // Replace with actual auth key
    const TEMPLATE_ID = "67d1a389d6fc0503f362bf72"; // Replace with actual template ID
console.log(payload)
    const data = {
        template_id: TEMPLATE_ID,
        recipients: [
            {
                mobiles: `91${mobileNumber}`,
                part_name: payload.part_name,
                event_name: payload.event_title,
                part_id: payload.part_id
            }
        ]
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "authkey": AUTH_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("SMS Sent Successfully:", result);
        return result;
    } catch (error) {
        console.error("Error sending SMS:", error.message);
        throw new Error("Failed to send SMS");
    }
}
