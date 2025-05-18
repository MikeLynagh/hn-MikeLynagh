import { PostList } from "./components/PostList";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <PostList />
      <Footer />
    </div>
  )
}

export default App
