import React, { type PropsWithChildren, useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { CenterView, Field, FlipPageButton, FloatPage, FormMain, HeaderChevron, Input, Label, LabelText, Page, PageTitle, PageTitleView, SubmitButton, SubmitButtonText, SubmitField } from '../../styled';
import { IAcertos, IAcerto } from './IAcertos';
import { useNavigation } from '@react-navigation/native';
import Rest from '../../classes/Rest';
import { DB_CNPJ, DB_SENHA } from '../../config/constants';
import Loading from '../../components/loading';
import { useSelector } from 'react-redux';
import { selectLogin } from '../../store/reducers/mainReducer';
import { Text } from 'react-native/Libraries/Text/Text';
import { DataTable } from 'react-native-paper';
import dayjs from 'dayjs';
import Util from '../../classes/Utils';
import { IAlertMessage } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';

const windowWidth = Dimensions.get('window').width;

export function Acertos(props: IAcertos) {
    const navigation = useNavigation();
    const logged = useSelector(selectLogin);

    const [alert, setAlert] = useState<IAlertMessage>({type: "", msg: ""});
    const [loading, setLoading] = useState<boolean>(true);

    const [acertos, setAcertos] = useState<IAcerto[]>([]);

    useEffect(() => {
        (async () => {
            const response = await Rest.getBase(`mov/pessoa/${logged.id}`, logged.token);

            if (response.error) {
                setLoading(false);
                setAlert({type: "error", msg: response.error.msg});
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

            <Alert alert={alert} setAlert={setAlert}/>

            <Header title="Acertos" navigation={navigation} />
            <DataTable style={{ width: windowWidth, backgroundColor: "white" }}>
                <DataTable.Row>
                    <DataTable.Title>Nº Reserva</DataTable.Title>
                    <DataTable.Title>Valor</DataTable.Title>
                    <DataTable.Title>Data Acerto</DataTable.Title>
                    <DataTable.Title style={{maxWidth: 20}}> </DataTable.Title>
                </DataTable.Row>
                {acertos.map((acerto) => (
                    <DataTable.Row>
                        <DataTable.Cell>{acerto.nota_fiscal}</DataTable.Cell>
                        <DataTable.Cell>R${Util.formatMoney(acerto.total)}</DataTable.Cell>
                        <DataTable.Cell>{dayjs(acerto.lancamento).format("DD/MM/YYYY")}</DataTable.Cell>
                        <DataTable.Cell style={{maxWidth: 20}}> </DataTable.Cell>
                    </DataTable.Row>
                ))}

            </DataTable>
        </Page>
    )
}