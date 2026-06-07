"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session.user.id;
}

export async function saveNote(
  characterId: string,
  moveId: string | null,
  content: string,
  noteId?: string
) {
  const userId = await requireAuth();

  if (noteId) {
    await prisma.note.update({
      where: { id: noteId, userId },
      data: { content },
    });
  } else {
    await prisma.note.create({
      data: { content, userId, characterId, moveId: moveId ?? undefined },
    });
  }

  revalidatePath(`/characters/${characterId}`);
}

export async function deleteNote(noteId: string, characterId: string) {
  const userId = await requireAuth();
  await prisma.note.delete({ where: { id: noteId, userId } });
  revalidatePath(`/characters/${characterId}`);
}
