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

const windowWidth = Dimensions.get('window').width;

export function Acertos(props: IAcertos) {
    const navigation = useNavigation();
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const tableTitles:ITableTitles[] = [
        {name: "Nº Reserva", colspan: 1}, 
        {name: "Val", colspan: 1},
        {name: "Data", colspan: 1}, 
        {name: "", colspan: 0}];

    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [acertos, setAcertos] = useState<IAcerto[]>([]);

    let tableWidth = 0;

    tableTitles.map((title:ITableTitles) => {
        if (title.colspan) {
            tableWidth += title.colspan * 100;
        } else {
            tableWidth += 100;
        }

    })
    if (tableWidth < windowWidth) {
        const lastIndex = tableTitles[tableTitles.length-1];

        tableTitles[tableTitles.length-1].width = (lastIndex && lastIndex.colspan ? lastIndex.colspan * 100 : 0) + (windowWidth-tableWidth) 
    }
    
    
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
            setAcertos(response);
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
                    <Table background='white'>
                        <Row>
                            {tableTitles.map((title, titleIndex) => (
                                <TableTitle colSpan={title.colspan} key={titleIndex}><TableTitleText>{title.name}</TableTitleText></TableTitle>
                            ))}
                        </Row>
                        {acertos.map((acerto, acertoIndex) => (
                            <Row key={acertoIndex}>
                                <Cell><CellText>{acerto.nota_fiscal}</CellText></Cell>
                                <Cell><CellText>R${Util.formatMoney(acerto.total)}</CellText></Cell>
                                <Cell><CellText>{dayjs(acerto.lancamento).format("DD/MM/YYYY")}</CellText></Cell>
                                <Cell><CellText><Link style={{ textAlign: "center", minWidth: 50, color: "blue", textDecorationLine: "underline" }} to={{ screen: "Acertos_Detalhes", params: { chave_mov: acerto.chave } }}>Realizar Acerto</Link></CellText></Cell>
                            </Row>
                        ))}
                    </Table>
                </Scrollable>
            </Scrollable>
        </Page >
    )
}