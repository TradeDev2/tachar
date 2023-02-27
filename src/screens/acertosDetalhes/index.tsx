import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { Table, Row, TableTitle, TableTitleText, Cell, CellText, Page, Scrollable, InputTable, BaseTouchable, PageTitle, PageTitleView, Select } from '../../styled';
import { IAcertos_Detalhes, IAcerto_Detalhe, ISummary } from './IAcertos_Detalhes';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Rest from '../../classes/Rest';
import Loading from '../../components/loading';
import Util from '../../classes/Utils';
import { IAlertMessage } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';

export function Acertos_Detalhes({ route }: any, props: IAcertos_Detalhes) {
    const navigation = useNavigation();
    
    const ADD = "add";
    const CHANGE_QUANTITY = "change_quantity";
    const DESCONTO_PORCENTAGEM = 30;

    const tableTitles = ["", "Nome", "Val", "Qtd", ""];
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const { chave_mov } = route.params;

    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [itens, setItens] = useState<IAcerto_Detalhe[]>([]);
    const [condicoes, setCondicoes] = useState<IAcerto_Detalhe[]>([]);
    const [devolucao, setDevolucao] = useState<boolean>(false);
    const [itensVendidos, setItensVendidos] = useState<IAcerto_Detalhe[]>([]);
    const [itensDevolvidos, setItensDevolvidos] = useState<IAcerto_Detalhe[]>([]);
    const [summary, setSummary] = useState<ISummary>();


    useEffect(() => {
        (async () => {
            const log = await Util.getStorageItem("login");
            setLogged(log);

            if (!log || !log.id) {
                navigation.navigate("Login");
            }

            const response = await Rest.getBase(`movitens/filter?ChaveMov=${chave_mov}`, log.token);

            if (response.error) {
                setLoading(false);
                setAlert({ type: "error", msg: response.msg });
                return;
            }

            const cond = await Rest.getBase(`condicoes/filter?condicao_web=1`, log.token);

            if (cond.error) {
                setLoading(false);
                setAlert({ type: "error", msg: response.msg });
                return;
            }

            setLoading(false);
            setItens(response.map((resp:IAcerto_Detalhe) => ({...resp, type: ""})));
            setCondicoes(cond);
        })();
    }, []);

    const buildSummary = () => {
        let qtdVendidos = 0;
        let qtdDevolvidos = 0;
        let descontoPorcento = itensVendidos[0] ? DESCONTO_PORCENTAGEM : 0;
        let descontoReal = 0;
        let total = 0;
        let totalVendidos = 0;
        let totalDevolvidos = 0;
        let totalDesconto = 0;

        itensVendidos.map((it:IAcerto_Detalhe) => {
            qtdVendidos += parseInt(it.quantidade);

            totalVendidos += parseFloat(it.valor_total) * parseInt(it.quantidade);
        })
        
        itensDevolvidos.map((it:IAcerto_Detalhe) => {
            qtdDevolvidos += parseInt(it.quantidade);

            totalDevolvidos += parseFloat(it.valor_total) * parseInt(it.quantidade);
        })

        descontoReal = totalVendidos * descontoPorcento/100;
        total += totalDevolvidos + totalVendidos;
        totalDesconto = total - descontoReal;

        setSummary({qtdVendidos, qtdDevolvidos, descontoPorcento, descontoReal,  total, totalDesconto});
    }

    const treaItems = (key: string, reason: "add" | "change_quantity", input: string | null = null) => {
        const item = itens.find((it: IAcerto_Detalhe) => it.chave == key);


        if (!item) {
            return setAlert({ type: "error", msg: "Item não encontrado!" });
        }

        if (devolucao) {

            const devolvidos = itensDevolvidos;
            const itemNaLista = devolvidos.find((it: IAcerto_Detalhe) => it.chave == key);
            const itemVendido = itensVendidos.find((it: IAcerto_Detalhe) => it.chave == key);

            if (itemNaLista) {
                if (reason == ADD) {
                    setItensDevolvidos(devolvidos.filter((it: IAcerto_Detalhe) => it.chave != key));
                    setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: itemVendido ? "vendido" : "" } : { ...it }))
                } else if (reason == CHANGE_QUANTITY && (input && !isNaN(parseInt(input)) && parseInt(input) >= 0 || !input)) {
                    if (input == "0") {
                        setItensDevolvidos(devolvidos.filter((it: IAcerto_Detalhe) => it.chave != key));
                        setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: itemVendido ? "vendido" : "" } : { ...it }))
                    } else if (input !== null) {
                        if (itemVendido && parseInt(input) <= parseInt(item.quantidade) - parseInt(itemVendido.quantidade) || !itemVendido && parseInt(input) <= parseInt(item.quantidade)) {
                            setItensDevolvidos(devolvidos.map((it: IAcerto_Detalhe) => it.chave == key ? { ...itemNaLista, quantidade: input } : { ...it }))
                            setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: itemVendido ? "" : "devolvido" } : { ...it }));
                        } else {
                            setItensDevolvidos(devolvidos.map((it: IAcerto_Detalhe) => it.chave == key ? { ...itemNaLista, quantidade: `${itemVendido ? parseInt(item.quantidade) - parseInt(itemVendido.quantidade) : parseInt(item.quantidade)}` } : { ...it }))
                            setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: itemVendido ? "" : "devolvidoMax" } : { ...it }));
                        }
                    }
                }
            } else {
                if (reason == ADD) {
                    if (!itemVendido || itemVendido && parseInt(itemVendido.quantidade) < parseInt(item.quantidade)) {
                        devolvidos.push({ ...item, quantidade: "1" });
                        setItensDevolvidos(devolvidos);
                        setItens(itens.map((it:IAcerto_Detalhe) => it.chave == key ? {...it, type: itemVendido ? "" : parseInt(it.quantidade) == 1 ? "devolvidoMax" : "devolvido"} : {...it}))
                    }
                }
            }

        } else {

            const vendidos = itensVendidos;
            const itemNaLista = vendidos.find((it: IAcerto_Detalhe) => it.chave == key);
            const itemDevolvido = itensDevolvidos.find((it: IAcerto_Detalhe) => it.chave == key);

            if (itemNaLista) {
                if (reason == ADD) {
                    setItensVendidos(vendidos.filter((it: IAcerto_Detalhe) => it.chave != key));
                    setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: itemDevolvido ? "devolvido" : "" } : { ...it }))
                } else if (reason == CHANGE_QUANTITY && (input && !isNaN(parseInt(input)) && parseInt(input) >= 0 || !input)) {
                    if (input == "0") {
                        setItensVendidos(vendidos.filter((it: IAcerto_Detalhe) => it.chave != key));
                        setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: itemDevolvido ? "devolvido" : "" } : { ...it }))
                    } else if (input !== null) {
                        if (itemDevolvido && parseInt(input) <= parseInt(item.quantidade) - parseInt(itemDevolvido.quantidade) || !itemDevolvido && parseInt(input) <= parseInt(item.quantidade)) {
                            setItensVendidos(vendidos.map((it: IAcerto_Detalhe) => it.chave == key ? { ...itemNaLista, quantidade: input } : { ...it }))
                            setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: itemDevolvido ? "" : "vendido" } : { ...it }));
                        } else {
                            setItensVendidos(vendidos.map((it: IAcerto_Detalhe) => it.chave == key ? { ...itemNaLista, quantidade: `${itemDevolvido ? parseInt(item.quantidade) - parseInt(itemDevolvido.quantidade) : parseInt(item.quantidade)}` } : { ...it }))
                            setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: itemDevolvido ? "" : "vendidoMax" } : { ...it }));
                        }
                    }
                }
            } else {
                if (reason == ADD) {
                    if (!itemDevolvido || itemDevolvido && parseInt(itemDevolvido.quantidade) < parseInt(item.quantidade)) {
                        vendidos.push({ ...item, quantidade: "1" });
                        setItensVendidos(vendidos);
                        setItens(itens.map((it:IAcerto_Detalhe) => it.chave == key ? {...it, type: itemDevolvido ? "" : parseInt(it.quantidade) == 1 ? "vendidoMax" : "vendido"} : {...it}))
                    }
                }
            }

        }
        buildSummary();
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <Page>
            <FixatedStatusBar />

            <Alert alert={alert} setAlert={setAlert} />

            <Header title="Acertos" navigation={navigation} />
            <PageTitleView>
                <BaseTouchable onPress={() => setDevolucao(!devolucao)}><PageTitle>{devolucao ? "DEVOLVIDOS" : "VENDIDOS"} <Icon name="compare-arrows" size={17} color="white" /> </PageTitle></BaseTouchable>
            </PageTitleView>
            <Scrollable>
                <Scrollable horizontal>
                    <Table background='white'>
                        <Row>
                            {tableTitles.map((title, titleIndex) => (
                                <TableTitle width={titleIndex == 0 ? 50 : titleIndex == 4 ? 75 : 0} colSpan={titleIndex == 3 ? 0.5 : undefined} key={titleIndex}><TableTitleText>{titleIndex == 4 ? devolucao ? "Nº devo." : "Nº vend." : title}</TableTitleText></TableTitle>
                            ))}
                        </Row>
                        {itens.map((item, itemIndex) => {
                            const type = devolucao ? item.type == "devolvido" || item.type == "devolvidoMax" ? "error" : item.type == "vendidoMax" ? "disabled" : "" : item.type == "vendido" || item.type == "vendidoMax" ? "success" : item.type == "devolvidoMax" ? "disabled" : "";
                            const addFunction = () => treaItems(item.chave, ADD);
                            const quantidade = devolucao ? itensDevolvidos.find((it: IAcerto_Detalhe) => it.chave == item.chave) : itensVendidos.find((it: IAcerto_Detalhe) => it.chave == item.chave);
                            const changeQuantidade = (value: string) => treaItems(item.chave, CHANGE_QUANTITY, value);

                            return (
                                <Row key={itemIndex}>
                                    <BaseTouchable onPress={() => addFunction()}><Cell width={50}><CellText>{type == "" ? "+" : "-"}</CellText></Cell></BaseTouchable>
                                    <BaseTouchable onPress={() => addFunction()}><Cell><CellText type={type ? type : ""}>{item.descricao}</CellText></Cell></BaseTouchable>
                                    <BaseTouchable onPress={() => addFunction()}><Cell><CellText type={type ? type : ""}>R${Util.formatMoney(item.valor_total)}</CellText></Cell></BaseTouchable>
                                    <BaseTouchable onPress={() => addFunction()}><Cell colSpan={0.5}><CellText type={type ? type : ""}>{parseInt(item.quantidade)}</CellText></Cell></BaseTouchable>
                                    <Cell width={75}><InputTable editable={type && type != "disabled" ? true : false} disabled={type && type != "disabled" ? false : true} value={quantidade ? quantidade.quantidade : "0"} onChangeText={(e) => changeQuantidade(e)} /></Cell>
                                </Row>
                            )
                        })}
                    </Table>

                </Scrollable>

                <Scrollable horizontal>
                    <Table background='white'>
                        <Row>
                            <TableTitle><TableTitleText>Qtd. Vendidos</TableTitleText></TableTitle>
                            <TableTitle><TableTitleText>Qtd. Devolvidos</TableTitleText></TableTitle>
                            <TableTitle><TableTitleText>Desconto (%)</TableTitleText></TableTitle>
                            <TableTitle><TableTitleText>Desconto (R$)</TableTitleText></TableTitle>
                            <TableTitle><TableTitleText>Total</TableTitleText></TableTitle>
                            <TableTitle><TableTitleText>Total com Desconto</TableTitleText></TableTitle>
                        </Row>
                        <Row>
                            <Cell><CellText>{summary ? summary.qtdVendidos : 0}</CellText></Cell>
                            <Cell><CellText>{summary ? summary.qtdDevolvidos : 0}</CellText></Cell>
                            <Cell><CellText>{summary ? summary.descontoPorcento : "0"}%</CellText></Cell>
                            <Cell><CellText>{summary ? Util.formatMoney(`${summary.descontoReal}`) : "R$0,00"}</CellText></Cell>
                            <Cell><CellText>{summary? Util.formatMoney(`${summary.total}`) : "R$0,00"}</CellText></Cell>
                            <Cell><CellText>{summary ? Util.formatMoney(`${summary.totalDesconto}`) : "R$0,00"}</CellText></Cell>
                        </Row>
                    </Table>
                </Scrollable>

                <Select style={{marginBottom: 20}} data={condicoes[0] ? condicoes.map((cond) => cond.descricao) : []} onSelect={() => {}}/>

            </Scrollable>
        </Page >
    )
}