"use client";

import type React from "react";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";

interface InfiniteScrollListProps<T> {
  fetchData: (page: number, search: string) => Promise<{ data: T[]; hasMore: boolean }>;
  renderItem: (item: T) => React.ReactNode;
  initialData: T[];
  initialHasMore: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
}

export function InfiniteScrollList<T extends { _id: string }>({
  fetchData,
  renderItem,
  initialData,
  initialHasMore,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found",
  columns = {
    base: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
  },
}: InfiniteScrollListProps<T>) {
  const [items, setItems] = useState<T[]>(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const getGridClasses = () => {
    const breakpoints = ["base", "sm", "md", "lg", "xl", "2xl"];
    return breakpoints
      .map((bp) => {
        const count = columns[bp as keyof typeof columns];
        if (!count) return null;
        return bp === "base" ? `grid-cols-${count}` : `${bp}:grid-cols-${count}`;
      })
      .filter(Boolean)
      .join(" ");
  };

  // Handle search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
      setItems([]);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Add a function to deduplicate items based on _id
  const deduplicateItems = (items: T[]) => {
    const seen = new Set();
    return items.filter(item => {
      const _id = (item as any)?._id;
      if (seen.has(_id)) {
        return false;
      }
      seen.add(_id);
      return true;
    });
  };

  // Update effect to deduplicate initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const result = await fetchData(1, debouncedSearch);
        setItems(deduplicateItems(result.data));
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [debouncedSearch, fetchData]);

  const loadMoreData = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await fetchData(nextPage, debouncedSearch);
      setItems(prevItems => deduplicateItems([...prevItems, ...result.data]));
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more data:", error);
    } finally {
      setLoading(false);
    }
  };

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

      {items.length === 0 && !hasMore ? (
        <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
      ) : (
        <InfiniteScroll
          dataLength={items?.length}
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
          className={`grid gap-6 ${getGridClasses()}`}
        >
          {items && items?.map((item) => (
            // Use _id as key since it's unique for MongoDB documents
            <div key={(item as any)?._id}>
              {renderItem(item)}
            </div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}
