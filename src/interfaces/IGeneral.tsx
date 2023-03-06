export interface IAlertMessage {
    msg: string,
    type: "error" | "success" | ""
}

export interface ITableTitles {
    title: string,
    alt?: string,
    colspan?: number,
    width?: number
}