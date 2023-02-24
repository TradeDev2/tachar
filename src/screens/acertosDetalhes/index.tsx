import React, { type PropsWithChildren, useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { Table, Row, TableTitle, TableTitleText, Cell, CellText, Field, FlipPageButton, FloatPage, FormMain, HeaderChevron, Input, Label, LabelText, Page, PageTitle, PageTitleView, Scrollable, SubmitButton, SubmitButtonText, SubmitField } from '../../styled';
import { IAcertos_Detalhes, IAcerto_Detalhe } from './IAcertos_Detalhes';
import { Link, useNavigation } from '@react-navigation/native';
import Rest from '../../classes/Rest';
import Loading from '../../components/loading';
import dayjs from 'dayjs';
import Util from '../../classes/Utils';
import { IAlertMessage } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';

const windowWidth = Dimensions.get('window').width;

export function Acertos_Detalhes({ route }: any, props: IAcertos_Detalhes) {
    const navigation = useNavigation();
    const tableTitles = ["", "Cod", "Nome", "Val", "Qtd", ""];
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const { chave_mov } = route.params;

    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [itens, setItens] = useState<IAcerto_Detalhe[]>([]);

    useEffect(() => {
        (async () => {
            const log = await Util.getStorageItem("login");
            setLogged(log);

            if (!log || !log.id) {
                navigation.navigate("Login");
            }

            const response = await Rest.getBase(`movitens/filter?ChaveMov=${chave_mov}`, log.token);

            console.log("response");
            console.log(response);
            if (response.error) {
                setLoading(false);
                setAlert({ type: "error", msg: response.msg });
                return;
            }

            setLoading(false);
            setItens(response);
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
                                <TableTitle width={titleIndex == 0 || titleIndex == 5 ? 50 : 0} key={titleIndex}><TableTitleText>{title}</TableTitleText></TableTitle>
                            ))}
                        </Row>
                        {itens.map((item, itemIndex) => (
                            <Row key={itemIndex}>
                                <Cell width={50}><CellText></CellText></Cell>
                                <Cell><CellText>{item.codigo_digitado}</CellText></Cell>
                                <Cell><CellText>{item.descricao}</CellText></Cell>
                                <Cell><CellText>R${Util.formatMoney(item.valor_total)}</CellText></Cell>
                                <Cell><CellText colSpan={0.5}>{parseInt(item.quantidade)}</CellText></Cell>
                                <Cell width={50}><CellText></CellText></Cell>
                            </Row>
                        ))}
                    </Table>
                </Scrollable>
            </Scrollable>
        </Page >
    )
}