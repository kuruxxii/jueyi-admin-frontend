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
import { format } from "date-fns";
import { ModifyUser, DeleteUser } from "./buttons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

type User = {
  email: string;
  number: string;
  subscription: {
    startDate: Date;
    endDate: Date;
  };
};

export default function UsersTable({
  query,
  currentPage,
}: {
  query: string | null;
  currentPage: number;
}) {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const getFilteredUsers = async () => {
      let url = `http://localhost:4000/admin/users?page=${currentPage}`;
      if (query) {
        url += `&query=${query}`;
      }
      const response = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });
      const users = await response.json();
      setUsers(users);
    };
    getFilteredUsers();
  }, [currentPage, query]);
  const handleDeleteUser = (email: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>手机号</TableHead>
          <TableHead>订阅开始时间</TableHead>
          <TableHead>订阅到期时间</TableHead>
          <TableHead className="w-44">操作</TableHead>
        </TableRow>
      </TableHeader>
      {users ? (
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.email}>
              <TableCell className="max-w-12 truncate">
                <div className="flex items-center gap-2">
                  <button>
                    <CopyToClipboard text={user.email}>
                      <DocumentDuplicateIcon className="w-5 text-slate-400 hover:text-slate-600 active:text-slate-950" />
                    </CopyToClipboard>
                  </button>
                  {user.email}
                </div>
              </TableCell>
              <TableCell className="max-w-16">{user.number}</TableCell>
              <TableCell className="w-36">
                {format(new Date(user.subscription.startDate), "yyyy-MM-dd")}
              </TableCell>
              <TableCell className="w-36">
                {format(new Date(user.subscription.endDate), "yyyy-MM-dd")}
              </TableCell>
              <TableCell className="flex justify-left space-x-4">
                <ModifyUser email={user.email} />
                <DeleteUser email={user.email} onDelete={handleDeleteUser} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <></>
      )}
    </Table>
  );
}
