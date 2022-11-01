
import { appointment } from "../axios"


export const newappointment = async (data) => {
    var newappointment = await appointment.post(`/`, data).then((res) => { return res.data }).catch((err) => { return err.response })
    return newappointment
}

export const allappointment = async () => {
    var allappointment = await appointment.get(`/all`).then((res) => { return res.data }).catch((err) => { return err.response })
    return allappointment
}

export const singleappointment = async () => {
    var allappointment = await appointment.get(`/single`).then((res) => { return res.data }).catch((err) => { return err.response })
    return allappointment
}


export const recurringappointment = async () => {
    var recurringappointment = await appointment.get(`/recurring`).then((res) => { return res.data }).catch((err) => { return err.response })
    return recurringappointment
}

export const instantappointment = async () => {
    var instantappointment = await appointment.get(`/intsnt`).then((res) => { return res.data }).catch((err) => { return err.response })
    return instantappointment
}
export const oneapoointment = async (appointment_id) => {
    var oneapoointment = await appointment.get(`/${appointment_id}`).then((res) => { return res.data }).catch((err) => { return err.response })
    return oneapoointment
}

export const updateapoointment = async (data,appointment_id) => {
    var updateapoointment = await appointment.post(`/update/${appointment_id}`,data).then((res) => { return res.data }).catch((err) => { return err.response })
    return updateapoointment
}
export const updateapoointmentmeeting = async (data,meeting_id) => {
    var updateapoointmentmeeting = await appointment.post(`/meetupdate/${meeting_id}`,data).then((res) => { return res.data }).catch((err) => { return err.response })
    return updateapoointmentmeeting
}
export const deleteapoointment = async (appointment_id) => {
    var deleteapoointment = await appointment.delete(`/${appointment_id}`).then((res) => { return res.data }).catch((err) => { return err.response })
    return deleteapoointment
}