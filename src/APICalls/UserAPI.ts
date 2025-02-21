import {config} from "../config";
import axios from "axios";
const userEndpoint = "user/"
const loginThirdPartyAPI = userEndpoint + "loginThirdParty"
const logoutAPI = userEndpoint + "logout"

export const loginUserCallbackThirdParty = async(encryptedCredential: string) => {
    try{
        const env = config.USE_LOCAL_API ? config.LOCAL_SOCIAL_MEDIA_API : config.EXTERNAL_URL
        const loginURL = `${env}${loginThirdPartyAPI}`
        const payLoad = {
            usercred: encryptedCredential
        }

        const response = await axios.post(loginURL, payLoad, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        })

        if (response.status === 200) {
            console.log("The response of login User Callback Third Party is ")
            console.log(response)
            return {success: true, data: response.data.user}
        }
        else {
            console.log("The response of login User Callback Third Party is ")
            console.log(response)
            return {success: false, data: response.data.message}
        }
    }catch(error){
        console.log("The error of login User Callback Third Party is ")
        console.log(error)
        return {success: false, data: "An error occurred during request"}
    }
}

export const logout = async() => {
    try{
        const env = config.USE_LOCAL_API ? config.LOCAL_SOCIAL_MEDIA_API : config.EXTERNAL_URL
        const logoutURL = `${env}${logoutAPI}`

        const response = await axios.post(logoutURL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            credentials: "include"
        })

        if (response.status === 200) {
            console.log("The response of logout is ")
            console.log(response)
            return {success: true, data: response.data.message}
        }
        else {
            console.log("The response of logout is ")
            console.log(response)
            return {success: false, data: response.data.message}
        }
    }catch(error){
        console.log("The error of logout is ")
        console.log(error)
        return {success: false, data: "An error occurred during request"}
    }
}