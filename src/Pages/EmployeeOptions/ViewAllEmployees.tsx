import React, {useEffect, useState} from "react";
import {W4FlexColumn, W4SubpageHeader} from "../../Utils/styling";
import BasicGrid, {IGridRowData} from "../../Components/BasicGrid";
import Banner, {BannerType, IBannerInfo} from "../../Components/Banner";
import {getAllEmployees} from "../../APICalls/EmployeeAPI";
import {employeeColumns} from "../Employee";
import styled from "styled-components";
import {IShowEmployee} from "../../Utils/W4Interfaces";

const ViewAllEmployees: React.FC = () => {
    const [employeeRowData, setEmployeeRowData] = useState<IGridRowData[] | []>([])
    const [showBanner, setShowBanner] = useState<boolean>(false)
    const [employeeBannerInfo, setEmployeeBannerInfo] = useState<IBannerInfo>({
        bannerMessage: "Error has happened for request",
        bannerType: BannerType.INFO
    })

    const closeSpecificEmployeeBanner = () => {
        setShowBanner(false)
    }

    useEffect(() => {
        getAllEmployees().then((value: {data: any, success: boolean}) => {
            if (value.success) {
                console.log(value.data)
                if (value.data.message !== undefined) {
                    // This means employees don't exist per the API so state that in the success banner
                    setEmployeeBannerInfo({bannerMessage: "Employees request successful with message: "
                            + value.data.message, bannerType: BannerType.SUCCESS})
                    setEmployeeRowData([])
                }
                else {
                    setEmployeeBannerInfo({bannerMessage: "Employees request successful", bannerType: BannerType.SUCCESS})
                    setEmployeeRowData(value.data.employees.map((employee: IShowEmployee) => {
                        return {
                            data: [
                                {columnKey: "employee_id", value: employee.employee_id},
                                {columnKey: "first_name", value: employee.first_name},
                                {columnKey: "last_name", value: employee.last_name},
                                {columnKey: "email", value: employee.email},
                                {columnKey: "phone_number", value: employee.phone_number}
                            ]
                        }
                    }))
                }
                setShowBanner(true)
            }
            else {
                console.log(value.data)
                setEmployeeBannerInfo({bannerMessage: value.data, bannerType: BannerType.ERROR})
                setShowBanner(true)
                console.log(value.data)
                setEmployeeRowData([])
            }
        }).catch((error) => {
            console.log("Exception occurred in when viewing all employees: ", error)
            setEmployeeBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
            setShowBanner(true)
            setEmployeeRowData([])
        })
    }, [])

    return (
        <ViewSpecificEmployeesWrapper>
            <W4SubpageHeader>View All Employees</W4SubpageHeader>
            <Banner bannerInfo={employeeBannerInfo} showBanner={showBanner} closeBannerCallback={closeSpecificEmployeeBanner}/>
            <BasicGrid columns={employeeColumns} rowData={employeeRowData} nowRowDataMessage={"No Employee(s) to Display"}/>
        </ViewSpecificEmployeesWrapper>
    )
}
const ViewSpecificEmployeesWrapper = styled(W4FlexColumn)`
  align-items: center;
`
export default ViewAllEmployees