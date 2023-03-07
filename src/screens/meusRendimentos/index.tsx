import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { Header } from '../../components/header';
import { Dimensions, Text } from 'react-native';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { Cell, CellText, Page, Row, Scrollable, Table, TableTitle, TableTitleText } from '../../styled';
import { IMeus_Rendimentos } from './IMeus_Rendimentos';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/loading';
import Util from '../../classes/Utils';
import { IAlertMessage, ITableTitles } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';
import Rest from '../../classes/Rest';
import dayjs from 'dayjs';

const windowWidth = Dimensions.get('window').width;

export function Meus_Rendimentos(props: IMeus_Rendimentos) {
    const navigation = useNavigation();
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const tableTitles: ITableTitles[] = [
        { title: "Ano", colspan: 1 },
        { title: "Mês", colspan: 1 },
        { title: "Valor", colspan: 1 }
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

    const [rendimentos, setRendimentos] = useState<any>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const log = await Util.getStorageItem("login");
            setLogged(log);

            if (!log || !log.id) {
                navigation.navigate("Login");
            }

            const rend = await Rest.getBase(`mov/tachar/somarendimento?emissao=>=${dayjs().subtract(1, "year").format("YYYY-MM-DD")}&tipo==S&cancelada==0&pessoa==${log.id}&`,log.token)

            if (rend.error) {
                setAlert({type: "error", msg: rend.msg});
                return setLoading(false);
            }
            
            setRendimentos(rend);

            setLoading(false);
        })();
    }, [])

    useEffect(() => {
        let valorTotal = 0;

        rendimentos.map((rend, rendIndex) => {
            valorTotal += parseFloat(rend.rendimento);
        })

        setTotal(valorTotal);

    }, [rendimentos])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <Page>
            <FixatedStatusBar />

            <Alert alert={alert} setAlert={setAlert} />

            <Header title="Meus Rendimentos" navigation={navigation} />

            <Scrollable>
                <Scrollable horizontal>
                    <Table background='white'>
                        <Row>
                            {tableTitles.map((title, titleIndex) => (
                                <TableTitle colSpan={title.colspan} width={title.width} key={titleIndex}><TableTitleText>{title.title}</TableTitleText></TableTitle>
                            ))}
                        </Row>
                        {rendimentos.map((rendimento: any, rendimentoIndex: number) => (
                            <Row key={rendimentoIndex}>
                                <Cell><CellText>{dayjs(rendimento.emissao).format("YYYY")}</CellText></Cell>
                                <Cell><CellText>{dayjs(rendimento.emissao).locale("pt-br").format("MMM")}</CellText></Cell>
                                <Cell><CellText>R${Util.formatMoney(rendimento.rendimento)}</CellText></Cell>
                            </Row>
                        ))}
                        <Row>
                            <Cell background={"#DEDEDE"}colSpan={2}><CellText>Total</CellText></Cell>
                            <Cell background={"#DEDEDE"} width={tableTitles[2].width}><CellText>R${Util.formatMoney(`${total}`)}</CellText></Cell>
                        </Row>
                    </Table>
                </Scrollable>
            </Scrollable>

        </Page >
    )
}