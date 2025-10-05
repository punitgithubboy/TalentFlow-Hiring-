import { useEffect, useRef, useMemo } from 'react';
import { useCandidateStore } from '@/stores/candidateStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users } from 'lucide-react';
import { useVirtual } from 'react-virtual';
import { Link } from 'react-router-dom';
import { Candidate } from '@/lib/db';

const stageColors: Record<Candidate['stage'], string> = {
  applied: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  screen: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  tech: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  offer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  hired: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function Candidates() {
  const {
    candidates,
    isLoading,
    error,
    filters,
    totalPages,
    setFilters,
    fetchCandidates,
  } = useCandidateStore();

  const parentRef = useRef<HTMLDivElement>(null);

  // Virtual scrolling setup
  const rowVirtualizer = useVirtual({
    size: candidates.length,
    parentRef,
    estimateSize: useMemo(() => () => 80, []),
    overscan: 10,
  });

  useEffect(() => {
    fetchCandidates();
  }, [filters, fetchCandidates]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track candidate applications ({candidates.length.toLocaleString()} total)
          </p>
        </div>
        <Link to="/candidates/kanban">
          <Button variant="outline">Kanban View</Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
              className="pl-10"
            />
          </div>

          <Select value={filters.stage || "all"} onValueChange={(value) => setFilters({ stage: value === "all" ? "" : value, page: 1 })}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="screen">Screening</SelectItem>
              <SelectItem value="tech">Technical</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive">
          <p className="text-destructive text-sm">{error}</p>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          <p className="text-muted-foreground mt-4">Loading candidates...</p>
        </div>
      ) : candidates.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No candidates found</h3>
          <p className="text-muted-foreground mt-2">
            {filters.search || filters.stage
              ? 'Try adjusting your filters'
              : 'Candidates will appear here once they apply'}
          </p>
        </Card>
      ) : (
        <>
          <Card className="p-0">
            <div
              ref={parentRef}
              className="h-[600px] overflow-auto"
              style={{ contain: 'strict' }}
            >
              <div
                style={{
                  height: `${rowVirtualizer.totalSize}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.virtualItems.map((virtualRow) => {
                  const candidate = candidates[virtualRow.index];
                  return (
                    <div
                      key={candidate.id}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      <Link to={`/candidates/${candidate.id}`}>
                        <div className="p-4 border-b hover:bg-accent transition-colors cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-foreground truncate">
                                {candidate.name}
                              </h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {candidate.email}
                              </p>
                            </div>
                            <Badge className={stageColors[candidate.stage]}>
                              {candidate.stage}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => setFilters({ page: filters.page - 1 })}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === totalPages}
                onClick={() => setFilters({ page: filters.page + 1 })}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
