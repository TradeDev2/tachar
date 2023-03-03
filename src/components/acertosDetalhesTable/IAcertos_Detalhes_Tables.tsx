import { IAcerto_Detalhe } from "../../screens/acertosDetalhes/IAcertos_Detalhes";

export interface ITitle {
    title: string,
    alt?: string,
    width?: number,
    colspan?: number
}

export interface IAcertos_Detalhes_Tables {
    titles: ITitle[],
    itens: IAcerto_Detalhe[],
    devolucao: boolean,
    treatItems: Function
}