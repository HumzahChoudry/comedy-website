import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getTourDates, saveTourDates } from "@/lib/data";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const dates = getTourDates();
  saveTourDates(dates.filter((d) => d.id !== id));

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const dates = getTourDates();
  saveTourDates(dates.map((d) => (d.id === id ? { ...d, ...body } : d)));

  return NextResponse.json({ success: true });
}
