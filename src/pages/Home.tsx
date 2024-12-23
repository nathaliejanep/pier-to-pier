const Home: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-semibold mb-6">Welcome to Pier2Pier</h1>
          <p className="text-xl mb-8">
            Connecting logistics and supply chain with blockchain technology for seamless, secure,
            and transparent operations.
          </p>
          <button
            // href="#getstarted"
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-gray-900 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Blockchain Security</h3>
              <p className="text-gray-600">
                All transactions are secured with blockchain technology, ensuring transparency and
                trust.
              </p>
            </div>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Seamless Integration</h3>
              <p className="text-gray-600">
                Easily integrates with your existing logistics and supply chain systems for smooth
                operations.
              </p>
            </div>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Track shipments in real-time with our intuitive and user-friendly interface.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">About Pier2Pier</h2>
          <p className="text-xl text-gray-700 mb-6">
            Pier2Pier is revolutionizing the logistics and supply chain industry by using blockchain
            technology. We provide a seamless and secure way to manage supply chain processes,
            improving transparency, efficiency, and trust.
          </p>
          <a
            href="#getstarted"
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
