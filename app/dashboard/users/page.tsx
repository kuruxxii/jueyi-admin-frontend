"use client";

import Pagination from "@/app/ui/Pagination";
import Search from "@/app/ui/Search";
import { useState, useEffect } from "react";
import { CreateUser } from "@/app/ui/users/buttons";
import UsersTable from "@/app/ui/users/UsersTable";
import { useSearchParams } from "next/navigation";
import { HOST } from "@/lib/url";

export default function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const currentPage = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState<number>(0);
  useEffect(() => {
    const getFilteredArticlesTotalPages = async () => {
      let url = `http://${HOST}/admin/users/pages`;
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
        <h1 className="text-2xl">用户</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="搜索用户..." />
        <CreateUser />
      </div>
      <UsersTable query={query} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
