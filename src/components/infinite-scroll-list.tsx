"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"

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

  const loadMoreData = async () => {
    if (loading) return
    
    setLoading(true)
    try {
      const nextPage = page + 1
      const result = await fetchData(nextPage, debouncedSearch)
      setItems((prevItems) => [...prevItems, ...result.data])
      setHasMore(result.hasMore)
      setPage(nextPage)
    } catch (error) {
      console.error("Error loading more data:", error)
    } finally {
      setLoading(false)
    }
  }

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
        <InfiniteScroll
          dataLength={items.length}
          next={loadMoreData}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          }
          endMessage={
            <p className="text-center py-4 text-gray-500">
              You have seen all items
            </p>
          }
          className="space-y-2"
        >
          {items.map((item) => (
            <div key={item.id} className="transition-all duration-200 hover:bg-gray-50">
              {renderItem(item)}
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  )
}