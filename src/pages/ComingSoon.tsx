import { Clock } from 'lucide-react';
import { EmptyState } from '@/components/ui/States';

export function ComingSoon() {
  return (
    <EmptyState
      icon={Clock}
      title="Coming soon"
      message="This feature isn't available yet. We'll let you know when it is."
    />
  );
}
