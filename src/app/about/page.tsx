import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, Target, Award } from "lucide-react"
import Link from "next/link"

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              We are on a mission to revolutionize the home services industry by connecting quality service providers with customers.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Founded in 2023, our platform emerged from a simple observation: finding reliable home service professionals should not be a challenge.
                  </p>
                  <p className="text-gray-600">
                    We started with a small team of dedicated professionals and have grown to serve thousands of customers across multiple cities in India.
                  </p>
                  <p className="text-gray-600">
                    Today, we are proud to be Indias fastest-growing home services platform, connecting skilled professionals with customers who need their services.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Service Providers", value: "10,000+" },
                  { label: "Happy Customers", value: "50,000+" },
                  { label: "Cities Covered", value: "100+" },
                  { label: "Services Completed", value: "100,000+" }
                ].map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  icon: <Shield className="h-10 w-10 text-blue-600" />,
                  title: "Trust & Safety",
                  description: "We verify all service providers and ensure your safety is our top priority."
                },
                {
                  icon: <Users className="h-10 w-10 text-blue-600" />,
                  title: "Customer First",
                  description: "Your satisfaction is at the heart of everything we do."
                },
                {
                  icon: <Target className="h-10 w-10 text-blue-600" />,
                  title: "Quality Service",
                  description: "We maintain high standards in service delivery and professional conduct."
                },
                {
                  icon: <Award className="h-10 w-10 text-blue-600" />,
                  title: "Excellence",
                  description: "We strive for excellence in every interaction and service provided."
                }
              ].map((value, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="bg-blue-50 rounded-full p-4 inline-block mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Join Our Platform</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Whether you are looking for services or want to offer your professional skills, we have the right opportunity for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/services">Find Services</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/auth/provider/register">Become a Provider</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
