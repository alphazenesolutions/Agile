import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/DrSidebar";
import "../../assest/css/profile.css";
import profilepic from "../../assest/img/profilepic.png";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { firebase } from "../../database/firebase";
import Update from "../../Components/Update";
import Avatar from "@mui/material/Avatar";
export default class profile extends Component {
  constructor(props) {
    super();
    this.state = {
      initial: null,
      firstname: null,
      number: null,
      degree: null,
      email: null,
      lastname: null,
      landline: null,
      specility: null,
      file: "",
      imagePreviewUrl: "",
      baseLogo: "",
      slogo: "",
      userid: null,
      userdata: [],
      profileurl: null,
      users: [],
      gender: null,
      loader: false,
    };
  }
  componentDidMount = async () => {
    var userid1 = sessionStorage.getItem("userid");
    if (userid1 === null) {
      var userid2 = localStorage.getItem("userid");
      this.setState({
        userid: userid2,
      });
    } else {
      this.setState({
        userid: userid1,
      });
    }
    var user = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/`)
      .then((res) => {
        return res.data;
      });
    const { userid } = this.state;
    var userdata = await axios
      .get(`${process.env.REACT_APP_SERVER}/users/user/${userid}`)
      .then((res) => {
        return res.data;
      });
    if (userdata.length !== 0) {
      this.setState({
        firstname: userdata[0].first_name,
        initial: userdata[0].initial,
        number: userdata[0].mobile_number,
        degree: userdata[0].degree,
        email: userdata[0].email,
        lastname: userdata[0].last_name,
        landline: userdata[0].landline_number,
        specility: userdata[0].speciality,
        profileurl: userdata[0].profile_pic,
        users: user,
        gender: userdata[0].gender,
      });
      if (userdata[0].first_name === null) {
        alert(
          "Thank you for joining Victor. Kindly take 5 min to complete the profile. Mandatory information is essential to be able to use the application"
        );
      }
    }
  };

  handleChangenew = async (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    const logo = await this.convertBase64(file);
    this.setState({
      baseLogo: logo,
      file: e.target.files,
    });
  };

  handlechange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  saveprofile = async () => {
    const {
      initial,
      firstname,
      number,
      degree,
      email,
      lastname,
      landline,
      specility,
      file,
      userid,
      profileurl,
      gender,
    } = this.state;

    if (initial == null) {
      toast.info("Initial Is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (firstname == null) {
      toast.info("First Name is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (lastname == null) {
      toast.info("Last Name is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (number == null) {
      toast.info("Mobile Number is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (email == null) {
      toast.info("Email Address is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (degree == null) {
      toast.info("Degree is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (specility == null) {
      toast.info("Specility is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (gender == null) {
      toast.info("Gender is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      toast.info("Please Wait...", {
        autoClose: 5000,
        transition: Slide,
      });
      this.setState({
        loader: true,
      });
      if (file[0] !== undefined) {
        let file11 = new Promise((resolve, reject) => {
          var storageRef = firebase.storage().ref("profile/" + file[0].name);
          storageRef.put(file[0]).then(function (snapshot) {
            storageRef.getDownloadURL().then(function (url) {
              //img download link ah ketakiradhu
              setTimeout(() => resolve(url), 1000);
            });
          });
        });
        var imgurl = await file11;
        var data = {
          initial: initial,
          first_name: firstname,
          last_name: lastname,
          email: email,
          profile_pic: imgurl,
          landline_number: landline,
          degree: degree,
          speciality: specility,
          mobile_number: number,
          gender: gender,
        };
        var updateuserdata = await axios
          .post(`${process.env.REACT_APP_SERVER}/users/update/${userid}`, data)
          .then((res) => {
            return res.data;
          });
        if (updateuserdata === true) {
          window.location.replace("/Review_edit_Doctor");
        }
      } else {
        var imgurlnew = await profileurl;
        var datanew = {
          initial: initial,
          first_name: firstname,
          last_name: lastname,
          email: email,
          profile_pic: imgurlnew,
          landline_number: landline,
          degree: degree,
          speciality: specility,
          mobile_number: number,
          gender: gender,
        };
        var updateuserdatanew = await axios
          .post(
            `${process.env.REACT_APP_SERVER}/users/update/${userid}`,
            datanew
          )
          .then((res) => {
            return res.data;
          });
        if (updateuserdatanew === true) {
          window.location.replace("/Review_edit_Doctor");
        }
      }
    }
  };
  convertBase64 = async (file) => {
    const convertBase64 = new Promise(async (resolve, reject) => {
      let reader = new FileReader();
      reader.onloadend = function () {
        return resolve(reader.result);
      };
      reader.readAsDataURL(file);
    });
    return await convertBase64;
  };
  backbtn = () => {
    window.location.replace("/doctor/waitingroom");
  };
  render() {
    let { baseLogo, profileurl } = this.state;
    let $imagePreview = null;
    if (baseLogo.trim().length !== 0) {
      $imagePreview = (
        <Avatar
          alt="Remy Sharp"
          src={baseLogo}
          variant="rounded"
          sx={{ width: 76, height: 76 }}
          id="slogos"
        />
      );
    } else if (profileurl === null) {
      $imagePreview = (
        <Avatar
          alt="Remy Sharp"
          src={profilepic}
          variant="rounded"
          sx={{ width: 76, height: 76 }}
          id="slogos"
        />
      );
    } else {
      $imagePreview = (
        <Avatar
          alt="Remy Sharp"
          src={profileurl}
          variant="rounded"
          sx={{ width: 76, height: 76 }}
          id="slogos"
        />
      );
    }
    const { slogo, specility, initial, gender, loader } = this.state;
    return (
      <div className="row">
        <div
          className="col-md-2"
          style={{
            width: "100%",
            backgroundColor: "whitesmoke",
          }}
        >
          <Sidebar />
        </div>
        <div className="col-md-10 profileside">
          <h4 className="mt-5">
            <b>Complete Your Profile</b>
          </h4>
          <h5>Personal Details</h5>
          <div className="mt-3 text-end">
            <button className="btn backbtn" onClick={this.backbtn}>
              {" "}
              Back
            </button>
            {loader === false ? (
              <button className="btn addrecep  ml-3" onClick={this.saveprofile}>
                {" "}
                Save & Next Step
              </button>
            ) : (
              <button className="btn addrecep  ml-3">
                <span
                  class="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span class="sr-only">Loading...</span>
              </button>
            )}
          </div>
          <div className="container row">
            <div className="mt-3">
              <label>
                <b>Profile Picture </b>
              </label>
              <div className="mt-2 mb-2"> {$imagePreview}</div>
              <input
                name="slogo"
                type="file"
                defaultValue={slogo}
                id="slogo"
                className="form-control1"
                onChange={(e) => this.handleChangenew(e)}
                placeholder="Full Name"
              />
            </div>
            <div className="col-md-5 mt-5">
              <div className="mt-3">
                <div className="row">
                  <label>
                    <b>
                      First Name <span className="red-asterisk">*</span>
                    </b>
                  </label>
                  <div className="input-group">
                    <div className="input-group-sm ">
                      <select
                        name="initial"
                        style={{ height: "100%" }}
                        className="form-control"
                        onChange={(e) => this.handlechange(e)}
                      >
                        {initial !== null ? (
                          <>
                            <option value={initial} selected>
                              {initial}
                            </option>
                            <option value="Mr">Mr</option>
                            <option value="Dr">Dr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                          </>
                        ) : (
                          <>
                            <option value="null">--</option>
                            <option value="Mr">Mr</option>
                            <option value="Dr">Dr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                          </>
                        )}
                      </select>
                    </div>
                    <input
                      name="firstname"
                      type="text"
                      id="pname"
                      className="form-control"
                      placeholder="Enter First name"
                      value={this.state.firstname}
                      onChange={(e) => this.handlechange(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <label>
                  <b>
                    Mobile Number <span className="red-asterisk">*</span>
                  </b>
                </label>
                <span style={{ float: "right", cursor: "pointer" }}>
                  <Update />
                </span>
                <input
                  type="text"
                  name="number"
                  placeholder="Enter Mobile Number"
                  disabled
                  value={this.state.number}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>

              <div className="mt-3">
                <label>
                  <b>
                    Email Address <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="Enter Email Address"
                  disabled
                  value={this.state.email}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <label>
                  <b>
                    Gender <span className="red-asterisk">*</span>
                  </b>
                </label>
                <select
                  className="form-control"
                  name="gender"
                  onChange={(e) => this.handlechange(e)}
                >
                  {gender !== null ? (
                    <>
                      <option value={gender} selected>
                        {gender}
                      </option>
                      <option value="null">Select</option>
                      <option value="Male">Male</option>
                      <option alue="Female">Female</option>
                    </>
                  ) : (
                    <>
                      <option value="null">Select</option>
                      <option value="Male">Male</option>
                      <option alue="Female">Female</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="col-md-5 mt-5">
              <div className="mt-3">
                <label>
                  <b>
                    Last Name <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Enter Last name"
                  value={this.state.lastname}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <label>
                  <b>
                    Degree <span className="red-asterisk">*</span>
                  </b>
                </label>
                <input
                  type="text"
                  name="degree"
                  placeholder="Enter Degree"
                  value={this.state.degree}
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
              <div className="mt-3">
                <label>
                  <b>
                    Speciality <span className="red-asterisk">*</span>
                  </b>
                </label>
                <select
                  name="specility"
                  className="form-control"
                  onChange={(e) => this.handlechange(e)}
                >
                  {specility != null ? (
                    <option value={specility} selected>
                      {specility}
                    </option>
                  ) : (
                    <>
                      <option>Select Speciality</option>
                      <option value="Adolescent medicine">
                        Adolescent medicine
                      </option>
                      <option value="Adult reconstructive orthopaedics">
                        Adult reconstructive orthopaedics
                      </option>
                      <option value="Advanced heart failure and transplant cardiology">
                        Advanced heart failure and transplant cardiology
                      </option>
                      <option value="Allergy and immunology">
                        Allergy and immunology
                      </option>
                      <option value="Andrology">Andrology</option>
                      <option value="Anesthesiology">Anesthesiology</option>
                      <option value="Anterior segment/cornea ophthalmology">
                        Anterior segment/cornea ophthalmology
                      </option>
                      <option value="Ayurvedic">Ayurvedic</option>
                      <option value="Bariatric Surgery">
                        Bariatric Surgery
                      </option>
                      <option value="Bone Marrow Transplant">
                        Bone Marrow Transplant
                      </option>
                      <option value="Breast Surgery">Breast Surgery</option>
                      <option value="Cardiac Surgery">Cardiac Surgery</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Cardiology / Electrophysiology">
                        Cardiology / Electrophysiology
                      </option>
                      <option value="Cardiovascular disease">
                        Cardiovascular disease
                      </option>
                      <option value="Chest Medicine">Chest Medicine</option>
                      <option value="Child abuse pediatrics">
                        Child abuse pediatrics
                      </option>
                      <option value="Clinical cardiac electrophysiology">
                        Clinical cardiac electrophysiology
                      </option>
                      <option value="Colon and rectal surgery">
                        Colon and rectal surgery
                      </option>
                      <option value="Congenital cardiac surgery">
                        Congenital cardiac surgery
                      </option>
                      <option value="Consulting Physician">
                        Consulting Physician
                      </option>
                      <option value="Cosmetology">Cosmetology</option>
                      <option value="Craniofacial surgery">
                        Craniofacial surgery
                      </option>
                      <option value="Critical care medicine">
                        Critical care medicine
                      </option>
                      <option value="Dental Surgery">Dental Surgery</option>
                      <option value="Dentist">Dentist</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Dermatopathology">Dermatopathology</option>
                      <option value="Developmental-behavioral pediatrics">
                        Developmental-behavioral pediatrics
                      </option>
                      <option value="Diabetology">Diabetology</option>
                      <option value="Dietary">Dietary</option>
                      <option value="Emergency & Trauma">
                        Emergency & Trauma
                      </option>
                      <option value="Emergency medicine">
                        Emergency medicine
                      </option>
                      <option value="Endochrinology">Endochrinology</option>
                      <option value="Endocrinology, diabetes, and metabolism">
                        Endocrinology, diabetes, and metabolism
                      </option>
                      <option value="Endovascular surgical neuroradiology">
                        Endovascular surgical neuroradiology
                      </option>
                      <option value="ENT">ENT</option>
                      <option value="Family medicine">Family medicine</option>
                      <option value="Family Physician">Family Physician</option>
                      <option value="Female pelvic medicine and reconstructive surgery ">
                        Female pelvic medicine and reconstructive surgery
                      </option>
                      <option value="Female urology">Female urology</option>
                      <option value="Fetal Medicine">Fetal Medicine</option>
                      <option value="Foot and Ankle orthopaedics">
                        Foot and Ankle orthopaedics
                      </option>
                      <option value="Gastroenterology">Gastroenterology</option>
                      <option value="Gastrointistinal Oncology">
                        Gastrointistinal Oncology
                      </option>
                      <option value="General surgery">General surgery</option>
                      <option value="Geriatric medicine">
                        Geriatric medicine
                      </option>
                      <option value="Glaucoma ophthalmology">
                        Glaucoma ophthalmology
                      </option>
                      <option value="Gynecologic oncology">
                        Gynecologic oncology
                      </option>
                      <option value="Gynecologic oncology">
                        Gynecologic oncology
                      </option>
                      <option value="Hand surgery">Hand surgery</option>
                      <option value="Head & Neck Surgery">
                        Head & Neck Surgery
                      </option>
                      <option value="Hemato Oncology">Hemato Oncology</option>
                      <option value="Hematology">Hematology</option>
                      <option value="Hematology">Hematology</option>
                      <option value="Hematology and oncology">
                        Hematology and oncology
                      </option>
                      <option value="Hepatology">Hepatology</option>
                      <option value="Homeopathy">Homeopathy</option>
                      <option value="Hospice and palliative medicine">
                        Hospice and palliative medicine
                      </option>
                      <option value="Immunology">Immunology</option>
                      <option value="Infectious disease">
                        Infectious disease
                      </option>
                      <option value="Internal medicine">
                        Internal medicine
                      </option>
                      <option value="Interventional cardiology">
                        Interventional cardiology
                      </option>
                      <option value="Interventional Radiology">
                        Interventional Radiology
                      </option>
                      <option value="IVF & Reproductive Medicine">
                        IVF & Reproductive Medicine
                      </option>
                      <option value="Joint Replacement">
                        Joint Replacement
                      </option>
                      <option value="Laproscopic Surgery">
                        Laproscopic Surgery
                      </option>
                      <option value="Liver Transplant">Liver Transplant</option>
                      <option value="Male infertility">Male infertility</option>
                      <option value="Maternal-fetal medicine">
                        Maternal-fetal medicine
                      </option>
                      <option value="Medical genetics">Medical genetics</option>
                      <option value="Medical Oncology">Medical Oncology</option>
                      <option value="Musculoskeletal oncology">
                        Musculoskeletal oncology
                      </option>
                      <option value="Neonatal-perinatal medicine">
                        Neonatal-perinatal medicine
                      </option>
                      <option value="Neonatology">Neonatology</option>
                      <option value="Nephrology">Nephrology</option>
                      <option value="Nephrology">Nephrology</option>
                      <option value="Neuro-ophthalmology">
                        Neuro-ophthalmology
                      </option>
                      <option value="Neurological surgery">
                        Neurological surgery
                      </option>
                      <option value="Neurology">Neurology</option>
                      <option value="Neuroradiology">Neuroradiology</option>
                      <option value="Neurosurgery">Neurosurgery</option>
                      <option value="Neurourology">Neurourology</option>
                      <option value="Nuclear medicine">Nuclear medicine</option>
                      <option value="Obstetrics and gynecology">
                        Obstetrics and gynecology
                      </option>
                      <option value="Ocular oncology">Ocular oncology</option>
                      <option value="Oculoplastics/orbit">
                        Oculoplastics/orbit
                      </option>
                      <option value="Oncology">Oncology</option>
                      <option value="Ophthalmic Plastic & Reconstructive Surgery">
                        Ophthalmic Plastic & Reconstructive Surgery
                      </option>
                      <option value="Ophthalmic surgery">
                        Ophthalmic surgery
                      </option>
                      <option value="Ophthalmology">Ophthalmology</option>
                      <option value="Oral and maxillofacial surgery">
                        Oral and maxillofacial surgery
                      </option>
                      <option value="Orthodontist">Orthodontist</option>
                      <option value="Orthopaedic sports medicine">
                        Orthopaedic sports medicine
                      </option>
                      <option value="Orthopaedic surgery">
                        Orthopaedic surgery
                      </option>
                      <option value="Orthopaedic surgery of the spine ">
                        Orthopaedic surgery of the spine
                      </option>
                      <option value="Orthopaedic trauma">
                        Orthopaedic trauma
                      </option>
                      <option value="Otolaryngology">Otolaryngology</option>
                      <option value="Otology neurotology">
                        Otology neurotology
                      </option>
                      <option value="Pain Medicine">Pain Medicine</option>
                      <option value="Pathology">Pathology</option>
                      <option value="Pediatric cardiology">
                        Pediatric cardiology
                      </option>
                      <option value="Pediatric critical care medicine">
                        Pediatric critical care medicine
                      </option>
                      <option value="Pediatric dermatology">
                        Pediatric dermatology
                      </option>
                      <option value="Pediatric endocrinology">
                        Pediatric endocrinology
                      </option>
                      <option value="Pediatric gastroenterology">
                        Pediatric gastroenterology
                      </option>
                      <option value="Pediatric hematology-oncology">
                        Pediatric hematology-oncology
                      </option>
                      <option value="Pediatric infectious diseases">
                        Pediatric infectious diseases
                      </option>
                      <option value="Pediatric internal medicine">
                        Pediatric internal medicine
                      </option>
                      <option value="Pediatric nephrology">
                        Pediatric nephrology
                      </option>
                      <option value="Pediatric oncology">
                        Pediatric oncology
                      </option>
                      <option value="Pediatric orthopaedics">
                        Pediatric orthopaedics
                      </option>
                      <option value="Pediatric otolaryngology">
                        Pediatric otolaryngology
                      </option>
                      <option value="Pediatric pulmonology">
                        Pediatric pulmonology
                      </option>
                      <option value="Pediatric rheumatology">
                        Pediatric rheumatology
                      </option>
                      <option value="Pediatric sports medicine">
                        Pediatric sports medicine
                      </option>
                      <option value="Pediatric surgery">
                        Pediatric surgery
                      </option>
                      <option value="Pediatric transplant hepatology">
                        Pediatric transplant hepatology
                      </option>
                      <option value="Pediatric urology">
                        Pediatric urology
                      </option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Physical medicine and rehabilitation">
                        Physical medicine and rehabilitation
                      </option>
                      <option value="Plastic surgery">Plastic surgery</option>
                      <option value="Prenatal">Prenatal</option>
                      <option value="Preventive medicine">
                        Preventive medicine
                      </option>
                      <option value="Procedural dermatology">
                        Procedural dermatology
                      </option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Pulmonary disease">
                        Pulmonary disease
                      </option>
                      <option value="Pulmonary disease and critical care medicine">
                        Pulmonary disease and critical care medicine
                      </option>
                      <option value="Radiation oncology">
                        Radiation oncology
                      </option>
                      <option value="Renal transplant">Renal transplant</option>
                      <option value="Reproductive endocrinologists and infertility">
                        Reproductive endocrinologists and infertility
                      </option>
                      <option value="Respitatory">Respitatory</option>
                      <option value="Retina/uveitis">Retina/uveitis</option>
                      <option value="Rheumatology">Rheumatology</option>
                      <option value="Sleep medicine">Sleep medicine</option>
                      <option value="Sports medicine">Sports medicine</option>
                      <option value="Strabismus/pediatric ophthalmology">
                        Strabismus/pediatric ophthalmology
                      </option>
                      <option value="Surgery">Surgery</option>
                      <option value="Surgical critical care">
                        Surgical critical care
                      </option>
                      <option value="Surgical Intensivists, specializing in critical care patients">
                        Surgical Intensivists, specializing in critical care
                        patients
                      </option>
                      <option value="Thoracic Surgery">Thoracic Surgery</option>
                      <option value="Thoracic surgery-integrated">
                        Thoracic surgery-integrated
                      </option>
                      <option value="Transplant hepatology">
                        Transplant hepatology
                      </option>
                      <option value="Trauma">Trauma</option>
                      <option value="Urologic oncology">
                        Urologic oncology
                      </option>
                      <option value="Urology">Urology</option>
                      <option value="Vascular surgery">Vascular surgery</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    );
  }
}
