"use client";

import Breadcrumbs from "@/app/ui/Breadcrumbs";
import { CreationForm } from "@/app/ui/articles/CreationForm";

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Articles", href: "/dashboard/articles" },
          {
            label: "Create Article",
            href: "/dashboard/articles/create",
            active: true,
          },
        ]}
      />
      <CreationForm />
    </main>
  );
}
