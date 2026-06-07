import Link from "next/link";
import { auth } from "@/lib/auth";
import { logout } from "@/app/actions/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
      className="px-6 py-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-6">
        <Link
          href="/"
          style={{ color: "var(--accent)" }}
          className="font-bold text-lg tracking-wide"
        >
          TekkenNote
        </Link>
        <Link
          href="/characters"
          style={{ color: "var(--text-muted)" }}
          className="text-sm hover:text-white transition-colors"
        >
          Characters
        </Link>
        <Link
          href="/search"
          style={{ color: "var(--text-muted)" }}
          className="text-sm hover:text-white transition-colors"
        >
          Search
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {session?.user ? (
          <>
            <span style={{ color: "var(--text-muted)" }} className="text-sm">
              {session.user.name ?? session.user.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
                className="text-sm border rounded px-3 py-1 hover:text-white transition-colors"
              >
                Log out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/login"
              style={{ color: "var(--text-muted)" }}
              className="text-sm hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              style={{
                background: "var(--accent)",
                color: "#0f0f13",
              }}
              className="text-sm font-semibold rounded px-3 py-1 hover:opacity-90 transition-opacity"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
