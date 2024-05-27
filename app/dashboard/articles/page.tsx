"use client";

import Pagination from "@/app/ui/Pagination";
import Search from "@/app/ui/Search";
import { useState, useEffect } from "react";
import { CreateArticle } from "@/app/ui/articles/buttons";
import ArticlesTable from "@/app/ui/articles/ArticlesTable";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const currentPage = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState<number>(0);
  useEffect(() => {
    const getFilteredArticlesTotalPages = async () => {
      let url = `http://localhost:4000/admin/articles/pages`;
      if (query) {
        url += `?query=${query}`;
      }
      const response = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      const json = await response.json();
      setTotalPages(json.totalPages);
    };
    getFilteredArticlesTotalPages();
  }, [query]);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">文章</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="搜索文章..." />
        <CreateArticle />
      </div>
      <ArticlesTable query={query} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
