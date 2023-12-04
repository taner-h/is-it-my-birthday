"use client";
import React, { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

const defaultPosition = { x: 32, y: 32 };

const GradientPosition = () => {
  const [mousePosition, setMousePosition] = React.useState(defaultPosition);
  const isBigScreen = useMediaQuery({ query: "(min-width: 800px)" });

  React.useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  if (isBigScreen) return mousePosition;
  else return defaultPosition;
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
