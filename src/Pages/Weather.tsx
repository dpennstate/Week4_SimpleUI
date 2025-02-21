import React, {useState} from "react";
import {OptionsButton, W4FlexColumn, W4FlexRow} from "../Utils/styling";
import styled from "styled-components";
import CurrentWeather from "./WeatherOptions/CurrentWeather";
import HistoricalWeather from "./WeatherOptions/HistoricalWeather";
import HistoricalAggregationWeather from "./WeatherOptions/HistoricalAggregationWeather";
import SummaryWeather from "./WeatherOptions/SummaryWeather";
import {IColumn} from "../Components/BasicGrid";

enum WeatherOptions {
    CurrentWeather = "Current Weather",
    HistoricalWeather = "Historical Weather",
    HistoricalAggregationWeather = "Historical Aggregation Weather",
    SummaryWeather = "Summary Weather",
}

interface IWeatherOption{
    name: string;
    weatherComponent: JSX.Element
}

export const currentWeatherColumns: IColumn[] = [
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
    {key: "wind_gust", columnName: "Wind Gust", columnDataType: "string"},
    {key: "weather_description", columnName: "Weather Desc", columnDataType: "string"}
]

const Weather: React.FC = () => {
    const CurrentWeatherOption: IWeatherOption = {name: WeatherOptions.CurrentWeather, weatherComponent: <CurrentWeather/>}
    const HistoryWeatherOption: IWeatherOption = {name: WeatherOptions.HistoricalWeather, weatherComponent: <HistoricalWeather/>}
    const HistoricalAggregationWeatherOption: IWeatherOption = {name: WeatherOptions.HistoricalAggregationWeather, weatherComponent: <HistoricalAggregationWeather/>}
    const SummaryWeatherOption: IWeatherOption = {name: WeatherOptions.SummaryWeather, weatherComponent: <SummaryWeather/>}

    const [currentOption, setCurrentOption] = useState<WeatherOptions>(WeatherOptions.CurrentWeather)
    const [weatherOptionsAvailableToUser, setWeatherOptionsAvailableToUser] = useState<IWeatherOption[]>([
        CurrentWeatherOption, HistoryWeatherOption, HistoricalAggregationWeatherOption, SummaryWeatherOption])

    const displayCurrentOption = () => {
        console.log("The page is weather being displayed")
        return  weatherOptionsAvailableToUser[weatherOptionsAvailableToUser.findIndex(option => option.name === currentOption)].weatherComponent

    }

    const changeWeatherOption = (weatherOption: WeatherOptions) => {
        setCurrentOption(weatherOption)
    }


    return (
        <W4FlexColumn>
            <WeatherTitle>Weather</WeatherTitle>
            <WeatherOptionsFlexRow>
                <OptionsButton onClick={() => changeWeatherOption(WeatherOptions.CurrentWeather)}>Current Weather</OptionsButton>
                <OptionsButton onClick={() => changeWeatherOption(WeatherOptions.HistoricalWeather)}>Historical Weathers</OptionsButton>
                <OptionsButton onClick={() => changeWeatherOption(WeatherOptions.HistoricalAggregationWeather)}>Historical Aggregation Weather</OptionsButton>
                <OptionsButton onClick={() => changeWeatherOption(WeatherOptions.SummaryWeather)}>Summary Weather</OptionsButton>
            </WeatherOptionsFlexRow>
            {
                displayCurrentOption()
            }
        </W4FlexColumn>
    )
}
const WeatherTitle = styled.h1`
`
const WeatherOptionsFlexRow = styled(W4FlexRow)`
    height: auto;
    justify-content: center;
`
export default Weather