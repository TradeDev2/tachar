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
        console.log(windowWidth);
        const lastIndex = tableTitles[tableTitles.length - 1];

        tableTitles[tableTitles.length - 1].width = (lastIndex && lastIndex.colspan ? lastIndex.colspan * 100 : 0) + (lastIndex && lastIndex.width ? lastIndex.width : 0) + (windowWidth - tableWidth)
        console.log(tableTitles);
    }

    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [rendimentos, setRendimentos] = useState<any>([]);

    useEffect(() => {
        (async () => {
            const log = await Util.getStorageItem("login");
            setLogged(log);

            if (!log || !log.id) {
                navigation.navigate("Login");
            }

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
                                <Cell><CellText>{rendimento.cod}</CellText></Cell>
                                <Cell><CellText>{rendimento.descricao}</CellText></Cell>
                                <Cell><CellText>R${rendimento.data_abertura}</CellText></Cell>
                            </Row>
                        ))}
                        <Row>
                            <Cell colSpan={2}><CellText>Total</CellText></Cell>
                            <Cell><CellText>R$0,00</CellText></Cell>
                        </Row>
                    </Table>
                </Scrollable>
            </Scrollable>

        </Page >
    )
}