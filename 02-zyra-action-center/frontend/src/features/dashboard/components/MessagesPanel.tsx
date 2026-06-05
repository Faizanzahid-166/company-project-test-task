import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Message } from '@/types';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { formatDate, getInitials } from '@/lib/utils';

interface MessagesPanelProps {
  messages: Message[];
  isOpen: boolean;
  onToggle: () => void;
}

function MessageItem({ message }: { message: Message }) {
  const parts = message.senderName.split(' ');
  const initials = getInitials(parts[0], parts[1] ?? parts[0]);

  return (
    <div className="flex gap-3 py-3 border-b border-subtle last:border-0">
      <div
        className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500
          flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        aria-hidden="true"
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-primary truncate">{message.senderName}</p>
          <span className="text-xs text-secondary flex-shrink-0">{formatDate(message.createdAt)}</span>
        </div>
        <p className="text-sm text-secondary mt-0.5 line-clamp-2">{message.content}</p>
      </div>
    </div>
  );
}

export function MessagesPanel({ messages, isOpen, onToggle }: MessagesPanelProps) {
  return (
    <Card>
      <CardHeader>
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full focus:outline-none focus:ring-2 focus:ring-brand-500 rounded"
          aria-expanded={isOpen}
          aria-controls="messages-list"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-brand-500" aria-hidden="true" />
            <h3 className="font-display font-semibold text-primary">Unread Messages</h3>
            <span
              className="bg-brand-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
              aria-label={`${messages.length} unread messages`}
            >
              {messages.length}
            </span>
          </div>
          {isOpen
            ? <ChevronUp className="w-4 h-4 text-secondary" aria-hidden="true" />
            : <ChevronDown className="w-4 h-4 text-secondary" aria-hidden="true" />
          }
        </button>
      </CardHeader>

      {isOpen && (
        <CardBody>
          <div id="messages-list">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" aria-hidden="true" />
              <p className="text-sm text-secondary">No unread messages</p>
            </div>
          ) : (
            <div role="list" aria-label="Unread messages">
              {messages.map((msg) => (
                <div role="listitem" key={msg.id}>
                  <MessageItem message={msg} />
                </div>
              ))}
            </div>
          )}
          </div>
        </CardBody>
      )}
    </Card>
  );
}
