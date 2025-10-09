import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface MentionsRendererProps {
  text: string;
  users?: User[];
  className?: string;
}

// Default users for mentions
const defaultUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@company.com', role: 'HR Manager' },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'Recruiter' },
  { id: '3', name: 'Mike Johnson', email: 'mike@company.com', role: 'Technical Lead' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Hiring Manager' },
  { id: '5', name: 'David Brown', email: 'david@company.com', role: 'Team Lead' },
];

export function MentionsRenderer({ 
  text, 
  users = defaultUsers, 
  className = '' 
}: MentionsRendererProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderTextWithMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Find user by name
      const userName = match[1];
      const user = users.find(u => u.name.toLowerCase() === userName.toLowerCase());
      
      if (user) {
        parts.push(
          <span
            key={match.index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-white rounded-md text-sm font-medium"
          >
            <Avatar className="h-4 w-4">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-primary/20 text-white text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            @{user.name}
          </span>
        );
      } else {
        parts.push(
          <span
            key={match.index}
            className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-md text-sm"
          >
            @{match[1]}
          </span>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  };

  return (
    <div className={`text-sm leading-relaxed ${className}`}>
      {renderTextWithMentions(text)}
    </div>
  );
}