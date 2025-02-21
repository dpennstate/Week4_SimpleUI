import {config} from "../config";
import axios from "axios";
import {IEditEmployee, IEmployee} from "../Utils/W4Interfaces";
const employeeEndpoint = "employee"
const employeesEndpoint = "employees/"
const employeeAPI = employeeEndpoint
const employeesAPI = employeesEndpoint
const createEmployeesAPI= employeesEndpoint + "create"
const editEmployeesAPI= employeesEndpoint + "edit"
const deleteEmployeesAPI= employeesEndpoint + "delete"

const employeesAxiosConfig = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}
export const getSingleEmployee = async(employeeId: string) => {
    try {
        const env = config.USE_LOCAL_API ? config.LOCAL_EMPLOYEE_API: config.EXTERNAL_URL
        const employeeURL = `${env}${employeeAPI}?id=${employeeId}`

        const response = await axios.get(employeeURL)

        if (response.status === 200) {
            console.log("The response of get single employees is ")
            console.log(response)
            return {data: response.data.data, success: true}
        }
        else {
            // The call returned something other than 200 like 400 or 500
            console.log("The response of get single employees is ")
            console.log(response)
            return {data: response.data.message, success: false}
        }
    }catch(error) {
        console.log("The error of get single employees is ")
        console.log(error)
        return {data: "Exception occurred while processing request", success: false}
    }
}

export const getAllEmployees = async() => {
    try {
        const env = config.USE_LOCAL_API ? config.LOCAL_EMPLOYEE_API: config.EXTERNAL_URL
        const getEmployeesURL = `${env}${employeesAPI}`

        const response = await axios.get(getEmployeesURL)

        if (response.status === 200) {
            console.log("The response of get all employees is ")
            console.log(response)
            return {data: response.data.data, success: true}
        }
        else {
            // The call returned something other than 200 like 400 or 500
            console.log("The response of get all employees is ")
            console.log(response)
            return {data: response.data.message, success: false}
        }
    }catch(error) {
        console.log("The error of get all employees is ")
        console.log(error)
        return {data: "Exception occurred while processing request", success: false}
    }
}

export const getListOfEmployees = async(employeeIds: string[]) => {
    try {
        const env = config.USE_LOCAL_API ? config.LOCAL_EMPLOYEE_API: config.EXTERNAL_URL
        const getListEmployeesURL = `${env}${employeesAPI}`
        const payload = {
            ids: employeeIds,
        }

        const response = await axios.post(getListEmployeesURL, payload, employeesAxiosConfig)

        if (response.status === 200) {
            console.log("The response of get list of employees is ")
            console.log(response)
            return {data: response.data.data, success: true}
        }
        else {
            // The call returned something other than 200 like 400 or 500
            console.log("The response of get list of employees is ")
            console.log(response)
            return {data: response.data.message, success: false}
        }
    }catch(error) {
        console.log("The error of get list of employees is ")
        console.log(error)
        return {data: "Exception occurred while processing request", success: false}
    }
}

export const createEmployees = async(employees: IEmployee[]) => {
    try {
        const env = config.USE_LOCAL_API ? config.LOCAL_EMPLOYEE_API: config.EXTERNAL_URL
        const createEmployeesURL = `${env}${createEmployeesAPI}`
        const payload = {
            employees: employees,
        }

        const response = await axios.post(createEmployeesURL, payload, employeesAxiosConfig)

        // At least one create was successful
        if (response.status === 201) {
            console.log("The response 201 of create employees is ")
            console.log(response)
            return {data: response.data.data, success: true}
        }
        else if (response.status === 200) {
            // None of the creates were successful, but also the request was successful with no exceptions
            console.log("The response 200 of create employees is ")
            console.log(response)
            return {data: response.data.data, success: true}
        }
        else {
            // The call returned something other than 200 or 201 like 400 or 500
            console.log("The response of create employees is ")
            console.log(response)
            return {data: response.data.message, success: false}
        }
    }catch(error) {
        console.log("The error of create employees is ")
        console.log(error)
        return {data: "Exception occurred while processing request", success: false}
    }
}

export const editEmployees = async(employees: IEditEmployee[]) => {
    try {
        const env = config.USE_LOCAL_API ? config.LOCAL_EMPLOYEE_API: config.EXTERNAL_URL
        const editEmployeesURL = `${env}${editEmployeesAPI}`
        const payload = {
            employees: employees,
        }

        const response = await axios.put(editEmployeesURL, payload, employeesAxiosConfig)

        // At least one edit was successful
        if (response.status === 201) {
            console.log("The response 201 of edit employees is ")
            console.log(response)
            return {data: response.data.data, success: true}
        }
        else if (response.status === 200) {
            // None of the edits were successful, but also the request was successful with no exceptions
            console.log("The response 200 of edit employees is ")
            console.log(response)
            return {data: response.data.data, success: true}
        }
        else {
            // The call returned something other than 200 or 201 like 400 or 500
            console.log("The response of edit employees is ")
            console.log(response)
            return {data: response.data.message, success: false}
        }
    }catch(error) {
        console.log("The error of edit employees is ")
        console.log(error)
        return {data: "Exception occurred while processing request", success: false}
    }
}

export const deleteEmployees = async(employeesIds: string[]) => {
    try {
        const env = config.USE_LOCAL_API ? config.LOCAL_EMPLOYEE_API: config.EXTERNAL_URL
        const deleteEmployeesURL = `${env}${deleteEmployeesAPI}`
        const payload = {
            ids: employeesIds,
        }

        const response = await axios.delete(deleteEmployeesURL, { headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, data: payload})

        // At least one delete was successful
        if (response.status === 201) {
            console.log("The response 201 of delete employees is ")
            console.log(response)
            return {data: response.data.data, success: true}
        }
        else if (response.status === 200) {
            // None of the deletes were successful, but also the request was successful with no exceptions
            console.log("The response 200 of delete employees is ")
            console.log(response)
            return {data: response.data.data, success: true}
        }
        else {
            // The call returned something other than 200 or 201 like 400 or 500
            console.log("The response of delete employees is ")
            console.log(response)
            return {data: response.data.message, success: false}
        }

    }catch(error) {
        console.log("The error of delete employees is ")
        console.log(error)
        return {data: "Exception occurred while processing request", success: false}
    }
}