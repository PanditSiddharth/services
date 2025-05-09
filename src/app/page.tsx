import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Search,
  Calendar,
  CheckCircle,
  Star,
  Briefcase,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Thermometer,
  Droplet,
  Flower2,
  HomeIcon,
  MapPin,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-blue-600">
    
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                  Professional Services at Your Doorstep
                </h1>
                <p className="text-lg md:text-xl mb-8">
                  Find trusted professionals for all your home service needs. Book appointments with just a few clicks.
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Link href="/services">Browse Services</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-blue-600 hover:bg-white/10">
                    <Link href="/auth/service-provider/register">Become a Provider</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center text-blue-600">
                <div className="relative w-64 h-64 md:w-80 md:h-80 bg-blue-500/30 rounded-full flex items-center justify-center">
                  <div className="absolute top-5 md:top-10 left-0 bg-white/90 p-3 md:p-4 rounded-lg shadow-lg flex items-center">
                    <Wrench className="text-blue-600 mr-2 h-5 w-5 md:h-6 md:w-6" />
                    <span className="font-medium text-sm md:text-base">Plumbing</span>
                  </div>
                  <div className="absolute top-1/2 right-0 bg-white/90 p-3 md:p-4 rounded-lg shadow-lg flex items-center">
                    <Zap className="text-blue-600 mr-2 h-5 w-5 md:h-6 md:w-6" />
                    <span className="font-medium text-sm md:text-base">Electrical</span>
                  </div>
                  <div className="absolute bottom-5 md:bottom-10 left-5 md:left-10 bg-white/90 p-3 md:p-4 rounded-lg shadow-lg flex items-center">
                    <Paintbrush className="text-blue-600 mr-2 h-5 w-5 md:h-6 md:w-6" />
                    <span className="font-medium text-sm md:text-base">Painting</span>
                  </div>
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 rounded-full flex items-center justify-center">
                    <HomeIcon className="text-white h-16 w-16 md:h-20 md:w-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We offer a wide range of professional services to meet all your home and office needs.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  title: "Plumbing",
                  description: "Expert plumbing services for repairs, installations, and maintenance.",
                  icon: <Droplet className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />,
                },
                {
                  title: "Electrical",
                  description: "Professional electrical services for all your home and office needs.",
                  icon: <Zap className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />,
                },
                {
                  title: "Cleaning",
                  description: "Thorough cleaning services to keep your space spotless and hygienic.",
                  icon: <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />,
                },
                {
                  title: "Carpentry",
                  description: "Skilled carpentry work for furniture repairs, installations, and custom projects.",
                  icon: <Hammer className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />,
                },
                {
                  title: "Painting",
                  description: "Professional painting services for interior and exterior surfaces.",
                  icon: <Paintbrush className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />,
                },
                {
                  title: "Gardening",
                  description: "Expert gardening and landscaping services for beautiful outdoor spaces.",
                  icon: <Flower2 className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />,
                },
                {
                  title: "AC Repair",
                  description: "Reliable air conditioning repair and maintenance services.",
                  icon: <Thermometer className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />,
                },
                {
                  title: "Home Repair",
                  description: "General home repair services for various household issues.",
                  icon: <Wrench className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />,
                },
              ].map((service, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="bg-blue-50 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">{service.description}</p>
                    <Button asChild variant="outline" className="w-full">
                      <Link
                        href={`/services/${service.title.toLowerCase()}`}
                        className="flex items-center justify-center"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our simple process makes it easy to find and book the services you need.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Choose a Service",
                  description: "Browse through our wide range of professional services and select what you need.",
                  icon: <Search className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />,
                  step: 1,
                },
                {
                  title: "Book an Appointment",
                  description: "Select a convenient date and time for the service provider to visit your location.",
                  icon: <Calendar className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />,
                  step: 2,
                },
                {
                  title: "Get the Job Done",
                  description: "Our verified professional will arrive at your doorstep and complete the service.",
                  icon: <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />,
                  step: 3,
                },
              ].map((step, index) => (
                <div key={index} className="text-center p-4 md:p-6 bg-white rounded-lg shadow-md">
                  <div className="relative">
                    <div className="bg-blue-100 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-6">
                      {step.icon}
                    </div>
                    <div className="absolute top-0 right-0 md:right-1/4 bg-blue-600 text-white rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
              {[
                {
                  value: "10,000+",
                  label: "Service Providers",
                  icon: <Briefcase className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" />,
                },
                {
                  value: "50,000+",
                  label: "Completed Jobs",
                  icon: <CheckCircle className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" />,
                },
                {
                  value: "100+",
                  label: "Cities Covered",
                  icon: <MapPin className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" />,
                },
                {
                  value: "4.8/5",
                  label: "Average Rating",
                  icon: <Star className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" />,
                },
              ].map((stat, index) => (
                <div key={index} className="p-4 md:p-6 rounded-lg bg-blue-700/50">
                  {stat.icon}
                  <h3 className="text-2xl md:text-4xl font-bold">{stat.value}</h3>
                  <p className="text-blue-100 text-sm md:text-base">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Dont just take our word for it. Hers what our satisfied customers have to say.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  name: "Priya Sharma",
                  role: "Homeowner",
                  testimonial:
                    "The plumber was very professional and fixed our leaking pipe quickly. Great service and reasonable pricing!",
                  rating: 5,
                  avatar: "PS",
                  bgColor: "bg-pink-100",
                  textColor: "text-pink-600",
                },
                {
                  name: "Rahul Patel",
                  role: "Office Manager",
                  testimonial:
                    "We've been using their cleaning services for our office for 6 months now. Always punctual and thorough.",
                  rating: 4,
                  avatar: "RP",
                  bgColor: "bg-blue-100",
                  textColor: "text-blue-600",
                },
                {
                  name: "Ananya Gupta",
                  role: "Apartment Resident",
                  testimonial:
                    "The electrician was knowledgeable and solved our complex wiring issue that others couldn't figure out.",
                  rating: 5,
                  avatar: "AG",
                  bgColor: "bg-purple-100",
                  textColor: "text-purple-600",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 md:h-5 md:w-5 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 italic text-sm md:text-base">{testimonial.testimonial}</p>
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${testimonial.bgColor} ${testimonial.textColor} flex items-center justify-center font-bold mr-4`}
                      >
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-gray-500 text-xs md:text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Providers */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Top Service Providers</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Meet some of our highest-rated service professionals ready to help you.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  name: "Rajesh Kumar",
                  profession: "Plumber",
                  experience: "8+ years experience",
                  rating: 4.9,
                  reviews: 124,
                  avatar: "RK",
                  bgColor: "bg-blue-100",
                  textColor: "text-blue-600",
                },
                {
                  name: "Amit Singh",
                  profession: "Electrician",
                  experience: "10+ years experience",
                  rating: 4.8,
                  reviews: 98,
                  avatar: "AS",
                  bgColor: "bg-yellow-100",
                  textColor: "text-yellow-600",
                },
                {
                  name: "Neha Verma",
                  profession: "House Cleaner",
                  experience: "5+ years experience",
                  rating: 4.7,
                  reviews: 87,
                  avatar: "NV",
                  bgColor: "bg-green-100",
                  textColor: "text-green-600",
                },
                {
                  name: "Vikram Patel",
                  profession: "Carpenter",
                  experience: "12+ years experience",
                  rating: 4.9,
                  reviews: 156,
                  avatar: "VP",
                  bgColor: "bg-orange-100",
                  textColor: "text-orange-600",
                },
              ].map((provider, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${provider.bgColor} ${provider.textColor} flex items-center justify-center text-xl md:text-2xl font-bold mb-4`}
                      >
                        {provider.avatar}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold">{provider.name}</h3>
                      <p className="text-blue-600 font-medium text-sm md:text-base">{provider.profession}</p>
                      <p className="text-gray-500 text-xs md:text-sm mb-3">{provider.experience}</p>
                      <div className="flex items-center mb-4">
                        <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-gray-500 text-xs md:text-sm ml-1">({provider.reviews} reviews)</span>
                      </div>
                      <Button asChild className="w-full">
                        <Link href={`/providers/${provider.name.toLowerCase().replace(" ", "-")}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg">
                <Link href="/providers">View All Providers</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Were committed to providing the best service experience for our customers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Verified Professionals",
                  description: "All our service providers undergo thorough background checks and skill verification.",
                  icon: <Users className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />,
                },
                {
                  title: "Timely Service",
                  description: "We value your time and ensure our professionals arrive at the scheduled time.",
                  icon: <Clock className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />,
                },
                {
                  title: "Quality Guarantee",
                  description: "We stand behind the quality of our services with a satisfaction guarantee.",
                  icon: <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-blue-600" />,
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 md:p-6 bg-white rounded-lg shadow-md"
                >
                  <div className="bg-blue-50 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Ready to Get Started?</h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have simplified their home service needs with our platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/auth/user/register">Sign Up as User</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-blue-600 hover:bg-white/10">
                <Link href="/auth/provider/register">Register as Provider</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
