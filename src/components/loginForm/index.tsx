import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { DB_SENHA, DB_CNPJ } from '../../config/constants';
import { FormMain, Label,  Field, Input, SubmitField, SubmitButton, SubmitButtonText } from '../../styled';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ILoginForm, IOperador } from './ILoginForm';
import Rest from '../../classes/Rest';
import { useDispatch, useSelector } from 'react-redux';
import { selectLogin, setLogin } from '../../store/reducers/mainReducer';
import { Alert } from 'react-native';

export function LoginForm(props: ILoginForm) {
    const dispatch = useDispatch()
    
    const [operadores, setOperadores] = useState<IOperador[]>([]);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    
    const login = async () => {
            
        const log = await Rest.postBase("pessoas/auth", { user_login: email, user_password: password, password: DB_SENHA, cnpj: DB_CNPJ }, "");
        
        if (log.error) {
            console.log(log.msg);
        } else {
            dispatch(setLogin({ id: log.chave, name: log.nome, token: log.token }));
            props.goHome();
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
    )
}