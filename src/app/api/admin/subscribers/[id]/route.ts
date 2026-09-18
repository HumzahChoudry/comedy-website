import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteEmailSignup } from "@/lib/data";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await deleteEmailSignup(id);

  return NextResponse.json({ success: true });
}
