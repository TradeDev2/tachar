export interface IBaseTable {
    titles: ITitle[],
    alt?: boolean,
    itens: IItem[][]
}

export interface IItem  {
    value: string
    type: "string" | "number" | "money" | "date" | "link"
    width?: number,
    colspan?: number
    link?: ILink
}

export interface ILink {
    screen: string
    params?: any
}

export interface ITitle {
    title: string,
    alt?: string,
    width?: number,
    colspan?: number
}
