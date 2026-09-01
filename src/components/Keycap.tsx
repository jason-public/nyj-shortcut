import React from 'react';

interface KeycapProps {
  keys: string[];
  size?: 'sm' | 'md' | 'lg';
  accent?: boolean;
}

export const Keycap: React.FC<KeycapProps> = ({ keys, size = 'md', accent = false }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-1.5 py-0.5 min-w-[1.4rem]',
    md: 'text-xs sm:text-sm px-2 py-0.5 min-w-[1.8rem]',
    lg: 'text-sm sm:text-base px-3 py-1 min-w-[2.2rem]'
  };

  return (
    <div className="inline-flex items-center flex-wrap gap-1.5">
      {keys.map((key, index) => {
        const isSeparator = key === '+' || key === '/' || key === '또는' || key === '→';
        
        if (isSeparator) {
          return (
            <span key={index} className="text-slate-400 font-semibold text-xs px-0.5">
              {key}
            </span>
          );
        }

        return (
          <React.Fragment key={index}>
            <kbd
              className={`shortcut-key ${accent ? 'kbd-key-accent' : ''} ${sizeClasses[size]}`}
            >
              {key}
            </kbd>
            {index < keys.length - 1 && !isSeparator && keys[index + 1] !== '+' && keys[index + 1] !== '또는' && keys[index + 1] !== '/' && (
              <span className="text-slate-400 font-medium text-xs">+</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

