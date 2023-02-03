import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { FixatedStatusBar } from '../fixatedStatusBar';
import { DB_SENHA, DB_CNPJ, defaultColors } from '../../config/constants';
import { FormMain, Label, LoginBottomHalf, LoginLogo, LoginTopHalf, Page, Field, Input, SubmitField, SubmitButton, SubmitButtonText, LinkRecuperacao, SigninButton, SigninButtonText, LinkRecuperacaoView } from '../../styled';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Link, useIsFocused } from '@react-navigation/native';
import { Footer } from '../footer';
import { ILogin, IOperador } from './ILogin';
import { useNavigation } from '@react-navigation/native';
import Rest from '../../classes/Rest';
import { setLogin, selectLogin } from '../../store/reducers/mainReducer';
import { useDispatch, useSelector } from 'react-redux';

export function Login(props: ILogin) {
    const logged = useSelector(selectLogin);
    const dispatch = useDispatch()
    const navigation = useNavigation();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [operadores, setOperadores] = useState<IOperador[]>([]);

    const login = async () => {
        if (!operadores.find((operador: IOperador) => operador.name.toLowerCase().trim() === email.toLowerCase().trim()) && email.toLowerCase().trim() !== "tradesystem") {
            console.log("Não encontrado");
        } else {
            
            const log = await Rest.postBase("touch/auth", { user_id: email.toLowerCase().trim() === "tradesystem" ? 1 : operadores.find((operador: IOperador) => operador.name.toLowerCase().trim() === email.toLowerCase().trim())?.chave, user_password: password, password: DB_SENHA, cnpj: DB_CNPJ }, "");
            
            if (log.error) {
                console.log(log.msg);
            } else {
                
                dispatch(setLogin({ id: log.chave, name: log.name, token: log.token }));
                navigation.navigate("Home");
            }
        }
    };

    useEffect(() => {
        if (logged?.id) {
            navigation.navigate("Home");
        }
        
        if (!operadores[0]) {
            (async () => {
                const response = await Rest.postBase("touch", { password: DB_SENHA, cnpj: DB_CNPJ }, "");
                const op: IOperador[] = [];

                

                setOperadores(op);
            })();
        }

    }, [operadores])

    return (
        <Page>
            <FixatedStatusBar />
            <LoginTopHalf background={defaultColors.item}>
                <LoginLogo resizeMode='contain' source={require("../../images/logo.png")} />
            </LoginTopHalf>
            <LoginBottomHalf>
                <FormMain login={true} mgTop={50}>
                    <Field login={true}>
                        <Label login={true}><Icon name="person" size={25} color="#FFFFFF" /></Label>
                        <Input
                            login={true}
                            placeholder={"Email"}
                            placeholderTextColor={"#CCCCCC"}
                            value={email}
                            onChangeText={(value: string) => { setEmail(value) }}
                        />
                    </Field>
                    <Field login={true}>
                        <Label login={true}><Icon name="lock" size={25} color="#FFFFFF" /></Label>
                        <Input
                            login={true}
                            placeholder={"Senha"}
                            placeholderTextColor={"#CCCCCC"}
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(value: string) => { setPassword(value) }}
                        />
                    </Field>
                    <SubmitField>
                        <SubmitButton onPress={() => login()}>
                            <SubmitButtonText letterSpace={4}>
                                ENTRAR
                            </SubmitButtonText>
                        </SubmitButton>
                    </SubmitField>
                </FormMain>

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
                    <SigninButtonText>Se Tornar Uma Revendedora!</SigninButtonText>
                </SigninButton>

                <Footer login={true} />
            </LoginBottomHalf>
        </Page>
    )
}