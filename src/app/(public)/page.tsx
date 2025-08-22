import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Search } from "lucide-react";

type Post = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  likes: number;
  contentHTML:string;
  dislikes: number;
  likeCount:number;
  coverImageUrl: string;
  dislikeCount: string;
};

async function getPosts(query = ""): Promise<Post[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API}/posts?q=${query}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch posts");

  const data = await res.json();

  return data.posts.map((post: Post) => ({
    id: post._id,
    slug: post.slug,
    title: post.title,
    excerpt: post.contentHTML
      ? post.contentHTML.slice(0, 120) + "..."
      : "No excerpt available",
    likes: post.likeCount,
    dislikes: post.dislikeCount,
    coverImageUrl: post.coverImageUrl,
  }));
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { q = "" } = await searchParams;
  const posts = await getPosts(q as string);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Search Bar */}
      <div className="flex items-center justify-center">
        <form
          method="get"
          action="/"
          className="flex w-full max-w-2xl shadow-lg rounded-xl overflow-hidden"
        >
          <input
            type="text"
            name="q"
            placeholder="🔍 Search posts..."
            defaultValue={q}
            className="flex-1 px-4 py-3 text-gray-700 border-none focus:ring-0 outline-none"
          />
          <Button
            type="submit"
            className="rounded-none px-6 py-8 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Search
          </Button>
        </form>
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No posts found.
          </p>
        )}

        {posts.map((post) => (
          <Card
            key={post._id}
            className="rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 bg-white"
          >
            {post.coverImageUrl && (
              <div className="overflow-hidden rounded-t-2xl h-48">
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <CardHeader className="pt-5 px-5">
              <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 space-y-4">
              <p className="text-gray-600 text-sm line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex justify-between items-center pt-3 border-t">
                <a
                  href={`/posts/${post.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Read more →
                </a>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsDown className="w-4 h-4" /> {post.dislikes}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
