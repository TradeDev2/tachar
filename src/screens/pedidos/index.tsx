import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { Dimensions, Text } from 'react-native';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { Cell, CellText, Page, Row, Scrollable, Table, TableTitle, TableTitleText } from '../../styled';
import { INegociacoes, IPedidos } from './IPedidos';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/loading';
import Util from '../../classes/Utils';
import { IAlertMessage, ITableTitles } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';
import Rest from '../../classes/Rest';
import dayjs from 'dayjs';

const windowWidth = Dimensions.get('window').width;

export function Pedidos(props: IPedidos) {
    const navigation = useNavigation();
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const tableTitles: ITableTitles[] = [
        { title: "Negociação Nº", colspan: 1 },
        { title: "Desc.", colspan: 1 },
        { title: "Abertura", colspan: 1 },
        { title: "Fase Atual", colspan: 1.2 },
        { title: "Pedido", colspan: 1 }
    ];

    let tableWidth = 0;

    tableTitles.map((title: ITableTitles) => {
        if (title.width) {
            tableWidth += title.width;
        } else if(title.colspan) {
            tableWidth += title.colspan * 100;
        } else {
            tableWidth += 100;
        }

    })
    if (tableWidth < windowWidth) {
        const lastIndex = tableTitles[tableTitles.length - 1];

        tableTitles[tableTitles.length - 1].width = (lastIndex && lastIndex.colspan ? lastIndex.colspan * 100 : 0) + (lastIndex && lastIndex.width ? lastIndex.width : 0) + (windowWidth - tableWidth)
    }

    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [pedidos, setPedidos] = useState<INegociacoes[]>([]);

    useEffect(() => {
        (async () => {
            const log = await Util.getStorageItem("login");
            setLogged(log);

            if (!log || !log.id) {
                navigation.navigate("Login");
            }

            const pedid = await Rest.getBase(`crmnegociacoes/fase/${log.id}`, log.token);

            if (pedid.error) {
                setAlert({ type: "error", msg: pedid.msg });
                return setLoading(false);
            }

            setPedidos(pedid);
            setLoading(false);
        })();
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <Page>
            <FixatedStatusBar />

            <Alert alert={alert} setAlert={setAlert} />

            <Header title="Pedidos" navigation={navigation} />

            <Scrollable>
                <Scrollable horizontal>
                    <Table background='white'>
                        <Row>
                            {tableTitles.map((title, titleIndex) => (
                                <TableTitle colSpan={title.colspan} width={title.width} key={titleIndex}><TableTitleText>{title.title}</TableTitleText></TableTitle>
                            ))}
                        </Row>
                        {pedidos.map((pedido: INegociacoes, pedidoIndex: number) => (
                            <Row key={pedidoIndex}>
                                <Cell><CellText>{pedido.cod}</CellText></Cell>
                                <Cell><CellText>{pedido.descricao}</CellText></Cell>
                                <Cell><CellText>{dayjs(pedido.data_abertura).format("DD/MM/YYYY")}</CellText></Cell>
                                <Cell colSpan={1.2}><CellText><Text style={{ textAlign: "center", minWidth: 50, color: "blue", textDecorationLine: "underline" }}>{pedido.fase_negociacao.descricao}</Text></CellText></Cell>
                                <Cell><CellText><Text style={{ textAlign: "center", minWidth: 50, color: "blue", textDecorationLine: "underline" }}>Pedido</Text></CellText></Cell>
                            </Row>
                        ))}
                    </Table>
                </Scrollable>
            </Scrollable>

        </Page >
    )
}