import React, {useState} from "react";
import {SubmitButton, W4FlexColumn, W4Input, W4InputLabel, W4SubpageHeader} from "../../Utils/styling";
import BasicGrid, {IColumn, IGridRowData} from "../../Components/BasicGrid";
import Banner, {BannerType, IBannerInfo} from "../../Components/Banner";
import {summaryWeather} from "../../APICalls/WeatherAPI";
import styled from "styled-components";


const summaryWeatherColumns: IColumn[] = [
    {key: "location", columnName: "Location", columnDataType: "string"},
    {key: "date", columnName: "Date", columnDataType: "string"},
    {key: "weather_overview", columnName: "Weather Overview", columnDataType: "string"}
]


const SummaryWeather: React.FC = () => {
    const [area, setArea] = useState<string>("")
    const areaLengthLimit = 100
    const [zip, setZip] = useState<string>("")
    const zipLength = 5
    const [summaryWeatherRowData, setSummaryWeatherRowData] = useState<IGridRowData[] | []>([])
    const [showBanner, setShowBanner] = useState<boolean>(false)


    const closeSummaryWeatherBanner = () => {
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

    const getSummaryWeather = () => {
        summaryWeather(area, zip).then((value: {data: any, success: boolean}) => {
            if (value.success) {
                console.log(value.data)
                if (value.data.data !== undefined) {
                    const summ = value.data.data
                    const summaryWeather = {
                        data: [
                            {columnKey: "location", value: area !== "" ? area : zip},
                            {columnKey: "date", value: summ.date},
                            {columnKey: "weather_overview", value: summ["weather_overview"]},
                        ]
                    }
                    setSummaryWeatherRowData([summaryWeather])
                    setArea("")
                    setZip("")
                }
            }
            else {
                console.log(value.data)
                setWeatherBannerInfo({bannerMessage: "Something went wrong during call", bannerType: BannerType.ERROR})
                setShowBanner(true)
                setSummaryWeatherRowData([])
            }
        }).catch((error) => {
            console.log("Exception occurred in when viewing summary weather: ", error)
            setWeatherBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
            setShowBanner(true)
            setSummaryWeatherRowData([])
        })
    }


    return (
        <CurrentWeatherWrapper>
            <W4SubpageHeader>Summary Weather</W4SubpageHeader>
            <Banner bannerInfo={weatherBannerInfo} showBanner={showBanner} closeBannerCallback={closeSummaryWeatherBanner}/>
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
            <SubmitButton onClick={getSummaryWeather} disabled={(zip === "" || zip.length !== zipLength || !validateZip(zip))
            && (area === "" || !validateArea(area))}>Get Summary Weather</SubmitButton>
            <BasicGrid columns={summaryWeatherColumns} rowData={summaryWeatherRowData} nowRowDataMessage={"No Current Weather to Display"}/>
        </CurrentWeatherWrapper>
    )
}
const CurrentWeatherWrapper = styled(W4FlexColumn)`
  align-items: center;
`
export default SummaryWeather