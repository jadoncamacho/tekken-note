import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function CharactersPage() {
  const characters = await prisma.character.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { moves: true } } },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Characters</h1>

      {characters.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          No characters found. Run{" "}
          <code className="text-xs bg-black/30 px-1 rounded">
            node scripts/scrape.mjs
          </code>{" "}
          to populate the database.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {characters.map((c) => (
            <Link
              key={c.id}
              href={`/characters/${c.slug}`}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
              className="rounded-lg p-4 hover:border-[var(--accent)] transition-colors group"
            >
              <div className="font-semibold group-hover:text-[var(--accent)] transition-colors">
                {c.name}
              </div>
              <div style={{ color: "var(--text-muted)" }} className="text-xs mt-1">
                {c._count.moves} moves
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
