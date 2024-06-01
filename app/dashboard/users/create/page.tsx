"use client";

import Breadcrumbs from "@/app/ui/Breadcrumbs";
import { CreationForm } from "@/app/ui/users/CreationForm";

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "用户", href: "/dashboard/users" },
          {
            label: "添加用户",
            href: "/dashboard/users/create",
            active: true,
          },
        ]}
      />
      <CreationForm />
    </main>
  );
}
