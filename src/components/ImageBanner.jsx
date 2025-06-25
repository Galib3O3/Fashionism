import React from 'react';

function ImageBanner({ src, alt, linkTo = '#' }) {
  return (
    <div className="w-full my-8 md:my-12"> {/* Vertical spacing */}
      <a href={linkTo} target="_blank" rel="noopener noreferrer" className="block w-full overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105"
        />
      </a>
    </div>
  );
}

export default ImageBanner;