import React, {useState} from "react";
import {SubmitButton, W4FlexColumn, W4Input, W4InputLabel, W4SubpageHeader} from "../../Utils/styling";
import BasicGrid, {IColumn, IGridRowData} from "../../Components/BasicGrid";
import Banner, {BannerType, IBannerInfo} from "../../Components/Banner";
import {historicalWeather} from "../../APICalls/WeatherAPI";
import {kelvinToF, openWeatherDate} from "../../Utils/SharedFunctions";
import styled from "styled-components";

const historicalWeatherColumns: IColumn[] = [
    {key: "location", columnName: "Location", columnDataType: "string"},
    {key: "date", columnName: "Date", columnDataType: "string"},
    {key: "sunrise", columnName: "Sunrise", columnDataType: "string"},
    {key: "sunset", columnName: "Sunset", columnDataType: "string"},
    {key: "temperature", columnName: "Temperature (F)", columnDataType: "string"},
    {key: "feels_like", columnName: "Feels Like (F)", columnDataType: "string"},
    {key: "pressure", columnName: "Pressure", columnDataType: "string"},
    {key: "humidity", columnName: "Humidity", columnDataType: "string"},
    {key: "dew_point", columnName: "Dew Point (F)", columnDataType: "string"},
    {key: "clouds", columnName: "Clouds", columnDataType: "string"},
    {key: "visibility", columnName: "Visibility", columnDataType: "string"},
    {key: "wind_speed", columnName: "Wind Speed", columnDataType: "string"},
    {key: "wind_deg", columnName: "Wind Degrees", columnDataType: "string"},
    {key: "weather", columnName: "Weather", columnDataType: "string"}
]


const HistoryWeather: React.FC = () => {
    const [area, setArea] = useState<string>("")
    const areaLengthLimit = 100
    const [zip, setZip] = useState<string>("")
    const zipLength = 5
    const [timeStamp, setTimeStamp] = useState<string>("")
    const timeStampLength = 14
    const [historicalWeatherRowData, setHistoricalWeatherRowData] = useState<IGridRowData[] | []>([])
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

    const validateTimeStamp = (timeStampParam: string) => {
        return (timeStampParam.match(/^[0-9]+$/) !== null && timeStampParam.length <= timeStampLength)
            || timeStampParam === ""
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

    const replaceForTimeStamp = (timeS: string) => {
        let noHyphCol = timeS.replaceAll('-', '')

        noHyphCol = noHyphCol.replaceAll(' ', '')

        noHyphCol = noHyphCol.replaceAll(':', '')

        return noHyphCol
    }

    const setTimeStampFunc = (timeStampParam: any) => {

       const noHyphCol =  replaceForTimeStamp(timeStampParam.target.value)


        if (validateTimeStamp(noHyphCol)) {
            let newTimeStamp = ""

            for (let i = 0; i < noHyphCol.length; i++) {
                if (i === 4 || i === 6) {
                    newTimeStamp += "-"
                }
                if (i === 8) {
                    newTimeStamp += " "
                }
                if (i === 10 || i === 12){
                    newTimeStamp += ":"
                }

                newTimeStamp += noHyphCol[i]

            }
            setTimeStamp(newTimeStamp)
        }
    }

    const getHistoricalWeather = () => {
        historicalWeather(area, zip, timeStamp).then((value: {data: any, success: boolean}) => {
            if (value.success) {
                console.log(value.data)
                if (value.data.data !== undefined) {
                    const hist = value.data.data.data[0]
                    const historicalWeather = {
                        data: [
                            {columnKey: "location", value: area !== "" ? area : zip},
                            {columnKey: "date", value: openWeatherDate(hist.dt)},
                            {columnKey: "sunrise", value: openWeatherDate(hist.sunrise)},
                            {columnKey: "sunset", value: openWeatherDate(hist.sunset)},
                            {columnKey: "temperature", value: kelvinToF(hist.temp)},
                            {columnKey: "feels_like", value: kelvinToF(hist["feels_like"])},
                            {columnKey: "pressure", value: hist.pressure},
                            {columnKey: "humidity", value: hist.humidity},
                            {columnKey: "dew_point", value: kelvinToF(hist["dew_point"])},
                            {columnKey: "clouds", value: hist.clouds},
                            {columnKey: "visibility", value: hist.visibility},
                            {columnKey: "wind_speed", value: hist["wind_speed"]},
                            {columnKey: "wind_deg", value: hist["wind_deg"]},
                            {columnKey: "weather", value: hist.weather[0].main + ` (${hist.weather[0].description})`}
                        ]
                    }
                    setHistoricalWeatherRowData([historicalWeather])
                    setArea("")
                    setZip("")
                    setTimeStamp("")
                }
            }
            else {
                console.log(value.data)
                setWeatherBannerInfo({bannerMessage: "Something went wrong during call", bannerType: BannerType.ERROR})
                setShowBanner(true)
                setHistoricalWeatherRowData([])
            }
        }).catch((error) => {
            console.log("Exception occurred in when viewing historical weather: ", error)
            setWeatherBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
            setShowBanner(true)
            setHistoricalWeatherRowData([])
        })
    }


    return (
        <HistoricalWeatherWrapper>
            <W4SubpageHeader>Historical Weather</W4SubpageHeader>
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
                <W4InputLabel>TimeStamp:</W4InputLabel>
                <W4Input onChange={setTimeStampFunc} value = {timeStamp} placeholder={"Put in value 2025-10-28 13:00:00"}/>
            </div>
            <SubmitButton onClick={getHistoricalWeather} disabled={((zip === "" || zip.length !== zipLength || !validateZip(zip))
                && (area === "" || !validateArea(area))) || (timeStamp === "" ||
                replaceForTimeStamp(timeStamp).length !== (timeStampLength) ||
                !validateTimeStamp(replaceForTimeStamp(timeStamp)))}>Get Historical Aggregation Weather</SubmitButton>
            <BasicGrid columns={historicalWeatherColumns} rowData={historicalWeatherRowData} nowRowDataMessage={"No Historical Weather to Display"}/>
        </HistoricalWeatherWrapper>
    )
}
const HistoricalWeatherWrapper = styled(W4FlexColumn)`
  align-items: center;
`
export default HistoryWeather