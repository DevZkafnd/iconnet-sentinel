import { NextResponse } from "next/server";

export async function GET() {
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const vercelUrl = process.env.VERCEL_URL;
  const hasSecret = !!process.env.NEXTAUTH_SECRET;
  
  return NextResponse.json({
    status: "Diagnostic",
    env: {
      NEXTAUTH_URL: nextAuthUrl ? "Set" : "Missing",
      VERCEL_URL: vercelUrl ? "Set" : "Missing",
      NEXTAUTH_SECRET: hasSecret ? "Set (OK)" : "Missing (CRITICAL)",
      NODE_ENV: process.env.NODE_ENV,
    },
    message: "If NEXTAUTH_SECRET is Missing, Login will fail with 500 error."
  });
}
