import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="nav">
        <div className="container nav-container">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">RealEstate</h1>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/properties" className="nav-link">Properties</Link>
            <Link href="/agents" className="nav-link">Agents</Link>
            <Link href="/auth/signin" className="btn">Sign In</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="container text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find Your Dream Property
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover premium real estate opportunities worldwide with our comprehensive platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/properties" className="btn">
              Browse Properties
            </Link>
            <Link href="/agents" className="btn btn-secondary">
              Find Agents
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">Browse Properties</h3>
              <p className="text-gray-600">
                Explore our extensive collection of properties from around the world.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Connect with Agents</h3>
              <p className="text-gray-600">
                Work with verified real estate professionals to find your perfect match.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Close the Deal</h3>
              <p className="text-gray-600">
                Secure your investment with our streamlined transaction process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">10K+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Verified Agents</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">5K+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Next Property?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who trust our platform for their real estate needs.
          </p>
          <Link href="/auth/signup" className="btn">
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">RealEstate</h3>
              <p className="text-gray-400">
                Your trusted partner in global real estate.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Properties</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/properties">All Properties</Link></li>
                <li><Link href="/properties?type=residential">Residential</Link></li>
                <li><Link href="/properties?type=commercial">Commercial</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/agents">Find Agents</Link></li>
                <li><Link href="/add-listing">List Property</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RealEstate Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
