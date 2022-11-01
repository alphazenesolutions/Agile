import axios from 'axios';
import React, { Component } from 'react';
// import demovideo from '../assest/img/samplevideo.mp4'

export default class Tutorial extends Component {
    constructor(props) {
        super()
        this.state = {
            role: localStorage.getItem("role") || sessionStorage.getItem("role"),
            myvideo: []
        }
    }
    componentDidMount = async () => {
        const { role } = this.state
        var allvideo = await axios.get(`${process.env.REACT_APP_SERVER}/tutorial/all`).then((res) => { return res.data })
        var myvideo = await allvideo.filter((res) => { return res.role === role })
        this.setState({
            myvideo: myvideo
        })
    }
    render() {
        const { myvideo } = this.state
        return (
            <div className='row'>
                {myvideo.length !== 0 ? myvideo.map((data, index) => (
                    <div className='col-md-4 mt-4' key={index}>
                        <div className='card'>
                            <div className='card-body'>
                                <h6>{data.heading}</h6>
                                <video width="340" height="240" controls>
                                    <source src={data.video} alt="" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                )) : <div className='text-center mt-5'>
                    <p>No Video Found</p>
                </div>}

            </div>
        )
    }
}
