import React from 'react';

/**
 * Universal Avatar Component
 * Shows profile image if available, otherwise displays initials
 * 
 * @param {string} name - User's full name (for generating initials)
 * @param {string} image - URL of profile image (optional)
 * @param {string} size - Size variant: 'xs', 'sm', 'md', 'lg', 'xl'
 * @param {string} shape - Shape variant: 'circle', 'rounded', 'square'
 * @param {string} className - Additional CSS classes
 */
export function UserAvatar({ 
  name = "User", 
  image = null, 
  size = "md",
  shape = "rounded",
  className = ""
}) {
  // Generate initials from name
  const getInitials = (fullName) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const initials = getInitials(name);

  // Size variants
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
    "2xl": "h-24 w-24 text-2xl",
    "3xl": "h-32 w-32 text-3xl"
  };

  // Shape variants
  const shapeClasses = {
    circle: "rounded-full",
    rounded: "rounded-xl",
    square: "rounded-md"
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${shapeClasses[shape]}
        bg-gradient-to-br from-blue-500 to-indigo-600 
        text-white font-semibold 
        flex items-center justify-center 
        shadow-sm overflow-hidden
        ${className}
      `}
    >
      {image ? (
        <img 
          src={image} 
          alt={name} 
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

// Export with backward compatible name
export default UserAvatar;
