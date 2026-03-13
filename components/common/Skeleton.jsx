import React from "react";

const Skeleton = ({ className = "", variant = "rect" }) => {
  const baseStyles = "animate-pulse bg-gray-200 dark:bg-gray-800";
  
  const variantStyles = {
    rect: "rounded-md",
    circle: "rounded-full",
    text: "rounded h-4 w-full",
  };

  return <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} />;
};

export default Skeleton;
