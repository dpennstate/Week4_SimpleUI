import React, {useState} from "react";
import emailValidator from "email-validator"
import {SubmitButton, W4FlexColumn, W4Input, W4InputLabel, W4SubpageHeader} from "../../Utils/styling";
import Banner, {BannerType, IBannerInfo} from "../../Components/Banner";
import {createEmployees} from "../../APICalls/EmployeeAPI";
import styled from "styled-components";
import {IEmployee} from "../../Utils/W4Interfaces";

const CreateEmployees: React.FC = () => {
    const [employeeFirstName, setEmployeeFirstName] = useState<string>("")
    const employeeNameMaxLength = 100
    const [employeeLastName, setEmployeeLastName] = useState<string>("")
    const [employeeEmail, setEmployeeEmail] = useState<string>("")
    const emailMaxLength = 254
    const [employeePhoneNumber, setEmployeePhoneNumber] = useState<string>("")
    const phoneNumberMaxLength = 10
    const [successfullyCreatedEmployees, setSuccessfullyCreatedEmployees] = useState([])
    const [failedToCreateEmployees, setFailedToCreateEmployees] = useState([])
    const [exceptionFailureToCreateEmployees, setExceptionFailureToCreateEmployees] = useState([])
    const [invalidCreateEmployees, setInvalidCreateEmployees] = useState([])
    // Note: So user does not lose data on employee they are looking to add, will make separate states
    // for editing an existing employee. Will only allow them to edit one employee at a time
    const [editEmployeeFirstName, setEditEmployeeFirstName] = useState<string>("")
    const [editEmployeeLastName, setEditEmployeeLastName] = useState<string>("")
    const [editEmployeeEmail, setEditEmployeeEmail] = useState<string>("")
    const [editEmployeePhoneNumber, setEditEmployeePhoneNumber] = useState<string>("")

    const [employeesCreate, setEmployeesCreate] = useState<IEmployee[]>([])
    const [showBanner, setShowBanner] = useState<boolean>(false)
    const [editEmployeeIndex, setEditEmployeeIndex] = useState(-1)

    const closeSpecificEmployeeBanner = () => {
        setShowBanner(false)
    }

    const [employeeBannerInfo, setEmployeeBannerInfo] = useState<IBannerInfo>({
        bannerMessage: "Error has happened for request",
        bannerType: BannerType.INFO
    })

    const validateName = (employeeName: string) => {
        return (employeeName.match(/^[A-Za-z]+$/) !== null && employeeName.length <= employeeNameMaxLength) || employeeName === ""
    }

    // Note will just do basic validation while adding the email. The Add Employee button will have validation
    // first to determine if employee email is valid email
    const validateEmail = (employeeEmail: string) => {
         return employeeEmail.length <= emailMaxLength || employeeEmail === ""
    }

    const validatePhoneNumber = (employeePhoneNumber: string) => {
        return (employeePhoneNumber.match(/^[0-9]+$/) !== null && employeePhoneNumber.length <= phoneNumberMaxLength)
            || employeePhoneNumber === ""
    }

    const setEmpFirstName = (employeeFirstNameInputValue: any) => {
        if (validateName(employeeFirstNameInputValue.target.value)) {
            setEmployeeFirstName(employeeFirstNameInputValue.target.value)
        }
    }

    const setEditEmpFirstName = (employeeFirstNameInputValue: any) => {
        if (validateName(employeeFirstNameInputValue.target.value)) {
            setEditEmployeeFirstName(employeeFirstNameInputValue.target.value)
        }
    }

    const setEmpLastName = (employeeLastNameInputValue: any) => {
        if (validateName(employeeLastNameInputValue.target.value)) {
            setEmployeeLastName(employeeLastNameInputValue.target.value)
        }
    }

    const setEditEmpLastName = (employeeLastNameInputValue: any) => {
        if (validateName(employeeLastNameInputValue.target.value)) {
            setEditEmployeeLastName(employeeLastNameInputValue.target.value)
        }
    }

    const setEmpEmail = (employeeEmailInputValue: any) => {
        if (validateEmail(employeeEmailInputValue.target.value)) {
            setEmployeeEmail(employeeEmailInputValue.target.value)
        }
    }

    const setEditEmpEmail = (employeeEmailInputValue: any) => {
        if (validateEmail(employeeEmailInputValue.target.value)) {
            setEditEmployeeEmail(employeeEmailInputValue.target.value)
        }
    }

    const setEmpPhoneNumber = (employeePhoneNumberInputValue: any) => {
        if (validatePhoneNumber(employeePhoneNumberInputValue.target.value.replaceAll('-', ''))) {
            let noHyphPhoneNumber = employeePhoneNumberInputValue.target.value.replaceAll('-', '')
            let newPhoneNumber = ""

            for (let i = 0; i < noHyphPhoneNumber.length; i++) {
                if (i === 3 || i === 6) {
                    newPhoneNumber += "-"
                }
                newPhoneNumber += noHyphPhoneNumber[i]
            }
            setEmployeePhoneNumber(newPhoneNumber)
        }
    }

    const setEditEmpPhoneNumber = (employeePhoneNumberInputValue: any) => {
        if (validatePhoneNumber(employeePhoneNumberInputValue.target.value.replaceAll('-', ''))) {

            let noHyphPhoneNumber = employeePhoneNumberInputValue.target.value.replaceAll('-', '')
            let newPhoneNumber = ""

            for (let i = 0; i < noHyphPhoneNumber.length; i++) {
                if (i === 3 || i === 6) {
                    newPhoneNumber += "-"
                }
                newPhoneNumber += noHyphPhoneNumber[i]
            }

            setEditEmployeePhoneNumber(newPhoneNumber)
        }
    }

    const createEmps = () => {
        // Should probably do a final check here to make sure all data is valid?
        createEmployees(employeesCreate).then((value: {data: any, success: boolean}) => {
            if (value.success) {
                console.log(value.data)

                // All employees failed to create, but no exceptions happened to cause failure (instead they were all invalid)
                if (value.data.invalidEmployees !== undefined && value.data.invalidEmployees.length > 0) {
                    setInvalidCreateEmployees(value.data.invalidEmployees)
                    setSuccessfullyCreatedEmployees([])
                    setFailedToCreateEmployees([])
                    setExceptionFailureToCreateEmployees([])
                }
                else if (value.data.createResult !== undefined) {
                    const createResult = value.data.createResult

                    // Check successful creations

                    if (createResult.createdEmployees !== undefined && createResult.createdEmployees.length > 0) {
                        setSuccessfullyCreatedEmployees(createResult.createdEmployees)
                    }
                    else {
                        setSuccessfullyCreatedEmployees([])
                    }

                    // Check invalid employees
                    if (createResult.invalidEmployees !== undefined && createResult.invalidEmployees.length > 0) {
                        setInvalidCreateEmployees(createResult.invalidEmployees)
                    }
                    else
                    {
                        setInvalidCreateEmployees([])
                    }

                    // Check failed to create employees
                    if (createResult.failedToCreate !== undefined && createResult.failedToCreate.length > 0) {
                        setFailedToCreateEmployees(createResult.failedToCreate)
                    }
                    else {
                        setFailedToCreateEmployees([])
                    }

                    // Check exception to create employees
                    if (createResult.exceptionToCreate !== undefined && createResult.exceptionToCreate.length > 0) {
                        setExceptionFailureToCreateEmployees(createResult.exceptionToCreate)
                    }
                    else {
                        setExceptionFailureToCreateEmployees([])
                    }
                }
                setEmployeeBannerInfo({bannerMessage: "Create Employees request successful with message: "
                        + value.data.message, bannerType: BannerType.SUCCESS})
                setShowBanner(true)
                setEmployeesCreate([])
            }
            else {
                console.log(value.data)
                setEmployeeBannerInfo({bannerMessage: value.data, bannerType: BannerType.ERROR})
                setShowBanner(true)
                setSuccessfullyCreatedEmployees([])
                setInvalidCreateEmployees([])
                setFailedToCreateEmployees([])
                setExceptionFailureToCreateEmployees([])
            }
        }).catch((error) => {
            console.log("Exception occurred in when creating employees: ", error)
            setEmployeeBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
            setShowBanner(true)
            setSuccessfullyCreatedEmployees([])
            setInvalidCreateEmployees([])
            setFailedToCreateEmployees([])
            setExceptionFailureToCreateEmployees([])
        })
    }

    const resetAddEmployeeFields = () => {
        setEmployeeFirstName("")
        setEmployeeLastName("")
        setEmployeeEmail("")
        setEmployeePhoneNumber("")
    }

    const resetEditEmployeeFields = () => {
        setEditEmployeeFirstName("")
        setEditEmployeeLastName("")
        setEditEmployeeEmail("")
        setEditEmployeePhoneNumber("")
    }

    const addEmployee = () => {
        if (employeeIsValid(employeeFirstName, employeeLastName, employeeEmail, employeePhoneNumber)) {
            const tempEmployeeCreate = employeesCreate
            const newEmployee: IEmployee = {
                first_name: employeeFirstName,
                last_name: employeeLastName,
                email: employeeEmail,
                phone_number: employeePhoneNumber
            }
            tempEmployeeCreate.push(newEmployee)
            setEmployeesCreate(tempEmployeeCreate)
            resetAddEmployeeFields()
        }
    }

    const editEmployee = (employeeIndex: number) => {
        setEditEmployeeFirstName(employeesCreate[employeeIndex].first_name)
        setEditEmployeeLastName(employeesCreate[employeeIndex].last_name)
        setEditEmployeeEmail(employeesCreate[employeeIndex].email)
        setEditEmployeePhoneNumber(employeesCreate[employeeIndex].phone_number)
        setEditEmployeeIndex(employeeIndex)
    }

    const removeEmployee = (employeeIndex: number) => {
        const tempEmployees = employeesCreate.filter((_, index) => index !== employeeIndex)
        setEmployeesCreate(tempEmployees)
    }

    const confirmEditEmployee = () => {
        if (employeeIsValid(editEmployeeFirstName, editEmployeeLastName, editEmployeeEmail, editEmployeePhoneNumber)) {
            const tempEmployeeCreate = employeesCreate
            tempEmployeeCreate[editEmployeeIndex] = {
                first_name: editEmployeeFirstName,
                last_name: editEmployeeLastName,
                email: editEmployeeEmail,
                phone_number: editEmployeePhoneNumber
            }
            setEmployeesCreate(tempEmployeeCreate)
            cancelEditEmployee()
        }
    }

    const cancelEditEmployee = () => {
        setEditEmployeeIndex(-1)
        resetEditEmployeeFields()
    }

    const employeeIsValid = (firstName: string, lastName: string, email: string, phoneNumber: string) => {
        return firstName !== "" &&  validateName(firstName) && lastName !== ""
            && validateName(lastName) && email !== "" && email.length <= emailMaxLength &&
            emailValidator.validate(email) && phoneNumber !== "" && phoneNumber.replaceAll('-', '').length === phoneNumberMaxLength
            && validatePhoneNumber(phoneNumber.replaceAll('-', ''))
    }

    const addEmployeeIsValid = () => {
        return employeeIsValid(employeeFirstName, employeeLastName, employeeEmail, employeePhoneNumber)
    }

    const editEmployeeIsValid = () => {
        const tmValue = employeeIsValid(editEmployeeFirstName, editEmployeeLastName, editEmployeeEmail, editEmployeePhoneNumber)
        return tmValue
    }

    const editEmployeeChangeExists = () => {
        return employeesCreate[editEmployeeIndex].first_name !== editEmployeeFirstName ||
            employeesCreate[editEmployeeIndex].last_name !== editEmployeeLastName ||
            employeesCreate[editEmployeeIndex].email !== editEmployeeEmail ||
            employeesCreate[editEmployeeIndex].phone_number !== editEmployeePhoneNumber
    }

    const employeeExistInListAdd = () => {
       return employeesCreate.length > 0 && employeesCreate.filter((employee) =>
            employee.email === employeeEmail || employee.phone_number === employeePhoneNumber).length > 0
    }

    const employeeExistInListEdit = () => {
        return employeesCreate.length > 0 && employeesCreate.filter((employee, index) => {
            return (employee.email == editEmployeeEmail && editEmployeeIndex !== index) ||
            (employee.phone_number == editEmployeePhoneNumber && editEmployeeIndex !== index)
        }).length > 0
    }

    const editEmployeeIndexMatches = (empListIndex: number) => {
        return empListIndex === editEmployeeIndex
    }

    const displayDataPostCreate = (employees: any) => {
       return  employees.map((employee: any, index: number) => {
            const employeeLocal = employee.employee !== undefined ? employee.employee : employee
            return (
                <div key = {index + employee.email}>
                    <CreateEmployeesInput disabled = {true}
                                          value = {employeeLocal.first_name}
                                          placeholder={"First Name"}/>
                    <CreateEmployeesInput disabled = {true}
                                          value = {employeeLocal.last_name}
                                          placeholder={"Last Name"}/>
                    <CreateEmployeesInput disabled = {true}
                                          value = {employeeLocal.email}
                                          placeholder={"Email"}/>
                    <CreateEmployeesInput disabled = {true}
                                          value = {employeeLocal.phone_number}
                                          placeholder={"Phone Number"}/>
                    {employee.message !== undefined &&
                    <CreateEmployeesInput disabled = {true}
                                          value = {employee.message}
                                          placeholder={"Message"}/>
                    }
                </div>
            )
        })
    }
    return (
        <ViewSpecificEmployeesWrapper>
            <Banner bannerInfo={employeeBannerInfo} showBanner={showBanner} closeBannerCallback={closeSpecificEmployeeBanner}/>
            <W4SubpageHeader>Create Employees</W4SubpageHeader>
            <div>
                <W4InputLabel>Add Employee: </W4InputLabel>
                <CreateEmployeesInput onChange={setEmpFirstName} disabled={!editEmployeeIndexMatches(-1)}
                                      value = {employeeFirstName} placeholder={"First Name"}/>
                <CreateEmployeesInput onChange={setEmpLastName} disabled={!editEmployeeIndexMatches(-1)}
                                      value = {employeeLastName} placeholder={"Last Name"}/>
                <CreateEmployeesInput onChange={setEmpEmail} disabled={!editEmployeeIndexMatches(-1)}
                                      value = {employeeEmail} placeholder={"Email"}/>
                <CreateEmployeesInput onChange={setEmpPhoneNumber} disabled={!editEmployeeIndexMatches(-1)}
                                      value = {employeePhoneNumber} placeholder={"Phone Number"}/>
                <SubmitButton onClick={addEmployee} disabled={!editEmployeeIndexMatches(-1) ||
                !addEmployeeIsValid() || employeeExistInListAdd()} >Add Employee</SubmitButton>
            </div>
            {employeesCreate.length > 0 && <p>Employees to be Created</p>}
            {employeesCreate.length > 0 ?
                employeesCreate.map((employee, index) => {
                    return (
                    <div key = {index}>
                        <CreateEmployeesInput onChange={setEditEmpFirstName} disabled = {!editEmployeeIndexMatches(index)}
                                              value = {!editEmployeeIndexMatches(index) ? employee.first_name : editEmployeeFirstName}
                                              placeholder={"First Name"}/>
                        <CreateEmployeesInput onChange={setEditEmpLastName} disabled = {!editEmployeeIndexMatches(index)}
                                              value = {!editEmployeeIndexMatches(index) ? employee.last_name : editEmployeeLastName}
                                              placeholder={"Last Name"}/>
                        <CreateEmployeesInput onChange={setEditEmpEmail} disabled = {!editEmployeeIndexMatches(index)}
                                              value = {!editEmployeeIndexMatches(index) ? employee.email : editEmployeeEmail}
                                              placeholder={"Email"}/>
                        <CreateEmployeesInput onChange={setEditEmpPhoneNumber} disabled = {!editEmployeeIndexMatches(index)}
                                              value = {!editEmployeeIndexMatches(index) ? employee.phone_number : editEmployeePhoneNumber}
                                              placeholder={"Phone Number"}/>

                        { !editEmployeeIndexMatches(index)?
                            <EditEmployeWrapperButton>
                                <SubmitButton onClick={() => editEmployee(index)} disabled={editEmployeeIndex !== -1}>Edit Employee</SubmitButton>
                                <SubmitButton onClick = {() => removeEmployee(index)} disabled={editEmployeeIndex !== -1}>Remove Employee</SubmitButton>
                            </EditEmployeWrapperButton>

                            :
                            <EditEmployeWrapperButton>
                                <SubmitButton onClick={confirmEditEmployee} disabled={!editEmployeeIsValid() ||
                                employeeExistInListEdit() || !editEmployeeChangeExists()}>Confirm Edit</SubmitButton>
                                <SubmitButton onClick={cancelEditEmployee}>Cancel Edit</SubmitButton>
                            </EditEmployeWrapperButton>
                        }
                    </div>
                    )
                })
            : <></>}

            {successfullyCreatedEmployees.length > 0 && <p>Employees Successfully Created</p>}
            {successfullyCreatedEmployees.length > 0 ?
                displayDataPostCreate(successfullyCreatedEmployees)
                : <></>}

            {invalidCreateEmployees.length > 0 && <p>Invalid Employees</p>}
            {invalidCreateEmployees.length > 0 ?
                displayDataPostCreate(invalidCreateEmployees)
                : <></>}

            {failedToCreateEmployees.length > 0 && <p>Failed Employees</p>}
            {failedToCreateEmployees.length > 0 ?
                displayDataPostCreate(failedToCreateEmployees)
                : <></>}

            {exceptionFailureToCreateEmployees.length > 0 && <p>Exception Employees</p>}
            {exceptionFailureToCreateEmployees.length > 0 ?
                displayDataPostCreate(exceptionFailureToCreateEmployees)
                : <></>}

            <SubmitButton onClick={createEmps} disabled={employeesCreate.length === 0 || editEmployeeIndex !== -1}>Create Employees</SubmitButton>
        </ViewSpecificEmployeesWrapper>
    )
}
const ViewSpecificEmployeesWrapper = styled(W4FlexColumn)`
  align-items: center;
`

const CreateEmployeesInput = styled(W4Input)`
    margin-left: 5px;
`
const EditEmployeWrapperButton = styled.div`
    display: inline;
`
export default CreateEmployees