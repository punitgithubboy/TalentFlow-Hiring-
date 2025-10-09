import { useState, useRef, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface MentionsTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  users?: User[];
}

// Default users for mentions
const defaultUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@company.com', role: 'HR Manager' },
  { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'Recruiter' },
  { id: '3', name: 'Mike Johnson', email: 'mike@company.com', role: 'Technical Lead' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@company.com', role: 'Hiring Manager' },
  { id: '5', name: 'David Brown', email: 'david@company.com', role: 'Team Lead' },
];

export function MentionsTextarea({
  value,
  onChange,
  placeholder = "Add notes... Use @ to mention team members",
  className,
  disabled = false,
  users = defaultUsers,
}: MentionsTextareaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ start: 0, end: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Filter users based on mention query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  // Handle text change
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(newValue);
    setCursorPosition(cursorPos);
    
    // Check for @ mentions
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      const start = cursorPos - mentionMatch[0].length;
      setMentionPosition({ start, end: cursorPos });
      setMentionQuery(mentionMatch[1]);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [onChange]);

  // Handle key down events
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isOpen) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        // Let the command component handle these
        return;
      } else if (e.key === 'Enter' && filteredUsers.length > 0) {
        // Select first user
        handleUserSelect(filteredUsers[0]);
        e.preventDefault();
      }
    }
  }, [isOpen, filteredUsers]);

  // Handle user selection
  const handleUserSelect = useCallback((user: User) => {
    const { start, end } = mentionPosition;
    const beforeMention = value.substring(0, start);
    const afterMention = value.substring(end);
    const mentionText = `@${user.name}`;
    
    const newValue = beforeMention + mentionText + afterMention;
    onChange(newValue);
    
    setIsOpen(false);
    setMentionQuery('');
    
    // Set cursor position after the mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = start + mentionText.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  }, [value, onChange, mentionPosition]);

  // Render text with mentions highlighted
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
            @{user.name}
          </span>
        );
      } else {
        parts.push(match[0]);
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn("min-h-[100px] resize-none", className)}
        disabled={disabled}
      />
      
      {/* Mentions Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="absolute inset-0 pointer-events-none" />
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-0" 
          align="start"
          side="top"
          style={{
            position: 'absolute',
            top: textareaRef.current ? 
              `${textareaRef.current.offsetTop - 200}px` : '0px',
            left: textareaRef.current ? 
              `${textareaRef.current.offsetLeft}px` : '0px',
          }}
        >
          <Command>
            <CommandInput 
              placeholder="Search team members..." 
              value={mentionQuery}
              onValueChange={setMentionQuery}
            />
            <CommandList>
              <CommandEmpty>No team members found.</CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.name}
                    onSelect={() => handleUserSelect(user)}
                    className="flex items-center gap-3 p-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-white text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Preview of text with mentions (optional) */}
      {value && (
        <div className="mt-2 p-3 bg-muted/50 rounded-md">
          <p className="text-xs text-muted-foreground mb-1">Preview:</p>
          <div className="text-sm">
            {renderTextWithMentions(value)}
          </div>
        </div>
      )}
    </div>
  );
}