const Home: React.FC = () => {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="bg-[#020515] py-20 text-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center w-[600px]">
          <h1 className="text-5xl font-semibold mb-6">Pier2Pier</h1>
          <p className="text-xl mb-8">
            Connecting logistics and supply chain with blockchain technology for seamless, secure,
            and transparent operations.
          </p>
          <a
            href="#getstarted"
            className="bg-[#436c93] text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="bg-gray-300 py-20 text-gray-900">
        <div className="max-w-7xl mx-auto text-center px-6 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className=" p-8 shadow-2xl rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Blockchain Security</h3>
              <p>
                All transactions are secured with blockchain technology, ensuring transparency and
                trust.
              </p>
            </div>
            <div className=" p-8 shadow-2xl rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Seamless Integration</h3>
              <p>
                Easily integrates with your existing logistics and supply chain systems for smooth
                operations.
              </p>
            </div>
            <div className="p-8 shadow-2xl rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-Time Tracking</h3>
              <p>Track shipments in real-time with our intuitive and user-friendly interface.</p>
            </div>
            <div className="p-8 shadow-2xl rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Supply Chain</h3>
              <p>Secure supply chain management with transparent records.</p>
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
            className="bg-[#436c93] text-white py-3 px-6 rounded-md hover:bg-blue-700"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
