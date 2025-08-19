/* Author: Kat Bassett */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getPosts, getCategories } from "./lib/wp";

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  categories: number[];
  _embedded?: { ["wp:featuredmedia"]?: Array<{ source_url?: string }> };
};

type WPCategory = { id: number; name: string };

export default function Home() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [search, setSearch] = useState("");
  const [catIds, setCatIds] = useState<number[]>([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [p, c] = await Promise.all([getPosts(), getCategories()]);
      setPosts(p);
      setCategories(c);
      setLoading(false);
    })();
  }, []);

  //multi-category filter logic
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesTitle = p.title.rendered.toLowerCase().includes(q);
      const matchesCats =
        catIds.length === 0 || p.categories.some((id) => catIds.includes(id));
      return matchesTitle && matchesCats;
    });
  }, [posts, search, catIds]);

  function onCatsChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const ids = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
    setCatIds(ids);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title…"
          className="flex-1 border rounded px-3 py-2"
          aria-label="Search posts by title"
        />

        <div className="flex items-start gap-2">
          <select
            multiple
            value={catIds.map(String)}
            onChange={onCatsChange}
            className="border rounded px-3 py-2 min-w-[220px]"
            aria-label="Filter by categories (hold Cmd/Ctrl to select multiple)"
            size={Math.min(8, Math.max(4, categories.length))} // show a few rows
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setCatIds([])}
            className="border rounded px-3 py-2"
            aria-label="Clear category selection"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <div className="py-8 text-sm text-gray-500">Loading…</div>}

      {/* Results */}
      <div className="grid gap-6">
        {!loading && filtered.length === 0 && (
          <p className="text-sm text-gray-500">No posts match your filters.</p>
        )}

        {filtered.map((post) => {
          const date = new Date(post.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });
          const img =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ??
            "https://via.placeholder.com/1200x400?text=No+image";

          return (
            <article key={post.id} className="rounded border overflow-hidden">
              <img src={img} alt={post.title.rendered} className="w-full h-56 object-cover" />
              <div className="p-4 bg-white">
                <h2
                  className="text-xl font-semibold mb-1"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <p className="text-gray-500 text-sm mb-3">{date}</p>
                <Link href={`/${post.slug}`}>Read more →</Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
