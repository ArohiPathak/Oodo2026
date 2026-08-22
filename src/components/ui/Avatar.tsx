import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className = '',
}) => {
  const getInitials = (nameStr: string) => {
    const parts = nameStr.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  };

  const getPastelColor = (nameStr: string) => {
    const colors = [
      { bg: 'bg-[#E8F0FE]', text: 'text-[#1A73E8]' }, // soft blue
      { bg: 'bg-[#FCE8E6]', text: 'text-[#C5221F]' }, // soft red
      { bg: 'bg-[#E6F4EA]', text: 'text-[#137333]' }, // soft green
      { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]' }, // soft yellow
      { bg: 'bg-[#F3E8FF]', text: 'text-[#7C7FF2]' }, // soft purple
      { bg: 'bg-[#E0F7FA]', text: 'text-[#00838F]' }, // soft cyan
      { bg: 'bg-[#FCE4EC]', text: 'text-[#C2185B]' }, // soft pink
    ];
    let hash = 0;
    for (let i = 0; i < nameStr.length; i++) {
      hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs font-semibold',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-16 h-16 text-lg font-bold',
    xl: 'w-24 h-24 text-2xl font-bold',
  };

  const colorSet = getPastelColor(name);

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${colorSet.bg} ${colorSet.text}`}>
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};
