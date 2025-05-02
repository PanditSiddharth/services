"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

interface InfiniteScrollListProps<T> {
  fetchData: (page: number, search: string) => Promise<{ data: T[]; hasMore: boolean }>
  renderItem: (item: T) => React.ReactNode
  initialData: T[]
  initialHasMore: boolean
  searchPlaceholder?: string
  emptyMessage?: string
}

export function InfiniteScrollList<T extends { id: string }>({
  fetchData,
  renderItem,
  initialData,
  initialHasMore,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found",
}: InfiniteScrollListProps<T>) {
  const [items, setItems] = useState<T[]>(initialData)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const observer = useRef<IntersectionObserver | null>(null)
  const lastItemRef = useRef<HTMLDivElement | null>(null)

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
      setItems([])
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  // Reset and load data when search changes
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        const result = await fetchData(1, debouncedSearch)
        setItems(result.data)
        setHasMore(result.hasMore)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [debouncedSearch, fetchData])

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (loading || !hasMore) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1)
      }
    })

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [loading, hasMore, items])

  // Load more data when page changes
  useEffect(() => {
    if (page === 1) return

    const loadMoreData = async () => {
      setLoading(true)
      try {
        const result = await fetchData(page, debouncedSearch)
        setItems((prevItems) => [...prevItems, ...result.data])
        setHasMore(result.hasMore)
      } catch (error) {
        console.error("Error loading more data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMoreData()
  }, [page, fetchData, debouncedSearch])

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {items.length === 0 && !loading ? (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id} className="transition-all duration-200 hover:bg-gray-50">
              {renderItem(item)}
            </div>
          ))}
          <div ref={lastItemRef} className="h-4" />
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      )}
    </div>
  )
}
