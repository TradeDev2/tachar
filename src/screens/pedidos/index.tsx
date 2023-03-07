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
import { BaseTable } from '../../components/baseTable';

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

    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [items, setItems] = useState<any[][]>([]);

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

            setItems(pedid.map((item:INegociacoes,itemIndex:number) => ([
                {value: item.cod, type: "string"},
                {value: item.descricao, type: "string"},
                {value: item.data_abertura, type: "date"},
                {value: item.fase_negociacao.descricao, type: "link", link: "", colspan: 1.2},
                {value: "Pedido", type: "link", link: ""}
            ])))

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
                    <BaseTable
                    itens={items}
                    titles={tableTitles}
                    />
                </Scrollable>
            </Scrollable>

        </Page >
    )
}