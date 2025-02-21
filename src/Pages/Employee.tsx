import React, {useState} from "react";
import styled from "styled-components";
import {IColumn} from "../Components/BasicGrid";
import ViewEmployee from "./EmployeeOptions/ViewEmployee";
import ViewSpecificEmployees from "./EmployeeOptions/ViewSpecificEmployees";
import ViewAllEmployees from "./EmployeeOptions/ViewAllEmployees";
import CreateEmployees from "./EmployeeOptions/CreateEmployees";
import EditEmployees from "./EmployeeOptions/EditEmployees";
import DeleteEmployees from "./EmployeeOptions/DeleteEmployees";
import {OptionsButton, W4FlexColumn, W4FlexRow} from "../Utils/styling"

enum EmployeeOptions {
    ViewAnEmployee = "View An Employee",
    ViewSpecificEmployees = "View Specific Employees",
    ViewAllEmployees = "View All Employees",
    CreateEmployees = "Create Employees",
    EditEmployees = "Edit Employees",
    DeleteEmployees = "Delete Employees"
}

interface IEmployeeOption{
    name: string;
    optionComponent: JSX.Element
}

export const employeeColumns: IColumn[] = [
    {key: "employee_id", columnName: "Employee ID", columnDataType: "string"},
    {key: "first_name", columnName: "First Name", columnDataType: "string"},
    {key: "last_name", columnName: "Last Name", columnDataType: "string"},
    {key: "email", columnName: "Email", columnDataType: "string"},
    {key: "phone_number", columnName: "Phone Number", columnDataType: "string"}]
const Employee: React.FC = () => {

        const ViewAnEmployeeOption: IEmployeeOption = {name: EmployeeOptions.ViewAnEmployee, optionComponent: <ViewEmployee/>}
        const ViewSpecificEmployeesOption: IEmployeeOption = {name: EmployeeOptions.ViewSpecificEmployees, optionComponent: <ViewSpecificEmployees/>}
        const ViewAllEmployeesOption: IEmployeeOption = {name: EmployeeOptions.ViewAllEmployees, optionComponent: <ViewAllEmployees/>}
        const CreateEmployeesOption: IEmployeeOption = {name: EmployeeOptions.CreateEmployees, optionComponent: <CreateEmployees/>}
        const EditEmployeesOption: IEmployeeOption = {name: EmployeeOptions.EditEmployees, optionComponent: <EditEmployees/>}
        const DeleteEmployeesOption: IEmployeeOption = {name: EmployeeOptions.DeleteEmployees, optionComponent: <DeleteEmployees/>}

        const [currentOption, setCurrentOption] = useState<EmployeeOptions>(EmployeeOptions.ViewAnEmployee)
        const [employeeOptionsAvailableToUser, setEmployeeOptionsAvailableToUser] = useState<IEmployeeOption[]>([
            ViewAnEmployeeOption, ViewSpecificEmployeesOption, ViewAllEmployeesOption, CreateEmployeesOption,
            EditEmployeesOption, DeleteEmployeesOption])

        const displayCurrentOption = () => {
          return  employeeOptionsAvailableToUser[employeeOptionsAvailableToUser.findIndex(option => option.name === currentOption)].optionComponent

        }

    const changeEmployeesOption = (employeeOption: EmployeeOptions) => {
            setCurrentOption(employeeOption)
    }


    return (
        <W4FlexColumn>
            <EmployeeTitle>Employee</EmployeeTitle>
            <EmployeeOptionsFlexRow>
                <OptionsButton onClick={() => changeEmployeesOption(EmployeeOptions.ViewAnEmployee)}>View An Employee</OptionsButton>
                <OptionsButton onClick={() => changeEmployeesOption(EmployeeOptions.ViewSpecificEmployees)}>View Specific Employees</OptionsButton>
                <OptionsButton onClick={() => changeEmployeesOption(EmployeeOptions.ViewAllEmployees)}>View All Employees</OptionsButton>
                <OptionsButton onClick={() => changeEmployeesOption(EmployeeOptions.CreateEmployees)}>Create Employees</OptionsButton>
                <OptionsButton onClick={() => changeEmployeesOption(EmployeeOptions.EditEmployees)}>Edit Employees</OptionsButton>
                <OptionsButton onClick={() => changeEmployeesOption(EmployeeOptions.DeleteEmployees)}>Delete Employees</OptionsButton>
            </EmployeeOptionsFlexRow>
            {
                displayCurrentOption()
            }
        </W4FlexColumn>
    )
}
const EmployeeTitle = styled.h1`
`
const EmployeeOptionsFlexRow = styled(W4FlexRow)`
    height: auto;
    justify-content: center;
`
export default Employee