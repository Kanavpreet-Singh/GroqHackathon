"use client";

import React from "react";
import { motion } from "framer-motion";

export const CardContainer = ({ children, className }) => {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className }) => {
  return (
    <motion.div
      className={`${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export const CardItem = ({ children, className, translateZ = 0, as: Component = "div", ...props }) => {
  return (
    <Component
      className={`${className}`}
      style={{
        transform: `translateZ(${translateZ}px)`,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}; 