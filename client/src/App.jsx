import { Routes, Route, Outlet, useParams } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/sidebar";
import NewsCarousel from "./components/newscarousel";
import NewsFeed from "./components/NewsFeed";
import { ThemeProvider } from "./components/ThemeProvider";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
    <Routes>
      <Route element={<MainLayout />}>
        {/* Home route with all news */}
        <Route
          path="/"
          element={
            <>
              <NewsCarousel selectedCategory="all" />
              <NewsFeed selectedCategory="all" />
            </>
          }
        />
        {/* Dynamic route for category */}
        <Route path="/:category" element={<CategoryPage />} />
      </Route>
    </Routes>
    </ThemeProvider>
  );
}

// Layout with Header, Sidebar and Main Outlet
const MainLayout = () => (
  <>
    <Header />
    
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </>
);

// Carousel + Feed for selected category
const CategoryPage = () => {
  const { category } = useParams();
  const selected = category || "all";

  return (
    <>
      <NewsCarousel selectedCategory={selected} />
      <NewsFeed selectedCategory={selected} />
    </>
  );
};

export default App;
