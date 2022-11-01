import {register} from '../axios/index'


export const newregister = async (data) => {
    var newregister = await register.post(`/add`, data).then((res) => { return res.data }).catch((err) => { return err.response })
    return newregister
}

export const allregister = async () => {
    var allregister = await register.get(`/`).then((res) => { return res.data }).catch((err) => { return err.response })
    return allregister
}