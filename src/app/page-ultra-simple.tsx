export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="nav">
        <div className="container nav-container">
          <div>
            <h1 className="text-2xl font-bold" style={{color: '#2563eb'}}>RealEstate</h1>
          </div>
          <nav className="flex items-center" style={{gap: '1.5rem'}}>
            <a href="/properties" className="nav-link">Properties</a>
            <a href="/agents" className="nav-link">Agents</a>
            <a href="/auth/signin" className="btn">Sign In</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20" style={{backgroundColor: '#f9fafb'}}>
        <div className="container text-center">
          <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem'}}>
            Find Your Dream Property
          </h1>
          <p style={{fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem', maxWidth: '32rem', margin: '0 auto 2rem auto'}}>
            Discover premium real estate opportunities worldwide with our comprehensive platform.
          </p>
          <div className="flex justify-center" style={{gap: '1rem'}}>
            <a href="/properties" className="btn">
              Browse Properties
            </a>
            <a href="/agents" className="btn btn-secondary">
              Find Agents
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-center" style={{fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '3rem'}}>
            How It Works
          </h2>
          <div className="grid grid-cols-3" style={{gap: '2rem'}}>
            <div className="card text-center">
              <div style={{fontSize: '2.25rem', marginBottom: '1rem'}}>🏠</div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem'}}>Browse Properties</h3>
              <p style={{color: '#6b7280'}}>
                Explore our extensive collection of properties from around the world.
              </p>
            </div>
            <div className="card text-center">
              <div style={{fontSize: '2.25rem', marginBottom: '1rem'}}>👥</div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem'}}>Connect with Agents</h3>
              <p style={{color: '#6b7280'}}>
                Work with verified real estate professionals to find your perfect match.
              </p>
            </div>
            <div className="card text-center">
              <div style={{fontSize: '2.25rem', marginBottom: '1rem'}}>✅</div>
              <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem'}}>Close the Deal</h3>
              <p style={{color: '#6b7280'}}>
                Secure your investment with our streamlined transaction process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16" style={{backgroundColor: '#f9fafb'}}>
        <div className="container">
          <div className="grid grid-cols-4 text-center" style={{gap: '2rem'}}>
            <div>
              <div style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#2563eb'}}>10K+</div>
              <div style={{color: '#6b7280'}}>Properties Listed</div>
            </div>
            <div>
              <div style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#2563eb'}}>500+</div>
              <div style={{color: '#6b7280'}}>Verified Agents</div>
            </div>
            <div>
              <div style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#2563eb'}}>50+</div>
              <div style={{color: '#6b7280'}}>Countries</div>
            </div>
            <div>
              <div style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#2563eb'}}>5K+</div>
              <div style={{color: '#6b7280'}}>Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 style={{fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem'}}>
            Ready to Find Your Next Property?
          </h2>
          <p style={{fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem'}}>
            Join thousands of users who trust our platform for their real estate needs.
          </p>
          <a href="/auth/signup" className="btn">
            Get Started Today
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{backgroundColor: '#1f2937', color: 'white', padding: '3rem 0'}}>
        <div className="container">
          <div className="grid grid-cols-4" style={{gap: '2rem'}}>
            <div>
              <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem'}}>RealEstate</h3>
              <p style={{color: '#9ca3af'}}>
                Your trusted partner in global real estate.
              </p>
            </div>
            <div>
              <h4 style={{fontWeight: '600', marginBottom: '1rem'}}>Properties</h4>
              <ul style={{color: '#9ca3af', lineHeight: '1.5'}}>
                <li><a href="/properties">All Properties</a></li>
                <li><a href="/properties?type=residential">Residential</a></li>
                <li><a href="/properties?type=commercial">Commercial</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{fontWeight: '600', marginBottom: '1rem'}}>Services</h4>
              <ul style={{color: '#9ca3af', lineHeight: '1.5'}}>
                <li><a href="/agents">Find Agents</a></li>
                <li><a href="/add-listing">List Property</a></li>
                <li><a href="/pricing">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{fontWeight: '600', marginBottom: '1rem'}}>Support</h4>
              <ul style={{color: '#9ca3af', lineHeight: '1.5'}}>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/terms">Terms</a></li>
              </ul>
            </div>
          </div>
          <div style={{borderTop: '1px solid #374151', marginTop: '2rem', paddingTop: '2rem', textAlign: 'center', color: '#9ca3af'}}>
            <p>&copy; 2025 RealEstate Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
