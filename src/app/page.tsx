import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const characterCount = await prisma.character.count();
  const moveCount = await prisma.move.count();

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <h1
        style={{ color: "var(--accent)" }}
        className="text-5xl font-bold mb-4 tracking-tight"
      >
        TekkenNote
      </h1>
      <p style={{ color: "var(--text-muted)" }} className="text-xl mb-12">
        Tekken 8 frame data with your personal move notes.
      </p>

      <div className="flex gap-4 justify-center mb-16">
        <Link
          href="/characters"
          style={{ background: "var(--accent)", color: "#0f0f13" }}
          className="font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Browse Characters
        </Link>
        <Link
          href="/search"
          style={{
            background: "var(--surface-2)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
          className="font-semibold px-6 py-3 rounded-lg hover:opacity-80 transition-opacity"
        >
          Search Moves
        </Link>
      </div>

      {characterCount > 0 ? (
        <div className="flex gap-8 justify-center">
          <div style={{ color: "var(--text-muted)" }} className="text-sm">
            <span
              style={{ color: "var(--accent)" }}
              className="block text-3xl font-bold"
            >
              {characterCount}
            </span>
            characters
          </div>
          <div style={{ color: "var(--text-muted)" }} className="text-sm">
            <span
              style={{ color: "var(--accent)" }}
              className="block text-3xl font-bold"
            >
              {moveCount.toLocaleString()}
            </span>
            moves indexed
          </div>
        </div>
      ) : (
        <p style={{ color: "var(--text-muted)" }} className="text-sm">
          No frame data yet.{" "}
          <code className="text-xs bg-black/30 px-2 py-0.5 rounded">
            node scripts/scrape.mjs
          </code>{" "}
          to seed the database.
        </p>
      )}
    </div>
  );
}
