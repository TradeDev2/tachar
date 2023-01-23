interface ILogin {
    id: number,
    name: string,
    token: string
}

interface IMain {
    login:ILogin
}

export interface IState {
    main: IMain
}