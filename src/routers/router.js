import Login from "../pages/login";
import Signup from "../pages/signup";
import profile from "../pages/drprofile/profile";
import Clinic from "../pages/drprofile/clinic";
import Access from "../pages/drprofile/allowaccess";
import Profilereview from "../pages/drprofile/review";
import Timimg from "../pages/drprofile/timimg";
import Profilemr from "../pages/mrprofile/profile";
import companymr from "../pages/mrprofile/company";
import reviewmr from "../pages/mrprofile/review";
import routeplan from "../pages/mrprofile/routeplan";
import Profilerecp from "../pages/recprofile/profile";
import Hospitalaccess from "../pages/recprofile/hospitalaccess";
import reviewrecp from "../pages/recprofile/review";
import profilenonmr from "../pages/nonmrprofile/profile";
import companynonmr from "../pages/nonmrprofile/company";
import teamplan from "../pages/nonmrprofile/teamplan";
import review from "../pages/nonmrprofile/review";
//Doctor
import waitingroom from "../pages/Doctor/waitingroom";
import appointment from "../pages/Doctor/appointment";
import connection from "../pages/Doctor/connection";
import tutorial from "../pages/Doctor/tutorial";
import notification from "../pages/Doctor/notification";
import messages from "../pages/Doctor/messages";
import fulldetails from "../pages/Doctor/fulldetails";
import approveappoitment from "../pages/Doctor/approveappointment";
import reportdr from "../pages/Doctor/report";
import amendappointmentdr from "../pages/Doctor/amendappointment";

//Mr
import waitingroommr from "../pages/Mr/waitingroom";
import appointmentmr from "../pages/Mr/appointment";
import connectionmr from "../pages/Mr/connection";
import tutorialmr from "../pages/Mr/tutorial";
import notificationmr from "../pages/Mr/notification";
import messagesmr from "../pages/Mr/messages";
import instant from "../pages/Mr/instant";
import setappointment from "../pages/Mr/setappointment";
import reseduleappointment from "../pages/Mr/reseduleappointment";
import amendappointment from "../pages/Mr/amendappointment";
import fulldetailsmr from "../pages/Mr/fulldetails";
import reportmr from "../pages/Mr/report";
import resedulelist from "../pages/Mr/resedulelist";

//Receptionist
import waitingroomrep from "../pages/Receptionist/waitingroom";
import appointmentrep from "../pages/Receptionist/appointment";
import connectionrep from "../pages/Receptionist/connection";
import approveappointment from "../pages/Receptionist/approveappointment";
import notificationrecp from "../pages/Receptionist/notification";
import messagesrecp from "../pages/Receptionist/messages";
import tutorialrecp from "../pages/Receptionist/tutorial";

//Non Mr
import waitingroomnonmr from "../pages/NonMr/waitingroom";
import appointmentnonmr from "../pages/NonMr/appoitment";
import connectionnonmr from "../pages/NonMr/connection";
import messagesnonmr from "../pages/NonMr/messages";
import notificationnonmr from "../pages/NonMr/notification";
import tutorialnonmr from "../pages/NonMr/tutorial";

import Dashboard from "../pages/Dashboard/Dashboard";
import TempLogin from "../pages/Login/Login";
// Dr Edit
import Review_edit from "../pages/drprofile/Review_edit";
import Clinic_edit_dr from "../pages/drprofile/Clinic_edit_dr";
import profile_dr_edit from "../pages/drprofile/profile_dr_edit";
import Timing_dr_edit from "../pages/drprofile/Timing_dr_edit";
// mr_review_edit
import mr_review_edit from "../pages/mrprofile/mr_review_edit";
import mr_profile_edit from "../pages/mrprofile/mr_profile_edit";
import mr_company_edit from "../pages/mrprofile/mr_company_edit";

// rec_review_edit
import rec_review_edit from "../pages/recprofile/rec_review_edit";
import rec_profile_edit from "../pages/recprofile/rec_profile_edit";

// non mr
import nonmr_review_edit from "../pages/nonmrprofile/nonmr_review_edit";
import nonmr_profile_edit from "../pages/nonmrprofile/nonmr_profile_edit";
import nonmr_company_edit from "../pages/nonmrprofile/nonmr_company_edit";

export const routers = [
  {
    path: "/",
    components: TempLogin,
    name: "Index",
    isprivate: false,
  },
  {
    path: "/templogin",
    components: TempLogin,
    name: "Index",
    isprivate: false,
  },
  {
    path: "/login",
    components: Login,
    name: "Login",
    isprivate: false,
  },
  {
    path: "/dashboard",
    components: Dashboard,
    name: "Dashboard",
    isprivate: false,
  },

  {
    path: "/signup",
    components: Signup,
    name: "Signup",
    isprivate: false,
  },
  {
    path: "/dr_profile",
    components: profile,
    name: "profile",
    isprivate: false,
  },
  {
    path: "/dr_clinic",
    components: Clinic,
    name: "Clinic",
    isprivate: false,
  },
  {
    path: "/dr_access",
    components: Access,
    name: "Access",
    isprivate: false,
  },
  {
    path: "/dr_profilereview",
    components: Profilereview,
    name: "Profilereview",
    isprivate: false,
  },
  // doctor_edit
  {
    path: "/Review_edit_Doctor",
    components: Review_edit,
    name: "Review_edit_Doctor",
    isprivate: false,
  },
  {
    path: "/Clinic_edit_dr",
    components: Clinic_edit_dr,
    name: "Clinic_edit_dr",
    isprivate: false,
  },
  {
    path: "/profile_dr_edit",
    components: profile_dr_edit,
    name: "profile_dr_edit",
    isprivate: false,
  },
  {
    path: "/Timing_dr_edit",
    components: Timing_dr_edit,
    name: "Timing_dr_edit",
    isprivate: false,
  },

  {
    path: "/dr_clinictimimg",
    components: Timimg,
    name: "Timimg",
    isprivate: false,
  },
  // mr_review_edit

  {
    path: "/mr_review_edit",
    components: mr_review_edit,
    name: "mr_review_edit",
    isprivate: false,
  },
  {
    path: "/mr_profile_edit",
    components: mr_profile_edit,
    name: "mr_profile_edit",
    isprivate: false,
  },
  {
    path: "/mr_company_edit",
    components: mr_company_edit,
    name: "mr_company_edit",
    isprivate: false,
  },
  //
  {
    path: "/mr_profile",
    components: Profilemr,
    name: "Profilemr",
    isprivate: false,
  },
  {
    path: "/mr_company",
    components: companymr,
    name: "companymr",
    isprivate: false,
  },
  {
    path: "/mr_review",
    components: reviewmr,
    name: "reviewmr",
    isprivate: false,
  },
  {
    path: "/mr_routeplan",
    components: routeplan,
    name: "routeplan",
    isprivate: false,
  },
  // rec_review_edit

  {
    path: "/rec_review_edit",
    components: rec_review_edit,
    name: "rec_review_edit",
    isprivate: false,
  },
  {
    path: "/rec_profile_edit",
    components: rec_profile_edit,
    name: "rec_profile_edit",
    isprivate: false,
  },
  //
  {
    path: "/recp_profile",
    components: Profilerecp,
    name: "Profilerecp",
    isprivate: false,
  },
  {
    path: "/recp_hospitalaccess",
    components: Hospitalaccess,
    name: "Hospitalaccess",
    isprivate: false,
  },
  {
    path: "/recp_review",
    components: reviewrecp,
    name: "reviewrecp",
    isprivate: false,
  },
  // nonmr_review_edit

  {
    path: "/nonmr_review_edit",
    components: nonmr_review_edit,
    name: "nonmr_review_edit",
    isprivate: false,
  },
  {
    path: "/nonmr_profile_edit",
    components: nonmr_profile_edit,
    name: "nonmr_profile_edit",
    isprivate: false,
  },
  {
    path: "/nonmr_company_edit",
    components: nonmr_company_edit,
    name: "nonmr_company_edit",
    isprivate: false,
  },
  //
  {
    path: "/nonmr_profile",
    components: profilenonmr,
    name: "profilenonmr",
    isprivate: false,
  },
  {
    path: "/nonmr_company",
    components: companynonmr,
    name: "companynonmr",
    isprivate: false,
  },
  {
    path: "/nonmr_team",
    components: teamplan,
    name: "teamplan",
    isprivate: false,
  },
  {
    path: "/nonmr_review",
    components: review,
    name: "review",
    isprivate: false,
  },
  {
    path: "/doctor/waitingroom",
    components: waitingroom,
    name: "waitingroom",
    isprivate: false,
  },
  {
    path: "/doctor/appointment",
    components: appointment,
    name: "appointment",
    isprivate: false,
  },
  {
    path: "/doctor/connection/:touserid",
    components: connection,
    name: "connection",
    isprivate: false,
  },
  {
    path: "/doctor/connection",
    components: connection,
    name: "connection",
    isprivate: false,
  },
  {
    path: "/doctor/tutorial",
    components: tutorial,
    name: "tutorial",
    isprivate: false,
  },
  {
    path: "/doctor/notification",
    components: notification,
    name: "notification",
    isprivate: false,
  },
  {
    path: "/doctor/messages",
    components: messages,
    name: "messages",
    isprivate: false,
  },
  {
    path: "/mr/waitingroom",
    components: waitingroommr,
    name: "waitingroommr",
    isprivate: false,
  },
  {
    path: "/mr/appointment",
    components: appointmentmr,
    name: "appointmentmr",
    isprivate: false,
  },
  {
    path: "/mr/connection",
    components: connectionmr,
    name: "connectionmr",
    isprivate: false,
  },
  {
    path: "/mr/connection/:touserid",
    components: connectionmr,
    name: "connectionmr",
    isprivate: false,
  },
  {
    path: "/mr/tutorial",
    components: tutorialmr,
    name: "tutorialmr",
    isprivate: false,
  },
  {
    path: "/mr/notification",
    components: notificationmr,
    name: "notificationmr",
    isprivate: false,
  },
  {
    path: "/mr/resedulelist",
    components: resedulelist,
    name: "resedulelist",
    isprivate: false,
  },

  {
    path: "/mr/fulldetails",
    components: fulldetailsmr,
    name: "fulldetailsmr",
    isprivate: false,
  },

  {
    path: "/mr/messages",
    components: messagesmr,
    name: "messagesmr",
    isprivate: false,
  },
  {
    path: "/doctor/fulldetails",
    components: fulldetails,
    name: "fulldetails",
    isprivate: false,
  },
  {
    path: "/doctor/approve",
    components: approveappoitment,
    name: "approveappoitment",
    isprivate: false,
  },
  {
    path: "/mr/instantappointments",
    components: instant,
    name: "instant",
    isprivate: false,
  },
  {
    path: "/mr/setappointments",
    components: setappointment,
    name: "setappointment",
    isprivate: false,
  },
  {
    path: "/mr/reseduleappointments",
    components: reseduleappointment,
    name: "reseduleappointment",
    isprivate: false,
  },
  {
    path: "/mr/amendappointment",
    components: amendappointment,
    name: "amendappointment",
    isprivate: false,
  },
  {
    path: "/receptionist/waitingroom",
    components: waitingroomrep,
    name: "waitingroomrep",
    isprivate: false,
  },
  {
    path: "/receptionist/appointment",
    components: appointmentrep,
    name: "appointmentrep",
    isprivate: false,
  },
  {
    path: "/receptionist/connection",
    components: connectionrep,
    name: "connectionrep",
    isprivate: false,
  },
  {
    path: "/receptionist/approveappointment",
    components: approveappointment,
    name: "approveappointment",
    isprivate: false,
  },
  {
    path: "/receptionist/notification",
    components: notificationrecp,
    name: "notificationrecp",
    isprivate: false,
  },
  {
    path: "/receptionist/message",
    components: messagesrecp,
    name: "messagesrecp",
    isprivate: false,
  },
  {
    path: "/receptionist/tutorial",
    components: tutorialrecp,
    name: "tutorialrecp",
    isprivate: false,
  },

  {
    path: "/nonmr/waitingroom",
    components: waitingroomnonmr,
    name: "waitingroomnonmr",
    isprivate: false,
  },
  {
    path: "/nonmr/appointment",
    components: appointmentnonmr,
    name: "appointmentnonmr",
    isprivate: false,
  },
  {
    path: "/nonmr/connection",
    components: connectionnonmr,
    name: "connectionnonmr",
    isprivate: false,
  },
  {
    path: "/nonmr/notification",
    components: notificationnonmr,
    name: "notificationnonmr",
    isprivate: false,
  },
  {
    path: "/nonmr/tutorial",
    components: tutorialnonmr,
    name: "tutorialnonmr",
    isprivate: false,
  },
  {
    path: "/nonmr/messages",
    components: messagesnonmr,
    name: "messagesnonmr",
    isprivate: false,
  },
  {
    path: "/mr/report",
    components: reportmr,
    name: "reportmr",
    isprivate: false,
  },
  {
    path: "/doctor/report",
    components: reportdr,
    name: "reportdr",
    isprivate: false,
  },
  {
    path: "/doctor/amendappointment",
    components: amendappointmentdr,
    name: "amendappointmentdr",
    isprivate: false,
  },
];
