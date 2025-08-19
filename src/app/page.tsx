/* Author: Kat Bassett */
/* Home page: lists posts with client-side search + category filter */

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
  const [catId, setCatId] = useState<number | "">("");
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesTitle = p.title.rendered.toLowerCase().includes(q);
      const matchesCat = catId === "" ? true : p.categories.includes(catId as number);
      return matchesTitle && matchesCat;
    });
  }, [posts, search, catId]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title…"
          className="flex-1 border rounded px-3 py-2"
          aria-label="Search posts by title"
        />
        <select
          value={catId === "" ? "" : String(catId)}
          onChange={(e) => setCatId(e.target.value ? Number(e.target.value) : "")}
          className="border rounded px-3 py-2"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
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
                <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline">
                  Read more →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
