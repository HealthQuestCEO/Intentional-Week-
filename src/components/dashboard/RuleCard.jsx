import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card } from '../common/Card';

export function RuleCard({
  rule,
  children,
  status = null,
  progress = null,
  expandedContent,
  defaultExpanded = false,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const Icon = Icons[rule.icon] || Icons.Circle;

  const getStatusDisplay = () => {
    if (status === 'complete') {
      return (
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
          <Check className="w-4 h-4 text-green-600" />
        </div>
      );
    }
    if (progress !== null) {
      return (
        <span className="text-sm font-medium text-charcoal/60">
          {progress}
        </span>
      );
    }
    return null;
  };

  return (
    <Card
      borderColor={rule.color}
      padding="none"
      className="overflow-hidden"
    >
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${rule.color}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: rule.color }} />
        </div>

        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-charcoal/40">
              Rule {rule.number}
            </span>
          </div>
          <h3 className="font-medium text-charcoal">
            {rule.shortName || rule.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {getStatusDisplay()}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-charcoal/40" />
          ) : (
            <ChevronDown className="w-5 h-5 text-charcoal/40" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-100 animate-expand">
          <p className="text-sm text-charcoal/60 mb-4 mt-3">
            {rule.description}
          </p>
          {expandedContent || children}
        </div>
      )}
    </Card>
  );
}

export default RuleCard;
