import React, {useState} from "react";
import {SubmitButton, W4FlexColumn, W4Input, W4InputLabel, W4SubpageHeader} from "../../Utils/styling";
import BasicGrid, {IColumn, IGridRowData} from "../../Components/BasicGrid";
import Banner, {BannerType, IBannerInfo} from "../../Components/Banner";
import styled from "styled-components";
import {currentWeather} from "../../APICalls/WeatherAPI";
import {kelvinToF, openWeatherDate} from "../../Utils/SharedFunctions";

const currentWeatherColumns: IColumn[] = [
    {key: "location", columnName: "Location", columnDataType: "string"},
    {key: "date", columnName: "Date", columnDataType: "string"},
    {key: "sunrise", columnName: "Sunrise", columnDataType: "string"},
    {key: "sunset", columnName: "Sunset", columnDataType: "string"},
    {key: "temperature", columnName: "Temperature (F)", columnDataType: "string"},
    {key: "feels_like", columnName: "Feels Like (F)", columnDataType: "string"},
    {key: "pressure", columnName: "Pressure", columnDataType: "string"},
    {key: "humidity", columnName: "Humidity", columnDataType: "string"},
    {key: "dew_point", columnName: "Dew Point", columnDataType: "string"},
    {key: "uvi", columnName: "UVI", columnDataType: "string"},
    {key: "clouds", columnName: "Clouds", columnDataType: "string"},
    {key: "visibility", columnName: "Visibility", columnDataType: "string"},
    {key: "wind_speed", columnName: "Wind Speed", columnDataType: "string"},
    {key: "wind_deg", columnName: "Wind Degrees", columnDataType: "string"},
    {key: "weather_description", columnName: "Weather Desc", columnDataType: "string"}
]

const CurrentWeather: React.FC = () => {
    const [area, setArea] = useState<string>("")
    const areaLengthLimit = 100
    const [zip, setZip] = useState<string>("")
    const zipLength = 5
    const [currentWeatherRowData, setCurrentWeatherRowData] = useState<IGridRowData[] | []>([])
    const [showBanner, setShowBanner] = useState<boolean>(false)


    const closeCurrentWeatherBanner = () => {
        setShowBanner(false)
    }

    const [weatherBannerInfo, setWeatherBannerInfo] = useState<IBannerInfo>({
        bannerMessage: "Error has happened for request",
        bannerType: BannerType.INFO
    })

    const validateArea = (areaParam: string) => {
        if ((areaParam.match(/^[A-Za-z]+$/) !== null && areaParam.length <= areaLengthLimit) || areaParam === "") {
            return true
        }
        return false
    }

    const validateZip = (zipParam: string) => {
        if ((zipParam.match(/^[0-9]+$/) !== null && zipParam.length <= zipLength) || zipParam === "") {
            return true
        }
        return false
    }

    // match(/^[A-Za-z]+$/) !== null
    const setAreaFunc = (areaParam: any) => {
        if (validateArea(areaParam.target.value)) {
            setArea(areaParam.target.value)
        }
    }

    const setZipFunc = (zipParam: any) => {
        if (validateZip(zipParam.target.value)) {
            setZip(zipParam.target.value)
        }
    }

    const getCurrentWeather = () => {
        currentWeather(area, zip).then((value: {data: any, success: boolean}) => {
            if (value.success) {
                console.log(value.data)
                if (value.data.data.current !== undefined) {
                    const cur = value.data.data.current
                    const currentWeather = {
                        data: [
                            {columnKey: "location", value: area !== "" ? area : zip},
                            {columnKey: "date", value: openWeatherDate(cur.dt)},
                            {columnKey: "sunrise", value: openWeatherDate(cur.sunrise)},
                            {columnKey: "sunset", value: openWeatherDate(cur.sunset)},
                            {columnKey: "temperature", value: kelvinToF(cur.temp)},
                            {columnKey: "feels_like", value: kelvinToF(cur.feels_like)},
                            {columnKey: "pressure", value: cur.pressure},
                            {columnKey: "humidity", value: cur.humidity},
                            {columnKey: "dew_point", value: kelvinToF(cur["dew_point"])},
                            {columnKey: "uvi", value: cur.uvi},
                            {columnKey: "clouds", value: cur.clouds},
                            {columnKey: "visibility", value: cur.visibility},
                            {columnKey: "wind_speed", value: cur["wind_speed"]},
                            {columnKey: "wind_deg", value: cur["wind_deg"]},
                            {columnKey: "wind_gust", value: cur["wind_gust"]},
                            {columnKey: "weather_description", value: cur.weather[0].main + ` (${cur.weather[0].description})`},
                        ]
                    }
                    setCurrentWeatherRowData([currentWeather])
                    setArea("")
                    setZip("")
                }
            }
            else {
                console.log(value.data)
                setWeatherBannerInfo({bannerMessage: "Something went wrong during call", bannerType: BannerType.ERROR})
                setShowBanner(true)
                setCurrentWeatherRowData([])
            }
        }).catch((error) => {
            console.log("Exception occurred in when viewing current weather: ", error)
            setWeatherBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
            setShowBanner(true)
            setCurrentWeatherRowData([])
        })
    }


    return (
        <CurrentWeatherWrapper>
            <W4SubpageHeader>Current Weather</W4SubpageHeader>
            <Banner bannerInfo={weatherBannerInfo} showBanner={showBanner} closeBannerCallback={closeCurrentWeatherBanner}/>
            <div>
                <W4InputLabel>Area:</W4InputLabel>
                <W4Input onChange={setAreaFunc} value = {area} placeholder={"Put in value such as Atlanta or London"}
                disabled={zip !== ""}/>
            </div>
            <div>
                <W4InputLabel>Zip:</W4InputLabel>
                <W4Input onChange={setZipFunc} value = {zip} placeholder={"Put in value such as 33567"}
                disabled = {area !== ""}/>
            </div>
            <SubmitButton onClick={getCurrentWeather} disabled={(zip === "" || zip.length !== zipLength || !validateZip(zip))
            && (area === "" || !validateArea(area))}>Get Current Weather</SubmitButton>
            <BasicGrid columns={currentWeatherColumns} rowData={currentWeatherRowData} nowRowDataMessage={"No Current Weather to Display"}/>
        </CurrentWeatherWrapper>
    )
}
const CurrentWeatherWrapper = styled(W4FlexColumn)`
  align-items: center;
  overflow-x: auto;
`
export default CurrentWeather