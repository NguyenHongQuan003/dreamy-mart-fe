import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import { useAuth } from "../utils/authUtils";

const Home = () => {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Content sẽ được thêm sau */}
        Trang chủ
        <div>
          {user ? (
            <>
              <h2>Xin chào, {user.fullname}</h2>
              <button onClick={signOut}>Đăng xuất</button>
            </>
          ) : (
            <p>Vui lòng đăng nhập</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
