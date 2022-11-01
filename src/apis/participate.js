import {participate} from '../axios/index'


export const newparticipate = async (data) => {
    var newparticipate = await participate.post(`/add`, data).then((res) => { return res.data }).catch((err) => { return err.response })
    return newparticipate
}

export const allparticipate = async () => {
    var allparticipate = await participate.get(`/view`).then((res) => { return res.data }).catch((err) => { return err.response })
    return allparticipate
}