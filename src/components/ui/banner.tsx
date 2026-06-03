"use client"
import { type HTMLAttributes, useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

type BannerVariant = "rainbow" | "normal"

export function Banner({
  id,
  xColor,
  variant = "normal",
  changeLayout = true,
  height = "3rem",
  rainbowColors = [
    "rgba(59, 130, 246, 0.6)",
    "rgba(34, 211, 238, 0.7)",
    "rgba(59, 130, 246, 0.6)",
    "rgba(34, 211, 238, 0.7)",
  ],
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  height?: string
  xColor?: string
  variant?: BannerVariant
  rainbowColors?: string[]
  changeLayout?: boolean
}) {
  const [open, setOpen] = useState(true)
  const globalKey = id ? `nd-banner-${id}` : null

  useEffect(() => {
    if (globalKey) setOpen(localStorage.getItem(globalKey) !== "true")
  }, [globalKey])

  if (!open) return null

  return (
    <div
      id={id}
      {...props}
      className={cn(
        "relative z-30 flex flex-row items-center justify-center px-4 text-center text-sm font-semibold tracking-wide overflow-hidden",
        variant === "normal" && "bg-secondary text-secondary-foreground",
        variant === "rainbow" && "bg-background text-foreground",
        !open && "hidden",
        props.className,
      )}
      style={{ height }}
    >
      {changeLayout && open ? (
        <style>
          {globalKey
            ? `:root:not(.${globalKey}) { --fd-banner-height: ${height}; }`
            : `:root { --fd-banner-height: ${height}; }`}
        </style>
      ) : null}
      {globalKey ? <style>{`.${globalKey} #${id} { display: none; }`}</style> : null}
      {globalKey ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `if (localStorage.getItem('${globalKey}') === 'true') document.documentElement.classList.add('${globalKey}');`,
          }}
        />
      ) : null}

      {variant === "rainbow" ? <Flow colors={rainbowColors} /> : null}
      {props.children}
      {id ? (
        <button
          type="button"
          aria-label="Fechar banner"
          onClick={() => {
            setOpen(false)
            if (globalKey) {
              localStorage.setItem(globalKey, "true")
              window.dispatchEvent(new Event("banner-status-changed"))
            }
          }}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className:
                "absolute cursor-pointer end-2 md:end-4 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground",
              size: "icon",
            }),
          )}
        >
          <X color={xColor} className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  )
}

function Flow({ colors }: { colors: string[] }) {
  return (
    <>
      <div
        className="absolute inset-0 z-[-1]"
        style={
          {
            animation: "fd-moving-banner 12s linear infinite",
            backgroundImage: `linear-gradient(90deg, ${[...colors, colors[0]]
              .map((color, i) => `${color} ${(i * 100) / colors.length}%`)
              .join(", ")})`,
            backgroundSize: "200% 100%",
          } as object
        }
      />
      <style>{`@keyframes fd-moving-banner { from { background-position: 0% 0; } to { background-position: 100% 0; } }`}</style>
    </>
  )
}
