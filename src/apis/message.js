import { message } from '../axios/index'


export const newmessage = async (data) => {
    var newmessage = await message.post(`/add`, data).then((res) => { return res.data }).catch((err) => { return err.response })
    return newmessage
}

export const allmessage = async (connectionid) => {
    var allmessage = await message.get(`/view/${connectionid}`).then((res) => { return res.data }).catch((err) => { return err.response })
    return allmessage
}

export const totalmessage = async () => {
    var allmessage = await message.get(`/all`).then((res) => { return res.data }).catch((err) => { return err.response })
    return allmessage
}