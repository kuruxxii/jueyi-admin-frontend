"use client";

import Breadcrumbs from "@/app/ui/Breadcrumbs";
import { ModificationForm } from "@/app/ui/journals/ModificationForm";
import { useState, useEffect } from "react";
import { HOST } from "@/lib/url";

type Journal = {
  title: string;
  description: string;
  vol: number;
  coverUrl: string;
  articles: string[];
};

export default function Page({ params }: { params: { vol: number } }) {
  const { vol } = params;
  const [journal, setJournal] = useState<Journal | null>(null);
  useEffect(() => {
    const getAJournal = async () => {
      let url = `http://${HOST}/admin/journals/${vol}`;
      const response = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      const journal = await response.json();
      setJournal(journal);
    };
    getAJournal();
  }, [vol]);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "周刊", href: "/dashboard/journals" },
          {
            label: "修改周刊",
            href: `/dashboard/journals/${vol}/modify`,
            active: true,
          },
        ]}
      />
      {journal ? <ModificationForm journal={journal} /> : <></>}
    </main>
  );
}
