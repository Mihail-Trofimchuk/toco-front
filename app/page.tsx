"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl bg-white text-black p-12">
        <CardHeader className="text-center space-y-6">
          <CardTitle className="text-4xl font-extrabold">
            Tocos - Carbon Reduction Platform
          </CardTitle>
          <p className="text-lg text-gray-700 max-w-xl mx-auto">
            Earn Toco tokens by participating in carbon reduction campaigns. Join campaigns, complete activities, and get rewarded with Toco tokens!
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-8 mt-8 text-center">
          <p className="text-gray-800 text-lg">
            Choose an option to get started:
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-6 mt-6 justify-center">
          <Link href="/auth/login" className="w-full sm:w-48">
            <Button className="w-full bg-black text-white hover:bg-gray-800 py-3 text-lg font-medium">
              Login
            </Button>
          </Link>
          <Link href="/auth/register" className="w-full sm:w-48">
            <Button className="w-full bg-black text-white hover:bg-gray-800 py-3 text-lg font-medium">
              Register
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
