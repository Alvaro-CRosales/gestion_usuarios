export interface IUserModel{
    email : string,
    password : string,
    name : string
}

export interface ILogInModel {
    email : string,
    password : string
}

export interface IListModel {
    name : string,
    description : string,
    priority_id : number
}