"use client";

import {
  ArrowTrendingUpIcon,
  DocumentDuplicateIcon,
  NewspaperIcon,
  UserGroupIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "数据", href: "/dashboard", icon: ArrowTrendingUpIcon },
  { name: "用户", href: "/dashboard/users", icon: UserGroupIcon },
  { name: "通知", href: "/dashboard/news", icon: ChatBubbleLeftEllipsisIcon },
  {
    name: "文章",
    href: "/dashboard/articles",
    icon: DocumentDuplicateIcon,
  },
  { name: "周刊", href: "/dashboard/journals", icon: NewspaperIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              }
            )}>
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
