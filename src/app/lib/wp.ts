/** 
 * Author: Kat Bassett
 */

//get posts from WordPress
export async function getPosts() {
  const res = await fetch(
    "https://ccnextdev.wpengine.com/wp-json/wp/v2/posts?_embed",
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  return res.json();
}

// fetch categories
export async function getCategories() {
  const res = await fetch(
    "https://ccnextdev.wpengine.com/wp-json/wp/v2/categories?_embed",
  );
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

