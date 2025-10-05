# TalentFlow - Mini Hiring Platform

A comprehensive React-based hiring management platform built according to technical specifications.

## 🚀 Features Implemented

### 1. Jobs Management
- ✅ Paginated job listings with server-like filtering (title, status, tags)
- ✅ Create/Edit jobs in modal with validation (required title, unique slug)
- ✅ Archive/Unarchive functionality
- ✅ Drag-and-drop reordering with optimistic updates
- ✅ Rollback on failure (simulated 5-10% error rate)
- ✅ Deep linking to jobs via `/jobs/:jobId`

### 2. Candidates Management
- ✅ Virtualized list supporting 1000+ candidates
- ✅ Client-side search (name/email)
- ✅ Server-like filtering by stage
- ✅ Candidate profile with timeline of status changes
- ✅ Kanban board with drag-and-drop between stages
- ✅ Notes with @mentions rendering (local user list)

### 3. Assessments
- ✅ Assessment builder per job
- ✅ Multiple question types:
  - Single-choice
  - Multi-choice
  - Short text
  - Long text
  - Numeric (with range validation)
  - File upload (stub)
- ✅ Live preview pane with fillable form
- ✅ Validation rules (required, numeric range, max length)
- ✅ Conditional questions (show based on previous answers)
- ✅ Local persistence

## 🛠 Technical Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand
- **API Mocking**: MSW (Mock Service Worker)
- **Local Storage**: Dexie (IndexedDB)
- **Drag & Drop**: @dnd-kit
- **Virtual Scrolling**: react-virtual
- **Routing**: React Router v6

## 📦 Data & API

### Simulated REST API Endpoints (via MSW)

```
GET  /api/jobs?search=&status=&page=&pageSize=&sort=
POST /api/jobs
PATCH /api/jobs/:id
PATCH /api/jobs/:id/reorder

GET  /api/candidates?search=&stage=&page=
POST /api/candidates
PATCH /api/candidates/:id
GET  /api/candidates/:id/timeline

GET  /api/assessments/:jobId
PUT  /api/assessments/:jobId
POST /api/assessments/:jobId/submit
```

### Seed Data

- 25 jobs (mixed active/archived)
- 1,000 candidates (randomly distributed across jobs and stages)
- 5 assessments with 10+ questions each
- Artificial latency: 200-1200ms
- Error rate: 5-10% on write operations

### Data Persistence

All data is stored in IndexedDB via Dexie. On page refresh, the application restores from IndexedDB. MSW acts as the network layer but writes through to IndexedDB.

## 🎯 Key Features

### Jobs Board
- **Pagination**: 10 jobs per page
- **Search**: Filter by job title
- **Status Filter**: Active or Archived
- **Drag Reorder**: Reorder jobs with visual feedback
- **Optimistic Updates**: Instant UI feedback with rollback on errors
- **Deep Links**: Direct navigation to specific jobs

### Candidates
- **Virtual Scrolling**: Efficiently render 1000+ candidates
- **Dual Views**: 
  - List view with search and filters
  - Kanban board for visual stage management
- **Timeline**: Full history of stage changes and notes
- **@Mentions**: Render mentions in notes (local user list)

### Assessments
- **Visual Builder**: Drag sections and questions
- **Question Types**: 6 different types with specific validations
- **Conditional Logic**: Show/hide questions based on answers
- **Live Preview**: Real-time preview of assessment form
- **Validation**: Client-side validation with helpful error messages

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Layout.tsx       # Main layout with navigation
│   ├── JobModal.tsx     # Job creation/edit modal
│   └── AssessmentPreview.tsx  # Assessment live preview
├── lib/
│   ├── db.ts           # Dexie database schema
│   ├── seedData.ts     # Database seeding logic
│   ├── utils.ts        # Utility functions
│   └── mocks/
│       ├── browser.ts  # MSW browser setup
│       └── handlers.ts # API request handlers
├── pages/
│   ├── Index.tsx             # Landing page
│   ├── Jobs.tsx              # Jobs listing
│   ├── JobDetail.tsx         # Job details
│   ├── Candidates.tsx        # Candidates list (virtual)
│   ├── CandidateDetail.tsx   # Candidate profile
│   ├── CandidatesKanban.tsx  # Kanban board
│   ├── Assessments.tsx       # Assessments overview
│   └── AssessmentBuilder.tsx # Assessment creation
├── stores/
│   ├── jobStore.ts      # Job state management
│   └── candidateStore.ts # Candidate state management
└── main.tsx            # App entry with MSW initialization
```

## 🎨 Design System

- **Primary Color**: Blue (#3B82F6) - Professional and trustworthy
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's scale
- **Components**: Fully themed shadcn/ui components
- **Responsive**: Mobile-first design approach

## 🚦 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## ✨ Key Implementation Details

### Optimistic Updates with Rollback

Jobs reordering implements optimistic updates:
1. Update UI immediately
2. Make API call
3. If call fails, rollback to previous state
4. Show error toast to user

### Virtual Scrolling

Candidates list uses react-virtual for efficient rendering:
- Only renders visible items + overscan
- Handles 1000+ items smoothly
- Dynamic height calculation

### Conditional Questions

Assessment questions can depend on previous answers:
```typescript
{
  conditionalOn: {
    questionId: 'q-1',
    answer: 'Yes'
  }
}
```

### IndexedDB Persistence

All mutations write to both MSW (for simulation) and IndexedDB (for persistence):
- Jobs, Candidates, Assessments stored locally
- Timeline events tracked
- Assessment responses saved

## 📊 Performance Optimizations

- Virtual scrolling for large lists
- Optimistic UI updates
- Debounced search inputs
- Lazy loading of routes
- Indexed database queries

## 🔒 Data Privacy

All data is stored locally in the browser's IndexedDB. No data is sent to any external servers.

## 🎓 Architecture Decisions

1. **Zustand over Redux**: Simpler API, less boilerplate
2. **MSW over custom mocks**: Industry standard, easy to extend
3. **Dexie over raw IndexedDB**: Better DX, type-safe queries
4. **shadcn/ui over component library**: Customizable, owns the code
5. **@dnd-kit over react-beautiful-dnd**: Better performance, modern API

## 🐛 Known Limitations

- File upload is stubbed (stores filename only)
- @mentions suggestions not implemented (renders mentions only)
- No authentication/authorization
- No real backend integration

## 📝 Future Enhancements

- Real-time collaboration
- Email notifications
- Advanced analytics
- Resume parsing
- Interview scheduling
- Integration with job boards

---

Built with ❤️ using React, TypeScript, and modern web technologies.
