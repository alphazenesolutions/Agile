import React, { Component } from "react";
import Sidebar from "../../Components/Sidebar/MrSidebar";
import { toast, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assest/css/profile.css";
import axios from "axios";

export default class mr_company_edit extends Component {
  constructor(props) {
    super();
    this.state = {
      company: null,
      division: null,
      title: null,
      userid: null,
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
    const allcompany = [
      "AAREY DRUGS & PHARMACEUTICALS LTD",
      "AARTI DRUGS LTD",
      "ABBOTT INDIA LTD",
      "ABL BIOTECHNOLOGIES LTD",
      "ADD-LIFE PHARMA LTD",
      "ADVIK LABORATORIES LTD",
      "AHLCON PARENTERALS (INDIA) LTD",
      "AJANTA PHARMA LTD",
      "ALBERT DAVID LTD-$",
      "ALEMBIC LTD",
      "ALEMBIC PHARMACEUTICALS LTD",
      "Alkem Laboratories Ltd",
      "AMBALAL SARABHAI ENTERPRISES LTD",
      "AMRUTANJAN HEALTH CARE LTD-$",
      "ANKUR DRUGS & PHARMA LTD-$",
      "ANU&#39;S LABORATORIES LTD",
      "ANUH PHARMA LTD",
      "ARVIND REMEDIES LTD",
      "ASTRAZENECA PHARMA INDIA LTD",
      "AURO LABORATORIES LTD",
      "AUROBINDO PHARMA LTD",
      "BACIL PHARMA LTD",
      "BAFNA PHARMACEUTICALS LTD",
      "Bajaj Healthcare Ltd",
      "BAL PHARMA LTD",
      "BDH INDUSTRIES LTD",
      "BERYL DRUGS LTD",
      "BHARAT IMMUNOLOGICALS & BIOLOGICALS CORPORATION LTD-$",
      "Bharat Parenterals Ltd",
      "BIOFIL CHEMICALS & PHARMACEUTICALS LTD",
      "BIOWIN PHARMA (INDIA) LTD",
      "BLISS GVS PHARMA LTD",
      "BRABOURNE ENTERPRISES LTD",
      "BRAWN BIOTECH LTD",
      "BROOKS LABORATORIES LTD",
      "CADILA HEALTHCARE LTD",
      "CAPLIN POINT LABORATORIES LTD",
      "Chandra Bhagat Pharma Ltd",
      "CHEMO PHARMA LABORATORIES LTD",
      "CHIPLUN FINE CHEMICALS LTD",
      "Cian Healthcare Ltd",
      "CIPLA LTD",
      "CLARIS LIFESCIENCES LTD",
      "COLINZ LABORATORIES LTD",
      "Concord Drugs Ltd",
      "CORAL LABORATORIES LTD",
      "CORE HEALTHCARE LTD",
      "Decipher Labs Ltd",
      "Denis Chem Lab Ltd",
      "DESH RAKSHAK AUSHDHALAYA LTD",
      "Dishman Carbogen Amcis Ltd",
      "DISHMAN PHARMACEUTICALS & CHEMICALS LTD",
      "DIVI&#39;S LABORATORIES LTD",
      "DrDatsons Labs Limited",
      "DRREDDY&#39;S LABORATORIES LTD",
      "DUJOHN LABORATORIES LTD",
      "Earum Pharmaceuticals Ltd",
      "EBERS PHARMACEUTICALS LTD",
      "ELDER HEALTH CARE LTD",
      "ELDER PHARMACEUTICALS LTD",
      "ELDER PROJECTS LTD",
      "ELEGANT PHARMACEUTICALS LTD",
      "EMERGY PHAARMA LTD",
      "EPSOM PROPERTIES LTD",
      "Eris Lifesciences Ltd",
      "EUPHARMA LABORATORIES LTD",
      "EVEREST ORGANICS LTD",
      "FDC LTD",
      "Fermenta Biotech Ltd",
      "FERNHILL INDUSTRIES LTD",
      "FERVENT SYNERGIES LTD",
      "Fredun Pharmaceuticals Ltd",
      "FRESENIUS KABI ONCOLOGY LTD",
      "FULFORD (INDIA) LTD-$",
      "Ganga Pharmaceuticals Ltd",
      "GENNEX LABORATORIES LTD",
      "GLAXOSMITHKLINE PHARMACEUTICALS LTD",
      "GLENMARK PHARMACEUTICALS LTD",
      "GODAVARI DRUGS LTD",
      "GRAN HEAL PHARMA LTD",
      "GRANULES INDIA LTD-$",
      "GUFIC BIOSCIENCES LTD",
      "GUJARAT INJECT (KERALA) LTD",
      "GUJARAT TERCE LABORATORIES LTD",
      "GUJARAT THEMIS BIOSYN LTD",
      "HARLEYSTREET PHARMACEUTICALS LTD",
      "HESTER BIOSCIENCES LTD",
      "HIKAL LTD",
      "HIRAN ORGOCHEM LTD-$",
      "HI-TECH DRUGS LTD",
      "INDOCO REMEDIES LTD",
      "IND-SWIFT LABORATORIES LTD",
      "IND-SWIFT LTD",
      "IOL CHEMICALS & PHARMACEUTICALS LTD",
      "IPCA LABORATORIES LTD",
      "ISHITA DRUGS & INDUSTRIES LTD",
      "JBCHEMICALS & PHARMACEUTICALS LTD",
      "JKPHARMACHEM LTD",
      "JAGSONPAL PHARMACEUTICALS LTD",
      "JENBURKT PHARMACEUTICALS LTD",
      "JUBILANT LIFE SCIENCES LIMITED",
      "KABRA DRUGS LTD",
      "KAMRON LABORATORIES LTD",
      "KAPPAC PHARMA LTD",
      "KAPRINAS PHARMACEUTICALS & CHEMICALS LTD",
      "KDL BIOTECH LTD",
      "KERALA AYURVEDA LTD",
      "KILITCH DRUGS (INDIA) LTD",
      "Kimia Biosciences Ltd",
      "KOPRAN LTD",
      "KREBS BIOCHEMICALS & INDUSTRIES LTD-$",
      "Kwality Pharmaceuticals Ltd",
      "Laurus Labs Ltd",
      "LINCOLN PHARMACEUTICALS LTD",
      "LUPIN LTD",
      "LYKA LABS LTD",
      "Madhuveer Com 18 Network Ltd",
      "MAHAVIR ADVANCED REMEDIES LTD",
      "MAKERS LABORATORIES LTD-$",
      "MANAV PHARMA LTD",
      "MANGALAM DRUGS & ORGANICS LTD",
      "MARKSANS PHARMA LTD",
      "MATRIX LABORATORIES LTD",
      "MAXIMAA SYSTEMS LTD",
      "MEDICAMEN BIOTECH LTD-$",
      "MEDI-CAPS LTD-$",
      "Medico Remedies Ltd",
      "Mercury Laboratories Ltd",
      "MESCO PHARMACEUTICALS LTD",
      "MONOZYME INDIA LTD",
      "MOON DRUGS LTD",
      "MOREPEN LABORATORIES LTD",
      "NAGARJUNA DRUGS LTD",
      "NATCO PHARMA LTD",
      "NATURAL CAPSULES LTD",
      "NECTAR LIFESCIENCES LTD",
      "NEULAND LABORATORIES LTD",
      "NGL FINE-CHEM LTD",
      "NOVARTIS INDIA LTD",
      "OMEGA LABORATORIES LTD",
      "Orchid Pharma Ltd",
      "ORIENTAL REMEDIES & HERBALS LTD",
      "Ortin Laboratories    Ltd-$",
      "Ortin Laboratories Ltd",
      "PCICHEMICALS AND PHARMACEUTICALS LTD",
      "PAN DRUGS LTD",
      "PANCHSHEEL ORGANICS LTD",
      "Parabolic Drugs Ltd",
      "PARENTERAL DRUGS (INDIA) LTD-$",
      "Parmax Pharma Ltd",
      "PARNAX LAB LTD",
      "PENTA PHARMADYES LTD",
      "PERK PHARMACEUTICALS LTD",
      "PFIZER LTD",
      "PHAARMASIA LTD",
      "PHARMAIDS PHARMACEUTICALS LTD",
      "PIRAMAL ENTERPRISES LTD",
      "Piramal Phytocare Limited",
      "PLETHICO PHARMACEUTICALS LTD",
      "Procter & Gamble Health Ltd",
      "Rajnish Wellness Ltd",
      "RANBAXY LABORATORIES LTD",
      "RATNA DRUGS LTD",
      "RAYMED LABS LTD",
      "REKVINA LABORATORIES LTD",
      "RESONANCE SPECIALTIES LTD-$",
      "RICHLINE PHARMA LTD",
      "ROOPA INDUSTRIES LTD",
      "RPG LIFE SCIENCES LTD",
      "RUBRA MEDICAMENTS LTD",
      "SAMRAT PHARMACHEM LTD-$",
      "SANDU PHARMACEUTICALS LTD",
      "SANGAM HEALTH CARE PRODUCTS LTD",
      "SANJIVANI PARANTERAL LTD",
      "Sanofi India Ltd",
      "SARVODAYA LABS LTD",
      "SENBO INDUSTRIES LTD",
      "SEQUENT SCIENTIFIC LTD",
      "SHABA CHEMICALS LTD",
      "SHARON BIO-MEDICINE LTD-$",
      "SHASUN PHARMACEUTICALS LTD",
      "SHILPA MEDICARE LTD",
      "SHILPAX LABORATORIES LTD",
      "Shree Ganesh Remedies Ltd",
      "SHREE NEELACHAL LABORATORIES LTD",
      "SHRISHMA FINE CHEMICALS & PHARMACEUTICALS LTD",
      "Shukra Pharmaceuticals Ltd",
      "SHYAMA INFOSYS LTD",
      "SIRIS LTD",
      "Smruthi Organics Ltd",
      "SMRUTHI ORGANICS LTD-$",
      "SMS Lifesciences India Ltd",
      "SMS PHARMACEUTICALS LTD",
      "Solara Active Pharma Sciences Ltd",
      "SOLVAY PHARMA INDIA LTD",
      "SOURCE NATURAL FOODS & HERBAL SUPPL LTD",
      "Span Divergent Ltd-$",
      "SS ORGANICS LTD",
      "Strides Pharma Science Ltd",
      "SUN PHARMA ADVANCED RESEARCH COMPANY LTD",
      "SUN PHARMACEUTICAL INDUSTRIES LTD",
      "Sunil Healthcare Ltd",
      "SUPRIYA PHARMACEUTICALS LTD",
      "SURYA PHARMACEUTICAL LTD",
      "SUVEN LIFE SCIENCES LTD",
      "Suven Pharmaceuticals Ltd",
      "SYNCOM FORMULATIONS (INDIA) LTD-$",
      "Syncom Healthcare Ltd",
      "Syngene International Ltd",
      "SYSCHEM (INDIA) LTD",
      "TAKE SOLUTIONS LTD",
      "TEEM LABORATORIES LTD",
      "THEMIS MEDICARE LTD",
      "TONIRA PHARMA LTD",
      "TORRENT CABLES LTD",
      "TORRENT PHARMACEUTICALS LTD",
      "TRANS ASIA CORPORATION LTD",
      "TRANS MEDICARE LTD",
      "TRANSCHEM LTD-$",
      "TRIMURTHI DRUGS & PHARMACEUTICALS LTD-$",
      "TRIOCHEM PRODUCTS LTD",
      "TTK HEALTHCARE LTD-$",
      "TWILIGHT LITAKA PHARMA LTD-$",
      "TYCHE INDUSTRIES LTD",
      "UNICHEM LABORATORIES LTD",
      "UNJHA FORMULATIONS LTD",
      "Valiant Organics Ltd",
      "Vanta Bioscience Ltd",
      "VARDHAMAN LABORATORIES LTD",
      "Vasundhara Rasayans Ltd",
      "Veerhealth Care Limited",
      "VENKAT PHARMA LTD",
      "Venmax Drugs And Pharmaceuticals Ltd",
      "VENUS REMEDIES LTD",
      "VERONICA LABORATORIES LTD",
      "VIKRAM THERMO (INDIA) LTD",
      "VISTA PHARMACEUTICALS LTD",
      "VITARA CHEMICALS LTD",
      "Vivanza Biosciences Ltd",
      "VIVIMED LABS LTD",
      "VYSALI PHARMACEUTICALS LTD",
      "WANBURY LTD",
      "WELCURE DRUGS & PHARMACEUTICALS LTD",
      "WINTAC LTD",
      "WOCKHARDT LTD",
      "WYETH LTD",
      "ZENITH HEALTH CARE LTD",
      "ZENOTECH LABORATORIES LTD",
      "ZILLION PHARMACHEM LTD",
      "Zim Laboratories Ltd",
      "ZYDEN GENTEC LTD",
    ];
    allcompany.forEach((company) => {
      document.getElementById(
        "companyList"
      ).innerHTML += `<option value='${company}' >${company}</option>`;
    });

    var companydata = await axios
      .get(`${process.env.REACT_APP_SERVER}/company/mr`)
      .then((res) => {
        return res.data;
      });
    if (companydata.length !== 0) {
      const { userid } = this.state;
      for (var a = 0; a < companydata.length; a++) {
        if (companydata[a].mr_id === userid) {
          document.getElementById("datalistcompany").value =
            companydata[a].company_name;
          document.getElementById("division").value =
            companydata[a].company_division;
          document.getElementById("title").value = companydata[a].title;
          this.setState({
            division: companydata[a].company_division,
            company: companydata[a].company_name,
          });
        }
      }
    }
  };
  addcompany = () => {
    const { company } = this.state;
    if (company === "null") {
      toast.info("Company is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      this.setState({
        company: company,
      });
    }
  };
  division = () => {
    var divisionvalue = document.getElementById("division").value;
    if (divisionvalue === null) {
      toast.info("Division is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    }
    this.setState({
      division: divisionvalue,
    });
  };
  savecompany = async () => {
    const { division, company, userid } = this.state;
    if (company === null) {
      toast.info("Company is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else if (division === null) {
      toast.info("Division is Required...", {
        autoClose: 2000,
        transition: Slide,
      });
    } else {
      this.setState({
        loader: true,
      });
      var titlevalue = document.getElementById("title").value;
      var data = {
        company_division: division,
        company_name: company,
        title: titlevalue,
        mr_id: userid,
      };
      var companydata = await axios
        .post(`${process.env.REACT_APP_SERVER}/company`, data)
        .then((res) => {
          return res.data;
        });
      if (companydata === true) {
        window.location.replace("/mr_review_edit");
      }
    }
  };
  handlechangenewdata = (e) => {
    this.setState({
      company: e.target.value,
    });
  };
  backbtn = () => {
    window.location.replace("/mr_review_edit");
  };
  render() {
    const { division, company, loader } = this.state;
    return (
      <div className=" row">
        <div
          className="col-md-2"
          style={{
            width: "100%",
            backgroundColor: "whitesmoke",
          }}
        >
          <Sidebar />
        </div>
        <div className=" col-md-10 profileside">
          <h4 className="mt-5">
            <b>Complete Your Mr Profile</b>
          </h4>
          <h5>Company Details</h5>
          <div className="mt-3 text-end">
            <button className="btn backbtn" onClick={this.backbtn}>
              {" "}
              Back
            </button>
            {loader === false ? (
              <button className="btn addrecep  ml-3" onClick={this.savecompany}>
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
            <div className="col-md-6 mt-5">
              <div className="mt-3">
                <div className="row">
                  <div className="col-sm-8">
                    <label>
                      <b>
                        Company Name <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <input
                      list="companyList"
                      id="datalistcompany"
                      className="form-control"
                      name="input_normal"
                      onChange={(e) => this.handlechangenewdata(e)}
                    />
                    <datalist
                      className="form-control"
                      id="companyList"
                    ></datalist>
                    {/* </input> */}
                  </div>
                  {company !== null ? (
                    <div className="mt-3 col-sm-4">
                      <button className="btn addcompany">Added</button>
                    </div>
                  ) : (
                    <div className="mt-3 col-sm-4">
                      <button
                        className="btn addcompany"
                        onClick={this.addcompany}
                      >
                        Add Company
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <label>
                  <b>Function </b>
                </label>
                <input
                  type="text"
                  name="number"
                  value="Medical Representative"
                  disabled
                  onChange={(e) => this.handlechange(e)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6 mt-5">
              <div className="mt-3">
                <div className="row">
                  <div className="col-sm-8">
                    <label>
                      <b>
                        Division <span className="red-asterisk">*</span>
                      </b>
                    </label>
                    <input
                      type="text"
                      name=""
                      id="division"
                      className="form-control"
                    />
                  </div>
                  {division !== null ? (
                    <div className="mt-3 col-sm-4">
                      <button className="btn addcompany">Added</button>
                    </div>
                  ) : (
                    <div className="mt-3 col-sm-4">
                      <button
                        className="btn addcompany"
                        onClick={this.division}
                      >
                        Add Division
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <label>
                  <b>Title </b>
                </label>
                <input
                  type="text"
                  name="number"
                  id="title"
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    );
  }
}
