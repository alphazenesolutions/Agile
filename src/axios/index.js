import axios from "axios"

export const connection = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER}/connection`
})

export const clinic = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER}/clinic`,
})

export const availability = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER}/availability`,
})

export const appointment = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER}/appointment`,
})

export const notification = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER}/notification`,
})

export const participate = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER}/participate`,
})

export const message = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER}/message`,
})

export const register = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER}/users`,
})