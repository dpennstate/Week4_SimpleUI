import React from "react";
import styled from "styled-components";
import {Pages} from "../Utils/W4Enums";

interface INavigationBar {
    changePage: (page: Pages) => void;
    logout: () => void
}

const NavigationBar: React.FC<INavigationBar> = (props) => {
    return (
        <NavigationBarWrapper>
            <NavigationBarPagesWrapper>
                <NavigationBarButton onClick={() => props.changePage(Pages.EmployeePage)}>Employee Page</NavigationBarButton>
                <NavigationBarButton onClick = {() => props.changePage(Pages.WeatherPage)}>Weather Page</NavigationBarButton>
            </NavigationBarPagesWrapper>
            <LogoutButton onClick = {props.logout}>Logout</LogoutButton>
        </NavigationBarWrapper>
    )
}
const NavigationBarWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    width: 60%;
`
const NavigationBarPagesWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
`
const NavigationBarButton = styled.button`
    margin: 0;
    padding: 0;
    border: none;
    width: 20%;
    height: 5vh;
    border-radius: 20px;
    cursor: pointer;
`
const LogoutButton = styled(NavigationBarButton)`
    margin-right: 20px;
    width: 10%;
`
export default NavigationBar