import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import BlogPage from './blog/pages/BlogPage';
import PostCreation from './blog/pages/PostCreation';
import PostPage from './blog/pages/PostPage';
import CategoryPage from './blog/pages/CategoryPage';
import RequireAuth from './blog/components/RequireAuth';
import BackgroundImage from './background.png'


// Create a wrapper component for protected routes
const ProtectedPostCreation = () => (
  <RequireAuth>
    <PostCreation />
  </RequireAuth>
);

const AppBackground = () => (
  <>
    <div className="app-background">
      <img 
        src={BackgroundImage} 
        alt="Background" 
        className="background-image"
      />
    </div>
    <div className="background-blur"></div>
    <div className="background-overlay"></div>
  </>
);

function App() {
  return (
    <Router>
      <div className="App">
        <AppBackground />
        <Routes>
          {/* Default route redirects to blog */}
          <Route path="/" element={<Navigate to="/blog" replace />} />
          
          {/* Blog page - public */}
          <Route path="/blog" element={<BlogPage />} />

          <Route path="/category/:category" element={<CategoryPage />} />
          
          {/* Mockup Post Page - public */}
          <Route path="/blog/:slug" element={<PostPage />} />
          
          {/* Post creation page - PROTECTED */}
          <Route path="/create" element={<ProtectedPostCreation />} />
          
          {/* Optional: 404 fallback */}
          <Route path="*" element={<Navigate to="/blog" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;