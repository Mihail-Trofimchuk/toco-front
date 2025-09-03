import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL; 

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Token does not exist" }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/api/auth/logout`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      return NextResponse.json({ error: data.message || "Logout failed" }, { status: res.status });
    }

    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    response.cookies.set("token", "", { path: "/", httpOnly: true, maxAge: 0 });

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Server error", err }, { status: 500 });
  }
}
