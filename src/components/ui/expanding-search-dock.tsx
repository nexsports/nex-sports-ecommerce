"use client"
import { AnimatePresence, motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  /** width when expanded in px (default 320) */
  expandedWidth?: number
  /** start already expanded */
  defaultOpen?: boolean
  /** Notify parent so it can adjust its layout when the dock expands/collapses */
  onOpenChange?: (open: boolean) => void
}

export function ExpandingSearchDock({
  onSearch,
  placeholder = "Buscar produtos...",
  className,
  expandedWidth = 320,
  defaultOpen = false,
  onOpenChange,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultOpen)
  const [query, setQuery] = useState("")
  const router = useRouter()

  const setExpanded = (next: boolean) => {
    setIsExpanded(next)
    onOpenChange?.(next)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    if (onSearch) onSearch(q)
    else router.push(`/busca?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {!isExpanded ? (
          <motion.button
            key="icon"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setExpanded(true)}
            aria-label="Abrir busca"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </motion.button>
        ) : (
          <motion.form
            key="input"
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: expandedWidth, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <div className="flex items-center gap-2 overflow-hidden rounded-full border border-border bg-card/90 backdrop-blur-md">
              <div className="ml-4">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                autoFocus={!defaultOpen}
                className="h-10 flex-1 bg-transparent pr-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <motion.button
                type="button"
                onClick={() => {
                  setExpanded(defaultOpen ? true : false)
                  setQuery("")
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Fechar busca"
                className={cn(
                  "mr-1.5 flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted text-foreground/70",
                  defaultOpen && "hidden",
                )}
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
