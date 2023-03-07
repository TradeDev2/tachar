import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { Table, Page, Scrollable, Row, TableTitle, TableTitleText, Cell, CellText } from '../../styled';
import { IAcertos, IAcerto, ITableTitles } from './IAcertos';
import { Link, useNavigation } from '@react-navigation/native';
import Rest from '../../classes/Rest';
import Loading from '../../components/loading';
import dayjs from 'dayjs';
import Util from '../../classes/Utils';
import { IAlertMessage } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';
import { BaseTable } from '../../components/baseTable';

const windowWidth = Dimensions.get('window').width;

export function Acertos(props: IAcertos) {
    const navigation = useNavigation();
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const tableTitles: ITableTitles[] = [
        { title: "Nº Reserva", colspan: 1 },
        { title: "Val", colspan: 1 },
        { title: "Data", colspan: 1 },
        { title: "", colspan: 0 }];

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

            const response = await Rest.getBase(`mov/pessoa/${log.id}`, log.token);

            if (response.error) {
                setLoading(false);
                setAlert({ type: "error", msg: response.error.msg });
                return;
            }

            setLoading(false);
            setItems(response.map((item, itemIndex) => ([
                { value: item.nota_fiscal, type: "string" },
                { value: item.total, type: "money" },
                { value: item.lancamento, type: "date" },
                { value: "Realizar Acerto", type: "link", link: { screen: "Acertos_Detalhes", params: { chave_mov: item.chave } }, colspan: 0 },
            ])));
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

            <Header title="Acertos" navigation={navigation} />
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