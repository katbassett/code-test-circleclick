/** 
 * Author: Kat Bassett
 * WordPress Integration from the WP REST API
 * -Uses '_embed' to include images and categories
 * -Configures with ISR (revalidate 60s).
 * @returns A list of posts in JSON format.
 * @throws {Error} If the fetch fails.
 */

export async function getPosts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?_embed`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}


