import React, { Component } from "react";
import victor from "../assest/img/Victor logo2.png";
import { Link } from "react-router-dom";
import "../assest/css/sidebar.css";

export default class sidebar extends Component {
  render() {
    return (
      <div className="sidebardiv">
        <div className="logosidebar mt-5">
          <img src={victor} alt="" />
          <p className="mt-5">1 to 5 steps</p>
        </div>
        <div className="itemlink">
          <div className="pagetitlelink">
            <Link
              className="linkitem"
              onClick={this.pagenae}
              id="personal"
              to={{ pathname: "/dr_profile", page: "Personal" }}
            >
              <span className="pagenumber">01</span> Personal Details
            </Link>
          </div>
          <div className="pagetitlelink">
            <Link
              className="linkitem"
              to={{ pathname: "/dr_clinic", page: "clinic" }}
            >
              <span className="pagenumber">02</span> Clinic/Hospital Details
            </Link>
          </div>
          <div className="pagetitlelink">
            <Link
              className="linkitem"
              to={{ pathname: "/dr_clinictimimg", page: "timimg" }}
            >
              <span className="pagenumber">03</span> Clinic/Hospital Timing
            </Link>
          </div>
          <div className="pagetitlelink">
            <Link
              className="linkitem"
              to={{ pathname: "/dr_access", page: "access" }}
            >
              <span className="pagenumber">04</span> Allow Access
            </Link>
          </div>
          <div className="pagetitlelink">
            <Link
              className="linkitem"
              to={{ pathname: "/dr_profilereview", page: "review" }}
            >
              <span className="pagenumber">05</span> Profile Review
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
