import React, {useEffect, useState} from "react";
import {SubmitButton, W4FlexColumn, W4Input, W4InputLabel, W4P, W4SubpageHeader} from "../../Utils/styling";
import Banner, {BannerType, IBannerInfo} from "../../Components/Banner";
import {editEmployees, getAllEmployees} from "../../APICalls/EmployeeAPI";
import styled from "styled-components";
import {IEditEmployee, IShowEmployee} from "../../Utils/W4Interfaces";
import emailValidator from "email-validator";

enum EditEmployeeField {
    FirstName = "First Name",
    LastName = "Last Name",
    Email = "Email",
    PhoneNumber = "Phone Number"
}

const EditEmployees: React.FC = () => {
    const employeeNameMaxLength = 100
    const emailMaxLength = 254
    const phoneNumberMaxLength = 10

    // Note: So user does not lose data on employee they are looking to add, will make separate states
    // for editing an existing employee. Will only allow them to edit one employee at a time
    const [editEmployeeFirstName, setEditEmployeeFirstName] = useState<string>("")
    const [editEmployeeLastName, setEditEmployeeLastName] = useState<string>("")
    const [editEmployeeEmail, setEditEmployeeEmail] = useState<string>("")
    const [editEmployeePhoneNumber, setEditEmployeePhoneNumber] = useState<string>("")

    const [originalEmployees, setOriginalEmployees] = useState<IShowEmployee[]>([])
    const [employeesEdit, setEmployeesEdit] = useState<IEditEmployee[]>([])
    const [showBanner, setShowBanner] = useState<boolean>(false)
    const [editEmployeeIndex, setEditEmployeeIndex] = useState(-1)

    const [successfullyEditedEmployees, setSuccessfullyEditedEmployees] = useState([])
    const [failedToEditEmployees, setFailedToEditEmployees] = useState([])
    const [exceptionFailureToEditEmployees, setExceptionFailureToEditEmployees] = useState([])
    const [invalidEditEmployees, setInvalidEditEmployees] = useState([])

    const getEmployees = () => {
        getAllEmployees().then((value: {data: any, success: boolean}) => {
            if (value.success) {
                console.log(value.data)
                if (value.data.message !== undefined) {
                    // This means employees don't exist per the API so state that in the success banner
                    setEmployeeBannerInfo({bannerMessage: "Employees request successful with message: "
                            + value.data.message, bannerType: BannerType.SUCCESS})
                    setOriginalEmployees([])
                    setEmployeesEdit([])
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
                setEmployeesEdit([])
            }
        }).catch((error) => {
            console.log("Exception occurred in when fetching employees in edit employees: ", error)
            setEmployeeBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
            setShowBanner(true)
            setOriginalEmployees([])
            setEmployeesEdit([])
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

    const setEditEmpFirstName = (employeeFirstNameInputValue: any) => {
        if (validateName(employeeFirstNameInputValue.target.value)) {
            setEditEmployeeFirstName(employeeFirstNameInputValue.target.value)
        }
    }

    const setEditEmpLastName = (employeeLastNameInputValue: any) => {
        if (validateName(employeeLastNameInputValue.target.value)) {
            setEditEmployeeLastName(employeeLastNameInputValue.target.value)
        }
    }

    const setEditEmpEmail = (employeeEmailInputValue: any) => {
        if (validateEmail(employeeEmailInputValue.target.value)) {
            setEditEmployeeEmail(employeeEmailInputValue.target.value)
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

    const editEmps = () => {
        // Should probably do a final check here to make sure all data is valid?
        editEmployees(employeesEdit).then((value: {data: any, success: boolean}) => {
            if (value.success) {
                console.log(value.data)

                // All employees failed to edit, but no exceptions happened to cause failure (instead they were all invalid)
                if (value.data.invalidEmployees !== undefined && value.data.invalidEmployees.length > 0) {
                    setInvalidEditEmployees(value.data.invalidEmployees)
                    setSuccessfullyEditedEmployees([])
                    setFailedToEditEmployees([])
                    setExceptionFailureToEditEmployees([])
                }
                else if (value.data.editResult !== undefined) {
                    const editResult = value.data.editResult
                    let unSuccessfulEdit = false

                    // Check successful edits

                    if (editResult.editedEmployees !== undefined && editResult.editedEmployees.length > 0) {
                        setSuccessfullyEditedEmployees(editResult.editedEmployees)
                    }
                    else {
                        setSuccessfullyEditedEmployees([])
                    }

                    // Check invalid employees
                    if (editResult.invalidEmployees !== undefined && editResult.invalidEmployees.length > 0) {
                        setInvalidEditEmployees(editResult.invalidEmployees)
                        unSuccessfulEdit = true
                    }
                    else {
                        setInvalidEditEmployees([])
                    }

                    // Check failed to edit employees
                    if (editResult.failedToEdit !== undefined && editResult.failedToEdit.length > 0) {
                        setFailedToEditEmployees(editResult.failedToEdit)
                        unSuccessfulEdit = true
                    }
                    else {
                        setFailedToEditEmployees([])
                    }

                    // Check exception to edit employees
                    if (editResult.exceptionToEdit !== undefined && editResult.exceptionToEdit.length > 0) {
                        setExceptionFailureToEditEmployees(editResult.exceptionToEdit)
                        unSuccessfulEdit = true
                    }
                    else {
                        setExceptionFailureToEditEmployees([])
                    }

                    if (!unSuccessfulEdit) {
                        setEmployeesEdit([])
                    }
                    else {
                        // Here just remove the successful edits from the employeesEdit array
                        const tempEmployeesEdit = employeesEdit.filter((employee) => {
                            if (editResult.editedEmployees.some((succEmployee: IShowEmployee) => succEmployee.employee_id === employee.employee_id)) {
                                return false
                            }
                            return true
                        })

                        setEmployeesEdit(tempEmployeesEdit)
                    }
                }
                setEmployeeBannerInfo({bannerMessage: "Edit Employees request successful with message: "
                        + value.data.message, bannerType: BannerType.SUCCESS})
                setShowBanner(true)
                setInvalidEditEmployees([])
                setSuccessfullyEditedEmployees([])
                setFailedToEditEmployees([])
                setExceptionFailureToEditEmployees([])
                getEmployees()
            }
            else {
                console.log(value.data)
                setEmployeeBannerInfo({bannerMessage: value.data, bannerType: BannerType.ERROR})
                setShowBanner(true)
                setInvalidEditEmployees([])
                setSuccessfullyEditedEmployees([])
                setFailedToEditEmployees([])
                setExceptionFailureToEditEmployees([])
                getEmployees()
            }
        }).catch((error) => {
            console.log("Exception occurred in when editing employees: ", error)
            setEmployeeBannerInfo({bannerMessage: "An unknown error occurred", bannerType: BannerType.ERROR})
            setShowBanner(true)
            setInvalidEditEmployees([])
            setSuccessfullyEditedEmployees([])
            setFailedToEditEmployees([])
            setExceptionFailureToEditEmployees([])
            getEmployees()
        })
    }

    const resetEditEmployeeFields = () => {
        setEditEmployeeFirstName("")
        setEditEmployeeLastName("")
        setEditEmployeeEmail("")
        setEditEmployeePhoneNumber("")
    }

    const editEmployee = (employeeIndex: number) => {
        setEditEmployeeFirstName(originalEmployees[employeeIndex].first_name)
        setEditEmployeeLastName(originalEmployees[employeeIndex].last_name)
        setEditEmployeeEmail(originalEmployees[employeeIndex].email)
        setEditEmployeePhoneNumber(originalEmployees[employeeIndex].phone_number)
        setEditEmployeeIndex(employeeIndex)
    }

    const undoEmployeeEdit = (employeeId: string) => {
        if (employeeInEditedList(employeeId)) {
            const tempEmployeesEdit = employeesEdit.filter((employee) => employee.employee_id !== employeeId)
            setEmployeesEdit(tempEmployeesEdit)
        }
    }

    const confirmEditEmployee = (employeeId: string) => {
        if (employeeIsValid(editEmployeeFirstName, editEmployeeLastName, editEmployeeEmail, editEmployeePhoneNumber)) {
            // Add to json only fields that have changed

            const changedEmployee: IEditEmployee = {employee_id: employeeId}

            const tempEmployeeEdit = employeesEdit

            if (originalEmployees[editEmployeeIndex].first_name !== editEmployeeFirstName) {
                // @ts-ignore
                changedEmployee.first_name = editEmployeeFirstName
            }
            if (originalEmployees[editEmployeeIndex].last_name !== editEmployeeLastName) {
                // @ts-ignore
                changedEmployee.last_name = editEmployeeLastName
            }
            if (originalEmployees[editEmployeeIndex].email !== editEmployeeEmail) {
                // @ts-ignore
                changedEmployee.email = editEmployeeEmail
            }
            if (originalEmployees[editEmployeeIndex].phone_number !== editEmployeePhoneNumber) {
                // @ts-ignore
                changedEmployee.phone_number = editEmployeePhoneNumber
            }

            // Now check if the employee already exists in the list. If it does, will just replace, else
            // push the employee onto the list
            let indexOfEmployeeInEditedList = employeesEdit.findIndex((employee) =>  employee.employee_id === employeeId)

            // Exists in edited employees list
            if (indexOfEmployeeInEditedList !== -1 ) {
                tempEmployeeEdit[indexOfEmployeeInEditedList] = changedEmployee
                setEmployeesEdit(tempEmployeeEdit)
            }
            else {
                // Doesn't exist in edited employees list
                tempEmployeeEdit.push(changedEmployee)
                setEmployeesEdit(tempEmployeeEdit)
            }

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
            && validatePhoneNumber(phoneNumber.replaceAll('-',''))
    }

    const editEmployeeIsValid = () => {
        const tmValue = employeeIsValid(editEmployeeFirstName, editEmployeeLastName, editEmployeeEmail, editEmployeePhoneNumber)
        return tmValue
    }

    const editEmployeeChangeExists = () => {
        return originalEmployees[editEmployeeIndex].first_name !== editEmployeeFirstName ||
            originalEmployees[editEmployeeIndex].last_name !== editEmployeeLastName ||
            originalEmployees[editEmployeeIndex].email !== editEmployeeEmail ||
            originalEmployees[editEmployeeIndex].phone_number !== editEmployeePhoneNumber
    }

    // This is to make sure employee being modified doesn't have an email or phone number given that isn't already
    // in the original employee list that isn't that employee
    // Note, if it does match, we have to check if that employee's email or phone number wasn't already modified
    // If it was then make sure it isn't same in the modified version
    const employeeExistsInListOriginal = () => {
        if (originalEmployees.length === 0) {
            return false
        }


        return originalEmployees.length > 0 && originalEmployees.filter((employee, index) => {

            if (employee.email === editEmployeeEmail && editEmployeeIndex !== index) {
                // Here need to check if the edited version of employee.email if it exists. If the employee id
                // doesn't exist, it means the original is the only one and so the edited email is same as original
                // Else if it does exist inside of the employeesEdit array, check if email is undefined. If it is
                // it also means that the user didn't attempt to change the email
                if (employeesEdit.length === 0) {
                    return true
                }

                if (!employeesEdit.some(emp => emp.employee_id === employee.employee_id)) {
                    return true
                }
                if (employeesEdit.some((emp) =>
                    emp.employee_id === employee.employee_id && emp.email === undefined)) {
                    // Here basically means that the email wasn't modified and so the emails are the same still so
                    // the employee exists in original list with same email and didn't have email modified if it does
                    // exist
                    return true
                }

                // This means that the user changed the email for this employee so it doesn't matter if they match
                // in the original. Will check phone number next so don't return just yet
            }

            if (employee.phone_number === editEmployeePhoneNumber && editEmployeeIndex !== index) {
                // Here need to check if the edited version of employee.phone_number if it exists. If the employee id
                // doesn't exist, it means the original is the only one and so the edited phone number is same as original
                // Else if it does exist inside of the employeesEdit array, check if phone number is undefined. If it is
                // it also means that the user didn't attempt to change the phone number
                if (employeesEdit.length === 0) {
                    return true
                }

                if (!employeesEdit.some(emp => emp.employee_id === employee.employee_id)) {
                    return true
                }
                if (employeesEdit.some((emp) =>
                    emp.employee_id === employee.employee_id && emp.phone_number === undefined)) {
                    // Here basically means that the phone number wasn't modified and so the phone numbers are the same still so
                    // the employee exists in original list with same phone number and didn't have phone number modified if it does
                    // exist
                    return true
                }

                // This means that the user changed the phone number for this employee so it doesn't matter if they match
                // in the original.
            }

            return false
        }).length > 0
    }

    // This check will be similar to original, but won't have to perform a second check
    const employeeExistInListEdit = (employeeId: string) => {
        if (employeesEdit.length === 0) {
            return false
        }

        return employeesEdit.length > 0 && employeesEdit.filter((employee) => {
            // This means that the employee email is already being used so yes it doesn't already exist in the edit list
            if (employee.email !== undefined && employee.email === editEmployeeEmail && employeeId !== employee.employee_id) {
                return true
            }
            // This means that the employee phone number is already being used so yes it doesn't already exist in the edit list
            if (employee.phone_number !== undefined && employee.phone_number === editEmployeePhoneNumber && employeeId !== employee.employee_id) {
                return true
            }
            return false
        }).length > 0
    }

    const editEmployeeIndexMatches = (empListIndex: number) => {
        return empListIndex === editEmployeeIndex
    }

    const employeeInEditedList = (employeeId: string) => {
        return employeesEdit.length > 0 && employeesEdit.filter((employee) => employee.employee_id === employeeId).length > 0
    }

    const getEmployeeInEditedList = (employeeId: string) => {
        return employeesEdit.filter((employee) => employee.employee_id === employeeId)[0]
    }
    const valueEditEmployee = (index: number, editEmployeeField: EditEmployeeField, employee: IShowEmployee) => {
        let valueEdit = ""
        if (editEmployeeIndexMatches(index)) {
            switch (editEmployeeField) {
                case EditEmployeeField.FirstName:
                    valueEdit = editEmployeeFirstName
                    break
                case EditEmployeeField.LastName:
                    valueEdit = editEmployeeLastName
                    break
                case EditEmployeeField.Email:
                    valueEdit = editEmployeeEmail
                    break
                case EditEmployeeField.PhoneNumber:
                    valueEdit = editEmployeePhoneNumber
                    break
            }
        }
        else if (employeeInEditedList(employee.employee_id)) {
            switch (editEmployeeField) {
                case EditEmployeeField.FirstName:
                    valueEdit = getEmployeeInEditedList(employee.employee_id).first_name || employee.first_name
                    break
                case EditEmployeeField.LastName:
                    valueEdit = getEmployeeInEditedList(employee.employee_id).last_name || employee.last_name
                    break
                case EditEmployeeField.Email:
                    valueEdit = getEmployeeInEditedList(employee.employee_id).email || employee.email
                    break
                case EditEmployeeField.PhoneNumber:
                    valueEdit = getEmployeeInEditedList(employee.employee_id).phone_number || employee.phone_number
                    break
            }
        }
        else {
            switch (editEmployeeField) {
                case EditEmployeeField.FirstName:
                    valueEdit = employee.first_name
                    break
                case EditEmployeeField.LastName:
                    valueEdit =  employee.last_name
                    break
                case EditEmployeeField.Email:
                    valueEdit = employee.email
                    break
                case EditEmployeeField.PhoneNumber:
                    valueEdit = employee.phone_number
                    break
            }
        }

        return valueEdit
    }

    const displayDataPostEdit = (employees: any) => {
        return  employees.map((employee: any, index: number) => {
            const employeeLocal = employee.employee !== undefined ? employee.employee : employee
            return (
                <div key = {index + employee.email}>
                    <EditEmployeesInput disabled = {true}
                                          value = {employeeLocal.first_name}
                                          placeholder={"First Name"}/>
                    <EditEmployeesInput disabled = {true}
                                          value = {employeeLocal.last_name}
                                          placeholder={"Last Name"}/>
                    <EditEmployeesInput disabled = {true}
                                          value = {employeeLocal.email}
                                          placeholder={"Email"}/>
                    <EditEmployeesInput disabled = {true}
                                          value = {employeeLocal.phone_number}
                                          placeholder={"Phone Number"}/>
                    {employee.message !== undefined &&
                    <EditEmployeesInput disabled = {true}
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
            <W4SubpageHeader>Edit Employees</W4SubpageHeader>
            {originalEmployees.length > 0 ?
                originalEmployees.map((employee, index) => {
                    return (
                        <EditEmployeeDivWrapper key = {index}>
                            <EditEmployeesInput onChange={setEditEmpFirstName} disabled = {!editEmployeeIndexMatches(index)}
                                                  value = {valueEditEmployee(index, EditEmployeeField.FirstName, employee)}
                                                  placeholder={"First Name"}/>
                            <EditEmployeesInput onChange={setEditEmpLastName} disabled = {!editEmployeeIndexMatches(index)}
                                                  value = {valueEditEmployee(index, EditEmployeeField.LastName, employee)}
                                                  placeholder={"Last Name"}/>
                            <EditEmployeesInput onChange={setEditEmpEmail} disabled = {!editEmployeeIndexMatches(index)}
                                                  value = {valueEditEmployee(index, EditEmployeeField.Email, employee)}
                                                  placeholder={"Email"}/>
                            <EditEmployeesInput onChange={setEditEmpPhoneNumber} disabled = {!editEmployeeIndexMatches(index)}
                                                  value = {valueEditEmployee(index, EditEmployeeField.PhoneNumber, employee)}
                                                  placeholder={"Phone Number"}/>


                            { !editEmployeeIndexMatches(index)?
                                <EditEmployeWrapperInline>
                                    <SubmitButton onClick={() => editEmployee(index)}
                                                  disabled={editEmployeeIndex !== -1}>Edit Employee</SubmitButton>
                                    {
                                        employeeInEditedList(employee.employee_id) &&
                                        <SubmitButton onClick={() => undoEmployeeEdit(employee.employee_id)}
                                                      disabled={editEmployeeIndex !== -1}>Undo Edit</SubmitButton>
                                    }
                                    {
                                        employeeInEditedList(employee.employee_id) &&
                                            <W4P>Pending Edit</W4P>
                                    }
                                </EditEmployeWrapperInline>

                                :
                                <EditEmployeWrapperInline>
                                    <SubmitButton onClick={ () => confirmEditEmployee(employee.employee_id)} disabled={!editEmployeeIsValid() ||
                                    employeeExistsInListOriginal() || employeeExistInListEdit(employee.employee_id) ||
                                    !editEmployeeChangeExists()}>Confirm Edit</SubmitButton>
                                    <SubmitButton onClick={cancelEditEmployee}>Cancel Edit</SubmitButton>
                                    {
                                        employeeInEditedList(employee.employee_id) &&
                                        <W4P>Pending Edit</W4P>
                                    }
                                </EditEmployeWrapperInline>
                            }
                        </EditEmployeeDivWrapper>
                    )
                })
                : <p>No Employees Exist to Edit</p>}

            {successfullyEditedEmployees.length > 0 && <p>Employees Successfully Edited</p>}
            {successfullyEditedEmployees.length > 0 ?
                displayDataPostEdit(successfullyEditedEmployees)
                : <></>}

            {invalidEditEmployees.length > 0 && <p>Invalid Employees</p>}
            {invalidEditEmployees.length > 0 ?
                displayDataPostEdit(invalidEditEmployees)
                : <></>}

            {failedToEditEmployees.length > 0 && <p>Failed Employees</p>}
            {failedToEditEmployees.length > 0 ?
                displayDataPostEdit(failedToEditEmployees)
                : <></>}

            {exceptionFailureToEditEmployees.length > 0 && <p>Exception Employees</p>}
            {exceptionFailureToEditEmployees.length > 0 ?
                displayDataPostEdit(exceptionFailureToEditEmployees)
                : <></>}

            {originalEmployees.length > 0 && <SubmitButton onClick={editEmps} disabled={employeesEdit.length === 0
            || editEmployeeIndex !== -1}>Edit Employees</SubmitButton>}
        </ViewSpecificEmployeesWrapper>
    )
}
const ViewSpecificEmployeesWrapper = styled(W4FlexColumn)`
  align-items: center;
`

const EditEmployeesInput = styled(W4Input)`
    margin-left: 5px;
`
const EditEmployeWrapperInline = styled.div`
    display: inline;
`

const EditEmployeeDivWrapper = styled.div`
    width: auto;
`

export default EditEmployees