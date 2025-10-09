# 🔧 Technical Documentation

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  React Components  │  State Management  │  UI Components       │
│  • Pages           │  • React Query     │  • shadcn/ui         │
│  • Hooks           │  • Context API     │  • Tailwind CSS      │
│  • Providers       │  • Local Storage   │  • Framer Motion     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  API Client        │  MSW Handlers      │  Mock Database       │
│  • HTTP Client     │  • Request Mocking │  • In-Memory Store   │
│  • Error Handling  │  • Response Mocking│  • Data Generation   │
│  • Type Safety     │  • Network Delays  │  • 1000+ Records     │
└─────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── ThemeProvider
├── QueryClient
├── ErrorBoundary
├── PremiumNavigation
├── Routes
│   ├── Index (Landing Page)
│   ├── Jobs
│   │   └── JobsBoard
│   ├── Candidates
│   │   ├── CandidatesBoard
│   │   ├── CandidatesKanban
│   │   └── CandidateDetail
│   └── Assessments
│       ├── AssessmentsList
│       └── AssessmentBuilder
└── Modals
    ├── CandidateFormModal
    ├── JobFormModal
    └── AssessmentPreview
```

## Data Flow Architecture

### 1. Candidate Management Flow

```typescript
// Data Flow: Candidate List
User Action → Component → Hook → React Query → API Client → MSW → Mock DB → Response → UI Update

// Example Implementation
const CandidatesKanban = () => {
  const { data, isLoading, error } = useCandidates({
    search,
    stage,
    page,
    pageSize: 1200
  });
  
  const candidates = data?.data || [];
  const stageCounts = useMemo(() => {
    // Calculate counts from candidates
  }, [candidates]);
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* Kanban Board */}
    </DragDropContext>
  );
};
```

### 2. Assessment Builder Flow

```typescript
// Data Flow: Assessment Creation
User Input → Form State → Local Storage → Preview Component → Validation → Save

// Example Implementation
const AssessmentBuilder = () => {
  const { assessment, updateAssessment } = useAssessmentPersistence(jobId);
  
  const handleSave = useCallback(() => {
    updateAssessment(assessment);
    // Persist to local storage
  }, [assessment, updateAssessment]);
  
  return (
    <div className="grid grid-cols-2 gap-6">
      <AssessmentForm />
      <AssessmentPreview assessment={assessment} />
    </div>
  );
};
```

## Performance Optimizations

### 1. React Query Configuration

```typescript
// Optimized Query Configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000,        // 5 minutes
      gcTime: 600000,           // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnReconnect: false,
    },
  },
});
```

### 2. Component Memoization

```typescript
// Memoized Components for Performance
const CandidateCard = memo(({ candidate, onEdit, onMove }) => {
  // Component implementation
});

const StageColumn = memo(({ stage, candidates }) => {
  // Column implementation
});
```

### 3. Virtual Scrolling (Future Enhancement)

```typescript
// Virtual Scrolling for Large Lists
const VirtualizedCandidateList = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 10,
  });

  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <CandidateCard candidate={candidates[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

## State Management Strategy

### 1. Server State (React Query)

```typescript
// Server State Management
export const useCandidates = (params) => {
  return useQuery({
    queryKey: candidatesKeys.list(params),
    queryFn: () => candidatesApi.getCandidates(params),
    // Optimized configuration
  });
};

export const useCreateCandidate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: candidatesApi.createCandidate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: candidatesKeys.lists() });
    },
  });
};
```

### 2. Client State (React Context)

```typescript
// Client State Management
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system');
  
  const value = useMemo(() => ({
    theme,
    setTheme,
    isDark: theme === 'dark' || (theme === 'system' && systemTheme === 'dark'),
  }), [theme, systemTheme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 3. Local Persistence

```typescript
// Local Storage Persistence
export const useAssessmentPersistence = (jobId) => {
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const saved = localStorage.getItem(`assessment-${jobId}`);
    if (saved) {
      setAssessment(JSON.parse(saved));
    }
    setIsLoading(false);
  }, [jobId]);
  
  const updateAssessment = useCallback((newAssessment) => {
    setAssessment(newAssessment);
    localStorage.setItem(`assessment-${jobId}`, JSON.stringify(newAssessment));
  }, [jobId]);
  
  return { assessment, updateAssessment, isLoading };
};
```

## API Design

### 1. RESTful API Structure

```typescript
// API Endpoints
const API_ENDPOINTS = {
  // Candidates
  GET_CANDIDATES: '/api/candidates',
  CREATE_CANDIDATE: '/api/candidates',
  UPDATE_CANDIDATE: '/api/candidates/:id',
  GET_CANDIDATE_TIMELINE: '/api/candidates/:id/timeline',
  
  // Jobs
  GET_JOBS: '/api/jobs',
  CREATE_JOB: '/api/jobs',
  UPDATE_JOB: '/api/jobs/:id',
  DELETE_JOB: '/api/jobs/:id',
  
  // Assessments
  GET_ASSESSMENT: '/api/assessments/:jobId',
  SAVE_ASSESSMENT: '/api/assessments/:jobId',
  SUBMIT_ASSESSMENT: '/api/assessments/:jobId/submit',
};
```

### 2. Request/Response Types

```typescript
// Type Definitions
interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  jobId: string;
  phone?: string;
  experience?: string;
  skills?: string[];
  source?: string;
  rating?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

interface Assessment {
  id: string;
  jobId: string;
  title: string;
  sections: AssessmentSection[];
  createdAt: number;
  updatedAt: number;
}

interface AssessmentSection {
  id: string;
  title: string;
  questions: Question[];
}

interface Question {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';
  text: string;
  options?: string[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  conditionalOn?: {
    questionId: string;
    value: any;
  };
}
```

## Security Considerations

### 1. Input Validation

```typescript
// Client-side Validation
const validateCandidate = (candidate: Partial<Candidate>) => {
  const errors: Record<string, string> = {};
  
  if (!candidate.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!candidate.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate.email)) {
    errors.email = 'Invalid email format';
  }
  
  return errors;
};
```

### 2. XSS Prevention

```typescript
// Safe HTML Rendering
const MentionsRenderer = ({ text }: { text: string }) => {
  const parseMentions = (text: string) => {
    return text.replace(/@(\w+)/g, (match, username) => {
      return `<span class="mention" data-user="${escapeHtml(username)}">${match}</span>`;
    });
  };
  
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: parseMentions(escapeHtml(text)) 
      }} 
    />
  );
};
```

## Testing Strategy

### 1. Unit Tests

```typescript
// Component Testing
describe('CandidateCard', () => {
  it('renders candidate information correctly', () => {
    const candidate = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      stage: 'applied',
      jobId: 'job-1',
    };
    
    render(<CandidateCard candidate={candidate} onEdit={jest.fn()} onMove={jest.fn()} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

### 2. Integration Tests

```typescript
// API Integration Testing
describe('Candidate API', () => {
  it('fetches candidates successfully', async () => {
    const mockCandidates = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
    ];
    
    server.use(
      http.get('/api/candidates', () => {
        return HttpResponse.json({ data: mockCandidates });
      })
    );
    
    const { result } = renderHook(() => useCandidates());
    
    await waitFor(() => {
      expect(result.current.data?.data).toEqual(mockCandidates);
    });
  });
});
```

## Deployment Architecture

### 1. Build Process

```typescript
// Vite Configuration
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          motion: ['framer-motion'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    port: 8081,
    host: true,
  },
});
```

### 2. Environment Configuration

```bash
# Production Environment
NODE_ENV=production
VITE_API_BASE_URL=https://api.talentflow.com
VITE_APP_NAME=TalentFlow
VITE_APP_VERSION=1.0.0
VITE_VERCEL_URL=https://talentflow-hiring.vercel.app
```

## Monitoring and Analytics

### 1. Performance Monitoring

```typescript
// Performance Tracking
const trackPerformance = (componentName: string, duration: number) => {
  if (process.env.NODE_ENV === 'production') {
    analytics.track('component_render', {
      component: componentName,
      duration,
      timestamp: Date.now(),
    });
  }
};
```

### 2. Error Tracking

```typescript
// Error Boundary with Tracking
class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'production') {
      errorTracker.captureException(error, {
        extra: errorInfo,
        tags: { component: 'ErrorBoundary' },
      });
    }
  }
}
```

## Future Enhancements

### 1. Planned Features

- [ ] **Real-time Collaboration** - WebSocket integration for live updates
- [ ] **Advanced Analytics** - Hiring metrics and insights dashboard
- [ ] **AI-Powered Matching** - Machine learning for candidate-job matching
- [ ] **Video Interviews** - Integrated video calling functionality
- [ ] **Mobile App** - React Native mobile application
- [ ] **Enterprise SSO** - Single sign-on integration
- [ ] **Advanced Reporting** - Custom report builder
- [ ] **Workflow Automation** - Automated hiring workflows

### 2. Technical Improvements

- [ ] **Microservices Architecture** - Break down into smaller services
- [ ] **GraphQL API** - More efficient data fetching
- [ ] **Real Database** - PostgreSQL with Prisma ORM
- [ ] **Redis Caching** - Distributed caching layer
- [ ] **CDN Integration** - Global content delivery
- [ ] **Progressive Web App** - Offline functionality
- [ ] **WebAssembly** - Performance-critical operations
- [ ] **Edge Computing** - Vercel Edge Functions

---

This technical documentation provides a comprehensive overview of the TalentFlow Hiring Platform's architecture, implementation details, and future roadmap.
