import React from "react";
import { Link } from "react-router-dom";
import { navState } from "../../utils/navTrail";
import "./style.css";

/**
 * trail: [{ label, to }] parent crumbs (linked)
 * current: string label for the active page (not linked)
 * Each parent link gets state with the trail prefix so context survives going back.
 */
export const PageBreadcrumb = ({ trail = [], current }) => {
  if (!current) return null;

  return (
    <nav className="page-breadcrumb" aria-label="Breadcrumb">
      {trail.map((crumb, i) => {
        const parentTrail = trail.slice(0, i);
        const state =
          crumb.state !== undefined
            ? crumb.state
            : parentTrail.length
              ? navState(parentTrail)
              : undefined;

        return (
          <React.Fragment key={`${crumb.to || crumb.label}-${i}`}>
            {crumb.to ? (
              <Link to={crumb.to} state={state}>
                {crumb.label}
              </Link>
            ) : (
              <span>{crumb.label}</span>
            )}
            <span className="page-breadcrumb-sep" aria-hidden="true">
              {" "}
              &gt;{" "}
            </span>
          </React.Fragment>
        );
      })}
      <span>{current}</span>
    </nav>
  );
};
