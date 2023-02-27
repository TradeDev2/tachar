export interface IAcertos_Detalhes {
}

export interface IAcerto_Detalhe {
    chave: string,
    valor_total: string,
    descricao: string,
    lancamento: string,
    codigo_digitado: string,
    quantidade: string,
    type?: string
}

export interface ISummary {
    qtdVendidos: number,
    qtdDevolvidos: number,
    descontoPorcento: number,
    descontoReal: number,
    total: number,
    totalDesconto:number
}