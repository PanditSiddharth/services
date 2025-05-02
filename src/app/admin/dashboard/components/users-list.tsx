"use client"
import { format } from "date-fns"
import { type User, getUsers } from "@/app/actions/admin"
import { InfiniteScrollList } from "./infinite-scroll-list"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Mail } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface UserListProps {
  initialUsers: User[]
  initialHasMore: boolean
}

export function UserList({ initialUsers, initialHasMore }: UserListProps) {
  const fetchUsers = async (page: number, search: string) => {
    const { users, hasMore } = await getUsers(page, 10, search)
    return { data: users, hasMore }
  }

  const renderUser = (user: User) => (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                <span>Email User</span>
              </DropdownMenuItem>
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              {user.status === "active" ? (
                <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="text-green-600">Activate</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>Joined: {format(new Date(user.createdAt), "MMM d, yyyy")}</span>
        {user.lastLogin && <span>Last login: {format(new Date(user.lastLogin), "MMM d, yyyy")}</span>}
      </div>
    </div>
  )

  return (
    <InfiniteScrollList
      fetchData={fetchUsers}
      renderItem={renderUser}
      initialData={initialUsers}
      initialHasMore={initialHasMore}
      searchPlaceholder="Search users by name or email..."
      emptyMessage="No users found"
    />
  )
}
