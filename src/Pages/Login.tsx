import React, {useState} from "react";
import {loginUserCallbackThirdParty} from "../APICalls/UserAPI";
import GoogleLoginComponent from "../Components/Login-Components/GoogleLoginComponent";
import styled from "styled-components";

interface ILogin {
    loginUser: (user: string) => void
}
const Login: React.FC<ILogin> = (props) => {
    const [errorLoginText, setErrorLoginText] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const thirdPartyLoginUser = (success: boolean, responseData?: any) => {
        if (success && responseData !== null && responseData !== undefined) {
            setErrorLoginText("")
            setIsLoading(true)
            loginUserCallbackThirdParty(responseData.credential).then((value: any) => {
                if (value.success) {
                    props.loginUser(value.data.firstname)
                }
                else {
                    setErrorLoginText(value.data)
                    setIsLoading(false)
                }
            })
        }
        else {
            setErrorLoginText("Incorrect username or password")
        }
    }

    return (
        <LoginWrapper>
            {
                isLoading &&
                <Loading>
                    <LoadingFlex>
                        <LoadingText>Logging In</LoadingText>
                    </LoadingFlex>
                </Loading>
            }
            <LoginTitle>Week 4 Assignment Frontend Development</LoginTitle>
            <GoogleLoginComponent googleLoginCallback={thirdPartyLoginUser}/>
            {
                errorLoginText !== "" &&
                <ErrorLoginLabel>{errorLoginText}</ErrorLoginLabel>
            }
        </LoginWrapper>
    )
}
const Loading = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.9;
`
const LoadingFlex = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 101;
    width: 100%;
    height: 100%;
`
const LoadingText = styled.p`
    color: white;
    font-size: 40px;
    cursor: default;
`
const ErrorLoginLabel = styled.label`
    color: red;
`
const LoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
`
const LoginTitle = styled.p``
export default Login