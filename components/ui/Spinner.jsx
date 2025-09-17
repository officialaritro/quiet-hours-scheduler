export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizes[size]} ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
