
import { notification } from "../axios"


export const newnotification = async (data) => {
    var newnotification = await notification.post(`/`,data).then((res) => { return res.data }).catch((err) => { return err.response })
    return newnotification
}

export const newnotificationmsgnew = async (data) => {
    var newnotificationmsg = await notification.post(`/msg/create`,data).then((res) => { return res.data }).catch((err) => { return err.response })
    return newnotificationmsg
}