# TalentFlow - Premium Hiring Platform

A modern, full-featured hiring platform built with React, TypeScript, and Tailwind CSS. TalentFlow provides a complete solution for managing job postings, candidate applications, and assessment processes with a beautiful, premium UI inspired by Linear, Superhuman, and Notion.

## ✨ Features

### 🎯 Core Functionality
- **Job Management**: Create, edit, archive, and manage job postings with drag-and-drop reordering
- **Candidate Pipeline**: Track candidates through multiple stages with a beautiful kanban board
- **Assessment Builder**: Create custom assessments with various question types and conditional logic
- **Real-time Search**: Fast, client-side search across all modules
- **Responsive Design**: Fully responsive interface that works on all devices

### 🎨 Premium UI/UX
- **Midnight Blue Theme**: Sophisticated color palette with elegant gradients
- **Smooth Animations**: Framer Motion powered animations for a premium feel
- **Glass Morphism**: Modern glass effects and backdrop blur
- **Micro-interactions**: Subtle hover effects and transitions
- **Loading States**: Beautiful skeleton loaders and loading indicators

### 🚀 Technical Features
- **TypeScript**: Full type safety throughout the application
- **MSW Integration**: Mock Service Worker for API simulation
- **IndexedDB Persistence**: Local data storage with Dexie
- **Drag & Drop**: Intuitive drag-and-drop for job reordering and candidate management
- **Form Validation**: Comprehensive form validation with error handling
- **Error Boundaries**: Graceful error handling and recovery

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Database**: IndexedDB with Dexie
- **API Mocking**: Mock Service Worker (MSW)
- **Drag & Drop**: @hello-pangea/dnd
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── api/                    # API layer and MSW handlers
│   ├── jobs.ts
│   ├── candidates.ts
│   └── assessments.ts
├── components/             # Reusable UI components
│   ├── jobs/              # Job-specific components
│   ├── candidates/        # Candidate-specific components
│   ├── assessments/       # Assessment-specific components
│   └── ui/               # Shadcn/UI components
├── pages/                 # Page components
│   ├── jobs/             # Job management pages
│   ├── candidates/       # Candidate management pages
│   └── assessments/      # Assessment builder pages
├── lib/                  # Utilities and configuration
│   ├── db.ts            # Database schema and configuration
│   ├── mocks/           # MSW handlers and seed data
│   └── utils.ts         # Utility functions
├── hooks/               # Custom React hooks
└── stores/              # State management (if needed)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd talentflow-hiring
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📱 Available Routes

- `/` - Landing page with hero section and testimonials
- `/jobs` - Job management dashboard
- `/jobs/:id` - Individual job details
- `/candidates` - Candidate management (grid/list view)
- `/candidates/kanban` - Kanban board for candidate pipeline
- `/candidates/:id` - Individual candidate profile
- `/assessments` - Assessment management dashboard
- `/assessments/:jobId` - Assessment builder for specific job

## 🎨 Design System

### Color Palette
- **Primary**: Electric blue (#3B82F6)
- **Background**: Deep navy (#0F172A)
- **Secondary**: Slate blue (#1E3A8A)
- **Muted**: Light slate (#94A3B8)
- **Accent**: Soft blue highlights

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold weights with wide letter spacing
- **Body**: Light weights for readability
- **Line Height**: Optimized for text rendering

### Components
- **Cards**: Elevated with subtle shadows and hover effects
- **Buttons**: Rounded corners with luminous hover glow
- **Forms**: Borderless with glowing focus rings
- **Modals**: Semi-glass effect with smooth animations

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=TalentFlow
```

### Database Configuration
The application uses IndexedDB for local storage. The database schema is defined in `src/lib/db.ts` and includes:

- **Jobs**: Job postings with metadata
- **Candidates**: Candidate information and pipeline status
- **Assessments**: Assessment forms and questions
- **Timeline**: Candidate activity history
- **Responses**: Assessment responses

### MSW Configuration
Mock Service Worker is configured to simulate API endpoints. Handlers are defined in `src/lib/mocks/handlers.ts` and include:

- CRUD operations for all entities
- Search and filtering
- Pagination
- Error simulation (10% error rate)
- Network delay simulation (200-1200ms)

## 📊 Data Seeding

The application includes comprehensive seed data:

- **25 Job Postings**: Various roles and industries
- **1000 Candidates**: Realistic names, emails, and profiles
- **Timeline Events**: Candidate activity history
- **Sample Assessments**: Pre-built assessment forms

To seed the database, the application automatically initializes data on first load.

## 🎯 Key Features Deep Dive

### Job Management
- **CRUD Operations**: Full create, read, update, delete functionality
- **Drag & Drop Reordering**: Intuitive job list management
- **Search & Filtering**: Real-time search with status filtering
- **Pagination**: Efficient handling of large job lists
- **Archive System**: Soft delete with archive/restore functionality

### Candidate Pipeline
- **Multi-stage Tracking**: Applied → Screening → Technical → Offer → Hired/Rejected
- **Kanban Board**: Visual pipeline management with drag-and-drop
- **Search & Filtering**: Advanced search across all candidate data
- **Profile Management**: Detailed candidate profiles with skills and notes
- **Timeline Tracking**: Complete activity history for each candidate

### Assessment Builder
- **Question Types**: Single choice, multiple choice, text, numeric, file upload
- **Conditional Logic**: Show/hide questions based on previous answers
- **Validation Rules**: Min/max length, numeric ranges, required fields
- **Live Preview**: Real-time preview of assessment forms
- **Section Organization**: Organize questions into logical sections

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of route components
- **Virtual Scrolling**: Efficient rendering of large candidate lists
- **Memoization**: React.memo and useMemo for expensive operations
- **Image Optimization**: Optimized avatar and asset loading
- **Bundle Analysis**: Optimized bundle size with tree shaking

## 🧪 Testing

The application includes comprehensive testing setup:

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any static hosting platform:
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Linear, Superhuman, Notion
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database**: Dexie (IndexedDB wrapper)



**TalentFlow** - Elevating the hiring experience with modern technology and beautiful design. 🚀