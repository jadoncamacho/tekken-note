import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import MoveTable from "@/components/MoveTable";

export async function generateStaticParams() {
  const characters = await prisma.character.findMany({ select: { slug: true } });
  return characters.map((c) => ({ slug: c.slug }));
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  const character = await prisma.character.findUnique({
    where: { slug },
    include: {
      moves: { orderBy: { command: "asc" } },
    },
  });

  if (!character) notFound();

  const userNotes = session?.user?.id
    ? await prisma.note.findMany({
        where: { characterId: character.id, userId: session.user.id },
      })
    : [];

  const notesByMove: Record<string, { id: string; content: string }[]> = {};
  for (const note of userNotes) {
    const key = note.moveId ?? "__character__";
    if (!notesByMove[key]) notesByMove[key] = [];
    notesByMove[key].push({ id: note.id, content: note.content });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{character.name}</h1>
      <p style={{ color: "var(--text-muted)" }} className="text-sm mb-8">
        {character.moves.length} moves
        {!session && (
          <span className="ml-2">
            —{" "}
            <a href="/login" style={{ color: "var(--accent)" }}>
              Log in
            </a>{" "}
            to save notes
          </span>
        )}
      </p>

      <MoveTable
        characterId={character.id}
        moves={character.moves}
        notesByMove={notesByMove}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
