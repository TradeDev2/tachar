export interface IAlert {
    alert: IAlertMessage,
    setAlert: Function
}

export interface IAlertMessage {
    msg: string,
    type: "error" | "success" | ""
}