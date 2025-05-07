import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <p className="text-gray-600 mb-4">Find and book services from professionals in your area.</p>
            <p className="text-gray-600">&copy; {new Date().getFullYear()} Services. All rights reserved.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">For Providers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/provider/register" className="text-gray-600 hover:text-primary">
                  Register as Provider
                </Link>
              </li>
              <li>
                <Link href="/auth/provider/login" className="text-gray-600 hover:text-primary">
                  Provider Login
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/provider-faq" className="text-gray-600 hover:text-primary">
                  Provider FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-600">
              <p>123 Main Street</p>
              <p>Mumbai, Maharashtra 400001</p>
              <p>India</p>
              <p className="mt-2">
                <a href="mailto:info@services.com" className="hover:text-primary">
                  info@services.com
                </a>
              </p>
              <p>
                <a href="tel:+919876543210" className="hover:text-primary">
                  +91 9876543210
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>
    </footer>
  )
}
