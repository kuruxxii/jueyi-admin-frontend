"use client";

import Breadcrumbs from "@/app/ui/Breadcrumbs";
import { CreationForm } from "@/app/ui/articles/CreationForm";

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "文章", href: "/dashboard/articles" },
          {
            label: "创建文章",
            href: "/dashboard/articles/create",
            active: true,
          },
        ]}
      />
      <CreationForm />
    </main>
  );
}
