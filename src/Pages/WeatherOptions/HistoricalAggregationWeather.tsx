import React, {useState} from "react";
import {SubmitButton, W4FlexColumn, W4Input, W4InputLabel, W4SubpageHeader} from "../../Utils/styling";
import BasicGrid, {IColumn, IGridRowData} from "../../Components/BasicGrid";
import Banner, {BannerType, IBannerInfo} from "../../Components/Banner";
import {historicalAggregationWeather} from "../../APICalls/WeatherAPI";
import styled from "styled-components";
import {kelvinToF} from "../../Utils/SharedFunctions";

const historicalAggregationWeatherColumns: IColumn[] = [
    {key: "location", columnName: "Location", columnDataType: "string"},
    {key: "date", columnName: "Date", columnDataType: "string"},
    {key: "cloud_cover", columnName: "Cloud Cover", columnDataType: "string"},
    {key: "humidity", columnName: "Humidity", columnDataType: "string"},
    {key: "precipitation", columnName: "Precipitation", columnDataType: "string"},
    {key: "min_temperature", columnName: "Minimum Temperature (F)", columnDataType: "string"},
    {key: "max_temperature", columnName: "Maximum Temperature (F)", columnDataType: "string"},
    {key: "morning_temperature", columnName: "Morning Temperature (F)", columnDataType: "string"},
    {key: "afternoon_temperature", columnName: "Afternoon Temperature (F)", columnDataType: "string"},
    {key: "evening_temperature", columnName: "Evening Temperature (F)", columnDataType: "string"},
    {key: "night_temperature", columnName: "Night Temperature (F)", columnDataType: "string"},
    {key: "pressure", columnName: "Pressure", columnDataType: "string"},
    {key: "wind_max_speed", columnName: "Wind Max Speed", columnDataType: "string"},
    {key: "wind_direction", columnName: "Wind Direction", columnDataType: "string"}
]


const HistoricalAggregationWeather: React.FC = () => {
    const [area, setArea] = useState<string>("")
    const areaLengthLimit = 100
    const [zip, setZip] = useState<string>("")
    const zipLength = 5
    const [date, setDate] = useState<string>("")
    const dateLength = 8
    const [historicalAggregationWeatherRowData, setHistoricalAggregationWeatherRowData] = useState<IGridRowData[] | []>([])
    const [showBanner, setShowBanner] = useState<boolean>(false)


    const closeHistoricalAggregationWeatherBanner = () => {
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

    const validateDate = (dateParam: string) => {
        return (dateParam.match(/^[0-9]+$/) !== null && dateParam.length <= dateLength)
            || dateParam === ""
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

    const setDateFunc = (dateParam: any) => {
        if (validateDate(dateParam.target.value.replaceAll('-', ''))) {
            let noHyphDate = dateParam.target.value.replaceAll('-', '')
            let newDate = ""

            for (let i = 0; i < noHyphDate.length; i++) {
                if (i === 4 || i === 6) {
                    newDate += "-"
                }
                newDate += noHyphDate[i]
            }
            setDate(newDate)
        }
    }

    const getHistoricalAggregationWeather = () => {
        historicalAggregationWeather(area, zip, date).then((value: {data: any, success: boolean}) => {
            if (value.success) {
                console.log(value.data)
                if (value.data.data !== undefined) {
                    const hist = value.data.data
                    const historicalAggregationWeather = {
                        data: [
                            {columnKey: "location", value: area !== "" ? area : zip},
                            {columnKey: "date", value: date},
                            {columnKey: "cloud_cover", value: hist["cloud_cover"]["afternoon"]},
                            {columnKey: "humidity", value: hist.humidity.afternoon},
                            {columnKey: "precipitation", value: hist.precipitation.total},
                            {columnKey: "min_temperature", value: kelvinToF(hist.temperature.min)},
                            {columnKey: "max_temperature", value: kelvinToF(hist.temperature.max)},
                            {columnKey: "morning_temperature", value: kelvinToF(hist.temperature.morning)},
                            {columnKey: "afternoon_temperature", value: kelvinToF(hist.temperature.afternoon)},
                            {columnKey: "evening_temperature", value: kelvinToF(hist.temperature.evening)},
                            {columnKey: "night_temperature", value: kelvinToF(hist.temperature.night)},
                            {columnKey: "pressure", value: hist.pressure.afternoon},
                            {columnKey: "wind_max_speed", value: hist.wind.max.speed},
                            {columnKey: "wind_direction", value: hist.wind.max.direction}
                        ]
                    }
                    setHistoricalAggregationWeatherRowData([historicalAggregationWeather])
                    setArea("")
                    setZip("")
                    setDate("")
                }
            }
            else {
                console.log(value.data)
                setWeatherBannerInfo({bannerMessage: "Something went wrong during call", bannerType: BannerType.ERROR})
                setShowBanner(true)
                setHistoricalAggregationWeatherRowData([])
            }
        }).catch((error) => {
            console.log("Exception occurred in when viewing historical aggregation weather: ", error)
            setWeatherBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
            setShowBanner(true)
            setHistoricalAggregationWeatherRowData([])
        })
    }


    return (
        <HistoricalAggregationWeatherWrapper>
            <W4SubpageHeader>Historical Aggregation Weather</W4SubpageHeader>
            <Banner bannerInfo={weatherBannerInfo} showBanner={showBanner} closeBannerCallback={closeHistoricalAggregationWeatherBanner}/>
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
            <div>
                <W4InputLabel>Date:</W4InputLabel>
                <W4Input onChange={setDateFunc} value = {date} placeholder={"Put in value 2025-10-28"}/>
            </div>
            <SubmitButton onClick={getHistoricalAggregationWeather} disabled={((zip === "" || zip.length !== zipLength || !validateZip(zip))
            && (area === "" || !validateArea(area))) || (date === "" || date.replaceAll('-','').length !== dateLength ||
                !validateDate(date.replaceAll('-','')))}>Get Historical Aggregation Weather</SubmitButton>
            <BasicGrid columns={historicalAggregationWeatherColumns} rowData={historicalAggregationWeatherRowData} nowRowDataMessage={"No Historical Aggregation Weather to Display"}/>
        </HistoricalAggregationWeatherWrapper>
    )
}
const HistoricalAggregationWeatherWrapper = styled(W4FlexColumn)`
  align-items: center;
`
export default HistoricalAggregationWeather