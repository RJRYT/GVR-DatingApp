import React from "react";
import "./Intro.css"

function Intro({page}) {
  return (
    <section className="inner-intro bg-fixed bg-overlay-black-60">
      <div className="container">
        <div className="row intro-title text-center">
          <div className="col-md-12">
            <div className="section-title">
              <h1 className="position-relative divider">
                {page} <span className="sub-title">{page}</span>
              </h1>
            </div>
          </div>
          <div className="col-md-12 mt-7">
            <ul className="page-breadcrumb">
              <li>
                <a href="/home">
                  <i className="fa fa-home"></i> Home
                </a>
                <i className="fa fa-angle-double-right"></i>
              </li>
              <li>
                <span>{page}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;
