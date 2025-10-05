# TalentFlow - Hiring Platform

A modern hiring platform built with React, TypeScript, and Vite for managing jobs, tracking candidates, and creating assessments.

## Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd talentflow-hiring

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Open http://localhost:8081
```

**Note**: Using `--legacy-peer-deps` due to React version conflicts with `react-virtual` library.

## Architecture

### Tech Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** + **shadcn/ui** for styling
- **Zustand** for state management
- **React Router v6** for routing
- **@dnd-kit** for drag & drop
- **MSW** for API mocking

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main layout
│   ├── JobModal.tsx    # Job creation/editing
│   └── AssessmentPreview.tsx
├── pages/              # Route components
│   ├── Jobs.tsx        # Job management
│   ├── Candidates.tsx  # Candidate listing
│   ├── CandidatesKanban.tsx  # Kanban view
│   └── AssessmentBuilder.tsx
├── stores/             # Zustand stores
│   ├── jobStore.ts     # Job state
│   └── candidateStore.ts
├── lib/                # Utilities
│   ├── db.ts          # Mock database
│   ├── utils.ts       # Helper functions
│   └── mocks/         # MSW handlers
└── hooks/             # Custom hooks
```

### State Management
```typescript
// Example store structure
export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  isLoading: false,
  filters: { status: 'all', search: '' },
  
  fetchJobs: async () => {
    set({ isLoading: true });
    try {
      const jobs = await jobApi.getAll();
      set({ jobs, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  }
}));
```

## Issues

### Current Issues
1. **React Version Conflicts**
   - `react-virtual` requires React 17, using React 18
   - **Workaround**: `--legacy-peer-deps` flag
   - **Fix**: Migrate to `@tanstack/react-virtual`

2. **TypeScript Strict Mode**
   - Some `any` types in mock data
   - **Impact**: Reduced type safety
   - **Priority**: Medium

3. **Performance**
   - Large candidate lists need virtualization
   - **Current**: Basic pagination
   - **Future**: Virtual scrolling for 1000+ items

4. **Error Handling**
   - Basic error states, no retry mechanisms
   - **Missing**: Network error recovery

## Technical Decisions

### Vite over Create React App
- **Reason**: 10x faster hot reload, smaller bundles, better TypeScript support
- **Trade-off**: Newer ecosystem, less documentation

### Zustand over Redux
- **Reason**: 90% less boilerplate, better TypeScript inference, easier learning curve
- **Trade-off**: Smaller community, fewer middleware options

### shadcn/ui over Material-UI
- **Reason**: Full customization control, smaller bundle size, Tailwind integration
- **Trade-off**: More setup required, less pre-built components

### MSW for API Mocking
- **Reason**: Intercepts real network requests, works in tests, realistic development
- **Trade-off**: Additional setup complexity

### TypeScript Integration
- **Reason**: Type safety, better developer experience, industry standard
- **Trade-off**: Learning curve, additional build step
