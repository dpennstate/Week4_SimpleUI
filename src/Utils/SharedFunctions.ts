export const kelvinToF = (kTemp: number) => {
    return (((kTemp - 273.15) * 1.8) + 32).toFixed(2)
}

export const openWeatherDate = (oDate: number) => {
    return (new Date(oDate * 1000)).toUTCString()
}