import axios from "axios";
import React, { Component } from "react";
import "./Advertisment.css";

export default class Advertisment extends Component {
  constructor(props) {
    super();
    this.state = {
      banner: null,
      bannerid: null,
      waitingroom: false,
    };
  }
  componentDidMount = async () => {
    var allbanner = await axios
      .get(`${process.env.REACT_APP_SERVER}/images/all`)
      .then((res) => {
        return res.data;
      });
    if (allbanner.length !== 0) {
      var shufflearray = this.shuffleArray(allbanner);
      if (shufflearray.length !== 0) {
        this.setState({
          banner: shufflearray[0].image,
          bannerid: shufflearray[0].advertisment_id,
        });
        var single = await axios
          .get(
            `${process.env.REACT_APP_SERVER}/images/${shufflearray[0].advertisment_id}`
          )
          .then((res) => {
            return res.data;
          });
        var data = {
          watchtime: Number(single[0].watchtime) + Number(10),
        };
        await axios
          .post(
            `${process.env.REACT_APP_SERVER}/images/update/${shufflearray[0].advertisment_id}`,
            data
          )
          .then((res) => {
            return res.data;
          });
      }
    }
    setTimeout(() => {
      this.componentDidMount();
    }, 10000);
  };
  shuffleArray = (allbanner) => {
    return allbanner.sort(() => Math.random() - 0.5);
  };

  render() {
    const { banner } = this.state;
    return (
      <div className="ADCONTAINER">
        <img className="bannerimg" src={banner} alt="" />
      </div>
    );
  }
}
