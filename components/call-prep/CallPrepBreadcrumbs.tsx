"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CallPrepBreadcrumbItem = { label: string; href?: string };

export function CallPrepBreadcrumbs({ items }: { items: CallPrepBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-2">
      <ol className="flex flex-wrap items-center gap-1.5 text-[12px] text-[rgba(0,0,0,0.45)]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-[rgba(0,0,0,0.35)]"
                  aria-hidden
                />
              )}
              {last || !item.href ? (
                <span
                  className={cn(last && "font-medium text-[rgba(0,0,0,0.72)]")}
                  {...(last ? { "aria-current": "page" as const } : {})}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-[rgba(0,0,0,0.65)]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
