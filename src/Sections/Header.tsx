import React from "react";
import styled from "styled-components";
import {Pages} from "../Utils/W4Enums";
import NavigationBar from "./NavigationBar";

interface IHeader{
    username: string,
    changeMainContentPage: (page: Pages) => void
    logout: () => void
}

const Header: React.FC<IHeader> = (props) => {
    const username = props.username
    const changePage = (page: Pages) => {
        props.changeMainContentPage(page)
    }

    return (
        <HeaderWrapper>
            <TopicButtonTitleWrapper>
                <W4Title onClick={() => changePage(Pages.HomePage)}>Week 4 Assignment</W4Title>
                <WelcomeUser>(Welcome {username})</WelcomeUser>
            </TopicButtonTitleWrapper>
            <NavigationBar logout={props.logout} changePage={changePage}/>
        </HeaderWrapper>

    )
}
const HeaderWrapper = styled.div`
  display: flex;
  position: sticky;
  top: 0;
 z-index: 2000;
  height: 8vh;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  align-content: center;
    align-items: center;
  width: 100%;
    background-color: black;
    
`
const TopicButtonTitleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    width: 40%;
`

const W4Title = styled.h1`
    cursor: pointer;
    color: #EEEEEE;
    &:hover{
      color: #787A91;
  }
`

const WelcomeUser = styled.h1`
  color: #EEEEEE;
  margin-left: 5px;
`
export default Header;