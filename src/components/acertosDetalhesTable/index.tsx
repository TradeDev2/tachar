import React, { type PropsWithChildren } from 'react';
import { Table, Row, TableTitle, TableTitleText, BaseTouchable, Cell, CellText, InputTable } from '../../styled';
import { IAcertos_Detalhes_Tables, ITitle } from './IAcertos_Detalhes_Tables';
import Util from '../../classes/Utils';

export function Acertos_Detalhes_Tables(props: IAcertos_Detalhes_Tables) {
    return (
            <Table background='white'>
                        <Row>
                            {props.titles.map((title:ITitle, titleIndex) => (
                                <TableTitle width={title.width} colSpan={title.colspan ? title.colspan : title.colspan} key={titleIndex}><TableTitleText>{props.devolucao && title.alt ? title.alt : title.title}</TableTitleText></TableTitle>
                            ))}
                        </Row>
                        {props.itens.filter((item, itemIndex) => (props.devolucao && item.type != "vendidoMax") || (!props.devolucao && item.type != "devolvidoMax")).map((item, itemIndex) => {
                            const type = props.devolucao ? item.type == "devolvido" || item.type == "devolvidoMax" ? "error" : item.type == "vendidoMax" ? "disabled" : "" : item.type == "vendido" || item.type == "vendidoMax" ? "success" : item.type == "devolvidoMax" ? "disabled" : "";
                            const addFunction = () => props.treatItems(item.chave, "add");
                            const quantidade = props.devolucao ? item.quantDevolvido : item.quantVendido;
                            const changeQuantidade = (value: string) => props.treatItems(item.chave, "change_quantity", value);

                            return (
                                <Row key={itemIndex}>
                                    <BaseTouchable onPress={() => addFunction()}><Cell><CellText type={type ? type : ""}>{item.descricao}</CellText></Cell></BaseTouchable>
                                    <BaseTouchable onPress={() => addFunction()}><Cell><CellText type={type ? type : ""}>R${Util.formatMoney(item.valor_total)}</CellText></Cell></BaseTouchable>
                                    <BaseTouchable onPress={() => addFunction()}><Cell colSpan={0.5}><CellText type={type ? type : ""}>{parseInt(item.quantidade)}</CellText></Cell></BaseTouchable>
                                    <Cell width={75}><InputTable editable={type && type != "disabled" ? true : false} disabled={type && type != "disabled" ? false : true} value={quantidade ? `${quantidade}` : "0"} onChangeText={(e) => changeQuantidade(e)} /></Cell>
                                </Row>
                            )
                        })}
                    </Table>
    )
}