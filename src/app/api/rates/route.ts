import { RatesResult } from "@/app/types/rates";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const result = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATES_API_KEY}/latest/USD`,
    {
      next: { revalidate: 60 * 60 * 4 },
    }
  );
  const data: RatesResult = await result.json();

  return NextResponse.json(data, { status: 200 });
}
