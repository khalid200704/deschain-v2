export const Spinner = ({ size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'
  return (
    <div className={`${sizeClass} border-4 border-gray-300 border-t-gold-500 rounded-full animate-spin`}></div>
  )
}
