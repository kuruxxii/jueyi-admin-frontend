"use client";
import React, { useState, useEffect, useRef } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreateJournal,
  ModifyJournal,
  DeleteJournal,
} from "@/app/ui/journals/buttons";
import { format } from "date-fns";

type Journal = {
  title: string;
  description: string;
  vol: number;
  coverUrl: string;
  articles: string[];
  createdAt: string;
};

export default function Page() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // Add a ref to track if the component is mounted
  /* 
  In React Strict Mode, useEffect (along with several other lifecycle methods) 
  is intentionally invoked twice during development.
  */
  const isMounted = useRef(false);

  useEffect(() => {
    const fetchPaginatedJournals = async (page: number) => {
      try {
        const response = await fetch(
          `http://localhost:4000/admin/journals?page=${page}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );
        const data = await response.json();
        const { journals, totalPages } = data;
        setJournals((prevJournals) => [...prevJournals, ...journals]);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching journals:", error);
      }
    };
    if (isMounted.current) {
      fetchPaginatedJournals(page);
    } else {
      isMounted.current = true;
    }
  }, [page]);

  const loadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleDeleteJournal = (vol: number) => {
    setJournals((prevJournals) =>
      prevJournals.filter((journal) => journal.vol !== vol)
    );
  };
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">周刊</h1>
        <CreateJournal />
      </div>
      <div className="mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {journals.map((journal) => (
          <Card key={journal.vol} className="relative">
            <CardHeader>
              <CardTitle>{`Vol. ${journal.vol}`}</CardTitle>
              <CardDescription>{`${format(
                new Date(journal.createdAt),
                "yyyy-MM-dd"
              )}`}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{journal.title}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p>{`${journal.articles.length}篇文章`}</p>
              <div className="flex items-center justify-around space-x-4">
                <ModifyJournal vol={journal.vol} />
                <DeleteJournal
                  vol={journal.vol}
                  onDelete={handleDeleteJournal}
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      {page < totalPages && (
        <Button onClick={loadMore} className="block mt-4 mx-auto">
          加载更多
        </Button>
      )}
    </div>
  );
}
