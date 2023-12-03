"use client";
import React, { ReactNode } from "react";

const GradientPosition = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return mousePosition;
};

const Gradient = ({ children, className }) => {
  return (
    <div
      style={{
        backgroundImage: `radial-gradient( circle  at ${
          GradientPosition().x
        }px ${
          GradientPosition().y
        }px, rgba(30,64,175,0.25) 0%, rgba(0,0,0,1) 40%)`,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default Gradient;
