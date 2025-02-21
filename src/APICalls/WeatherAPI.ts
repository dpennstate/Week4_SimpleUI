import {config} from "../config";
import axios from "axios";
const weatherEndpoint = "weather/"
const currentWeatherAPI = weatherEndpoint + "current"
const historicalWeatherAPI = weatherEndpoint + "historical"
const historicalAggregationWeatherAPI = weatherEndpoint + "historical-aggregation"
const summaryWeatherAPI = weatherEndpoint + "summary"
const weatherAxiosConfig = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}
export const currentWeather = async(area: string | null, zip: string | null) => {
    try {
        const env = config.USE_LOCAL_API ? config.LOCAL_WEATHER_API: config.EXTERNAL_URL
        const weatherURL = `${env}${currentWeatherAPI}`
        const payload = {
            area: area,
            zip: zip
        }

        const response = await axios.post(weatherURL, payload, weatherAxiosConfig)

        if (response.status === 200) {
            console.log("The response of current weather is ")
            console.log(response)
            return {data: response.data, success: true}
        }
        else {
            // The call returned something other than 200 like 400 or 500
            console.log("The response of current weather is ")
            console.log(response)
            return {data: response.data, success: false}
        }
    }catch(error) {
        console.log("The error of current weather is ")
        console.log(error)
        return {data: "Exception occurred while processing request", success: false}
    }
}

export const historicalWeather = async(area: string | null, zip: string | null, historyTimeStamp: string) => {
    try {
        const env = config.USE_LOCAL_API ? config.LOCAL_WEATHER_API: config.EXTERNAL_URL
        const weatherURL = `${env}${historicalWeatherAPI}`
        const payload = {
            area: area,
            zip: zip,
            ts: historyTimeStamp
        }

        const response = await axios.post(weatherURL, payload, weatherAxiosConfig)

        if (response.status === 200) {
            console.log("The response of historical weather is ")
            console.log(response)
            return {data: response.data, success: true}

        }
        else {
            // The call returned something other than 200 like 400 or 500
            console.log("The response of historical weather is ")
            console.log(response)
            return {data: response.data, success: false}

        }
    }catch(error) {
        console.log("The response of historical weather is ")
        console.log(error)
        return {data: "Exception occurred while processing request", success: false}

    }
}

export const historicalAggregationWeather = async(area: string | null, zip: string | null, historyDateTime: string) => {
    try {
        const env = config.USE_LOCAL_API ? config.LOCAL_WEATHER_API: config.EXTERNAL_URL
        const weatherURL = `${env}${historicalAggregationWeatherAPI}`
        const payload = {
            area: area,
            zip: zip,
            dt: historyDateTime
        }

        const response = await axios.post(weatherURL, payload, weatherAxiosConfig)

        if (response.status === 200) {
            console.log("The response of historical aggregation weather is ")
            console.log(response)
            return {data: response.data, success: true}

        }
        else {
            // The call returned something other than 200 like 400 or 500
            console.log("The response of historical aggregation weather is ")
            console.log(response)
            return {data: response.data, success: false}

        }
    }catch(error) {
        console.log("The error of historical aggregation weather is ")
        console.log(error)
        return {data: "Exception occurred while processing request", success: false}

    }
}

export const summaryWeather = async(area: string | null, zip: string | null) => {
    try {
        const env = config.USE_LOCAL_API ? config.LOCAL_WEATHER_API: config.EXTERNAL_URL
        const weatherURL = `${env}${summaryWeatherAPI}`
        const payload = {
            area: area,
            zip: zip
        }

        const response = await axios.post(weatherURL, payload, weatherAxiosConfig)

        if (response.status === 200) {
            console.log("The response of summary weather is ")
            console.log(response)
            return {data: response.data, success: true}

        }
        else {
            // The call returned something other than 200 like 400 or 500
            console.log("The response of summary weather is ")
            console.log(response)
            return {data: response.data, success: false}

        }
    }catch(error) {
        console.log("The error of summary weather is ")
        console.log(error)
        return {data: "Exception occurred while processing request", success: false}

    }
}