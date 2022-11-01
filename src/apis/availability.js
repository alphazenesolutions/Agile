
import { availability } from "../axios"


export const allavailability = async () => {
    var allavailability = await availability.get(`/all`).then((res) => { return res.data }).catch((err) => { return err.response })
    return allavailability
}