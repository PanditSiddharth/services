"use client"
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSession } from "next-auth/react";
import { getUser } from "../actions/user";
import Loading from "../user/dashboard/loading";
import { getProviderStats } from "../actions/provider";

// Mock data for demonstration
const mockServiceProvider = {
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+1234567890",
  profession: { name: "Electrician" },
  experience: 5,
  rating: 4.7,
  totalReviews: 48,
  totalBookings: 72,
  completedBookings: 68,
  isVerified: true,
  isActive: true,
  address: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    pincode: "10001",
  },
  availability: {
    isAvailable: true,
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    workingHours: {
      start: "09:00",
      end: "18:00",
    }
  },
  bankDetails: {
    accountHolderName: "John Smith",
    accountNumber: "XXXX-XXXX-1234",
    bankName: "Example Bank",
  },
  services: [
    { service: { name: "Electrical Repair" }, price: 50, priceUnit: "hour" },
    { service: { name: "Panel Installation" }, price: 200, priceUnit: "job" },
    { service: { name: "Wiring Service" }, price: 75, priceUnit: "hour" },
  ],
};

const mockBookings = [
  {
    _id: "b1",
    service: { name: "Electrical Repair" },
    subService: { name: "Switch Repair", price: 50 },
    user: { firstName: "Alice Johnson" },
    bookingDate: new Date("2025-04-28T10:00:00"),
    status: "confirmed",
    estimatedPrice: 50,
    address: {
      city: "New York",
    },
  },
  {
    _id: "b2",
    service: { name: "Panel Installation" },
    subService: { name: "Main Panel", price: 200 },
    user: { firstName: "Bob Williams" },
    bookingDate: new Date("2025-04-30T14:00:00"),
    status: "pending",
    estimatedPrice: 200,
    address: {
      city: "New York",
    },
  },
  {
    _id: "b3",
    service: { name: "Wiring Service" },
    subService: { name: "House Rewiring", price: 150 },
    user: { firstName: "Carol Davis" },
    bookingDate: new Date("2025-04-25T11:30:00"),
    status: "completed",
    estimatedPrice: 150,
    finalPrice: 175,
    address: {
      city: "New York",
    },
  },
  {
    _id: "b4",
    service: { name: "Electrical Repair" },
    subService: { name: "Light Fixture", price: 75 },
    user: { firstName: "David Brown" },
    bookingDate: new Date("2025-04-24T09:15:00"),
    status: "completed",
    estimatedPrice: 75,
    finalPrice: 75,
    address: {
      city: "New York",
    },
  },
];

const mockReviews = [
  {
    _id: "r1",
    user: { firstName: "Carol Davis" },
    booking: { _id: "b3" },
    rating: 5,
    comment: "Excellent work! Fixed all wiring issues and was very professional.",
    createdAt: new Date("2025-04-26T15:30:00"),
  },
  {
    _id: "r2",
    user: { firstName: "David Brown" },
    booking: { _id: "b4" },
    rating: 4,
    comment: "Good job with the light fixture. Quick and efficient service.",
    createdAt: new Date("2025-04-25T10:45:00"),
  },
];

// Chart data
const earningsData = [
  { name: "Jan", earnings: 1200 },
  { name: "Feb", earnings: 1700 },
  { name: "Mar", earnings: 1500 },
  { name: "Apr", earnings: 2100 },
];

const bookingStatusData = [
  { name: "Completed", value: 68 },
  { name: "Pending", value: 3 },
  { name: "Cancelled", value: 1 },
];

const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

// Status badge component
const StatusBadge = ({ status }: any) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    "in-progress": "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    "no-show": "bg-gray-100 text-gray-800",
  };

  return (
    <Badge className={`${(statusColors as any)[status] || "bg-gray-100"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function ServiceProviderDashboard() {
  const { data: session } = useSession();
  interface Booking {
    _id: string;
    user: { firstName: string; };
    service?: { name: string; };
    subService?: { name: string; };
    bookingDate: Date;
    status: string;
    estimatedPrice: number;
    finalPrice?: number;
    address: { city: string; };
  }

  const [dashboardData, setDashboardData] = useState<{
    recentBookings: Booking[];
    stats: {
      totalBookings: number;
      completedBookings: number;
      rating: number;
      reviews: number;
      revenue: number;
    };
  }>({
    recentBookings: [],
    stats: {
      totalBookings: 0,
      completedBookings: 0,
      rating: 0,
      reviews: 0,
      revenue: 0
    }
  });

  useEffect(() => {
    if ((session?.user as any)?.id) {
      if (session && (session.user as any)?.id) {
        getProviderStats((session.user as any).id)
          .then((data) => {
            setDashboardData({
              recentBookings: data.recentBookings || [],
              stats: {
                totalBookings: data.stats?.totalBookings || 0,
                completedBookings: data.stats?.completedBookings || 0,
                rating: data.stats?.rating || 0,
                reviews: data.stats?.reviews || 0,
                revenue: data.stats?.revenue || 0,
              },
            });
          })
          .catch(console.error);
      }
    }
  }, [session]);

  const mockServiceProvider = useSession().data?.user as any;

  useEffect(() => {
    if(mockServiceProvider){
      getUser({
        email: mockServiceProvider.email,
        role: "serviceProvider",
        populate: true
      }).then((user) => {
        if (user) {
          Object.assign(mockServiceProvider, user);
        }
      }).catch((error) => {
        console.error("Error fetching user:", error);
      })
    }
  },[]);


  const [activeTab, setActiveTab] = useState("overview");

  return (
    !mockServiceProvider ?  <Loading /> : <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white mr-4">
              <Icons.Electric size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {mockServiceProvider?.name}
              </h1>
              <p className="text-gray-600">
                {mockServiceProvider?.profession?.name}
                {mockServiceProvider?.isVerified && (
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    <Icons.Check className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className={mockServiceProvider?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
              {mockServiceProvider?.isActive ? "Active" : "Inactive"}
            </Badge>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Icons.Settings size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{dashboardData.stats.revenue}</div>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <Icons.ChevronRight className="h-4 w-4 -rotate-90" />
                    <span>+12% from last month</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.stats.totalBookings}</div>
                  <p className="text-xs text-gray-500 mt-1">
                    {dashboardData.stats.completedBookings} completed
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center">
                    {dashboardData.stats.rating}
                    <span className="text-yellow-500 ml-1">
                      <Icons.User className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {dashboardData.stats.reviews} reviews
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((dashboardData.stats.completedBookings / dashboardData.stats.totalBookings) * 100)}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                  <CardDescription>Your earnings over the past 4 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={earningsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`₹${value}`, "Earnings"]}
                        />
                        <Line
                          type="monotone"
                          dataKey="earnings"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Status</CardTitle>
                  <CardDescription>Distribution of your bookings</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={bookingStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                          label
                        >
                          {bookingStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} bookings`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Your next scheduled services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.recentBookings.filter(b => b.status !== "completed").map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user.firstName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.address.city}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking?.service?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking?.subService?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {format(booking.bookingDate, "MMM dd, yyyy")}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(booking.bookingDate, "h:mm a")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₹{booking.estimatedPrice}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={booking.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage your service bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.recentBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user.firstName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.address.city}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {booking?.service?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking?.subService?.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {format(booking.bookingDate, "MMM dd, yyyy")}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(booking.bookingDate, "h:mm a")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              ₹{booking.finalPrice || booking.estimatedPrice}
                            </div>
                            {booking.finalPrice && booking.finalPrice !== booking.estimatedPrice && (
                              <div className="text-xs text-gray-500">
                                Est: ₹{booking.estimatedPrice}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-4">
                              View
                            </button>
                            {booking.status === "pending" && (
                              <button className="text-green-600 hover:text-green-900">
                                Accept
                              </button>
                            )}
                            {booking.status === "confirmed" && (
                              <button className="text-purple-600 hover:text-purple-900">
                                Start
                              </button>
                            )}
                            {booking.status === "in-progress" && (
                              <button className="text-green-600 hover:text-green-900">
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  Your average rating: {mockServiceProvider?.rating}/5 from {mockServiceProvider?.totalReviews} reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review._id} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">
                              {review.user.firstName}
                            </h4>
                            <div className="ml-2 flex">
                              {[...Array(5)].map((_, i) => (
                                <Icons.User
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review?.rating
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(review.createdAt, "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                    <p className="mt-1">{mockServiceProvider?.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="mt-1">{mockServiceProvider?.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                    <p className="mt-1">{mockServiceProvider?.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Profession</h4>
                    <p className="mt-1">{mockServiceProvider?.profession?.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                    <p className="mt-1">{mockServiceProvider?.experience} years</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Address</h4>
                    <p className="mt-1">
                      {mockServiceProvider?.address?.street}, {mockServiceProvider?.address?.city}, {mockServiceProvider?.address?.state} {mockServiceProvider?.address?.pincode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Services & Pricing</CardTitle>
                  <CardDescription>Services you offer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockServiceProvider?.services?.map((service, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-3 last:border-b-0">
                        <div>
                          <h4 className="font-medium">{service?.service?.name}</h4>
                          <p className="text-sm text-gray-500">
                            {service?.priceUnit === "hour" && "Hourly Rate"}
                            {service?.priceUnit === "job" && "Fixed Price"}
                            {service?.priceUnit === "day" && "Daily Rate"}
                          </p>
                        </div>
                        <p className="font-medium">₹{service?.price}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                  <CardDescription>Your working hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                      const isWorkingDay = mockServiceProvider?.availability?.workingDays?.includes(day);
                      return (
                        <div 
                          key={day}
                          className={`p-4 text-center rounded-md ${isWorkingDay ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}`}
                        >
                          <p className="text-sm font-medium">{day.slice(0, 3)}</p>
                          <p className={`text-xs mt-1 ${isWorkingDay ? "text-blue-700" : "text-gray-500"}`}>
                            {isWorkingDay 
                              ? `${mockServiceProvider?.availability?.workingHours?.start} - ${mockServiceProvider?.availability?.workingHours?.end}`
                              : "Off day"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bank Details</CardTitle>
                  <CardDescription>For payment processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Account Holder</h4>
                    <p className="mt-1">{mockServiceProvider?.bankDetails.accountHolderName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Account Number</h4>
                    <p className="mt-1">{mockServiceProvider?.bankDetails.accountNumber}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Bank Name</h4>
                    <p className="mt-1">{mockServiceProvider?.bankDetails.bankName}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}