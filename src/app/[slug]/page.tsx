
/* Author: Kat Bassett */
/* Individual post page: displays full post content */



import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60; // ISR every 60s revalidate

type WPPost = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  content: { rendered: string };
};

async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const res = await fetch(
    `https://ccnextdev.wpengine.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(
      slug
    )}&_embed=1`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as WPPost[];
  return data[0] ?? null;
}

// Optional: nicer page titles in the browser tab / previews
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const plainTitle = post?.title.rendered.replace(/<[^>]+>/g, "") ?? "Post";
  return { title: `${plainTitle} | Blog` };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  const formatted = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1
        className="text-3xl font-bold mb-2"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />
      <p className="text-gray-500 mb-6">{formatted}</p>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      <Link href="/" className="mt-8 inline-block text-blue-600 hover:underline">
        ← Back to Home
      </Link>
    </main>
  );
}


