import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getTourDates, saveTourDates } from "@/lib/data";
import { TourDate } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, venue, city, ticketUrl, soldOut, notes } =
    (await req.json()) as Partial<TourDate>;

  if (!date || !venue || !city) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const tourDate = {
    id: uuidv4(),
    date,
    venue,
    city,
    ticketUrl: ticketUrl || "",
    soldOut: !!soldOut,
    notes: notes || "",
  };

  const dates = await getTourDates();
  await saveTourDates([...dates, tourDate]);

  return NextResponse.json({ tourDate });
}
