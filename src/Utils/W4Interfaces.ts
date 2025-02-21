export interface IPage{
    name: string;
    pageComponent: JSX.Element;
}

export interface IShowEmployee{
    employee_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

export interface IEmployee {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

export interface IEditEmployee {
    employee_id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
}