import React, { Component } from 'react'
import victor from '../assest/img/Victor logo2.png'
import { Link } from 'react-router-dom'
import '../assest/css/sidebar.css'

export default class sidebarrecp extends Component {

    render() {
        return (
            <div className="sidebardiv">
                <div className="logosidebar mt-5">
                    <img src={victor} alt="" />
                    <p className="mt-5">1 to 4 steps</p>
                </div>
                <div className="itemlink">
                    <div className="pagetitlelink">
                        <Link className="linkitem" to="/recp_profile" ><span className="pagenumber">01</span> Personal Details</Link>
                    </div>
                    <div className="pagetitlelink">
                        <Link className="linkitem" to="/recp_hospitalaccess" ><span className="pagenumber">02</span> Clinic / Hospital Access</Link>
                    </div>
                    <div className="pagetitlelink">
                        <Link className="linkitem" to="/recp_review" ><span className="pagenumber">04</span> Profile Review</Link>
                    </div>
                </div>
            </div>
        )
    }
}
