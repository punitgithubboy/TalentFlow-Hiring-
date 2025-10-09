import { useRef, useMemo } from 'react';
import { useVirtual } from 'react-virtual';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Candidate } from '@/lib/db';

interface VirtualizedCandidateListProps {
  candidates: Candidate[];
  onCandidateClick?: (candidate: Candidate) => void;
  searchTerm?: string;
}

const stageColors: Record<Candidate['stage'], string> = {
  applied: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
  screen: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
  tech: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
  offer: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
  hired: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
  rejected: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600',
};

const stageLabels: Record<Candidate['stage'], string> = {
  applied: 'Applied',
  screen: 'Screening',
  tech: 'Technical',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
};

export function VirtualizedCandidateList({ 
  candidates, 
  onCandidateClick,
  searchTerm = '' 
}: VirtualizedCandidateListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Filter candidates based on search term
  const filteredCandidates = useMemo(() => {
    if (!searchTerm) return candidates;
    
    const term = searchTerm.toLowerCase();
    return candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(term) ||
      candidate.email.toLowerCase().includes(term)
    );
  }, [candidates, searchTerm]);

  // Virtual scrolling setup
  const rowVirtualizer = useVirtual({
    size: filteredCandidates.length,
    parentRef,
    estimateSize: useMemo(() => () => 80, []),
    overscan: 10,
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto"
      style={{
        contain: 'strict',
      }}
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          const candidate = filteredCandidates[virtualRow.index];
          
          return (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: virtualRow.index * 0.02 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Card 
                className="m-2 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                onClick={() => onCandidateClick?.(candidate)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={candidate.avatar} alt={candidate.name} />
                      <AvatarFallback className="bg-primary/10 text-white font-semibold">
                        {getInitials(candidate.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {candidate.name}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${stageColors[candidate.stage]}`}
                        >
                          {stageLabels[candidate.stage]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {candidate.email}
                      </p>
                      {candidate.phone && (
                        <p className="text-xs text-muted-foreground">
                          {candidate.phone}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(candidate.createdAt).toLocaleDateString()}
                      </p>
                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {candidate.skills.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}