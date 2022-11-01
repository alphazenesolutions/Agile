import { connection } from '../axios/index'

export const allconnection = async () => {
    var allconnection = await connection.get(`/connect`).then((res) => { return res.data }).catch((err) => { return err.response })
    return allconnection
}

export const updateconnection = async (connectionid) => {
    var allconnection = await connection.post(`/updatemsgcount/${connectionid}`).then((res) => { return res.data }).catch((err) => { return err.response })
    return allconnection
}
export const updateconnectionfrom = async (connectionid) => {
    var allconnection = await connection.post(`/updatemsgcountfrom/${connectionid}`).then((res) => { return res.data }).catch((err) => { return err.response })
    return allconnection
}

export const updateconnectionzero = async (data, connectionid) => {
    var allconnection = await connection.post(`/update/${connectionid}`, data).then((res) => { return res.data }).catch((err) => { return err.response })
    return allconnection
}

