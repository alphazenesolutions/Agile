import React, { Component } from 'react'
import Sidebar from '../../Components/Sidebar/ReceptionistSidebar'
import profilepic from '../../assest/img/profilepic.png'
import '../../assest/css/doctorpage.css'
import axios from 'axios';
import { AiFillCaretLeft, AiFillCaretRight, AiOutlineMore } from "react-icons/ai";
import moment from 'moment'
import { singleappointment, recurringappointment, instantappointment, allappointment, updateapoointment, } from '../../apis/appointment'
import { singlecart } from '../../apis/clinic'
import { allavailability } from '../../apis/availability'
import Navigation from '../../Components/FixedBottomNavigationRecep'
import Doctorlist from '../../Components/recpdoctor'
import { toast, Slide, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Avatar from "@mui/material/Avatar";
export default class appointment extends Component {
    constructor(props) {
        super();
        this.state = {
            userid: null,
            profileurl: null,
            months: null,
            year: null,
            single: [],
            recurring: [],
            instant: [],
            liveappointment: [],
            users: [],
            totalappointment: [],
            reseduleappointment: [],
            data: [],
            Day: null,
            today: null,
            time: null,
            company_name: null,
            myclinic: [],
            clinicname: null,
            myavailability: [],
            completeappointment: [],
            datepicker: null,
            currentdate: moment().format("YYYY-MM-DD"),
            leaveappointment: [],
            myconnectionuser: [],
            meeting_id: null,
            onlyid: null,
            declineappointment: [],
        };
    }
    componentDidMount = async () => {
        var userid1 = sessionStorage.getItem("doctorid");
        this.setState({
            userid: userid1,
        });
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
            });
        }

        var company = await axios
            .get(`${process.env.REACT_APP_SERVER}/company/mr`)
            .then((res) => {
                return res.data;
            });
        for (var i = 0; i < company.length; i++) {
            if (company[i].mr_id === userid) {
                this.setState({
                    company_name: company[i].company_name,
                });
            }
        }
        var clinic = await singlecart();
        var myclinic = clinic.filter((data) => {
            return data.doctors === userid;
        });
        var today = moment().format("YYYY-MM-DD");
        var date = moment().format("MMMM");
        var year = moment().format("YYYY");
        var Day = moment().format("D");
        this.setState({
            months: date,
            Day: Day,
            today: today,
            myclinic: myclinic,
        });
        var monthnew = 12;
        if (date === "January") {
            monthnew = 1;
        } else if (date === "February") {
            monthnew = 2;
        } else if (date === "March") {
            monthnew = 3;
        } else if (date === "April") {
            monthnew = 4;
        } else if (date === "May") {
            monthnew = 5;
        } else if (date === "June") {
            monthnew = 6;
        } else if (date === "July") {
            monthnew = 7;
        } else if (date === "August") {
            monthnew = 8;
        } else if (date === "September") {
            monthnew = 9;
        } else if (date === "October") {
            monthnew = 10;
        } else if (date === "November") {
            monthnew = 11;
        }
        var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        var daysInMonth = new Date(year, monthnew, 0).getDate();
        var data = [];
        for (i = 1; i < daysInMonth + 1; i++) {
            var weekDay =
                days[(new Date(year, monthnew - 1, 1).getDay() + i - 1) % 7];
            if (i < 10) {
                data.push({
                    date: i,
                    day: weekDay,
                });
            } else {
                data.push({
                    date: i,
                    day: weekDay,
                });
            }
        }
        this.gettime();
        this.setState({
            months: date,
            year: year,
            data: data,
        });
        if (Day > 10 && Day <= 20) {
            document.getElementById("calendarnew").scrollBy(800, 0);
        } else if (Day > 20) {
            document.getElementById("calendarnew").scrollBy(1700, 0);
        }
        // setTimeout(() => {
        this.todayappointment();
        // }, 10000);
        this.getnotification();
    };
    // todayappointment = async () => {
    //     const { users, userid } = this.state
    //     var singleAppointment = await singleappointment()
    //     var recurringAppointment = await recurringappointment()
    //     var instantAppointment = await instantappointment()
    //     var single = await singleAppointment.filter((res) => { return res.from_id === userid && res.meeting_status === "await" && res.status === "Approved" })
    //     var recurring = await recurringAppointment.filter((res) => { return res.from_id === userid && res.meeting_status === "await" && res.status === "Approved" })
    //     var instant = await instantAppointment.filter((res) => { return res.from_id === userid && res.meeting_status === "await" && res.status === "Approved" })
    //     this.setState({
    //         single: single,
    //         recurring: recurring,
    //         instant: instant
    //     })
    //     var today = moment().format("YYYY-MM-DD")
    //     var todaysingle = single.filter((data) => { return data.meeting_date === today })
    //     var todayrecurring = recurring.filter((data) => { return data.meeting_date === today })
    //     var todayinstant = instant.filter((data) => { return data.meeting_date === today })
    //     var totalappointment = []
    //     for (var i = 0; i < users.length; i++) {
    //         for (var j = 0; j < todaysingle.length; j++) {
    //             if (users[i].userid === todaysingle[j].to_id) {
    //                 totalappointment.push({
    //                     info: users[i],
    //                     appointment: todaysingle[j]
    //                 })
    //             }
    //         }
    //     }
    //     for (i = 0; i < users.length; i++) {
    //         for (j = 0; j < todayrecurring.length; j++) {
    //             if (users[i].userid === todayrecurring[j].to_id) {
    //                 totalappointment.push({
    //                     info: users[i],
    //                     appointment: todayrecurring[j]
    //                 })
    //             }
    //         }
    //     }
    //     for (i = 0; i < users.length; i++) {
    //         for (j = 0; j < todayinstant.length; j++) {
    //             if (users[i].userid === todayinstant[j].to_id) {
    //                 totalappointment.push({
    //                     info: users[i],
    //                     appointment: todayinstant[j]
    //                 })
    //             }
    //         }
    //     }
    //     this.setState({
    //         totalappointment: totalappointment
    //     })
    //     this.liveappointment()
    // }
    gettime = () => {
        this.setState({
            time: moment().format("hh:mm A"),
        });
        setTimeout(() => {
            this.gettime();
        }, 10000);
    };

    handlechangecalender = (e) => {

        var month = document.getElementById("months").value;
        this.setState({
            months: month,
        });

        var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        var year = document.getElementById("year").value;
        var daysInMonth = new Date(year, month, 0).getDate();
        var data = [];
        for (var i = 1; i < daysInMonth + 1; i++) {
            var weekDay = days[(new Date(year, month - 1, 1).getDay() + i - 1) % 7];
            if (i < 10) {
                data.push({
                    date: i,
                    day: weekDay,
                });
            } else {
                data.push({
                    date: i,
                    day: weekDay,
                });
            }
        }
        this.setState({
            data: data,
            totalappointment: [],
            liveappointment: [],
            reseduleappointment: [],
            leaveappointment: [],
            declineappointment: [],
            completeappointment: [],
        });


    };
    previousItem = () => {
        document.getElementById("calendarnew").scrollBy(-100, 0);
    };
    nextItem = () => {
        document.getElementById("calendarnew").scrollBy(100, 0);
    };

    liveappointment = () => {
        //working
        const { totalappointment } = this.state;
        var time = moment().format("h:mm A");
        var liveappointment = [],
            nonliveappointment = [];
        for (var i = 0; i < totalappointment.length; i++) {
            var colon = time.indexOf(":");
            var hours = time.substr(0, colon),
                minutes = time.substr(colon + 1, 2),
                meridian = time.substr(colon + 4, 2).toUpperCase();
            var hoursInt = parseInt(hours, 10),
                offset = meridian === "PM" ? 12 : 0;
            if (hoursInt === 12) {
                hoursInt = offset;
            } else {
                hoursInt += offset;
            }
            if (
                totalappointment[i].appointment.from_time <=
                hoursInt + ":" + minutes && totalappointment[i].appointment.decline_status !== "true"
            ) {
                liveappointment.push(totalappointment[i]);
            } else {
                nonliveappointment.push(totalappointment[i]);
            }
        }
        var reseduleappointment = [],
            liveappointmentnew = [];
        for (var a = 0; a < liveappointment.length; a++) {
            var colonnew = time.indexOf(":");
            var hoursnew = time.substr(0, colonnew),
                minutesnew = time.substr(colonnew + 1, 2),
                meridiannew = time.substr(colonnew + 4, 2).toUpperCase();
            var hoursIntnew = parseInt(hoursnew, 10),
                offsetnew = meridiannew === "PM" ? 12 : 0;
            if (hoursIntnew === 12) {
                hoursIntnew = offsetnew;
            } else {
                hoursIntnew += offsetnew;
            }
            if (
                liveappointment[a].appointment.to_time <=
                hoursIntnew + ":" + minutesnew
            ) {
                reseduleappointment.push(liveappointment[a]);
            } else {
                liveappointmentnew.push(liveappointment[a]);
            }
        }

        var joinroom = [],
            leaveroom = [];
        for (i = 0; i < liveappointmentnew.length; i++) {
            if (liveappointmentnew[i].appointment.waiting_room === "true" && liveappointmentnew[i].appointment.decline_status !== "true") {
                leaveroom.push(liveappointmentnew[i]);
            } else {
                joinroom.push(liveappointmentnew[i]);
            }
        }
        this.setState({
            totalappointment: nonliveappointment,
            liveappointment: joinroom,
            reseduleappointment: reseduleappointment,
            leaveappointment: leaveroom,
        });

    };
    todayappointment = async () => {
        const { users, userid, today } = this.state;
        var singleAppointment = await singleappointment();
        var recurringAppointment = await recurringappointment();
        var instantAppointment = await instantappointment();
        var allappointmentnew = await allappointment();
        var single = await singleAppointment.filter((res) => {
            return (
                res.to_id === userid &&
                res.meeting_status === "await" &&
                res.status === "Approved"
            );
        });
        var recurring = await recurringAppointment.filter((res) => {
            return (
                res.to_id === userid &&
                res.meeting_status === "await" &&
                res.status === "Approved"
            );
        });
        var instant = await instantAppointment.filter((res) => {
            return (
                res.to_id === userid &&
                res.meeting_status === "await" &&
                res.status === "Approved"
            );
        });
        var completeappointment = await allappointmentnew.filter((res) => {
            return res.meeting_status === "completed";
        });
        this.setState({
            single: single,
            recurring: recurring,
            instant: instant,
        });
        var todaysingle = single.filter((data) => {
            return data.meeting_date === today;
        });
        var todayrecurring = recurring.filter((data) => {
            return data.meeting_date === today;
        });
        var todayinstant = instant.filter((data) => {
            return data.meeting_date === today;
        });
        var todaycompleteappointment = completeappointment.filter((data) => {
            return data.meeting_date === today;
        });
        var totalappointment = [];
        for (var i = 0; i < users.length; i++) {
            for (var j = 0; j < todaysingle.length; j++) {
                if (users[i].userid === todaysingle[j].from_id) {
                    totalappointment.push({
                        info: users[i],
                        appointment: todaysingle[j],
                    });
                }
            }
        }
        for (i = 0; i < users.length; i++) {
            for (j = 0; j < todayrecurring.length; j++) {
                if (users[i].userid === todayrecurring[j].from_id) {
                    totalappointment.push({
                        info: users[i],
                        appointment: todayrecurring[j],
                    });
                }
            }
        }
        for (i = 0; i < users.length; i++) {
            for (j = 0; j < todayinstant.length; j++) {
                if (users[i].userid === todayinstant[j].from_id) {
                    totalappointment.push({
                        info: users[i],
                        appointment: todayinstant[j],
                    });
                }
            }
        }
        var completeappointmentnew = [];
        for (var a = 0; a < users.length; a++) {
            for (var b = 0; b < todaycompleteappointment.length; b++) {
                if (users[a].userid === todaycompleteappointment[b].from_id) {
                    completeappointmentnew.push({
                        info: users[a],
                        appointment: todaycompleteappointment[b],
                    });
                }
            }
        }
        this.setState({
            totalappointment: totalappointment,
            completeappointment: completeappointmentnew,
        });
        this.liveappointment();
    };
    getdatemobile = (e) => {
        this.setState({
            datepicker: e.target.value,
        });
        setTimeout(() => {
            this.getdate();
        }, 10000);
    };
    getdate = async (e) => {
        const {
            datepicker,
            months,
            year,
            single,
            recurring,
            instant,
            users,
            currentdate,
        } = this.state;
        if (datepicker === null && e.target.id !== undefined) {
            var selectdate = `${year}-${months}-${e.target.id}`;
            var today = moment(selectdate).format("YYYY-MM-DD");
            this.setState({
                Day: e.target.id,
                today: today,
            });
        } else {
            var todaynew = datepicker;
            this.setState({
                today: todaynew,
            });
        }
        this.setState({
            totalappointment: [],
            liveappointment: [],
            reseduleappointment: [],
            leaveappointment: [],
            declineappointment: [],
            completeappointment: [],
        });

        var allappointmentnew = await allappointment();
        var completeappointment = await allappointmentnew.filter((res) => {
            return res.meeting_status === "completed";
        });
        var todaysingle = single.filter((data) => {
            return data.meeting_date === today;
        });
        var todayrecurring = recurring.filter((data) => {
            return data.meeting_date === today;
        });
        var todayinstant = instant.filter((data) => {
            return data.meeting_date === today;
        });

        var todaycompleteappointment = completeappointment.filter((data) => {
            return data.meeting_date === today;
        });
        var totalappointment = [];
        for (var i = 0; i < users.length; i++) {
            for (var j = 0; j < todaysingle.length; j++) {
                if (users[i].userid === todaysingle[j].to_id) {
                    totalappointment.push({
                        info: users[i],
                        appointment: todaysingle[j],
                    });
                }
            }
        }
        for (var i = 0; i < users.length; i++) {
            for (var j = 0; j < todayrecurring.length; j++) {
                if (users[i].userid === todayrecurring[j].to_id) {
                    totalappointment.push({
                        info: users[i],
                        appointment: todayrecurring[j],
                    });
                }
            }
        }
        for (var i = 0; i < users.length; i++) {
            for (var j = 0; j < todayinstant.length; j++) {
                if (users[i].userid === todayinstant[j].to_id) {
                    totalappointment.push({
                        info: users[i],
                        appointment: todayinstant[j],
                    });
                }
            }
        }
        for (var a = 0; a < users.length; a++) {
            for (var b = 0; b < todaycompleteappointment.length; b++) {
                if (users[a].userid === todaycompleteappointment[b].to_id) {
                    totalappointment.push({
                        info: users[a],
                        appointment: todaycompleteappointment[b],
                    });
                }
            }
        }
        if (currentdate === today) {
            this.setState({
                totalappointment: totalappointment,
            });
            this.todayappointment();
        } else if (currentdate > today) {
            this.setState({
                reseduleappointment: totalappointment,
            });
        } else {
            this.setState({
                totalappointment: totalappointment,
            });
        }
    };
    handlechangeclinic = async (e) => {
        if (e.target.value !== "0") {
            const { totalappointment, liveappointment, reseduleappointment } =
                this.state;
            var mycliniclive = [],
                myclinictotal = [],
                myclinicresedule = [];
            for (var i = 0; i < liveappointment.length; i++) {
                if (liveappointment[i].appointment.clinic_name === e.target.value && liveappointment[i].appointment.decline_status !== "true") {
                    mycliniclive.push(liveappointment[i]);
                }
            }
            for (var j = 0; j < totalappointment.length; j++) {
                if (totalappointment[j].appointment.clinic_name === e.target.value && liveappointment[i].appointment.decline_status !== "true") {
                    myclinictotal.push(totalappointment[j]);
                }
            }
            for (var k = 0; k < reseduleappointment.length; k++) {
                if (reseduleappointment[k].appointment.clinic_name === e.target.value && liveappointment[i].appointment.decline_status === "true") {
                    myclinicresedule.push(reseduleappointment[k]);
                }
            }
            this.setState({
                liveappointment: mycliniclive,
                totalappointment: myclinictotal,
                reseduleappointment: myclinicresedule,
            });
        } else {
            this.todayappointment();
        }
        var allAvailability = await allavailability();
        var myavailability = await allAvailability.filter((data) => {
            return data.clinic_name === e.target.value;
        });
        this.setState({
            myavailability: myavailability,
        });
    };
    handlechangeavailable = async (e) => {
        const {
            myavailability,
            totalappointment,
            liveappointment,
            reseduleappointment,
        } = this.state;
        var single = await myavailability.filter((data) => {
            return data.availability_id === e.target.value;
        });
        var myresedule = [],
            mytotal = [],
            mylive = [];
        for (var i = 0; i < reseduleappointment.length; i++) {
            if (
                reseduleappointment[i].appointment.from_time <= single[0].from_time &&
                reseduleappointment[i].appointment.to_time >= single[0].to_time && liveappointment[i].appointment.decline_status === "true"
            ) {
                myresedule.push(reseduleappointment[i]);
            }
        }
        for (var j = 0; j < totalappointment.length; j++) {
            if (
                totalappointment[j].appointment.from_time <= single[0].from_time &&
                totalappointment[j].appointment.to_time >= single[0].to_time && liveappointment[j].appointment.decline_status === "true"
            ) {
                mytotal.push(totalappointment[j]);
            }
        }
        for (var k = 0; k < liveappointment.length; k++) {
            if (
                liveappointment[k].appointment.from_time <= single[0].from_time &&
                liveappointment[k].appointment.to_time >= single[0].to_time && liveappointment[k].appointment.decline_status === null
            ) {
                mylive.push(liveappointment[k]);
            }
        }
        this.setState({
            liveappointment: mylive,
            totalappointment: mytotal,
            reseduleappointment: myresedule,
        });
    };
    allappointment = () => {
        this.todayappointment();
    };
    sessionbefore = async () => {
        const {
            totalappointment,
            liveappointment,
            reseduleappointment,
            completeappointment,
        } = this.state;
        var sessiontotal = await totalappointment.filter((data) => {
            return data.appointment.from_time <= "12:00" && data.appointment.decline_status !== "true";
        });
        var sessionlive = await liveappointment.filter((data) => {
            return data.appointment.from_time <= "12:00" && data.appointment.decline_status !== "true";
        });
        var sessionresedule = await reseduleappointment.filter((data) => {
            return data.appointment.from_time <= "12:00" && data.appointment.decline_status === "true";
        });
        var sessioncomplete = await completeappointment.filter((data) => {
            return data.appointment.from_time <= "12:00" && data.appointment.decline_status !== "true";
        });
        this.setState({
            liveappointment: sessionlive,
            totalappointment: sessiontotal,
            reseduleappointment: sessionresedule,
            completeappointment: sessioncomplete,
        });
    };
    sessionafter = async () => {
        const {
            totalappointment,
            liveappointment,
            reseduleappointment,
            completeappointment,
        } = this.state;
        var sessiontotal = await totalappointment.filter((data) => {
            return data.appointment.from_time > "12:00" && data.appointment.decline_status !== "true";
        });
        var sessionlive = await liveappointment.filter((data) => {
            return data.appointment.from_time > "12:00" && data.appointment.decline_status !== "true";
        });
        var sessionresedule = await reseduleappointment.filter((data) => {
            return data.appointment.from_time > "12:00" && data.appointment.decline_status === "true";
        });
        var sessioncomplete = await completeappointment.filter((data) => {
            return data.appointment.from_time > "12:00" && data.appointment.decline_status !== "true";
        });
        this.setState({
            liveappointment: sessionlive,
            totalappointment: sessiontotal,
            reseduleappointment: sessionresedule,
            completeappointment: sessioncomplete,
        });
    };
    getnotification = () => {
        setTimeout(() => {
            this.notification();
        }, 10000);
    };
    notification = async () => {
        const { userid } = this.state;
        var mynotification = await axios
            .get(`${process.env.REACT_APP_SERVER}/notification/${userid}`)
            .then((res) => {
                return res.data;
            });
        if (mynotification.length !== 0) {
            var alert = [],
                alertnew = [];
            for (var i = 0; i < mynotification.length; i++) {
                if (mynotification[i].msg === "New Connection") {
                    alert.push(mynotification[i]);
                    await axios
                        .delete(
                            `${process.env.REACT_APP_SERVER}/notification/${mynotification[i].id}`
                        )
                        .then((res) => {
                            return res.data;
                        });
                }
                if (mynotification[i].msg === "New Waitingroom") {
                    alertnew.push(mynotification[i]);
                    await axios
                        .delete(
                            `${process.env.REACT_APP_SERVER}/notification/${mynotification[i].id}`
                        )
                        .then((res) => {
                            return res.data;
                        });
                }
            }
            if (alert.length !== 0) {
                toast.info("You Receive New Connection...", {
                    autoClose: 2000,
                    transition: Slide,
                });
            }
            if (alertnew.length !== 0) {
                toast.info("New Mr Join Your WaitingRoom...", {
                    autoClose: 2000,
                    transition: Slide,
                });
            }
        }
        // setTimeout(() => {
        //   this.componentDidMount();
        // }, 10000);
    };
    viewfulldetails = (e) => {
        sessionStorage.setItem("viewprofile", e.target.value);
        window.location.replace("/doctor/fulldetails");
    };
    viewfulldetailsnew = (e) => {
        sessionStorage.setItem("viewprofile", e.target.id);
        window.location.replace("/doctor/fulldetails");
    }
    declinebtn = async (e) => {
        var data = {
            decline_status: "true",
        };
        var appointment = await updateapoointment(data, e.target.id);
        if (appointment === "true") {
            window.location.reload()
        }
    };
    amendappointment = (e) => {
        sessionStorage.setItem("appointmentid", e.target.id);
        window.location.replace("/doctor/amendappointment");
    };
    render() {
        const { months, year, totalappointment, liveappointment, reseduleappointment, data, Day, myclinic, myavailability, completeappointment } = this.state

        return (
            <div className="dashboard">
                <Sidebar />
                <div className="waitingroom">
                    <Doctorlist />
                    <div className="mt-2">
                        <h5>Appointment</h5>
                    </div>
                    <div className="row">
                        <div className="col-md-3 col-6">
                            <select
                                className="form-control"
                                id="months"
                                onChange={(e) => this.handlechangecalender(e)}
                            >
                                {months !== null ? (
                                    <option value={months} selected>
                                        {months}
                                    </option>
                                ) : (
                                    ""
                                )}
                                <option value="0">Select Month</option>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </div>
                        <div className="col-md-3 yeardiv col-6">
                            <select
                                className="form-control"
                                id="year"
                                onChange={(e) => this.handlechangecalender(e)}
                            >
                                {year !== null ? (
                                    <option value={year} selected>
                                        {year}
                                    </option>
                                ) : (
                                    ""
                                )}
                                <option value="2022">2022</option>
                                <option value="2023">2023</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                                <option value="2027">2027</option>
                                <option value="2028">2028</option>
                                <option value="2029">2029</option>
                                <option value="2030">2030</option>
                                <option value="2031">2031</option>
                                <option value="2032">2032</option>
                            </select>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-6 mobiledatepicker">
                            <input
                                type="date"
                                className="form-control"
                                onChange={(e) => this.getdatemobile(e)}
                            />
                        </div>
                        <div className="col-md-10 calenderdiv">
                            <div className="wrapper2 new">
                                <button onClick={this.previousItem} id="backBtn">
                                    <AiFillCaretLeft onClick={this.previousItem} />
                                </button>
                                <ul id="calendarnew">
                                    {data.length !== 0
                                        ? data.map((data, index) =>
                                            Number(Day) === data.date ? (
                                                <li
                                                    key={index}
                                                    id={data.date}
                                                    onClick={this.getdate}
                                                    className="day liveday"
                                                    style={{ display: "grid" }}
                                                >
                                                    {data.date}
                                                    <span
                                                        className="weekDay"
                                                        id={data.date}
                                                        onClick={this.getdate}
                                                    >
                                                        {data.day}
                                                    </span>
                                                </li>
                                            ) : (
                                                <li
                                                    key={index}
                                                    id={data.date}
                                                    onClick={this.getdate}
                                                    className="day"
                                                    style={{ display: "grid" }}
                                                >
                                                    {data.date}
                                                    <span className="weekDay">{data.day}</span>
                                                </li>
                                            )
                                        )
                                        : null}
                                </ul>
                                <button id="forBtn" onClick={this.nextItem}>
                                    <AiFillCaretRight onClick={this.nextItem} />
                                </button>
                            </div>
                        </div>
                        <div className="col-md-2 col-6">
                            <div className="card text-center timecard">
                                <div className="card-body">
                                    <h6 className="headingspan">Current Time</h6>
                                    <h4 className="timespan" id="currenttime">
                                        {this.state.time}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3 flex">
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-2 col-2">
                                    <button className="editbtnn" onClick={this.allappointment}>
                                        All Appointments
                                    </button>
                                </div>
                                <div className="col-md-2 col-5">
                                    <button className="editbtn" onClick={this.sessionbefore}>
                                        Session 1
                                    </button>
                                </div>
                                <div className="col-md-2 col-5" style={{ marginLeft: "-30px" }}>
                                    <button className="editbtn" onClick={this.sessionafter}>
                                        Session 2
                                    </button>
                                </div>
                                <div className="col-md-3 col-4">
                                    <select
                                        className="form-control"
                                        id="year"
                                        onChange={(e) => this.handlechangeclinic(e)}
                                    >
                                        <option value="0">Select Clinic Name</option>
                                        {myclinic.length !== 0
                                            ? myclinic.map((data, index) => (
                                                <option key={index} value={data.clinic_name}>
                                                    {data.clinic_name}
                                                </option>
                                            ))
                                            : null}
                                    </select>
                                </div>
                                <div className="col-md-3 col-4">
                                    <select
                                        className="form-control"
                                        id="year"
                                        onChange={(e) => this.handlechangeavailable(e)}
                                    >
                                        <option value="0">Select Time Availability</option>
                                        {myavailability.length !== 0
                                            ? myavailability.map((data, index) => (
                                                <option key={index} value={data.availability_id}>
                                                    {data.from_time}-{data.to_time}
                                                </option>
                                            ))
                                            : null}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-md-10">
                            <div className="row livetablelabel">
                                <div className="col-md-3">Name</div>
                                <div className="col-md-3">Action</div>
                                <div className="col-md-3">Meeting Type</div>
                                <div className="col-md-3">Full Details</div>
                            </div>
                            <div className="row">
                                {liveappointment.length !== 0
                                    ? liveappointment.map((data, index) => (
                                        <div className="card live" key={index}>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <div className="row">
                                                            <div className="col-sm-4 col-3">
                                                                {data.info.profile_pic !== null ? (
                                                                    <img id={data.info.userid}
                                                                        onClick={this.viewfulldetailsnew}
                                                                        className="profilepictop"
                                                                        src={data.info.profile_pic}
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <img id={data.info.userid}
                                                                        onClick={this.viewfulldetailsnew}
                                                                        className="profilepictop"
                                                                        src={profilepic}
                                                                        alt=""
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="col-sm-8 col-9">
                                                                <span className="heading" id={data.info.userid}
                                                                    onClick={this.viewfulldetailsnew}>
                                                                    {data.info.initial}. {data.info.first_name}{" "}
                                                                    {data.info.last_name}
                                                                </span>
                                                                <br />
                                                                <span className="headingspan">
                                                                    Clinic: {data.appointment.clinic_name}
                                                                </span>
                                                                <br />
                                                                <span className="headingspan">
                                                                    Medical Representative
                                                                </span>
                                                                <br />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3 col-4">
                                                        <span>
                                                            Waiting for MR to join your waiting room
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-3 col-4">
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_type === null
                                                                ? "Video Call"
                                                                : data.appointment.meeting_type}
                                                        </span>
                                                        <br />
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_time}
                                                        </span>
                                                        <br />
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_date}
                                                        </span>
                                                        <br />
                                                    </div>
                                                    <div className="col-sm-2 col-4">
                                                        <button className="editbtn" value={data.info.userid}
                                                            onClick={this.viewfulldetails}>
                                                            View Full Details
                                                        </button>
                                                    </div>
                                                    <div className="col-sm-1 col-1">
                                                        <div className="dropdown dropright">
                                                            <span className="" data-toggle="dropdown">
                                                                <button className="editbtn btn-sm">
                                                                    <AiOutlineMore
                                                                        style={{ fontSize: "20px" }}
                                                                    />
                                                                </button>
                                                            </span>
                                                            <div className="dropdown-menu">
                                                                <button
                                                                    className="dropdown-item declinebtn"
                                                                    id={data.appointment.appointment_id}
                                                                    onClick={this.declinebtn}
                                                                >
                                                                    Decline
                                                                </button>
                                                                <button
                                                                    className="dropdown-item"
                                                                    id={data.appointment.appointment_id}
                                                                    onClick={this.amendappointment}
                                                                >
                                                                    Amend
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    ))
                                    : null}
                                {totalappointment.length !== 0
                                    ? totalappointment.map((data, index) => (
                                        <div className="card total" key={index}>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <div className="row">
                                                            <div className="col-sm-4 col-3">
                                                                {data.info.profile_pic !== null ? (
                                                                    <Avatar
                                                                        src={data.info.profile_pic}
                                                                        variant="rounded"
                                                                        sx={{ width: 56, height: 56 }}
                                                                    />
                                                                ) : (
                                                                    <Avatar
                                                                        src={profilepic}
                                                                        variant="rounded"
                                                                        sx={{ width: 56, height: 56 }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="col-sm-8 col-9">
                                                                <span className="heading" id={data.info.userid}
                                                                    onClick={this.viewfulldetailsnew}>
                                                                    {data.info.initial}. {data.info.first_name}{" "}
                                                                    {data.info.last_name}
                                                                </span>
                                                                <br />
                                                                <span className="headingspan">
                                                                    Clinic: {data.appointment.clinic_name}
                                                                </span>
                                                                <br />
                                                                <span className="headingspan">
                                                                    Medical Representative
                                                                </span>
                                                                <br />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3 col-4">
                                                        {data.appointment.decline_status === "true" ?
                                                            <span>
                                                                Reschedule MISSED/ CANCELLED APPOINTMENT
                                                            </span> :
                                                            <span>
                                                                Medical Representative will join meeting room to
                                                                initiate the appointment
                                                            </span>}
                                                    </div>
                                                    <div className="col-sm-3 col-4">
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_type === null
                                                                ? "Video Call"
                                                                : data.appointment.meeting_type}
                                                        </span>
                                                        <br />
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_time}
                                                        </span>
                                                        <br />
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_date}
                                                        </span>
                                                        <br />
                                                    </div>
                                                    <div className="col-sm-2 col-4">
                                                        <button className="editbtn" value={data.info.userid}
                                                            onClick={this.viewfulldetails}>
                                                            View Full Details
                                                        </button>
                                                    </div>
                                                    {data.appointment.decline_status === "true" ? null :
                                                        <div className="col-sm-1 col-1">
                                                            <div className="dropdown dropright">
                                                                <span className="" data-toggle="dropdown">
                                                                    <button className="editbtn btn-sm">
                                                                        <AiOutlineMore
                                                                            style={{ fontSize: "20px" }}
                                                                        />
                                                                    </button>
                                                                </span>
                                                                <div className="dropdown-menu">
                                                                    <button
                                                                        className="dropdown-item declinebtn"
                                                                        id={data.appointment.appointment_id}
                                                                        onClick={this.declinebtn}
                                                                    >
                                                                        Decline
                                                                    </button>
                                                                    <button
                                                                        className="dropdown-item"
                                                                        id={data.appointment.appointment_id}
                                                                        onClick={this.amendappointment}
                                                                    >
                                                                        Amend
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>}

                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : null}
                                {reseduleappointment.length !== 0
                                    ? reseduleappointment.map((data, index) => (
                                        <div className="card resedule" key={index}>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <div className="row">
                                                            <div className="col-sm-4 col-3">
                                                                {data.info.profile_pic !== null ? (
                                                                    <Avatar
                                                                        src={data.info.profile_pic}
                                                                        variant="rounded"
                                                                        sx={{ width: 56, height: 56 }}
                                                                    />
                                                                ) : (
                                                                    <Avatar
                                                                        src={profilepic}
                                                                        variant="rounded"
                                                                        sx={{ width: 56, height: 56 }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="col-sm-8 col-9">
                                                                <span className="heading" id={data.info.userid}
                                                                    onClick={this.viewfulldetailsnew}>
                                                                    {data.info.initial}. {data.info.first_name}{" "}
                                                                    {data.info.last_name}
                                                                </span>
                                                                <br />
                                                                <span className="headingspan">
                                                                    Clinic: {data.appointment.clinic_name}
                                                                </span>
                                                                <br />
                                                                <span className="headingspan">
                                                                    Medical Representative
                                                                </span>
                                                                <br />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3 col-4">
                                                        <span className="text-danger">
                                                            Meeting Missed
                                                        </span>
                                                    </div>
                                                    <div className="col-sm-3 col-4">
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_type === null
                                                                ? "Video Call"
                                                                : data.appointment.meeting_type}
                                                        </span>
                                                        <br />
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_time}
                                                        </span>
                                                        <br />
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_date}
                                                        </span>
                                                        <br />
                                                    </div>
                                                    <div className="col-sm-3 col-4">
                                                        <button className="editbtn" value={data.info.userid}
                                                            onClick={this.viewfulldetails}>
                                                            View Full Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : null}

                                {completeappointment.length !== 0
                                    ? completeappointment.map((data, index) => (
                                        <div className="card total" key={index}>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <div className="row">
                                                            <div className="col-sm-4 col-3">
                                                                {data.info.profile_pic !== null ? (
                                                                    <Avatar
                                                                        src={data.info.profile_pic}
                                                                        variant="rounded"
                                                                        sx={{ width: 56, height: 56 }}
                                                                    />
                                                                ) : (
                                                                    <Avatar
                                                                        src={profilepic}
                                                                        variant="rounded"
                                                                        sx={{ width: 56, height: 56 }}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="col-sm-8 col-9">
                                                                <span className="heading" id={data.info.userid}
                                                                    onClick={this.viewfulldetailsnew}>
                                                                    {data.info.initial}. {data.info.first_name}{" "}
                                                                    {data.info.last_name}
                                                                </span>
                                                                <br />
                                                                <span className="headingspan">
                                                                    Clinic: {data.appointment.clinic_name}
                                                                </span>
                                                                <br />
                                                                <span className="headingspan">
                                                                    Medical Representative
                                                                </span>
                                                                <br />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3 col-4">
                                                        <span>Meeting Completed</span>
                                                    </div>
                                                    <div className="col-sm-3 col-4">
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_type === null
                                                                ? "Video Call"
                                                                : data.appointment.meeting_type}
                                                        </span>
                                                        <br />
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_time}
                                                        </span>
                                                        <br />
                                                        <span className="headingspan">
                                                            {data.appointment.meeting_date}
                                                        </span>
                                                        <br />
                                                    </div>
                                                    <div className="col-sm-3 col-4">
                                                        <button className="editbtn" value={data.info.userid}
                                                            onClick={this.viewfulldetails}>
                                                            View Full Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : null}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='bottomnavigation'>
                    <Navigation />
                </div>
                <ToastContainer />
            </div>

        )
    }
}
