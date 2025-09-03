"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import jwt from "jsonwebtoken";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      let { token } = await res.json();

      if (token?.startsWith("Bearer ")) {
        token = token.slice(7);
      }

      const decodedData = jwt.decode(token) as { role: string };

      if (decodedData?.role === "tocos") {

        console.log('/dashboard/client');
        router.push("/dashboard/client");
      } else if (decodedData?.role === "participant") {
        router.push("/dashboard/participant");
      } else {
        router.push("/auth/login"); 
      }

      if (!res.ok) throw new Error("Invalid credentials");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
              Register
            </Link>
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Label htmlFor="email" className="mb-2 text-base font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-base p-3"
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="password" className="mb-2 text-base font-medium">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-base p-3"
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button className="w-full py-3 text-base" onClick={() => handleLogin()} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
