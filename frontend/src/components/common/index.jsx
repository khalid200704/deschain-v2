import React from 'react'

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-navy-900 text-white hover:bg-navy-500',
    secondary: 'bg-ice-100 text-navy-900 hover:bg-ice-200',
    gold: 'bg-gold-500 text-white hover:bg-gold-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }
  
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}

export const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`} {...props}>
    {children}
  </div>
)

export const Input = React.forwardRef(({ 
  label, 
  error, 
  type = 'text', 
  className = '',
  ...props 
}, ref) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-navy-900 mb-2">{label}</label>}
    <input
      ref={ref}
      type={type}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-500 ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
))

export const Spinner = ({ size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'
  return (
    <div className={`${sizeClass} border-4 border-gray-300 border-t-gold-500 rounded-full animate-spin`}></div>
  )
}

export const Badge = ({ children, variant = 'blue', className = '' }) => {
  const variants = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
