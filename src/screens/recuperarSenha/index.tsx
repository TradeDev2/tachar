import React, { type PropsWithChildren, useState} from 'react';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { Page } from '../../styled';
import { IRecuperar_Senha } from './IRecuperar_Senha';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/loading';
import { IAlertMessage } from '../../interfaces/IGeneral';

export function Recuperar_Senha(props: IRecuperar_Senha) {
    const navigation = useNavigation();
    
    
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <Page>
            <FixatedStatusBar />
            <Header title="Recuperar Senha" hideCart={true} navigation={navigation} />

        </Page>
    )
}