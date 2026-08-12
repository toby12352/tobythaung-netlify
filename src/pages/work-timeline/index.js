import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { meta, worktimeline } from "../../content_option";
import useGoogleAnalytics from "../../hooks/useGoogleAnalytics ";
import { entryTrail, navState } from "../../utils/navTrail";

export const WorkTimeline = () => {
  useGoogleAnalytics("G-ZVC52HVG8Q");

  return (
    <HelmetProvider>
      <Container className="About-header work-timeline-page">
        <Helmet>
          <meta charSet="utf-8" />
          <title> Work Timeline | {meta.title} </title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <nav className="page-breadcrumb" aria-label="Breadcrumb">
              <Link to="/about">About</Link>
              <span className="page-breadcrumb-sep" aria-hidden="true">
                {" "}
                &gt;{" "}
              </span>
              <span>Work Timeline</span>
            </nav>
            <h1 className="display-4 mb-4" style={{ fontSize: "3.8rem" }}>
              Work Timeline
            </h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        {worktimeline.map((role, i) => (
          <Row key={i} className="sec_sp timeline-role">
            <Col lg="12">
              <h3 className="color_sec timeline-role-title">{role.jobtitle}</h3>
              <p className="timeline-role-meta">
                {role.where} · {role.date}
              </p>
              {role.detail ? (
                <p className="timeline-role-detail">{role.detail}</p>
              ) : null}
              {role.learnMore ? (
                <Link
                  to={role.learnMore.to}
                  state={navState(entryTrail(role.learnMore.from))}
                  className="timeline-learn-more"
                >
                  {role.learnMore.label}
                </Link>
              ) : null}
            </Col>
          </Row>
        ))}
      </Container>
    </HelmetProvider>
  );
};
