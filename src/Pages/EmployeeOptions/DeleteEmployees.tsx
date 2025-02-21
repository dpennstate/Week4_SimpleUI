import React, {useEffect, useState} from "react";
import {SubmitButton, W4FlexColumn, W4Input, W4P, W4SubpageHeader} from "../../Utils/styling";
import Banner, {BannerType, IBannerInfo} from "../../Components/Banner";
import {deleteEmployees, getAllEmployees} from "../../APICalls/EmployeeAPI";
import styled from "styled-components";
import {IShowEmployee} from "../../Utils/W4Interfaces";


const DeleteEmployees: React.FC = () => {
    const [originalEmployees, setOriginalEmployees] = useState<IShowEmployee[]>([])
    const [employeesDelete, setEmployeesDelete] = useState<string[]>([])
    const [showBanner, setShowBanner] = useState<boolean>(false)

    const [successfullyDeletedEmployees, setSuccessfullyDeletedEmployees] = useState([])
    const [failedToDeleteEmployees, setFailedToDeleteEmployees] = useState([])
    const [exceptionFailureToDeleteEmployees, setExceptionFailureToDeleteEmployees] = useState([])
    const [invalidDeleteEmployees, setInvalidDeleteEmployees] = useState([])

    const getEmployees = () => {
        getAllEmployees().then((value: {data: any, success: boolean}) => {
            if (value.success) {
                console.log(value.data)
                if (value.data.message !== undefined) {
                    // This means employees don't exist per the API so state that in the success banner
                    setEmployeeBannerInfo({bannerMessage: "Employees request successful with message: "
                            + value.data.message, bannerType: BannerType.SUCCESS})
                    setOriginalEmployees([])
                    setEmployeesDelete([])
                    setShowBanner(true)

                }
                else {
                    setOriginalEmployees(value.data.employees)
                }
            }
            else {
                console.log(value.data)
                setEmployeeBannerInfo({bannerMessage: value.data, bannerType: BannerType.ERROR})
                setShowBanner(true)
                console.log(value.data)
                setOriginalEmployees([])
                setEmployeesDelete([])
            }
        }).catch((error) => {
            console.log("Exception occurred in when fetching employees in edit employees: ", error)
            setEmployeeBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
            setShowBanner(true)
            setOriginalEmployees([])
            setEmployeesDelete([])
        })
    }

    useEffect(() => {
        getEmployees()
    }, [])

    const closeSpecificEmployeeBanner = () => {
        setShowBanner(false)
    }

    const [employeeBannerInfo, setEmployeeBannerInfo] = useState<IBannerInfo>({
        bannerMessage: "Error has happened for request",
        bannerType: BannerType.INFO
    })

    const deleteEmps = () => {
        // Should probably do a final check here to make sure all data is valid?
        deleteEmployees(employeesDelete).then((value: {data: any, success: boolean}) => {
            if (value.success) {
                console.log(value.data)

                // All employees failed to delete, but no exceptions happened to cause failure (instead they were all invalid)
                if (value.data.deleteResult === undefined && value.data.message !== undefined) {
                    setInvalidDeleteEmployees(value.data.invalidEmployees)
                    setSuccessfullyDeletedEmployees([])
                    setFailedToDeleteEmployees([])
                    setExceptionFailureToDeleteEmployees([])
                }
                else if (value.data.deleteResult !== undefined) {
                    const deleteResult = value.data.deleteResult
                    let unSuccessfulDelete = false

                    // Check successful creations

                    if (deleteResult.deletedEmployees !== undefined && deleteResult.deletedEmployees.length > 0) {
                        setSuccessfullyDeletedEmployees(
                            deleteResult.deletedEmployees)
                    }
                    else {
                        setSuccessfullyDeletedEmployees([])
                    }

                    // Check invalid employees
                    if (deleteResult.invalidEmployeesIDs !== undefined && deleteResult.invalidEmployeesIDs.length > 0) {
                        setInvalidDeleteEmployees(deleteResult.invalidEmployeesIDs)
                        unSuccessfulDelete = true
                    }
                    else {
                        setInvalidDeleteEmployees([])
                    }

                    // Check failed to delete employees
                    if (deleteResult.failedToDelete !== undefined && deleteResult.failedToDelete.length > 0) {
                        setFailedToDeleteEmployees(deleteResult.failedToDelete)
                        unSuccessfulDelete = true
                    }
                    else {
                        setFailedToDeleteEmployees([])
                    }

                    // Check exception to create employees
                    if (deleteResult.exceptionToDelete !== undefined && deleteResult.exceptionToDelete.length > 0) {
                        setExceptionFailureToDeleteEmployees(deleteResult.exceptionToDelete)
                        unSuccessfulDelete = true
                    }
                    else {
                        setExceptionFailureToDeleteEmployees([])
                    }

                    if (!unSuccessfulDelete) {
                        setEmployeesDelete([])
                    }
                    else {
                        // Here just remove the successful deletes from the employeesDelete array
                        const tempEmployeesDelete = employeesDelete.filter((employeeId) => {
                            if (deleteResult.deletedEmployees.includes(employeeId)) {
                                return false
                            }
                            return true
                        })

                        setEmployeesDelete(tempEmployeesDelete)
                    }
                }
                setEmployeeBannerInfo({bannerMessage: "Delete Employees request successful with message: "
                        + value.data.message, bannerType: BannerType.SUCCESS})
                setShowBanner(true)
                getEmployees()
            }
            else {
                console.log(value.data)
                setEmployeeBannerInfo({bannerMessage: value.data, bannerType: BannerType.ERROR})
                setShowBanner(true)
                setInvalidDeleteEmployees([])
                setSuccessfullyDeletedEmployees([])
                setFailedToDeleteEmployees([])
                setExceptionFailureToDeleteEmployees([])
                getEmployees()
            }
        }).catch((error) => {
            console.log("Exception occurred in when deleting employees: ", error)
            setEmployeeBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
            setShowBanner(true)
            setInvalidDeleteEmployees([])
            setSuccessfullyDeletedEmployees([])
            setFailedToDeleteEmployees([])
            setExceptionFailureToDeleteEmployees([])
            getEmployees()
        })
    }

    const deleteEmployee = (employeeId: string) => {
        if (!employeesDelete.includes(employeeId)) {
            // Note the only reason I have to do [...employeesDelete] instead of employeesDelete is there was a bug
            // where React recognized there was a change, but due to it being a shallow change, no rerender with the
            // updated values was being performed.
            const tempEmployeesDelete = [...employeesDelete]
            tempEmployeesDelete.push(employeeId)
            setEmployeesDelete(tempEmployeesDelete)
        }
    }

    const undoEmployeeDelete = (employeeId: string) => {
        if (employeeInDeletedList(employeeId)) {
            const tempEmployeesDelete = employeesDelete.filter((employeeDeleteId) => employeeDeleteId !== employeeId)
            setEmployeesDelete(tempEmployeesDelete)
        }
    }

    const employeeInDeletedList = (employeeId: string) => {
        return employeesDelete.length > 0 && employeesDelete.includes(employeeId)
    }

    const displayDataPostDelete = (employeeIds: any) => {
        return  employeeIds.map((employeeId: any, index: number) => {
            const employeeIdLocal = employeeId.id !== undefined ? employeeId.id : employeeId
            return (
                <div key = {index + employeeId}>
                    <DeleteEmployeesInput disabled = {true}
                                        value = {employeeIdLocal}
                                        placeholder={"EmployeeId"}/>
                    {employeeId.message !== undefined &&
                    <DeleteEmployeesInput disabled = {true}
                                        value = {employeeId.message}
                                        placeholder={"Message"}/>
                    }
                </div>
            )
        })
    }

    return (
        <ViewSpecificEmployeesWrapper>
            <Banner bannerInfo={employeeBannerInfo} showBanner={showBanner} closeBannerCallback={closeSpecificEmployeeBanner}/>
            <W4SubpageHeader>Delete Employees</W4SubpageHeader>
            {originalEmployees.length > 0 ?
                originalEmployees.map((employee, index) => {
                    return (
                        <div key = {index + employee.employee_id}>
                            <DeleteEmployeesInput disabled = {true}
                                                value = {employee.first_name}
                                                placeholder={"First Name"}/>
                            <DeleteEmployeesInput disabled = {true}
                                                  value = {employee.last_name}
                                                placeholder={"Last Name"}/>
                            <DeleteEmployeesInput disabled = {true}
                                                  value = {employee.email}
                                                placeholder={"Email"}/>
                            <DeleteEmployeesInput disabled = {true}
                                                  value = {employee.phone_number}
                                                placeholder={"Phone Number"}/>

                            <DeleteEmployeeWrapperButton>
                                <SubmitButton onClick={() => deleteEmployee(employee.employee_id)} disabled={employeeInDeletedList(employee.employee_id)}>
                                    Delete Employee</SubmitButton>

                                {employeeInDeletedList(employee.employee_id)  ?
                                    <SubmitButton onClick={() => undoEmployeeDelete(employee.employee_id)}>
                                        Undo Delete</SubmitButton> : <></>}


                                {employeeInDeletedList(employee.employee_id) ?
                                    <W4P>Pending Delete</W4P> : <></>}

                            </DeleteEmployeeWrapperButton>
                        </div>
                    )
                })
                : <p>No Employees Exist to Delete</p>}

            {successfullyDeletedEmployees.length > 0 && <p>Employees Successfully Deleted</p>}
            {successfullyDeletedEmployees.length > 0 ?
                displayDataPostDelete(successfullyDeletedEmployees)
                : <></>}

            {invalidDeleteEmployees.length > 0 && <p>Invalid Employees</p>}
            {invalidDeleteEmployees.length > 0 ?
                displayDataPostDelete(invalidDeleteEmployees)
                : <></>}

            {failedToDeleteEmployees.length > 0 && <p>Failed Employees</p>}
            {failedToDeleteEmployees.length > 0 ?
                displayDataPostDelete(failedToDeleteEmployees)
                : <></>}

            {exceptionFailureToDeleteEmployees.length > 0 && <p>Exception Employees</p>}
            {exceptionFailureToDeleteEmployees.length > 0 ?
                displayDataPostDelete(exceptionFailureToDeleteEmployees)
                : <></>}


            {originalEmployees.length > 0 && <SubmitButton onClick={deleteEmps} disabled={employeesDelete.length === 0}>
                Delete Employeess</SubmitButton>}
        </ViewSpecificEmployeesWrapper>
    )
}
const ViewSpecificEmployeesWrapper = styled(W4FlexColumn)`
  align-items: center;
`

const DeleteEmployeesInput = styled(W4Input)`
    margin-left: 5px;
`
const DeleteEmployeeWrapperButton = styled.div`
    display: inline;
`
export default DeleteEmployees