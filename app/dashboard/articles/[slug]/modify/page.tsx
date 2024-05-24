"use client";

import Breadcrumbs from "@/app/ui/Breadcrumbs";
import { ModificationForm } from "@/app/ui/articles/ModificationForm";
import { useState, useEffect } from "react";

type Topic =
  | "个人成长"
  | "商业财经"
  | "科技前沿"
  | "人文社科"
  | "职场专题"
  | "校园学习专题";

type Article = {
  slug: string;
  title: string;
  coverUrl: string;
  introduction: string;
  author: string;
  read: number;
  topic: Topic;
  origin: string;
  content: string;
};

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [article, setArticles] = useState<Article | null>(null);
  useEffect(() => {
    const getAnArticle = async () => {
      let url = `http://localhost:4000/admin/articles/${slug}`;
      const response = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      const article = await response.json();
      setArticles(article);
    };
    getAnArticle();
  }, [slug]);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Articles", href: "/dashboard/articles" },
          {
            label: "Modify Article",
            href: `/dashboard/articles/${slug}/modify`,
            active: true,
          },
        ]}
      />
      {article ? <ModificationForm article={article} /> : <></>}
    </main>
  );
}
