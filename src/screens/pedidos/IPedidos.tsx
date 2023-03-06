export interface IPedidos {
}

export interface INegociacoes {
    cod: string,
    descricao: string,
    data_abertura: string,
    chave: string,
    fase_negociacao: IFase_Negociacao
}

export interface IFase_Negociacao {
    descricao: string
}