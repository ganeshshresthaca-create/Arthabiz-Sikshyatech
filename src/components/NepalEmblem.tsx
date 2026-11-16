import React from 'react';

interface Props {
  className?: string;
  size?: number | string;
  title?: string;
}

/**
 * Official National Emblem of Nepal (नेपालको निशान छाप)
 * High-resolution official insignia fitting the official uploaded emblem.
 */
export const NepalEmblem: React.FC<Props> = ({
  className = 'w-16 h-16',
  size,
  title = 'नेपालको निशान छाप (Official Emblem of Nepal)',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <img
      src="/src/assets/images/nepal_official_emblem_1790913143506.jpg"
      alt={title}
      className={`object-contain select-none shrink-0 ${className}`}
      style={style}
      referrerPolicy="no-referrer"
    />
  );
};
