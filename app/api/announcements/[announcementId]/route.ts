import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { announcementSchema } from "@/lib/validators";

export async function PUT(
  req: Request,
  { params }: { params: { announcementId: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = announcementSchema.parse(json);

    const announcement = await db.announcement.update({
      where: { id: params.announcementId },
      data: body,
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("[ANNOUNCEMENT_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { announcementId: string } }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.announcement.delete({
      where: { id: params.announcementId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ANNOUNCEMENT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
