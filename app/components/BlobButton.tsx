"use client";
import React from "react";

export const BlobButton = ({
  children = "Blob Button",
  ariaLabel = "Blob Button",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}) => (
  <button
    className={`blob-btn ${className}`}
    aria-label={ariaLabel}
    {...props}
  >
    {children}
    <span className="blob-btn__inner">
      <span className="blob-btn__blobs">
        <span className="blob-btn__blob"></span>
        <span className="blob-btn__blob"></span>
        <span className="blob-btn__blob"></span>
        <span className="blob-btn__blob"></span>
      </span>
    </span>
  </button>
); 