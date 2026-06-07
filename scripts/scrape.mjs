/**
 * Scrapes character frame data from tekkendocs.com and seeds the database.
 * Run: node scripts/scrape.mjs
 */
import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const BASE = "https://tekkendocs.com";

const CHARACTERS = [
  { id: "alisa", name: "Alisa" },
  { id: "anna", name: "Anna" },
  { id: "armor-king", name: "Armor King" },
  { id: "asuka", name: "Asuka" },
  { id: "azucena", name: "Azucena" },
  { id: "bryan", name: "Bryan" },
  { id: "claudio", name: "Claudio" },
  { id: "clive", name: "Clive" },
  { id: "devil-jin", name: "Devil Jin" },
  { id: "dragunov", name: "Dragunov" },
  { id: "eddy", name: "Eddy" },
  { id: "feng", name: "Feng" },
  { id: "heihachi", name: "Heihachi" },
  { id: "hwoarang", name: "Hwoarang" },
  { id: "jack-8", name: "Jack-8" },
  { id: "jin", name: "Jin" },
  { id: "jun", name: "Jun" },
  { id: "kazuya", name: "Kazuya" },
  { id: "king", name: "King" },
  { id: "kuma", name: "Kuma" },
  { id: "lars", name: "Lars" },
  { id: "law", name: "Law" },
  { id: "lee", name: "Lee" },
  { id: "leo", name: "Leo" },
  { id: "leroy", name: "Leroy" },
  { id: "lidia", name: "Lidia" },
  { id: "lili", name: "Lili" },
  { id: "nina", name: "Nina" },
  { id: "panda", name: "Panda" },
  { id: "paul", name: "Paul" },
  { id: "raven", name: "Raven" },
  { id: "reina", name: "Reina" },
  { id: "shaheen", name: "Shaheen" },
  { id: "steve", name: "Steve" },
  { id: "victor", name: "Victor" },
  { id: "xiaoyu", name: "Xiaoyu" },
  { id: "yoshimitsu", name: "Yoshimitsu" },
  { id: "zafina", name: "Zafina" },
];

async function fetchMoves(slug) {
  const url = `${BASE}/t8/${slug}`;
  console.log(`  Fetching ${url}`);
  const res = await fetch(url, {
    headers: { "User-Agent": "TekkenNoteProject/1.0 (portfolio project)" },
  });
  if (!res.ok) {
    console.warn(`  HTTP ${res.status} for ${slug}`);
    return [];
  }
  const html = await res.text();
  const $ = cheerio.load(html);

  const moves = [];
  // tekkendocs renders a table with these headers
  $("table tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 2) return;
    const command = $(cells[0]).text().trim();
    if (!command) return;
    moves.push({
      command,
      hitLevel: $(cells[1]).text().trim() || null,
      damage: $(cells[2]).text().trim() || null,
      startup: $(cells[3]).text().trim() || null,
      block: $(cells[4]).text().trim() || null,
      hit: $(cells[5]).text().trim() || null,
      counterHit: $(cells[6]).text().trim() || null,
      moveNotes: $(cells[7]).text().trim() || null,
    });
  });
  return moves;
}

async function main() {
  console.log("Starting scrape...\n");
  for (const char of CHARACTERS) {
    console.log(`[${char.name}]`);
    await prisma.character.upsert({
      where: { id: char.id },
      create: { id: char.id, name: char.name, slug: char.id },
      update: { name: char.name },
    });

    const moves = await fetchMoves(char.id);
    console.log(`  ${moves.length} moves found`);

    for (const move of moves) {
      await prisma.move.upsert({
        where: { characterId_command: { characterId: char.id, command: move.command } },
        create: { ...move, characterId: char.id },
        update: move,
      });
    }

    // Be polite to the server
    await new Promise((r) => setTimeout(r, 800));
  }
  console.log("\nDone!");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
