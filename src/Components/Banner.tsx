import React from "react";
import styled from "styled-components";
import {OptionsButton} from "../Utils/styling";

export interface IBannerInfo {
    bannerMessage: string
    bannerType: BannerType
}

export interface IBanner {
    bannerInfo: IBannerInfo
    showBanner: boolean
    closeBannerCallback: () => void
}
export enum BannerType {
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
    INFO = "INFO",
    WARNING = "WARNING"
}

enum BannerColor {
    ERROR = "#FF0000FF",
    SUCCESS = "#90EE90FF",
    INFO = "#ADD8E6FF",
    WARNING = "#FF4500FF"
}
const Banner: React.FC<IBanner> = (props) => {


    if (!props.showBanner) {
        return <></>
    }

    return (
        <BannerWrapper $bannerType={props.bannerInfo.bannerType}>
            <BannerText>{props.bannerInfo.bannerMessage}</BannerText>
            <BannerButton onClick={props.closeBannerCallback}>X</BannerButton>
        </BannerWrapper>
    )
}

export default Banner

const BannerWrapper = styled.div<{$bannerType: BannerType}>`
    margin-top: 5px;
    margin-bottom: 5px;
    width: 50%;
    border-style: solid;
    border-width: 1px;
    border-color: grey;
    color: black;
    background-color: ${(props) => props && props.$bannerType == BannerType.ERROR ?
            BannerColor.ERROR : props.$bannerType == BannerType.SUCCESS ?
                    BannerColor.SUCCESS: props.$bannerType == BannerType.INFO ? BannerColor.INFO : BannerColor.WARNING};
`

const BannerText = styled.p`
    display: inline;
    color: black;
`

const BannerButton = styled(OptionsButton)`
    background-color: transparent;
    border-color: transparent;
    border-radius: 0;
   &:hover{
      border-color: lightgray;
   }
`