# Task Manager Client Application

A modern, responsive task management web application built with React 19, TypeScript, and Vite. This client application provides an intuitive interface for users to manage their tasks, track project progress, and view analytics in real-time.

## 🚀 Features

- **User Authentication & Authorization**
  - Secure login/register system with JWT tokens
  - Protected routes and user session management
  - Automatic token refresh and authentication state persistence

- **Task Management System**
  - Create, read, update, and delete tasks
  - Task prioritization (low, medium, high)
  - Status tracking (todo, in-progress, completed)
  - Due date management and reminders
  - Real-time task synchronization

- **Dashboard & Analytics**
  - Comprehensive project progress tracking
  - Visual analytics with Chart.js integration
  - Task statistics and performance metrics
  - User activity monitoring

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Dark theme with smooth animations
  - Mobile-first approach with sidebar navigation
  - Interactive components with Framer Motion

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router DOM 7
- **State Management**: React Context + Local Storage
- **Charts**: Chart.js 4.5 + React Chart.js 2
- **Icons**: Heroicons React + React Icons
- **Animations**: Framer Motion 12
- **Blockchain Integration**: Ethers.js 6.11
- **Local Storage**: LocalForage
- **Development Tools**: ESLint 9, TypeScript 5.7

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Git**: For version control

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone [your-repository-url]
cd Task-manager-client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (if needed for custom API endpoints):
```env
VITE_API_URL=https://task-manager-server-three-iota.vercel.app/api
```

### 4. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

### 6. Preview Production Build
```bash
npm run preview
```

## 🏗️ Project Architecture

### Directory Structure
```
src/
├── components/          # Reusable UI components
│   ├── AuthDebug.tsx   # Authentication debugging component
│   ├── FooterSection.tsx
│   ├── Modal.tsx       # Reusable modal component
│   ├── MyProgress.tsx  # Progress tracking component
│   ├── Navbar.tsx      # Navigation component
│   ├── NewsletterSection.tsx
│   ├── PrivateRoute.tsx # Route protection component
│   ├── ProjectAnalytics.tsx # Analytics dashboard
│   ├── ProjectCard.tsx # Project display component
│   ├── Sidebar.tsx     # Main navigation sidebar
│   ├── StatsCard.tsx   # Statistics display
│   ├── TaskDetails.tsx # Task information display
│   ├── TaskForm.tsx    # Task creation/editing form
│   └── TaskList.tsx    # Task listing component
├── pages/              # Main application pages
│   ├── CreateTask.tsx  # Task creation page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Homepage.tsx    # Landing page
│   ├── Login.tsx       # Authentication page
│   ├── Register.tsx    # User registration
│   ├── Tasks.tsx       # Task management page
│   └── UpdateTask.tsx  # Task editing page
├── services/           # API and external services
│   ├── taskService.ts  # Task management API calls
│   └── index.ts        # Service exports
├── config/             # Configuration files
│   └── index.ts        # API endpoints and settings
├── types/              # TypeScript type definitions
│   ├── asset.ts        # Asset-related types
│   └── network.ts      # Network-related types
├── utils/              # Utility functions
│   └── auth.ts         # Authentication utilities
└── assets/             # Static assets
```

### Key Components

- **Authentication System**: JWT-based auth with localStorage persistence
- **Task Service**: RESTful API integration for CRUD operations
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Responsive Layout**: Mobile-first design with collapsible sidebar
- **Real-time Updates**: Live task synchronization with backend

## 💡 Development Approach

### 1. **Architecture Decisions**
- **Component-Based Structure**: Modular components for maintainability and reusability
- **TypeScript Integration**: Full type safety for better development experience and error prevention
- **Context API**: Centralized state management for authentication and user data
- **Service Layer**: Clean separation of concerns with dedicated API service classes

### 2. **UI/UX Design Philosophy**
- **Mobile-First**: Responsive design that works seamlessly across all devices
- **Dark Theme**: Modern aesthetic with excellent readability
- **Smooth Animations**: Framer Motion integration for polished user interactions
- **Accessibility**: Semantic HTML and keyboard navigation support

### 3. **Performance Optimization**
- **Code Splitting**: Lazy loading of route components
- **Efficient Rendering**: React.memo and useMemo for performance-critical components
- **Optimized Builds**: Vite configuration for fast development and production builds
- **Local Storage**: Efficient client-side data persistence

### 4. **Security Implementation**
- **JWT Authentication**: Secure token-based authentication system
- **Route Protection**: Automatic redirect for unauthorized access
- **Input Validation**: Client-side validation with TypeScript interfaces
- **Secure API Calls**: Authenticated requests with proper headers

## ⏱️ Development Timeline

**Total Development Time: Approximately 6+ hours**


## 🚀 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## 🔌 API Integration

The application integrates with a backend API hosted on Vercel:
- **Base URL**: `https://task-manager-server-three-iota.vercel.app/api`
- **Authentication**: JWT-based with refresh token support
- **Endpoints**: Tasks, Events, and User management APIs
- **Real-time**: WebSocket-like updates for live data synchronization

## 🌟 Key Features Implementation

### Authentication Flow
- Secure login/registration with JWT tokens
- Automatic token refresh and session management
- Protected route implementation with automatic redirects
- Local storage persistence for offline capability

### Task Management
- Full CRUD operations with real-time updates
- Priority and status management
- Due date tracking and reminders
- Search and filtering capabilities

### Dashboard Analytics
- Chart.js integration for visual data representation
- Real-time progress tracking
- Performance metrics and statistics
- User activity monitoring

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the existing issues in the repository
- Create a new issue with detailed description
- Contact the development team

---

**Built with ❤️ using React 19, TypeScript, and Vite**