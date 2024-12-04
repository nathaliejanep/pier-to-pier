const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-blue-600 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-lg">© 2024 Pier2Pier. All Rights Reserved.</p>
        <div className="mt-4">
          <a href="#" className="hover:text-blue-200 mx-3">
            Facebook
          </a>
          <a href="#" className="hover:text-blue-200 mx-3">
            Twitter
          </a>
          <a href="#" className="hover:text-blue-200 mx-3">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
