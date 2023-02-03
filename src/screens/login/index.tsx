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
    const dispatch = useDispatch()
    const navigation = useNavigation();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    
    const login = async (id:number) => {
            
            const log = await Rest.postBase("touch/auth", { user_id: id, user_password: password, password: DB_SENHA, cnpj: DB_CNPJ }, "");
            
            if (log.error) {
                console.log(log.msg);
            } else {
                
                dispatch(setLogin({ id: log.chave, name: log.name, token: log.token }));
                navigation.navigate("Home");
            }
    };

    useEffect(() => {
        if (logged?.id) {
            navigation.navigate("Home");
        }
    }, [])

    return (
        <Page>
            <FixatedStatusBar />
            <LoginTopHalf background={defaultColors.item}>
                <LoginLogo resizeMode='contain' source={require("../../images/logo.png")} />
            </LoginTopHalf>
            <LoginBottomHalf>
                <LoginForm
                    email={email}
                    setEmail={(value:string) => setEmail(value)}
                    password={password}
                    setPassword={(value:string) => setPassword(value)}
                    login={(id:number) => login(id)}
                />

                <LinkRecuperacaoView>
                    <Link to={{ screen: 'Recuperar_Senha' }}>
                        <LinkRecuperacao>
                            Esqueci minha senha
                        </LinkRecuperacao>
                    </Link>
                </LinkRecuperacaoView>

                <SigninButton
                    background='#A08525'
                    onPress={() => navigation.navigate("Cadastro_Fotos")}
                >
                    <SigninButtonText>Se Tornar Uma Revendedora!</SigninButtonText>
                </SigninButton>

                <Footer login={true} />
            </LoginBottomHalf>
        </Page>
    )
}