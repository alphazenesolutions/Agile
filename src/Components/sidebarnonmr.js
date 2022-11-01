import React, { Component } from 'react'
import victor from '../assest/img/Victor logo2.png'
import { Link } from 'react-router-dom'
import '../assest/css/sidebar.css'

export default class sidebarnonmr extends Component {
    render() {
        return (
            <div className="sidebardiv">
                <div className="logosidebar mt-5">
                    <img src={victor} alt="" />
                    <p className="mt-5">1 to 4 steps</p>
                </div>
                <div className="itemlink">
                    <div className="pagetitlelink">
                        <Link className="linkitem" to="/nonmr_profile" ><span className="pagenumber">01</span> Personal Details</Link>
                    </div>
                    <div className="pagetitlelink">
                        <Link className="linkitem" to="/nonmr_company" ><span className="pagenumber">02</span> Company Details</Link>
                    </div>
                    <div className="pagetitlelink">
                        <Link className="linkitem" to="/nonmr_team" ><span className="pagenumber">02</span> Team Planning</Link>
                    </div>
                    <div className="pagetitlelink">
                        <Link className="linkitem" to="/nonmr_review" ><span className="pagenumber">04</span> Profile Review</Link>
                    </div>
                </div>
            </div>
        )
    }
}
