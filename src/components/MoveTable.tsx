"use client";

import { useState, useTransition } from "react";
import { saveNote, deleteNote } from "@/app/actions/notes";

type Move = {
  id: string;
  command: string;
  hitLevel: string | null;
  damage: string | null;
  startup: string | null;
  block: string | null;
  hit: string | null;
  counterHit: string | null;
  moveNotes: string | null;
};

type NoteEntry = { id: string; content: string };

type Props = {
  characterId: string;
  moves: Move[];
  notesByMove: Record<string, NoteEntry[]>;
  isLoggedIn: boolean;
};

function FrameCell({ value }: { value: string | null }) {
  if (!value || value === "—" || value === "-") {
    return <span style={{ color: "var(--text-muted)" }}>—</span>;
  }
  const num = parseInt(value.replace(/[^-\d]/g, ""), 10);
  const color =
    isNaN(num) ? "inherit" : num >= 0 ? "var(--green)" : "var(--red)";
  return <span style={{ color }}>{value}</span>;
}

function NoteEditor({
  characterId,
  moveId,
  existingNotes,
}: {
  characterId: string;
  moveId: string;
  existingNotes: NoteEntry[];
}) {
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!text.trim()) return;
    startTransition(async () => {
      await saveNote(characterId, moveId, text.trim());
      setText("");
    });
  }

  function handleEdit(note: NoteEntry) {
    setEditingId(note.id);
    setEditText(note.content);
  }

  function handleSaveEdit() {
    if (!editText.trim() || !editingId) return;
    startTransition(async () => {
      await saveNote(characterId, moveId, editText.trim(), editingId);
      setEditingId(null);
    });
  }

  function handleDelete(noteId: string) {
    startTransition(async () => {
      await deleteNote(noteId, characterId);
    });
  }

  return (
    <div className="mt-2 space-y-2">
      {existingNotes.map((note) => (
        <div
          key={note.id}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
          className="rounded p-2 text-sm"
        >
          {editingId === note.id ? (
            <div className="flex gap-2">
              <input
                className="flex-1 bg-transparent outline-none"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                style={{ color: "var(--accent)" }}
                className="text-xs"
              >
                Save
              </button>
              <button
                onClick={() => setEditingId(null)}
                style={{ color: "var(--text-muted)" }}
                className="text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-start gap-2">
              <span style={{ color: "var(--text-primary)" }}>{note.content}</span>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(note)}
                  style={{ color: "var(--text-muted)" }}
                  className="text-xs hover:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  style={{ color: "var(--red)" }}
                  className="text-xs hover:opacity-80"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a note..."
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          className="flex-1 text-xs px-2 py-1 rounded outline-none focus:border-[var(--accent)] placeholder:text-[var(--text-muted)]"
          disabled={isPending}
        />
        <button
          onClick={handleAdd}
          disabled={isPending || !text.trim()}
          style={{ background: "var(--accent)", color: "#0f0f13" }}
          className="text-xs font-semibold px-2 py-1 rounded disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function MoveTable({
  characterId,
  moves,
  notesByMove,
  isLoggedIn,
}: Props) {
  const [filter, setFilter] = useState("");
  const [expandedMove, setExpandedMove] = useState<string | null>(null);

  const filtered = filter
    ? moves.filter(
        (m) =>
          m.command.toLowerCase().includes(filter.toLowerCase()) ||
          (m.moveNotes ?? "").toLowerCase().includes(filter.toLowerCase())
      )
    : moves;

  const headers = ["Command", "Hit", "Dmg", "Startup", "Block", "On Hit", "CH", "Notes"];

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter moves... (e.g. df+1, launcher)"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
        className="w-full max-w-sm mb-4 px-3 py-2 rounded text-sm outline-none focus:border-[var(--accent)] placeholder:text-[var(--text-muted)]"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{ color: "var(--text-muted)" }}
                  className="text-left px-3 py-2 font-medium text-xs uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
              {isLoggedIn && (
                <th
                  style={{ color: "var(--text-muted)" }}
                  className="text-left px-3 py-2 font-medium text-xs uppercase tracking-wide"
                >
                  My Notes
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((move) => {
              const myNotes = notesByMove[move.id] ?? [];
              const hasNotes = myNotes.length > 0;
              const isExpanded = expandedMove === move.id;

              return (
                <>
                  <tr
                    key={move.id}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background: isExpanded ? "var(--surface)" : undefined,
                    }}
                    className="hover:bg-[var(--surface)] transition-colors"
                  >
                    <td className="px-3 py-2 font-mono font-semibold">
                      {move.command}
                    </td>
                    <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>
                      {move.hitLevel ?? "—"}
                    </td>
                    <td className="px-3 py-2">{move.damage ?? "—"}</td>
                    <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>
                      {move.startup ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      <FrameCell value={move.block} />
                    </td>
                    <td className="px-3 py-2">
                      <FrameCell value={move.hit} />
                    </td>
                    <td className="px-3 py-2">
                      <FrameCell value={move.counterHit} />
                    </td>
                    <td
                      className="px-3 py-2 max-w-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {move.moveNotes ?? ""}
                    </td>
                    {isLoggedIn && (
                      <td className="px-3 py-2">
                        <button
                          onClick={() =>
                            setExpandedMove(isExpanded ? null : move.id)
                          }
                          style={{
                            color: hasNotes ? "var(--accent)" : "var(--text-muted)",
                          }}
                          className="text-xs hover:text-white transition-colors"
                        >
                          {hasNotes
                            ? `${myNotes.length} note${myNotes.length > 1 ? "s" : ""}`
                            : "+ Note"}
                        </button>
                      </td>
                    )}
                  </tr>
                  {isLoggedIn && isExpanded && (
                    <tr
                      key={`${move.id}-notes`}
                      style={{ background: "var(--surface-2)" }}
                    >
                      <td colSpan={9} className="px-4 pb-4 pt-2">
                        <NoteEditor
                          characterId={characterId}
                          moveId={move.id}
                          existingNotes={myNotes}
                        />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ color: "var(--text-muted)" }} className="text-sm py-8 text-center">
            No moves match &ldquo;{filter}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
