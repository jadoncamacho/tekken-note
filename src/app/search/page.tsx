import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const session = await auth();

  type Result = {
    id: string;
    command: string;
    hitLevel: string | null;
    damage: string | null;
    startup: string | null;
    block: string | null;
    hit: string | null;
    moveNotes: string | null;
    character: { id: string; name: string; slug: string };
    userNotes?: { id: string; content: string }[];
  };

  let results: Result[] = [];

  if (q && q.trim().length > 0) {
    const moves = await prisma.move.findMany({
      where: {
        OR: [
          { command: { contains: q } },
          { moveNotes: { contains: q } },
        ],
      },
      include: {
        character: true,
        userNotes: session?.user?.id
          ? { where: { userId: session.user.id } }
          : false,
      },
      take: 100,
      orderBy: [{ character: { name: "asc" } }, { command: "asc" }],
    });
    results = moves as Result[];
  }

  // Also search notes if logged in
  let noteResults: { id: string; content: string; move: { command: string } | null; character: { name: string; slug: string } }[] = [];
  if (q && session?.user?.id) {
    noteResults = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        content: { contains: q },
      },
      include: {
        move: { select: { command: true } },
        character: { select: { name: true, slug: true } },
      },
      take: 50,
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Search</h1>

      <form method="GET" className="mb-8">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search moves, commands, properties... (e.g. launcher, tornado, df+1)"
            autoFocus
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            className="flex-1 px-4 py-2 rounded text-sm outline-none focus:border-[var(--accent)] placeholder:text-[var(--text-muted)]"
          />
          <button
            type="submit"
            style={{ background: "var(--accent)", color: "#0f0f13" }}
            className="font-semibold px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </div>
      </form>

      {q && (
        <>
          {/* Move results */}
          {results.length > 0 && (
            <section className="mb-10">
              <h2
                style={{ color: "var(--text-muted)" }}
                className="text-xs uppercase tracking-wide mb-3"
              >
                Moves ({results.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {["Character", "Command", "Hit", "Dmg", "Startup", "Block", "On Hit", "Notes"].map((h) => (
                        <th
                          key={h}
                          style={{ color: "var(--text-muted)" }}
                          className="text-left px-3 py-2 text-xs uppercase tracking-wide font-medium"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((m) => (
                      <tr
                        key={m.id}
                        style={{ borderBottom: "1px solid var(--border)" }}
                        className="hover:bg-[var(--surface)] transition-colors"
                      >
                        <td className="px-3 py-2">
                          <Link
                            href={`/characters/${m.character.slug}`}
                            style={{ color: "var(--accent)" }}
                            className="hover:underline"
                          >
                            {m.character.name}
                          </Link>
                        </td>
                        <td className="px-3 py-2 font-mono font-semibold">
                          {m.command}
                        </td>
                        <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>
                          {m.hitLevel ?? "—"}
                        </td>
                        <td className="px-3 py-2">{m.damage ?? "—"}</td>
                        <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>
                          {m.startup ?? "—"}
                        </td>
                        <td className="px-3 py-2">{m.block ?? "—"}</td>
                        <td className="px-3 py-2">{m.hit ?? "—"}</td>
                        <td className="px-3 py-2 max-w-xs" style={{ color: "var(--text-muted)" }}>
                          {m.moveNotes ?? ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Note results */}
          {noteResults.length > 0 && (
            <section>
              <h2
                style={{ color: "var(--text-muted)" }}
                className="text-xs uppercase tracking-wide mb-3"
              >
                Your Notes ({noteResults.length})
              </h2>
              <div className="space-y-2">
                {noteResults.map((note) => (
                  <div
                    key={note.id}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                    className="rounded-lg px-4 py-3"
                  >
                    <div style={{ color: "var(--text-muted)" }} className="text-xs mb-1">
                      <Link
                        href={`/characters/${note.character.slug}`}
                        style={{ color: "var(--accent)" }}
                        className="hover:underline"
                      >
                        {note.character.name}
                      </Link>
                      {note.move && (
                        <span className="ml-2 font-mono">{note.move.command}</span>
                      )}
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.length === 0 && noteResults.length === 0 && (
            <p style={{ color: "var(--text-muted)" }} className="text-sm">
              No results for &ldquo;{q}&rdquo;
            </p>
          )}
        </>
      )}
    </div>
  );
}
