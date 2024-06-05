"use client";

import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { HOST } from "@/lib/url";

export function CreateJournal() {
  return (
    <Link
      href="/dashboard/journals/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <span className="hidden md:block">创建周刊</span>
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ModifyJournal({ vol }: { vol: number }) {
  return (
    <Link
      href={`/dashboard/journals/${vol}/modify`}
      className="rounded-md border p-2 hover:bg-gray-100">
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteJournal({
  vol,
  onDelete,
}: {
  vol: number;
  onDelete: (vol: number) => void;
}) {
  const { toast } = useToast();
  async function handleDelete(vol: number): Promise<void> {
    try {
      const response = await fetch(`http://${HOST}/admin/journals/${vol}`, {
        credentials: "include",
        method: "DELETE",
      });
      const json = await response.json();
      if (!response.ok) {
        toast({
          variant: "destructive",
          description: `出错啦！错误信息：${json.error}`,
        });
      }
      if (response.ok) {
        toast({ description: "文章已删除" });
        onDelete(vol);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: `出错啦！错误信息：${error}`,
      });
    }
  }
  return (
    <div className="rounded-md border px-2 pt-2 pb-1 hover:bg-gray-100">
      <AlertDialog>
        <AlertDialogTrigger>
          <TrashIcon className="w-5" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>真的要删除这卷周刊吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤消。这将永久从我们的服务器中删除这卷周刊。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(vol)}>
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
