import { posts } from "@/lib/post";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/homepage/ArticleDetail";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = posts.find((p) => p.slug === slug);
    if (!post) notFound();
    return <ArticleDetail post={post} />;
}