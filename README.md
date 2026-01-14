# Mutant Boi Genius Blog

A full-stack blog platform for creative expression, built with React/TypeScript frontend and Node.js/MongoDB backend. This platform allows "Mutant Boi Genius" to publish zines, essays, and creative works with a modern, aesthetic design.

![Project Structure](https://img.shields.io/badge/Project-Full%20Stack-blue)
![React](https://img.shields.io/badge/React-19.x-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248)

## ✨ Features

### Frontend (React/TypeScript)
- **Modern UI**: Glass-morphism design with blurred background effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Category Navigation**: Side menu with nested categories (Arts, Essays, Resources)
- **Search Functionality**: Real-time search across posts
- **Post Management**: Create, edit, and delete posts with rich text editor
- **Contact System**: Built-in contact form with email integration
- **Authentication**: JWT-based admin login system

### Backend (Node.js/Express/MongoDB)
- **RESTful API**: Complete CRUD operations for posts
- **JWT Authentication**: Secure admin access
- **Email Integration**: Contact form with auto-replies
- **Tag System**: Categorization with aggregator pages
- **File Structure**: Organized MVC architecture

## 🏗️ Project Structure

```
mutant-boi-genius/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth & error handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── utils/          # Helper functions
│   └── server.js           # Entry point
│
├── frontend/               # React/TypeScript frontend
│   ├── src/
│   │   ├── blog/          # Blog-specific components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript interfaces
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
│
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mutant-boi-genius
   ```

2. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB and email settings
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local with your API URL
   npm install
   ```

### Environment Variables

**Backend (.env):**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Frontend (.env.local):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Running Locally

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   # App runs on http://localhost:3000
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API Health Check: http://localhost:5000/api/health

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts (with pagination, category filtering, search)
- `GET /api/posts/:slug` - Get single post by slug
- `POST /api/posts` - Create new post (admin only)
- `PUT /api/posts/:id` - Update post (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)
- `GET /api/posts/categories` - Get all categories with post counts

### Contact
- `POST /api/contact` - Submit contact form

## 🎨 Design Features

### Visual Design
- **Static Background**: 2245 × 1587px centered background image
- **Glass-morphism**: Blurred, semi-transparent containers
- **Responsive Layout**: Adapts to all screen sizes
- **Interactive Side Menu**: Hover-activated nested navigation

### User Experience
- **Real-time Search**: Instant post filtering
- **Category Pages**: Aggregated content by tags
- **Rich Text Editor**: Formatting tools for post creation
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages

## 🔧 Technical Stack

### Frontend
- **React 19** with TypeScript
- **React Router 7** for navigation
- **CSS Modules** for component styling
- **Custom Hooks** for data fetching
- **Fetch API** for HTTP requests

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for email handling
- **Helmet** for security headers

### Development Tools
- **ESLint** for code quality
- **Nodemon** for backend hot reload
- **React DevTools** for debugging
- **MongoDB Atlas** for cloud database

## 🗂️ Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String,
  displayName: String,
  role: String, // 'admin', 'author', 'reader'
  createdAt: Date
}
```

### Post Model
```javascript
{
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  author: ObjectId,
  tags: [{
    name: String,
    type: String // 'design', 'tattoo', 'painting', etc.
  }],
  isPublished: Boolean,
  publishedAt: Date,
  viewCount: Number
}
```

## 🚀 Deployment

### Backend Deployment Options
1. **Railway.app** (Recommended - Free Tier Available)
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

2. **Render.com**
   - Create Web Service
   - Connect GitHub repository
   - Add MongoDB Atlas database

3. **Vercel** (Serverless Functions)
   - Add `vercel.json` configuration
   - Deploy as serverless functions

### Frontend Deployment Options
1. **Vercel** (Recommended for React)
   ```bash
   yarn install -g vercel
   vercel
   ```

2. **Netlify**
   - Connect repository
   - Set build command: `yarn build`
   - Set publish directory: `build`

3. **GitHub Pages**
   ```bash
   yarn build
   yarn deploy
   ```

### Environment Configuration for Production

**Backend Production (.env):**
```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=your_mongodb_connection_string_here

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Admin User (set these initially)
ADMIN_USERNAME=mutantboi
ADMIN_EMAIL=yourboyfriend@email.com
ADMIN_PASSWORD=changeme123

# Email (for contact form)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@mutantboigenius.com
EMAIL_TO=contact@mutantboigenius.com
```

**Frontend Production (.env.production):**
```env
REACT_APP_API_URL=
DONATION_URL=
```

## 🔐 Security Features

- **JWT Authentication**: Token-based admin access
- **Password Hashing**: bcrypt.js for secure password storage
- **CORS Configuration**: Restricted to frontend domain
- **Helmet.js**: Security HTTP headers
- **Input Validation**: Server-side validation
- **Rate Limiting**: (Recommended for production)

## 📱 Admin Features

### Post Management
- Create posts with rich text editor
- Add tags and categories
- Upload featured images
- Schedule publication
- View post statistics

### User Management
- Admin dashboard access
- User role management
- Profile editing

### Content Management
- Category organization
- Tag management
- Content search and filtering

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Add testing framework (jest recommended)
npm test
```

### Frontend Testing
```bash
cd frontend
yarn test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

All content © [Year] Mutant Boi Genius. All rights reserved.

Website created and maintained by [Your Name].

Built with React, TypeScript, and passion.

## 🆘 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check MongoDB connection string
   - Verify all environment variables are set
   - Check port 5000 is not in use

2. **Frontend can't connect to backend**
   - Verify backend is running on port 5000
   - Check CORS configuration in backend
   - Verify REACT_APP_API_URL in frontend .env.local

3. **Authentication issues**
   - Check JWT token in localStorage
   - Verify admin credentials in backend .env
   - Ensure token is sent in Authorization header

4. **Database connection issues**
   - Verify MongoDB Atlas IP whitelist
   - Check network connectivity
   - Verify database user permissions

### Debug Tools

1. **Backend Logs**
   ```bash
   cd backend
   npm run dev
   # Check console for errors
   ```

2. **Frontend DevTools**
   - Open browser DevTools (F12)
   - Check Console and Network tabs
   - Use React DevTools extension

3. **API Testing**
   ```bash
   # Test backend API
   curl http://localhost:5000/api/health
   ```

## 🎯 Future Enhancements

### Planned Features
- [ ] Comment system
- [ ] User subscriptions
- [ ] Newsletter integration
- [ ] Analytics dashboard
- [ ] SEO optimization
- [ ] Dark mode toggle
- [ ] Offline support (PWA)

### Technical Improvements
- [ ] Implement caching layer
- [ ] Add comprehensive testing
- [ ] Improve error logging
- [ ] Add API documentation (Swagger)
- [ ] Implement rate limiting
- [ ] Add monitoring and alerts

## 🙏 Acknowledgments

- Special thanks to all readers and supporters
- Inspired by independent publishing and digital art communities
- Built with open-source technologies

---

**Note**: This project is for personal/educational use. For production deployment, consider adding additional security measures, monitoring, and backup solutions.