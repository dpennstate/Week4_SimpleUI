import React from "react";
import styled from "styled-components";
import {GoogleOAuthProvider, GoogleLogin} from "@react-oauth/google";
import {config} from "../../config";

interface IGoogleLoginComponent {
    googleLoginCallback: (success: boolean, loginResponse?: any) => void
}
const GoogleLoginComponent: React.FC<IGoogleLoginComponent> = (props) => {

    const loginResponse = (success: boolean, credentialResponse?: any) => {
        props.googleLoginCallback(success, credentialResponse)
    }
    return (
        <GoogleLoginCompWrapper>
            <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
                <GoogleLogin onSuccess={credentialResponse => {
                    loginResponse(true, credentialResponse)
                }}
                             onError={() => {
                                 console.log('Login Failed')
                                 loginResponse(false)
                             }}
                />
            </GoogleOAuthProvider>
        </GoogleLoginCompWrapper>
    )
}
const GoogleLoginCompWrapper = styled.div`
    margin: 10px;
`
export default GoogleLoginComponent