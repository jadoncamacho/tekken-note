import Link from "next/link";
import { register } from "@/app/actions/auth";

export default function RegisterPage() {
  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold mb-8 text-center">Create account</h1>

      <form action={register} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            style={{ color: "var(--text-muted)" }}
            className="block text-sm mb-1"
          >
            Name (optional)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            className="w-full px-3 py-2 rounded text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            style={{ color: "var(--text-muted)" }}
            className="block text-sm mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            className="w-full px-3 py-2 rounded text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            style={{ color: "var(--text-muted)" }}
            className="block text-sm mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            className="w-full px-3 py-2 rounded text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>
        <button
          type="submit"
          style={{ background: "var(--accent)", color: "#0f0f13" }}
          className="w-full font-semibold py-2 rounded hover:opacity-90 transition-opacity"
        >
          Create account
        </button>
      </form>

      <p
        style={{ color: "var(--text-muted)" }}
        className="text-sm text-center mt-6"
      >
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--accent)" }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
