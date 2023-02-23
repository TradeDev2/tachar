import React, { type PropsWithChildren, useEffect } from 'react';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { defaultColors } from '../../config/constants';
import { LoginBottomHalf, LoginLogo, LoginTopHalf, Page, LinkRecuperacao, SigninButton, SigninButtonText, LinkRecuperacaoView } from '../../styled';
import { Link } from '@react-navigation/native';
import { Footer } from '../../components/footer';
import { ILogin } from './ILogin';
import { useNavigation } from '@react-navigation/native';
import { LoginForm } from '../../components/loginForm';
import Util from '../../classes/Utils';

export function Login(props: ILogin) {
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const logged = await Util.getStorageItem("login")
            console.log(logged);

            if (logged && logged?.id) {
                navigation.navigate("Home");
            }
        })()
    }, [])

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
                <LoginForm goHome={goHome} />

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