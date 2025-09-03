import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Unauthorized" }, { status: res.status });
    }

    const response = NextResponse.json(data, { status: 200 });
    response.cookies.set("token", data.token, { httpOnly: true, path: "/" });
    return response;
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
