import React, {useState} from "react";
import {SubmitButton, W4FlexColumn, W4Input, W4InputLabel, W4SubpageHeader} from "../../Utils/styling";
import BasicGrid, {IGridRowData} from "../../Components/BasicGrid";
import Banner, {BannerType, IBannerInfo} from "../../Components/Banner";
import {getListOfEmployees} from "../../APICalls/EmployeeAPI";
import {employeeColumns} from "../Employee";
import styled from "styled-components";
import {IShowEmployee} from "../../Utils/W4Interfaces";

const ViewSpecificEmployees: React.FC = () => {
    const [employeeIdAdd, setEmployeeIdAdd] = useState<string>("")
    const [employeeIdRemove, setEmployeeIdRemove] = useState<string>("")
    const [employeeIds, setEmployeeIds] = useState<string[]>([])
    const [invalidEmployeeIds, setInvalidEmployeeIds] = useState<string[]>([])
    const [employeeRowData, setEmployeeRowData] = useState<IGridRowData[] | []>([])
    const [showBanner, setShowBanner] = useState<boolean>(false)


    const closeSpecificEmployeeBanner = () => {
        setShowBanner(false)
    }

    const [employeeBannerInfo, setEmployeeBannerInfo] = useState<IBannerInfo>({
        bannerMessage: "Error has happened for request",
        bannerType: BannerType.INFO
    })

    const setEmployee = (employeeIdInputValue: any) => {
        if ((employeeIdInputValue.target.value.match(/^[0-9]+$/) !== null && employeeIdInputValue.target.value.length <= 30)
            || employeeIdInputValue.target.value === "") {
            return true
        }
        return false
    }

    const setEmployeeAdd = (employeeIdInputValue: any) => {
        if (setEmployee(employeeIdInputValue)) {
            setEmployeeIdAdd(employeeIdInputValue.target.value)
        }
    }

    const setEmployeeRemove = (employeeIdInputValue: any) => {
        if (setEmployee(employeeIdInputValue)) {
            setEmployeeIdRemove(employeeIdInputValue.target.value)
        }
    }



    const getSpecificEmployees = () => {
        getListOfEmployees(employeeIds).then((value: {data: any, success: boolean}) => {
            if (value.success) {
                console.log(value.data)
                if (value.data.message !== undefined) {
                    // This means employees don't exist per the API so state that in the success banner
                    setEmployeeBannerInfo({bannerMessage: "Specific Employees request successful with message: "
                            + value.data.message, bannerType: BannerType.SUCCESS})
                    setInvalidEmployeeIds(employeeIds)
                    setEmployeeIds([])
                    setEmployeeRowData([])
                }
                else {
                    if (value.data.invalidIds !== undefined && value.data.invalidIds.length > 0) {
                        setInvalidEmployeeIds(value.data.invalidIds)
                    }
                    else {
                        setInvalidEmployeeIds([])
                    }
                    setEmployeeBannerInfo({bannerMessage: "Specific Employees request successful", bannerType: BannerType.SUCCESS})
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
                    setEmployeeIds([])
                }
                setShowBanner(true)
            }
            else {
                console.log(value.data)
                setEmployeeBannerInfo({bannerMessage: value.data, bannerType: BannerType.ERROR})
                setShowBanner(true)
                setEmployeeRowData([])
                setInvalidEmployeeIds([])
            }
        }).catch((error) => {
            console.log("Exception occurred in when viewing specific employees: ", error)
            setEmployeeBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
            setShowBanner(true)
            setEmployeeRowData([])
            setInvalidEmployeeIds([])
        })
    }

    const addEmployeeID = () => {
        if (employeeIsValid(employeeIdAdd)) {
            const tempEmployeeIds = employeeIds
            tempEmployeeIds.push(employeeIdAdd)
            setEmployeeIds(tempEmployeeIds)
            setEmployeeIdAdd("")
        }
    }

    const removeEmployeeID = () => {
        if (employeeIsValid(employeeIdRemove)) {
            const tempEmployeeIds = employeeIds.filter(emp => emp !== employeeIdRemove)
            setEmployeeIds(tempEmployeeIds)
            setEmployeeIdRemove("")
        }
    }

    const employeeIsValid = (employeeId: string) => {
        return employeeId !== "" && employeeId.match(/^[0-9]+$/) !== null && employeeId.length > 0 && employeeId.length <= 30
    }

    const employeeIdExistInList = (employeeId: string) => {
        console.log(employeeId !== "" && employeeIds.includes(employeeId))
        return employeeId !== "" && employeeIds.includes(employeeId)
    }
    return (
        <ViewSpecificEmployeesWrapper>
            <W4SubpageHeader>View Specific Employees</W4SubpageHeader>
            <Banner bannerInfo={employeeBannerInfo} showBanner={showBanner} closeBannerCallback={closeSpecificEmployeeBanner}/>
            <div>
                <W4InputLabel>Add Employee ID:</W4InputLabel>
                <W4Input onChange={setEmployeeAdd} value = {employeeIdAdd} placeholder={"Put in value such as 1234"}/>
                <SubmitButton onClick={addEmployeeID} disabled={!employeeIsValid(employeeIdAdd) ||
                employeeIdExistInList(employeeIdAdd)} >Add Employee</SubmitButton>
            </div>

            <div>
                <W4InputLabel>Remove Employee ID:</W4InputLabel>
                <W4Input onChange={setEmployeeRemove} value = {employeeIdRemove} placeholder={"Put in value such as 1234"}/>
                <SubmitButton onClick={removeEmployeeID} disabled={!employeeIsValid(employeeIdRemove) ||
                !employeeIdExistInList(employeeIdRemove)}>Remove Employee</SubmitButton>
            </div>

            <textarea cols= {100} rows={10} disabled={true} value={employeeIds.join()}/>
            <SubmitButton onClick={getSpecificEmployees} disabled={employeeIds.length === 0}>Get Employees</SubmitButton>
            {invalidEmployeeIds.length > 0 &&
                <div>
                    <p>Invalid Employees</p>
                    <textarea cols={100} rows={10} disabled={true} value={invalidEmployeeIds.join()}/>
                </div>
            }
            <BasicGrid columns={employeeColumns} rowData={employeeRowData} nowRowDataMessage={"No Employee(s) to Display"}/>
        </ViewSpecificEmployeesWrapper>
    )
}
const ViewSpecificEmployeesWrapper = styled(W4FlexColumn)`
  align-items: center;
`
export default ViewSpecificEmployees