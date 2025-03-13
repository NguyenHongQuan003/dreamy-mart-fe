import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Content sẽ được thêm sau */}
        Trang chủ
      </main>
      <Footer />
    </div>
  );
};

export default Home;
