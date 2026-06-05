"use client"

import React, { createContext, useContext, useEffect, useReducer, useCallback, useState } from "react"
import type { CartItem } from "@/lib/mocks/types"

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; variantId: string }
  | { type: "UPDATE_QTY"; variantId: string; qty: number }
  | { type: "CLEAR" }
  | { type: "LOAD"; items: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.variantId === action.item.variantId)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.variantId === action.item.variantId
              ? { ...i, qty: Math.min(i.qty + action.item.qty, 10) }
              : i
          ),
        }
      }
      return { items: [...state.items, action.item] }
    }
    case "REMOVE":
      return { items: state.items.filter((i) => i.variantId !== action.variantId) }
    case "UPDATE_QTY":
      if (action.qty <= 0) {
        return { items: state.items.filter((i) => i.variantId !== action.variantId) }
      }
      return {
        items: state.items.map((i) =>
          i.variantId === action.variantId ? { ...i, qty: Math.min(action.qty, 10) } : i
        ),
      }
    case "CLEAR":
      return { items: [] }
    case "LOAD":
      return { items: action.items }
    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (variantId: string) => void
  updateQty: (variantId: string, qty: number) => void
  clear: () => void
  total: number
  count: number
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "nex-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        dispatch({ type: "LOAD", items: JSON.parse(stored) })
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      // ignore
    }
  }, [state.items])

  const add = useCallback(
    (item: CartItem) => {
      dispatch({ type: "ADD", item })
      setIsOpen(true)
    },
    []
  )
  const remove = useCallback((variantId: string) => dispatch({ type: "REMOVE", variantId }), [])
  const updateQty = useCallback(
    (variantId: string, qty: number) => dispatch({ type: "UPDATE_QTY", variantId, qty }),
    []
  )
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), [])

  const total = state.items.reduce((sum, i) => sum + i.priceCents * i.qty, 0)
  const count = state.items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ items: state.items, add, remove, updateQty, clear, total, count, isOpen, open, close, toggle }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
