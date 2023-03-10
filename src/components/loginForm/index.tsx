import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { DB_SENHA, DB_CNPJ } from '../../config/constants';
import { FormMain, Label, Field, Input, SubmitField, SubmitButton, SubmitButtonText } from '../../styled';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ILoginForm, IOperador } from './ILoginForm';
import Rest from '../../classes/Rest';
import { Alert } from '../../components/alert';
import { IAlertMessage } from '../../interfaces/IGeneral';
import Util from '../../classes/Utils';

export function LoginForm(props: ILoginForm) {

    const [operadores, setOperadores] = useState<IOperador[]>([]);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });

    const login = async () => {

        const log = await Rest.postBase("pessoas/auth", { user_login: email, user_password: password, password: DB_SENHA, cnpj: DB_CNPJ }, "");

        console.log(log);
        if (log.error) {
            setAlert({ type: "error", msg: log.msg })
        } else {
            await Util.setStorageItem("login", { id: log.chave, name: log.nome, token: log.token });
            props.goHome();
        }
    };

    useEffect(() => {
        if (!operadores[0]) {
            (async () => {
                const response = await Rest.postBase("touch", { password: DB_SENHA, cnpj: DB_CNPJ }, "");
                const op: IOperador[] = [];

                console.log(response);
                if (response.error) {
                    setAlert({ type: "error", msg: response.msg.message })
                } else {
                    response.filter((res: any) => res.operadores[0]).map((res: any) => res.operadores.map((operador: IOperador) => op.push(operador)));
                }

                setOperadores(op);
            })();
        }

    }, [])

    return (
        <>
            <Alert alert={alert} setAlert={setAlert} />

            <FormMain login={true} mgTop={50}>
                <Field login={true}>
                    <Label login={true}><Icon name="person" size={25} color="#999999" /></Label>
                    <Input
                        login={true}
                        placeholder={"Email"}
                        placeholderTextColor={"#999999"}
                        value={email}
                        onChangeText={(value: string) => { setEmail(value) }}
                    />
                </Field>
                <Field login={true}>
                    <Label login={true}><Icon name="lock" size={25} color="#999999" /></Label>
                    <Input
                        login={true}
                        placeholder={"Senha"}
                        placeholderTextColor={"#999999"}
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
        </>
    )
}