// src/components/FeatureCard.jsx
import React from 'react';

function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-gray-700", // Default color for the icon
  titleColor = "text-gray-900",    // Default color for the title
  descriptionColor = "text-gray-700", // Default color for the description
  bgColor = "bg-gray-50",          // Default background color for the card
  shadow = "shadow-md",            // Default shadow for the card
  borderColor = "border-gray-200"  // Default border color for the card
}) {
  return (
    <div className={`${bgColor} ${shadow} ${borderColor} border p-8 rounded-lg text-center transition-transform transform hover:scale-105 duration-300 ease-in-out`}>
      {/*
        Updated: Using flexbox (flex justify-center items-center) to center the icon.
        The 'mx-auto' is removed as it's typically for centering the block itself
        within its parent if it has a defined width. Flexbox 'justify-center'
        is for centering content horizontally within the flex container.
      */}
      <div className={`text-5xl mb-4 flex justify-center items-center ${iconColor}`}>
        {Icon && <Icon />} {/* Render the icon if it exists */}
      </div>
      <h3 className={`text-2xl font-bold mb-3 ${titleColor}`}>{title}</h3>
      <p className={`text-lg ${descriptionColor}`}>{description}</p>
    </div>
  );
}

export default FeatureCard;