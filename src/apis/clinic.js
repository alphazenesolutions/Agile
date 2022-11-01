import { clinic } from "../axios"


export const singlecart = async () => {
    var singleclinic = await clinic.get(`/`).then((res) => { return res.data }).catch((err) => { return err.response })
    return singleclinic
}