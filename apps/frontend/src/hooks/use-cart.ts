'use client'

import { useCallback, useMemo, useReducer } from 'react'
import type { CartItem, Product } from '@/types'

type CartAction =
  | { type: 'add'; product: Product; quantity: number }
  | { type: 'clear' }
  | { type: 'set'; items: CartItem[] }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      if (action.quantity <= 0) return state
      const existing = state.find((item) => item.product.id === action.product.id)
      if (existing) {
        return state.map((item) =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + action.quantity }
            : item
        )
      }
      return [...state, { product: action.product, quantity: action.quantity }]
    }
    case 'clear':
      return []
    case 'set':
      return action.items
  }
}

export function useCart(initial: CartItem[] = []) {
  const [items, dispatch] = useReducer(cartReducer, initial)

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  )

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  )

  const add = useCallback((product: Product, quantity: number) => {
    dispatch({ type: 'add', product, quantity })
  }, [])

  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  const set = useCallback((items: CartItem[]) => {
    dispatch({ type: 'set', items })
  }, [])

  return { items, totalCount, totalAmount, add, clear, set }
}
