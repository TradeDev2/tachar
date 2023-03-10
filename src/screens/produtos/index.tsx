import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { Table, Row, TableTitle, TableTitleText, Cell, CellText, Page, Scrollable, InputTable, BaseTouchable, PageTitle, PageTitleView, Select, CenterView, SubmitButton, SubmitButtonText } from '../../styled';
import { IAcertos_Detalhes } from './IProdutos';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Rest from '../../classes/Rest';
import Loading from '../../components/loading';
import Util from '../../classes/Utils';
import { IAlertMessage } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';
import { CFOP_DIFERENTE_ESTADO, CFOP_EXTERIOR, CFOP_MESMO_ESTADO, EMPRESA_CODIGO } from '../../config/constants';
import { Acertos_Detalhes_Tables } from '../../components/acertosDetalhesTable';

const windowWidth = Dimensions.get('window').width;

export function Produtos({ route }: any, props: IProdutos) {
    const navigation = useNavigation();

    const ADD = "add";
    const CHANGE_QUANTITY = "change_quantity";
    const DESCONTO_PORCENTAGEM = 30;

    const tableTitles: ITableTitles[] = [
        { title: "Nome" }, { title: "Val" }, { title: "Qtd", colspan: 0.5 }, { title: "Nº Vend.", width: 75, alt: "Nº Devo." }];

        let tableWidth = 0;

        tableTitles.map((title:ITableTitles) => {
            if (title.colspan) {
                tableWidth += title.colspan * 100;
            } else if (title.width) {
                tableWidth += title.width;
            } else {
                tableWidth += 100;
            }
    
        })
        if (tableWidth < windowWidth) {
            const lastIndex = tableTitles[tableTitles.length-1];
    
            tableTitles[tableTitles.length-1].width = (lastIndex && lastIndex.colspan ? lastIndex.colspan * 100 : 0) + (lastIndex && lastIndex.width ? lastIndex.width : 0) + (windowWidth-tableWidth) 
        }


    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const { chave_mov } = route.params;

    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [fase, setFase] = useState<number>(0);
    const [itens, setItens] = useState<IAcerto_Detalhe[]>([]);
    const [condicao, setCondicao] = useState<any>();
    const [condicoes, setCondicoes] = useState<any[]>([]);
    const [devolucao, setDevolucao] = useState<boolean>(false);
    const [summary, setSummary] = useState<ISummary>();


    useEffect(() => {
        if (logged) {
            (async () => {
                const log = await Util.getStorageItem("login");
                setLogged(log);

                if (!log || !log.id) {
                    navigation.navigate("Login");
                }

                const response = await Rest.getBase(`movitens/filter?ChaveMov=${chave_mov}&orderBy=movitens.descricao ASC`, log.token);

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

                const crm = await Rest.getBase(`crmnegociacoes/pessoa/${log.id}`, log.token);

                if (crm.error) {
                    setLoading(false);
                    setAlert({ type: "error", msg: crm.msg });
                    return
                }
                console.log(crm[crm.length - 1].fase);

                setLoading(false);
                setItens(response.map((resp: IAcerto_Detalhe) => ({ ...resp, type: "" })));
                setCondicoes(cond);
                setFase(crm[crm.length - 1].fase);
            })();
        }
    }, []);

    useEffect(() => {
        let qtdVendidos = 0;
        let qtdDevolvidos = 0;
        let descontoReal = 0;
        let total = 0;
        let totalDesconto = 0;

        itens.map((it: IAcerto_Detalhe) => {
            qtdVendidos += it.quantVendido ? it.quantVendido : 0;
            qtdDevolvidos += it.quantDevolvido ? it.quantDevolvido : 0;

            total += parseFloat(it.valor_total) * (it.quantVendido ? it.quantVendido : 0);
        })

        let descontoPorcento = qtdVendidos > 0 ? DESCONTO_PORCENTAGEM : 0;

        descontoReal = total * descontoPorcento / 100;
        totalDesconto = total - descontoReal;

        setSummary({ qtdVendidos, qtdDevolvidos, descontoPorcento, descontoReal, total, totalDesconto });
    }, [itens]);

    const treatItems = (key: string, reason: "add" | "change_quantity", input: string | null = null) => {
        const item = itens.find((it: IAcerto_Detalhe) => it.chave == key);


        if (!item) {
            return setAlert({ type: "error", msg: "Item não encontrado!" });
        }

        if (devolucao) {

            if (item && item.quantDevolvido && item.quantDevolvido > 0) {
                if (reason == ADD) {
                    setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: item.quantVendido ? "vendido" : "", quantDevolvido: 0 } : { ...it }))
                } else if (reason == CHANGE_QUANTITY && (input && !isNaN(parseInt(input)) && parseInt(input) >= 0 || !input)) {
                    if (input == "0") {
                        setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: item.quantVendido ? "vendido" : "", quantDevolvido: 0 } : { ...it }))
                    } else if (input !== null) {
                        if (item.quantVendido && parseInt(input) <= parseInt(item.quantidade) - item.quantVendido || !item.quantVendido && parseInt(input) <= parseInt(item.quantidade)) {
                            setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: item.quantVendido ? "" : "devolvido", quantDevolvido: parseInt(input) } : { ...it }));
                        } else {
                            setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: item.quantVendido ? "" : "devolvidoMax", quantDevolvido: item.quantVendido ? parseInt(item.quantidade) - item.quantVendido : parseInt(item.quantidade) } : { ...it }));
                        }
                    }
                }
            } else {
                if (reason == ADD) {
                    if (!item.quantVendido || item.quantVendido && item.quantVendido < parseInt(item.quantidade)) {
                        setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: item.quantVendido ? "" : parseInt(it.quantidade) == 1 ? "devolvidoMax" : "devolvido", quantDevolvido: 1 } : { ...it }))
                    }
                }
            }

        } else {

            if (item && item.quantVendido && item.quantVendido > 0) {
                if (reason == ADD) {
                    setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: item.quantDevolvido ? "devolvido" : "", quantVendido: 0 } : { ...it }))
                } else if (reason == CHANGE_QUANTITY && (input && !isNaN(parseInt(input)) && parseInt(input) >= 0 || !input)) {
                    if (input == "0") {
                        setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: item.quantDevolvido ? "devolvido" : "", quantVendido: 0 } : { ...it }))
                    } else if (input !== null) {
                        if (item.quantDevolvido && parseInt(input) <= parseInt(item.quantidade) - item.quantDevolvido || !item.quantDevolvido && parseInt(input) <= parseInt(item.quantidade)) {
                            setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: item.quantDevolvido ? "" : "vendido", quantVendido: parseInt(input) } : { ...it }));
                        } else {
                            setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: item.quantDevolvido ? "" : "vendidoMax", quantVendido: item.quantDevolvido ? parseInt(item.quantidade) - item.quantDevolvido : parseInt(item.quantidade) } : { ...it }));
                        }
                    }
                }
            } else {
                if (reason == ADD) {
                    if (!item.quantDevolvido || item.quantDevolvido && item.quantDevolvido < parseInt(item.quantidade)) {
                        setItens(itens.map((it: IAcerto_Detalhe) => it.chave == key ? { ...it, type: item.quantDevolvido ? "" : parseInt(it.quantidade) == 1 ? "vendidoMax" : "vendido", quantVendido: 1 } : { ...it }))
                    }
                }
            }

        }
    }

    const pagarAcerto = async () => {
        setLoading(true);

        if (itens.find((it: IAcerto_Detalhe) => parseInt(it.quantidade) != (it.quantDevolvido ? it.quantDevolvido : 0) + (it.quantVendido ? it.quantVendido : 0))) {
            setAlert({ type: "error", msg: "Por favor, acerte todos os itens" });
            return;
        }

        if (!condicao || !condicao.chave) {
            setAlert({ type: "error", msg: "Selecione uma condição de pagamento" });
        }

        const vendidos = itens.filter((it: IAcerto_Detalhe) => it.quantVendido && it.quantVendido > 0);
        const devolvidos = itens.filter((it: IAcerto_Detalhe) => it.quantDevolvido && it.quantDevolvido > 0);
        console.log(devolvidos);

        if (devolvidos[0]) {
            const responseDev = await Rest.postBase(`/mov/tachar/salvaracerto`, {
                cfop_mesmo_estado: CFOP_MESMO_ESTADO,
                cfop_diferente_estado: CFOP_DIFERENTE_ESTADO,
                cfop_exterior: CFOP_EXTERIOR,
                chave_empresa: EMPRESA_CODIGO,

                itens: devolvidos,
                pessoa: logged.id,
                tipo: "D",
                chave_condicao: 1,
                chave_mov

            }, logged.token);


            console.log(responseDev);
        }
        if (vendidos[0]) {
            const responseDev = await Rest.postBase(`/mov/tachar/salvaracerto`, {
                cfop_mesmo_estado: CFOP_MESMO_ESTADO,
                cfop_diferente_estado: CFOP_DIFERENTE_ESTADO,
                cfop_exterior: CFOP_EXTERIOR,
                chave_empresa: EMPRESA_CODIGO,

                itens: vendidos,
                pessoa: logged.id,
                tipo: "S",
                chave_condicao: 1,
                chave_mov

            }, logged.token);


            console.log(responseDev);
        }
        setLoading(false);
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
                <SubmitButton width={(windowWidth/2)-20} onPress={() => setDevolucao(!devolucao)}>
                    <SubmitButtonText>
                        {devolucao ? "DEVOLVIDOS" : "VENDIDOS"} <Icon name="compare-arrows" size={17} color="white" />
                    </SubmitButtonText>
                </SubmitButton>
            </PageTitleView>
            <Scrollable>
                <Scrollable horizontal>

                    <Acertos_Detalhes_Tables
                        titles={tableTitles}
                        itens={itens}
                        treatItems={treatItems}
                        devolucao={devolucao}
                    />

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
                            <Cell><CellText>{summary ? `R$${Util.formatMoney(`${summary.descontoReal}`)}` : "0,00"}</CellText></Cell>
                            <Cell><CellText>{summary ? `R$${Util.formatMoney(`${summary.total}`)}` : "0,00"}</CellText></Cell>
                            <Cell><CellText>{summary ? `R$${Util.formatMoney(`${summary.totalDesconto}`)}` : "0,00"}</CellText></Cell>
                        </Row>
                    </Table>
                </Scrollable>

                <CenterView style={{ paddingBottom: 50 }}>
                    <Select buttonStyle={{ width: windowWidth - 90 }} defaultButtonText='Método de Pagamento' data={condicoes[0] ? condicoes.map((cond) => cond.descricao) : []} onSelect={(e) => { setCondicao(condicoes[0] ? condicoes.find((cond: any) => cond.descricao == e) : []) }} />
                </CenterView>

                {fase == 13 &&
                    <CenterView style={{ paddingBottom: 50 }}>
                        <SubmitButton onPress={async () => await pagarAcerto()}>
                            <SubmitButtonText>Pagar</SubmitButtonText>
                        </SubmitButton>
                    </CenterView>
                }

            </Scrollable>
        </Page >
    )
}