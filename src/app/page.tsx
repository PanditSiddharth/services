import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Star,
  Wrench,
  Zap,
  PenToolIcon as Tool,
  Hammer,
  Paintbrush,
  Thermometer,
  Search,
  LocateIcon as LocationIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  // Dummy service professionals data
  const serviceProfessionals = [
    {
      id: 1,
      name: "Rajesh Kumar",
      profession: "Plumber",
      location: "Andheri, Mumbai",
      rating: 4.8,
      reviews: 124,
      experience: "8 years",
      price: "₹400/hour",
      available: true,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Sunil Sharma",
      profession: "Electrician",
      location: "Malad, Mumbai",
      rating: 4.9,
      reviews: 156,
      experience: "10 years",
      price: "₹450/hour",
      available: true,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Amit Patel",
      profession: "Mechanic",
      location: "Borivali, Mumbai",
      rating: 4.7,
      reviews: 98,
      experience: "6 years",
      price: "₹500/hour",
      available: false,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "Priya Singh",
      profession: "Painter",
      location: "Dadar, Mumbai",
      rating: 4.6,
      reviews: 87,
      experience: "5 years",
      price: "₹350/hour",
      available: true,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      name: "Mohammed Khan",
      profession: "Carpenter",
      location: "Bandra, Mumbai",
      rating: 4.9,
      reviews: 132,
      experience: "12 years",
      price: "₹550/hour",
      available: true,
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      name: "Lakshmi Rao",
      profession: "Electrician",
      location: "Powai, Mumbai",
      rating: 4.8,
      reviews: 104,
      experience: "7 years",
      price: "₹425/hour",
      available: true,
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  // Service categories
  const serviceCategories = [
    {
      title: "Plumbing",
      description: "Pipe repairs, installations, leakages, bathroom fittings and more",
      icon: <Wrench className="h-10 w-10 text-primary" />,
    },
    {
      title: "Electrical",
      description: "Wiring, repairs, installations, electrical appliance setup and maintenance",
      icon: <Zap className="h-10 w-10 text-primary" />,
    },
    {
      title: "Mechanical",
      description: "Vehicle repairs, maintenance, parts replacement and diagnostics",
      icon: <Tool className="h-10 w-10 text-primary" />,
    },
    {
      title: "Carpentry",
      description: "Furniture assembly, repairs, custom woodwork and installations",
      icon: <Hammer className="h-10 w-10 text-primary" />,
    },
    {
      title: "Painting",
      description: "Interior and exterior painting, wall textures, and touch-ups",
      icon: <Paintbrush className="h-10 w-10 text-primary" />,
    },
    {
      title: "AC & Appliance Repair",
      description: "AC servicing, refrigerator, washing machine and appliance repairs",
      icon: <Thermometer className="h-10 w-10 text-primary" />,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-xl flex items-center">
              <div className="w-8 h-8 rounded bg-primary mr-2 flex items-center justify-center text-primary-foreground">
                HS
              </div>
              HomeServices
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#services" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="#professionals" className="text-sm font-medium hover:text-primary transition-colors">
              Professionals
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="#register-pro">Register as Professional</Link>
            </Button>
            <Button asChild>
              <Link href="#book-service">Book a Service</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Expert Home Services at Your Doorstep
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect with verified plumbers, electricians, mechanics and more in your area. Quality service
                    professionals just a click away.
                  </p>
                </div>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <div className="relative w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="text" placeholder="What service do you need?" className="w-full pl-10 pr-16" />
                    <Button className="absolute right-1 top-1/2 -translate-y-1/2 h-8">Search</Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <LocationIcon className="h-4 w-4 text-primary" />
                  <span>Popular cities:</span>
                  <span className="font-medium">Mumbai, Delhi, Bangalore, Hyderabad, Chennai</span>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=550&width=550"
                  width={550}
                  height={550}
                  alt="Home Services Professionals"
                  className="rounded-lg object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Our Services
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Professional Services for Your Home
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose from our wide range of home services provided by verified professionals in your area.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              {serviceCategories.map((service, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="mt-2 text-muted-foreground">{service.description}</p>
                    <Link
                      href="#book-service"
                      className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                    >
                      Book now
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Professionals Section */}
        <section id="professionals" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Top Rated Professionals
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Meet Our Verified Service Providers
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Skilled and experienced professionals ready to help you with your home service needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {serviceProfessionals.map((professional) => (
                <Card key={professional.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col">
                      <div className="flex items-start p-6">
                        <div className="relative mr-4 h-16 w-16 flex-shrink-0">
                          <Image
                            src={professional.image || "/placeholder.svg"}
                            alt={professional.name}
                            width={64}
                            height={64}
                            className="rounded-full object-cover"
                          />
                          {professional.available && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{professional.name}</h3>
                            <Badge variant={professional.available ? "default" : "outline"}>
                              {professional.available ? "Available Now" : "Busy"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{professional.profession}</p>
                          <div className="mt-1 flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(professional.rating)
                                      ? "fill-primary text-primary"
                                      : "fill-muted text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm font-medium">{professional.rating}</span>
                            <span className="ml-1 text-sm text-muted-foreground">({professional.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t px-6 py-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span>{professional.location}</span>
                          </div>
                          <div>{professional.experience}</div>
                          <div className="font-medium">{professional.price}</div>
                        </div>
                      </div>
                      <div className="border-t p-4">
                        <Button className="w-full">Book Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button variant="outline" size="lg">
                View All Professionals
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Simple Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How HomeServices Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get your home services done in just a few simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-4 text-xl font-bold">Select a Service</h3>
                <p className="mt-2 text-muted-foreground">
                  Choose from our wide range of home services that you need assistance with
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-4 text-xl font-bold">Book a Professional</h3>
                <p className="mt-2 text-muted-foreground">
                  Select from our verified professionals based on ratings, price and availability
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-4 text-xl font-bold">Get Work Done</h3>
                <p className="mt-2 text-muted-foreground">
                  The professional arrives at your doorstep and completes the service efficiently
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "10,000+", label: "Service Providers" },
                { value: "50,000+", label: "Completed Jobs" },
                { value: "100+", label: "Cities Covered" },
                { value: "4.8/5", label: "Average Rating" },
              ].map((stat, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-4xl font-bold text-primary">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What Our Customers Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from our satisfied customers about their experience with our service professionals
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl gap-6 py-12 lg:grid-cols-3">
              {[
                {
                  quote:
                    "I needed an emergency plumber and HomeServices connected me with Rajesh within minutes. He fixed my leaking pipe quickly and professionally. Highly recommended!",
                  author: "Anita Desai",
                  location: "Mumbai",
                  service: "Plumbing",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
                {
                  quote:
                    "Sunil was punctual, knowledgeable and fixed all the electrical issues in my home. The booking process was simple and the service was excellent.",
                  author: "Vikram Mehta",
                  location: "Delhi",
                  service: "Electrical",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
                {
                  quote:
                    "I've used HomeServices multiple times for different needs. Their professionals are always reliable and the quality of work is consistently good.",
                  author: "Priya Sharma",
                  location: "Bangalore",
                  service: "Multiple Services",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{testimonial.quote}</p>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.author}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.location} • {testimonial.service}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="book-service" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Get Your Home Services Done?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Book a service professional today and get your home tasks completed with ease.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="grid gap-4">
                  <div className="grid gap-2">
                    <label
                      htmlFor="service-type"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Select Service
                    </label>
                    <select
                      id="service-type"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a service</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="mechanical">Mechanical</option>
                      <option value="carpentry">Carpentry</option>
                      <option value="painting">Painting</option>
                      <option value="appliance">AC & Appliance Repair</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="location"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Your Location
                    </label>
                    <Input id="location" placeholder="Enter your area or pincode" />
                  </div>
                  <Button type="submit" className="w-full">
                    Find Professionals
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Register as Professional Section */}
        <section id="register-pro" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  width={600}
                  height={600}
                  alt="Service Professional"
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center"
                />
              </div>
              <div className="space-y-6">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  For Professionals
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Join Our Network of Service Providers
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Are you a skilled professional? Partner with us to find new customers and grow your business.
                </p>
                <div className="grid gap-4">
                  {[
                    {
                      title: "More Customers",
                      description: "Get connected with customers looking for your services in your area.",
                    },
                    {
                      title: "Flexible Schedule",
                      description: "Choose when you want to work and which jobs you want to take.",
                    },
                    {
                      title: "Secure Payments",
                      description: "Get paid directly to your account for completed services.",
                    },
                    {
                      title: "Build Your Reputation",
                      description: "Earn reviews and ratings to showcase your quality work.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <CheckCircle className="mt-1 h-5 w-5 flex-none text-primary" />
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild size="lg" className="mt-4">
                  <Link href="#register-form">Register as a Professional</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                    Contact Us
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Get in Touch</h2>
                  <p className="text-muted-foreground md:text-xl/relaxed">
                    Have questions or need assistance? Our customer support team is here to help.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Phone className="mt-1 h-5 w-5 flex-none text-primary" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-sm text-muted-foreground">+91 1800 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="mt-1 h-5 w-5 flex-none text-primary" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">support@homeservices.in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="mt-1 h-5 w-5 flex-none text-primary" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-sm text-muted-foreground">
                        123 Service Road, Tech Park
                        <br />
                        Mumbai, Maharashtra 400001
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Clock className="mt-1 h-5 w-5 flex-none text-primary" />
                    <div>
                      <h3 className="font-medium">Support Hours</h3>
                      <p className="text-sm text-muted-foreground">Monday - Sunday: 8:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-background p-6 shadow-sm">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="first-name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        First name
                      </label>
                      <input
                        id="first-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="last-name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Last name
                      </label>
                      <input
                        id="last-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="font-bold text-xl flex items-center">
                <div className="w-8 h-8 rounded bg-primary mr-2 flex items-center justify-center text-primary-foreground">
                  HS
                </div>
                HomeServices
              </Link>
              <p className="text-sm text-muted-foreground">
                Connecting you with skilled professionals for all your home service needs. Quality service at your
                doorstep.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Services</h3>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link href="#" className="hover:text-primary transition-colors">
                  Plumbing
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Electrical
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Mechanical
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Carpentry
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Painting
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Company</h3>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link href="#" className="hover:text-primary transition-colors">
                  About Us
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Careers
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Partner With Us
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link href="#contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Legal</h3>
              <nav className="flex flex-col space-y-2 text-sm">
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </nav>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} HomeServices. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
