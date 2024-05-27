"use client";

import Breadcrumbs from "@/app/ui/Breadcrumbs";
import { CreationForm } from "@/app/ui/journals/CreationForm";

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "周刊", href: "/dashboard/journals" },
          {
            label: "创建周刊",
            href: "/dashboard/journals/create",
            active: true,
          },
        ]}
      />
      <CreationForm />
    </main>
  );
}
