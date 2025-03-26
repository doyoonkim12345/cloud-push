import { NextResponse } from "next/server";

export async function GET(request, params) {
  console.log(params);
  return NextResponse.json(
    { error: "No asset name provided." },
    { status: 400 }
  );
}
