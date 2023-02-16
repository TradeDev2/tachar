import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { DB_SENHA, DB_CNPJ, defaultColors } from '../../config/constants';
import { LoginBottomHalf, LoginLogo, LoginTopHalf, Page, LinkRecuperacao, SigninButton, SigninButtonText, LinkRecuperacaoView } from '../../styled';
import { Link, useIsFocused } from '@react-navigation/native';
import { Footer } from '../../components/footer';
import { ILogin } from './ILogin';
import { useNavigation } from '@react-navigation/native';
import Rest from '../../classes/Rest';
import { setLogin, selectLogin } from '../../store/reducers/mainReducer';
import { useDispatch, useSelector } from 'react-redux';
import { LoginForm } from '../../components/loginForm';

export function Login(props: ILogin) {
    const logged = useSelector(selectLogin);
    const navigation = useNavigation();

    if (logged?.id) {
        navigation.navigate("Home");
    }
    
    const goHome = () => {
        navigation.navigate("Home");
    }

    return (
        <Page>
            <FixatedStatusBar />
            <LoginTopHalf background={defaultColors.item}>
                <LoginLogo resizeMode='contain' source={require("../../images/logo.png")} />
            </LoginTopHalf>
            <LoginBottomHalf>
                <LoginForm goHome={goHome}/>

                <LinkRecuperacaoView>
                    <Link to={{ screen: 'Recuperar_Senha' }}>
                        <LinkRecuperacao>
                            Esqueci minha senha
                        </LinkRecuperacao>
                    </Link>
                </LinkRecuperacaoView>

                <SigninButton
                    background='#A08525'
                    onPress={() => navigation.navigate("Cadastro")}
                >
                    <SigninButtonText>Seja uma Revendedora!</SigninButtonText>
                </SigninButton>

                <Footer login={true} />
            </LoginBottomHalf>
        </Page>
    )
}