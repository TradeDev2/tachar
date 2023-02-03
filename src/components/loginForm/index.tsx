import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { DB_SENHA, DB_CNPJ } from '../../config/constants';
import { FormMain, Label,  Field, Input, SubmitField, SubmitButton, SubmitButtonText } from '../../styled';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ILoginForm, IOperador } from './ILoginForm';
import Rest from '../../classes/Rest';

export function LoginForm(props: ILoginForm) {
    const [operadores, setOperadores] = useState<IOperador[]>([]);

    const login = async () => {
        if (!operadores.find((operador: IOperador) => operador.name.toLowerCase().trim() === props.email.toLowerCase().trim()) && props.email.toLowerCase().trim() !== "tradesystem") {
            console.log("Não encontrado");
        } else {

            props.login(props.email.toLowerCase().trim() === "tradesystem" ? 1 : operadores.find((operador: IOperador) => operador.name.toLowerCase().trim() === props.email.toLowerCase().trim())?.chave);
        }
    };

    useEffect(() => {
        if (!operadores[0]) {
            (async () => {
                const response = await Rest.postBase("touch", { password: DB_SENHA, cnpj: DB_CNPJ }, "");
                const op: IOperador[] = [];

                if (response.error) {
                    console.log(response.error.msg);
                } else {
                    response.filter((res: any) => res.operadores[0]).map((res: any) => res.operadores.map((operador: IOperador) => op.push(operador)));
                }

                setOperadores(op);
            })();
        }

    }, [])

    return (
        <FormMain login={true} mgTop={50}>
            <Field login={true}>
                <Label login={true}><Icon name="person" size={25} color="#FFFFFF" /></Label>
                <Input
                    login={true}
                    placeholder={"Email"}
                    placeholderTextColor={"#CCCCCC"}
                    value={props.email}
                    onChangeText={(value: string) => { props.setEmail(value) }}
                />
            </Field>
            <Field login={true}>
                <Label login={true}><Icon name="lock" size={25} color="#FFFFFF" /></Label>
                <Input
                    login={true}
                    placeholder={"Senha"}
                    placeholderTextColor={"#CCCCCC"}
                    secureTextEntry={true}
                    value={props.password}
                    onChangeText={(value: string) => { props.setPassword(value) }}
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
    )
}