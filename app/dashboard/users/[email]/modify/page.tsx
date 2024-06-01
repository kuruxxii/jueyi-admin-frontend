"use client";

import Breadcrumbs from "@/app/ui/Breadcrumbs";
import { ModificationForm } from "@/app/ui/users/ModificationForm";
import { useState, useEffect } from "react";

type User = {
  email: string;
  number: string;
  subscription: {
    startDate: Date;
    endDate: Date;
  };
};

export default function Page({ params }: { params: { email: string } }) {
  const { email } = params;
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getAUser = async () => {
      let url = `http://localhost:4000/admin/users/${email}`;
      const response = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      const user = await response.json();
      setUser(user);
    };
    getAUser();
  }, [email]);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "用户", href: "/dashboard/users" },
          {
            label: "修改用户信息",
            href: `/dashboard/users/${email}/modify`,
            active: true,
          },
        ]}
      />
      {user ? <ModificationForm user={user} /> : <></>}
    </main>
  );
}
