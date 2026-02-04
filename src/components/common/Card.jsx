import { forwardRef } from 'react';

export const Card = forwardRef(function Card(
  {
    children,
    className = '',
    padding = 'md',
    borderColor,
    onClick,
    hoverable = false,
    ...props
  },
  ref
) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm
        ${paddingClasses[padding]}
        ${borderColor ? `border-l-4` : ''}
        ${hoverable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={borderColor ? { borderLeftColor: borderColor } : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`font-semibold text-charcoal ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-charcoal/60 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default Card;
