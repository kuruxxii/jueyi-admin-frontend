"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ModifyArticle, DeleteArticle } from "./buttons";

type Article = {
  slug: string;
  title: string;
  topic: string;
  author: string;
  createdAt: string;
};

export default function ArticlesTable({
  query,
  currentPage,
}: {
  query: string | null;
  currentPage: number;
}) {
  const [articles, setArticles] = useState<Article[]>([]);
  useEffect(() => {
    const getFilteredArticles = async () => {
      let url = `http://localhost:4000/admin/articles?page=${currentPage}`;
      if (query) {
        url += `&query=${query}`;
      }
      const response = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      const articles = await response.json();
      setArticles(articles);
    };
    getFilteredArticles();
  }, [currentPage, query]);
  const handleDeleteArticle = (slug: string) => {
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.slug !== slug)
    );
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>slug</TableHead>
          <TableHead>标题</TableHead>
          <TableHead>话题分类</TableHead>
          <TableHead>作者</TableHead>
          <TableHead>创建时间</TableHead>
          <TableHead className="w-44">操作</TableHead>
        </TableRow>
      </TableHeader>
      {articles ? (
        <TableBody>
          {articles.map((article) => (
            <TableRow key={article.slug}>
              <TableCell className="max-w-12 truncate">
                {article.slug}
              </TableCell>
              <TableCell className="max-w-16 truncate">
                {article.title}
              </TableCell>
              <TableCell className="w-36">{article.topic}</TableCell>
              <TableCell className="max-w-4 truncate">
                {article.author}
              </TableCell>
              <TableCell className="w-36">
                {format(new Date(article.createdAt), "yyyy-MM-dd")}
              </TableCell>
              <TableCell className="flex justify-left space-x-4">
                <ModifyArticle slug={article.slug} />
                <DeleteArticle
                  slug={article.slug}
                  onDelete={handleDeleteArticle}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <></>
      )}
    </Table>
  );
}
