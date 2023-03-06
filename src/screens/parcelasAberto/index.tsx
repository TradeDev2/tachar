import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { Cell, CellText, Page, Row, Scrollable, TableTitle, TableTitleText, Table } from '../../styled';
import { IParcelas_Aberto, ITableTitles } from './IParcelas_Aberto';
import { Link, useNavigation } from '@react-navigation/native';
import Loading from '../../components/loading';
import Util from '../../classes/Utils';
import { IAlertMessage } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';
import Rest from '../../classes/Rest';
import dayjs from 'dayjs';
import { Text, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export function Parcelas_Aberto(props: IParcelas_Aberto) {
    const navigation = useNavigation();
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const tableTitles:ITableTitles[] = [
        {name: "Docto.", colspan: 1}, 
        {name: "Vencto.", colspan: 1},
        {name: "Val.", colspan: 1}, 
        {name: "Sald.", colspan: 1}, 
        {name: "Mostra", colspan: 1}, 
        {name: "Boleto", colspan: 1}];


        let tableWidth = 0;

        tableTitles.map((title:ITableTitles) => {
            if (title.width) {
                tableWidth += title.width;
            } else if(title.colspan) {
                tableWidth += title.colspan * 100;
            } else {
                tableWidth += 100;
            }
    
        })
        if (tableWidth < windowWidth) {
            const lastIndex = tableTitles[tableTitles.length-1];
    
            tableTitles[tableTitles.length-1].width = (lastIndex && lastIndex.colspan ? lastIndex.colspan * 100 : 0) + (lastIndex && lastIndex.width ? lastIndex.width : 0) + (windowWidth-tableWidth) 
        }

    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [parcelas, setParcelas] = useState<any/*IParcelas*/>([]);

    useEffect(() => {
        (async () => {
            const log = await Util.getStorageItem("login");
            
            if (!log || !log.id) {
                navigation.navigate("Login");
            }

            const parcel = await Rest.getBase(`recebimento/filter?pessoa=${log.id}&saldo=!0`,log.token);

            console.log(parcel)
            if (parcel.error) {
                setAlert({type: "error", msg: parcel.msg});
                setLoading(false);
                return;
            }

            setParcelas(parcel);
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

            <Header title="Parcelas em Aberto" navigation={navigation} />
            <Scrollable>
                <Scrollable horizontal>
                    <Table background='white'>
                        <Row>
                            {tableTitles.map((title, titleIndex) => (
                                <TableTitle colSpan={title.colspan} width={title.width} key={titleIndex}><TableTitleText>{title.name}</TableTitleText></TableTitle>
                            ))}
                        </Row>
                        {parcelas.map((parcela, parcelaIndex) => (
                            <Row key={parcelaIndex}>
                                <Cell><CellText>{parcela.docto}</CellText></Cell>
                                <Cell><CellText>{dayjs(parcela.vencimento).format("DD/MM/YYYY")}</CellText></Cell>
                                <Cell><CellText>R${Util.formatMoney(parcela.valor)}</CellText></Cell>
                                <Cell><CellText>R${Util.formatMoney(parcela.saldo)}</CellText></Cell>
                                <Cell><CellText><Text style={{ textAlign: "center", minWidth: 50, color: "blue", textDecorationLine: "underline" }}>Venda</Text></CellText></Cell>
                                <Cell><CellText><Text style={{ textAlign: "center", minWidth: 50, color: "blue", textDecorationLine: "underline" }}>Gerar Boleto</Text></CellText></Cell>
                            </Row>
                        ))}
                    </Table>
                </Scrollable>
                <Scrollable horizontal>
                            <Table background='white'>
                                <Row>
                                    <Cell width={windowWidth * 0.75}><CellText>Limite Reserva Peças</CellText></Cell>
                                    <Cell width={windowWidth * 0.25}><CellText align={"right"}>0</CellText></Cell>
                                </Row>
                                <Row>
                                    <Cell width={windowWidth * 0.75}><CellText>Numero de peças em reserva</CellText></Cell>
                                    <Cell width={windowWidth * 0.25}><CellText align={"right"}>0</CellText></Cell>
                                </Row>
                                <Row>
                                    <Cell width={windowWidth * 0.75}><CellText>Limite Disp. Peças em reserva</CellText></Cell>
                                    <Cell width={windowWidth * 0.25}><CellText align={"right"}>0</CellText></Cell>
                                </Row>
                                <Row>
                                    <Cell width={windowWidth * 0.75}><CellText>Total em Aberto</CellText></Cell>
                                    <Cell width={windowWidth * 0.25}><CellText align={"right"}>R${parcelas[0] ? parcelas[0].valor : "0,00"}</CellText></Cell>
                                </Row>
                            </Table>
                </Scrollable>
            </Scrollable>

        </Page >
    )
}