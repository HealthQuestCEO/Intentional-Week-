import { forwardRef } from 'react';

const variants = {
  primary: 'bg-balanced-teal text-white hover:bg-balanced-teal/90',
  secondary: 'bg-white text-charcoal border border-gray-200 hover:bg-gray-50',
  ghost: 'text-charcoal hover:bg-gray-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors focus:outline-none focus:ring-2 focus:ring-balanced-teal focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
});

export default Button;
