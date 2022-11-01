import leftimg from "../../assest/img/img1.png";
import logo from "../../assest/img/victor.png";

import "./Login.css";
import MainpageButtons from "../../Components/MainpageButtons/MainpageButtons";

const Login = () => {
  return (
    <div className="Login">
      <div
        className="leftcol"
        style={{ backgroundImage: "linear-gradient(#9f62a9, #7201bd)" }}
      >
        <div className="leftcol_body">
          <h1>Victor brings doctors and medical representatives together</h1>
          <center>
            <img src={leftimg} alt="" />
          </center>
        </div>
      </div>
      <div className="rightcol">
        <div className="rightcol_body">
          <center>
            <img src={logo} style={{ paddingBottom: "20px" }} alt=""></img>
          </center>
          <center>
            <h6>
              <b>Click on your relevant role</b>
            </h6>
          </center>
          <MainpageButtons />
        </div>
      </div>
    </div>
  );
};

export default Login;
