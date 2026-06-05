"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground", className)}>
      <Link href="/" className="hover:text-foreground transition-colors">
        Início
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        const isFirst = i === 0
        // On mobile, hide intermediate items (keep first + last)
        if (!isFirst && !isLast && items.length > 2) {
          if (i === 1) {
            return (
              <span key={i} className="hidden sm:flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-muted-foreground">…</span>
              </span>
            )
          }
          return (
            <span key={i} className="hidden sm:flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </span>
          )
        }
        return (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5" />
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
