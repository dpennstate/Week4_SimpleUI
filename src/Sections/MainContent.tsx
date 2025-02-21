import React, {useEffect, useState} from "react";
import {Pages} from "../Utils/W4Enums";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import {IPage} from "../Utils/W4Interfaces";
import Header from "./Header";
import Employee from "../Pages/Employee";
import Weather from "../Pages/Weather";
import {W4FlexColumn} from "../Utils/styling";

const MainContent: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Pages>(Pages.LoginPage)
    const [username, setUsername] = useState("")
    const [loadingPage, setLoadingPage] = useState(false)

    const setDocumentTitle  = () => {
        document.title = "Week 4 - " + currentPage
    }

    const loginUser = (user: string) => {
        setUsername(user)
    }
    const logoutUser = () => {
        setUsername("")
    }

    const changePage = (page: Pages) => {
        setCurrentPage(page)
    }
    const HomePage: IPage = {name: Pages.HomePage, pageComponent: <Home/>}
    const LoginPage: IPage = {name: Pages.LoginPage, pageComponent: <Login loginUser={loginUser}/>}
    const EmployeePage: IPage = {name: Pages.EmployeePage, pageComponent: <Employee/>}
    const WeatherPage: IPage = {name: Pages.WeatherPage, pageComponent: <Weather/>}

    const [pagesAvailableToUser, setPagesAvailableToUser] = useState<IPage[]>([LoginPage])

    const setAvailablePages = () => {
        setLoadingPage(true)
        if (username === "") {
            setPagesAvailableToUser([LoginPage])
            setCurrentPage(Pages.LoginPage)
        } else {
            setPagesAvailableToUser([HomePage, EmployeePage, WeatherPage])
            setCurrentPage(Pages.HomePage)
        }
        setLoadingPage(false)
    }

    const displayCurrentPage = () => {
      return  pagesAvailableToUser[pagesAvailableToUser.findIndex(page => page.name === currentPage)].pageComponent

    }


    useEffect(() => {
        setDocumentTitle()
    }, [])

    useEffect(() => {
        setDocumentTitle()
    }, [currentPage])
    useEffect(() => {
        setAvailablePages()
    }, [username])



    return (
        username !== "" && currentPage !== Pages.LoginPage ?
        <W4FlexColumn>
            <Header username={username} logout={logoutUser} changeMainContentPage={changePage}/>
            <W4FlexColumn>
                {
                    loadingPage ?
                        <div>I am loading</div> :
                        displayCurrentPage()
                }
            </W4FlexColumn>
        </W4FlexColumn> :
        <W4FlexColumn>
            {
                loadingPage ?
                    <div>I am loading</div> :
                    displayCurrentPage()
            }
        </W4FlexColumn>
    )
}

export default MainContent