import React, {useState} from "react";
import styled from "styled-components";
import {SubmitButton, W4FlexColumn, W4Input, W4InputLabel, W4SubpageHeader} from "../../Utils/styling";
import {getSingleEmployee} from "../../APICalls/EmployeeAPI";
import BasicGrid, {IGridRowData} from "../../Components/BasicGrid";
import {employeeColumns} from "../Employee";
import Banner, {BannerType, IBannerInfo} from "../../Components/Banner";

const ViewEmployee: React.FC = () => {
    const [employeeId, setEmployeeId] = useState<string>("")
    const [employeeRowData, setEmployeeRowData] = useState<IGridRowData[] | []>([])
    const [showBanner, setShowBanner] = useState<boolean>(false)
    const [employeeIdFetchAttempted, setEmployeeIdFetchAttempted] = useState<boolean>(false)

    const closeEmployeeBanner = () => {
        setShowBanner(false)
    }

    const [employeeBannerInfo, setEmployeeBannerInfo] = useState<IBannerInfo>({
        bannerMessage: "Error has happened for request",
        bannerType: BannerType.INFO
    })

    const setEmployee = (employeeIdInputValue: any) => {
        if ((employeeIdInputValue.target.value.match(/^[0-9]+$/) !== null && employeeIdInputValue.target.value.length <= 30)
            || employeeIdInputValue.target.value === "") {
            setEmployeeId(employeeIdInputValue.target.value)
            if (employeeIdFetchAttempted) {
                setEmployeeIdFetchAttempted(false)
            }
        }
    }

    const getEmployee = () => {
        if (employeeIsValid()) {
            getSingleEmployee(employeeId).then((value: {data: any, success: boolean}) => {
                if (value.success) {
                    console.log(value.data)
                    if (value.data.message !== undefined) {
                        // This means employee doesn't exist per the API so state that in the success banner
                        setEmployeeBannerInfo({bannerMessage: "Employees request successful with message: "
                                + value.data.message, bannerType: BannerType.SUCCESS})
                        setEmployeeRowData([])
                    }
                    else {
                        setEmployeeBannerInfo({bannerMessage: "Employees request successful", bannerType: BannerType.SUCCESS})
                        const employee = value.data.employee
                        setEmployeeRowData([
                            {
                                data: [
                                    {columnKey: "employee_id", value: employee.employee_id},
                                    {columnKey: "first_name", value: employee.first_name},
                                    {columnKey: "last_name", value: employee.last_name},
                                    {columnKey: "email", value: employee.email},
                                    {columnKey: "phone_number", value: employee.phone_number}
                                ]
                            }
                        ])
                        setEmployeeId("")
                    }
                    setShowBanner(true)
                }
                else {
                    setEmployeeBannerInfo({bannerMessage: value.data, bannerType: BannerType.ERROR})
                    setShowBanner(true)
                    console.log(value.data)
                    setEmployeeRowData([])
                }
                setEmployeeIdFetchAttempted(true)
            }).catch((error) => {
                console.log("Exception occurred in when viewing a specific employee: ", error)
                setEmployeeBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
                setShowBanner(true)
                setEmployeeRowData([])
            })
        }
    }

    const employeeIsValid = () => {
        if (employeeId !== "" && employeeId.match(/^[0-9]+$/) !== null && employeeId.length > 0 && employeeId.length <= 30) {
            return true
        }
        return false
    }
    return (
        <ViewEmployeeWrapper>
            <W4SubpageHeader>View Employee</W4SubpageHeader>
            <Banner bannerInfo={employeeBannerInfo} showBanner={showBanner} closeBannerCallback={closeEmployeeBanner}/>
            <W4InputLabel>Employee ID:</W4InputLabel>
            <W4Input onChange={setEmployee} value = {employeeId} placeholder={"Put in value such as 1234"}/>
            <SubmitButton onClick={getEmployee} disabled={!employeeIsValid() || employeeIdFetchAttempted}>Get Employee</SubmitButton>
            <BasicGrid columns={employeeColumns} rowData={employeeRowData} nowRowDataMessage={"No Employee to Display"}/>
        </ViewEmployeeWrapper>
    )
}
const ViewEmployeeWrapper = styled(W4FlexColumn)`
  align-items: center;
`
export default ViewEmployee