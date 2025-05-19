import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Search, Calendar, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Getting the service you need is simple and straightforward with our platform
            </p>
          </div>
        </section>

        {/* Detailed Steps */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12">
              {[
                {
                  step: 1,
                  title: "Choose Your Service",
                  description: "Browse through our comprehensive list of services and select the one you need. From plumbing to electrical work, we've got you covered.",
                  icon: <Search className="h-12 w-12 text-blue-600" />,
                  details: [
                    "Browse service categories",
                    "Compare service providers",
                    "Read customer reviews",
                    "Check service pricing"
                  ]
                },
                {
                  step: 2,
                  title: "Book an Appointment",
                  description: "Select your preferred date and time slot. Our booking system ensures you get the service exactly when you need it.",
                  icon: <Calendar className="h-12 w-12 text-blue-600" />,
                  details: [
                    "Pick your preferred date",
                    "Choose available time slots",
                    "Add service requirements",
                    "Confirm booking instantly"
                  ]
                },
                {
                  step: 3,
                  title: "Get Professional Service",
                  description: "Our verified professional will arrive at your doorstep on time and provide quality service.",
                  icon: <CheckCircle className="h-12 w-12 text-blue-600" />,
                  details: [
                    "Get service at your doorstep",
                    "Track professional's arrival",
                    "Rate the service",
                    "Make secure payment"
                  ]
                }
              ].map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3 text-center md:text-left">
                    <div className="inline-block bg-blue-100 rounded-full p-6 mb-4">
                      {step.icon}
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                      Step {step.step}: {step.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                  </div>
                  <div className="md:w-2/3 bg-gray-50 rounded-lg p-6">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center">
                          <ArrowRight className="h-5 w-5 text-blue-600 mr-2" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8">Book your first service today and experience the convenience.</p>
            <Button asChild size="lg">
              <Link href="/services">Browse Services</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
