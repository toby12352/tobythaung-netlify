import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

const WaveUnderline = () => (
  <span className="wave-link-underline" aria-hidden="true">
    <svg
      className="wave-link-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 18"
      preserveAspectRatio="none"
    >
      <path
        d="M0 9c8-10 16 10 24 0s16-10 24 0 16 10 24 0 16-10 24 0 16 10 24 0 16-10 24 0 16 10 24 0 16-10 24 0 16 10 24 0 16-10 24 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

/** Inline link with a wavy underline that animates on hover. */
export const WaveLink = ({ to, href, children, className = "", ...rest }) => {
  const classes = `wave-link ${className}`.trim();
  const body = (
    <>
      <span className="wave-link-text">{children}</span>
      <WaveUnderline />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {body}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {body}
    </a>
  );
};
