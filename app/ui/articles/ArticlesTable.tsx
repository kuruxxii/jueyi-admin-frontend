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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>slug</TableHead>
          <TableHead>标题</TableHead>
          <TableHead>话题分类</TableHead>
          <TableHead>作者</TableHead>
          <TableHead>创建时间</TableHead>
        </TableRow>
      </TableHeader>
      {articles?.map((article) => {
        return (
          <TableBody key={article.slug}>
            <TableRow>
              <TableCell className="font-medium">{article.slug}</TableCell>
              <TableCell>{article.title}</TableCell>
              <TableCell>{article.topic}</TableCell>
              <TableCell>{article.author}</TableCell>
              <TableCell>{article.createdAt}</TableCell>
            </TableRow>
          </TableBody>
        );
      })}
    </Table>
  );
}
