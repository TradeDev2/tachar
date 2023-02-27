import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { Table, Page, Scrollable, Row, TableTitle, TableTitleText, Cell, CellText } from '../../styled';
import { IAcertos, IAcerto } from './IAcertos';
import { Link, useNavigation } from '@react-navigation/native';
import Rest from '../../classes/Rest';
import Loading from '../../components/loading';
import dayjs from 'dayjs';
import Util from '../../classes/Utils';
import { IAlertMessage } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';

export function Acertos(props: IAcertos) {
    const navigation = useNavigation();
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const tableTitles = [
        {name: "Nº Reserva", colSpan: 1}, 
        {name: "Val", colSpan: 1},
        {name: "Data", colSpan: 1}, 
        {name: "", colSpan: 0}];

    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [acertos, setAcertos] = useState<IAcerto[]>([]);

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
                                <TableTitle colSpan={title.colSpan} key={titleIndex}><TableTitleText>{title.name}</TableTitleText></TableTitle>
                            ))}
                        </Row>
                        {acertos.map((acerto, acertoIndex) => (
                            <Row key={acertoIndex}>
                                <Cell><CellText>{acerto.nota_fiscal}</CellText></Cell>
                                <Cell><CellText>R${Util.formatMoney(acerto.total)}</CellText></Cell>
                                <Cell><CellText>{dayjs(acerto.lancamento).format("DD/MM/YYYY")}</CellText></Cell>
                                <Cell><CellText><Link style={{ textAlign: "center", minWidth: 50 }} to={{ screen: "Acertos_Detalhes", params: { chave_mov: acerto.chave } }}>Realizar Acerto</Link></CellText></Cell>
                            </Row>
                        ))}
                    </Table>
                    {/* <Table style={{ minWidth: windowWidth, backgroundColor: "white" }}>
                        <Row data={tableTitle} style={{color: "#222222"}}/>
                        {acertos.map((acerto, acertoIndex) => (
                            <TableWrapper key={acertoIndex} style={{ flexDirection: 'row' }}>
                                <Cell data={acerto.nota_fiscal} />
                                <Cell data={`R$${Util.formatMoney(acerto.total)}`} />
                                <Cell data={dayjs(acerto.lancamento).format("DD/MM/YYYY")} />
                                <Cell style={{ maxWidth: 50 }} data={renderLink(acerto.chave)} />
                            </TableWrapper>
                        ))}

                    </Table> */}
                </Scrollable>
            </Scrollable>
        </Page >
    )
}