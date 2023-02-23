import React, { type PropsWithChildren, useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { CenterView, Field, FlipPageButton, FloatPage, FormMain, HeaderChevron, Input, Label, LabelText, Page, PageTitle, PageTitleView, SubmitButton, SubmitButtonText, SubmitField } from '../../styled';
import { ICadastro } from './ICadastro';
import { useNavigation } from '@react-navigation/native';
import Rest from '../../classes/Rest';
import { DB_CNPJ, DB_SENHA } from '../../config/constants';
import Loading from '../../components/loading';
import { IAlertMessage } from '../../interfaces/IGeneral';

const windowWidth = Dimensions.get('window').width;

export function Cadastro(props: ICadastro) {
    const navigation = useNavigation();
    const firstHalfPos = useRef(new Animated.Value(0)).current;
    const secondHalfPos = useRef(new Animated.Value(windowWidth)).current;
    const [transition, setTransition] = useState<1 | 2>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });

    const [chave, setChave] = useState<string>("");
    const [nome, setNome] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [senhaConfirma, setSenhaConfirma] = useState<string>("");
    const [enderecoChave, setEnderecoChave] = useState<string>("");
    const [cep, setCep] = useState<string>("");
    const [numero, setNumero] = useState<string>("");
    const [rua, setRua] = useState<string>("");
    const [bairro, setBairro] = useState<string>("");
    const [uf, setUf] = useState<string>("");
    const [complemento, setComplemento] = useState<string>("");

    useEffect(() => {
        if (transition === 1) {
            Animated.timing(
                firstHalfPos,
                {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                    easing: Easing.ease
                }
            ).start();
            Animated.timing(
                secondHalfPos,
                {
                    toValue: windowWidth,
                    duration: 250,
                    useNativeDriver: true,
                    easing: Easing.ease
                }
            ).start();
        } else {
            Animated.timing(
                firstHalfPos,
                {
                    toValue: -windowWidth,
                    duration: 250,
                    useNativeDriver: true,
                    easing: Easing.ease
                }
            ).start();
            Animated.timing(
                secondHalfPos,
                {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                    easing: Easing.ease
                }
            ).start();
        }
    }, [transition])

    const validationsFirst = [];
    const validationsSecond = [];

    validationsFirst.push(nome);
    validationsFirst.push(cpf);
    validationsFirst.push(email);
    validationsFirst.push(senha && senhaConfirma && senha === senhaConfirma);
    validationsSecond.push(cep);
    validationsSecond.push(numero);
    validationsSecond.push(rua);
    validationsSecond.push(bairro);
    validationsSecond.push(uf);

    const validFormFirst = validationsFirst.reduce((a, b) => a && b);
    const validFormSecond = validationsSecond.reduce((a, b) => a && b) && validFormFirst;

    const checkCpf = async () => {
        if (cpf.length < 11) {
            return;
        }
        setLoading(true);

        const pessoas = await Rest.postBase(`pessoas/filter-alt?cnpj_cpf=${cpf}`, {
            password: DB_SENHA
        }, "");

        if (pessoas.error) {
            setAlert({ type: "error", msg: pessoas.msg });
            setLoading(false);
            return;
        }

        if (pessoas[0]) {
            setChave(pessoas[0].chave);
            setCpf(pessoas[0].cnpj_cpf);
            setEmail(pessoas[0].login);
            setNome(pessoas[0].nome);
            setSenha(pessoas[0].senha);
            setSenhaConfirma(pessoas[0].senha);

            const enderecos = await Rest.postBase(`pessoas/enderecos-alt/${pessoas[0].chave}`, {
                password: DB_SENHA,
                cnpj: DB_CNPJ
            }, "");

            if (enderecos.error) {
                setAlert({ type: "error", msg: enderecos.msg });
                setLoading(false);
                return;
            }

            const endereco = enderecos.find((end: any) => end.padrao == 1);

            setCep(endereco.cep);
            setEnderecoChave(endereco.chave);
            setNumero(endereco.numero);
            setRua(endereco.endereco);
            setBairro(endereco.bairro);
            setUf(endereco.uf);
            setComplemento(endereco.complemento);
        }
        setLoading(false);
    }

    const submit = async () => {
        if (chave) {
            setLoading(true);
            const response = await Rest.putBase(`pessoas/salvar-alt`, {
                password: DB_SENHA,
                chave,
                cnpj_cpf: cpf,
                login: email,
                senha,
            }, "");

            if (response.error) {
                setLoading(false);
                setAlert({type: "error", msg: response.msg});
                return;
            }

            const responseEndereco = await Rest.postBase(`pessoas/enderecos/salvar-alt/${chave}`, {
                password: DB_SENHA,
                enderecos: [{
                    chave: enderecoChave,
                    cep,
                    numero,
                    endereco: rua,
                    bairro,
                    uf,
                    complemento
                }]
            }, "")

            if (responseEndereco.error) {
                setLoading(false);
                setAlert({type: "error", msg: responseEndereco.msg});
                return;
            }

            setLoading(false);
            navigation.navigate("Cadastro_Fotos", {
                user_id: chave,
                user_name: nome
            })
        } else {
            setLoading(true);
            const response = await Rest.postBase(`pessoas/salvar-alt`, {
                password: DB_SENHA,
                chave,
                cep,
                numero,
                endereco: rua,
                bairro,
                uf,
                complemento
            }, "")

            if (response.error) {
                setLoading(false);
                setAlert({type: "error", msg: response.msg});
                return;
            }

            const pessoa = await Rest.postBase(`pessoas/filter-alt?cnpj_cpf=${cpf}`, {
                password: DB_SENHA
            }, "");

            if (!pessoa[0]) {
                setLoading(false);
                return;
            }

            setLoading(false);
            navigation.navigate("Cadastro_Fotos", {
                user_id: pessoa[0].chave,
                user_name: nome
            });
        }
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <Page>
            <FixatedStatusBar />
            <Header title="Cadastro" hideBack={transition == 1 ? false : true} hideCart={true} navigation={navigation} />
            <FloatPage style={{ transform: [{ translateX: firstHalfPos }] }}>
                <PageTitleView>
                    <PageTitle>Dados Pessoais</PageTitle>
                </PageTitleView>
                <FormMain>
                    <Field>
                        <Label><LabelText>Nome</LabelText></Label>
                        <Input
                            value={nome}
                            onChangeText={setNome}
                        />
                    </Field>
                    <Field>
                        <Label><LabelText>CPF</LabelText></Label>
                        <Input
                            value={cpf}
                            onChangeText={setCpf}
                            onBlur={() => checkCpf()}
                        />
                    </Field>
                    <Field>
                        <Label><LabelText>Email</LabelText></Label>
                        <Input
                            value={email}
                            onChangeText={setEmail}
                        />
                    </Field>
                    <Field segments={2}>
                        <Label><LabelText>Senha</LabelText></Label>
                        <Input
                            secureTextEntry={true}
                            value={senha}
                            onChangeText={setSenha}
                        />
                    </Field>
                    <Field segments={2}>
                        <Label><LabelText>Confirmar Senha</LabelText></Label>
                        <Input
                            secureTextEntry={true}
                            value={senhaConfirma}
                            onChangeText={setSenhaConfirma}
                        />
                    </Field>
                </FormMain>

                <CenterView>
                    <FlipPageButton disabled={!validFormFirst} mgBottom={30} onPress={() => { if (validFormFirst) { setTransition(2) } }}>
                        <Icon name="arrow-right" size={25} color={validFormFirst ? `#FFFFFF` : "#333333"} />
                    </FlipPageButton>
                </CenterView>
            </FloatPage>
            <FloatPage style={{ transform: [{ translateX: secondHalfPos }] }}>
                <PageTitleView>
                    <PageTitle>Endereço</PageTitle>
                </PageTitleView>
                <FormMain>
                    <Field segments={2}>
                        <Label><LabelText>CEP</LabelText></Label>
                        <Input
                            value={cep}
                            onChangeText={setCep}
                        />
                    </Field>
                    <Field segments={2}>
                        <Label><LabelText>Numero</LabelText></Label>
                        <Input
                            value={numero}
                            onChangeText={setNumero}
                        />
                    </Field>
                    <Field>
                        <Label><LabelText>Rua</LabelText></Label>
                        <Input
                            value={rua}
                            onChangeText={setRua}
                        />
                    </Field>
                    <Field segments={3 / 2}>
                        <Label><LabelText>Bairro</LabelText></Label>
                        <Input
                            value={bairro}
                            onChangeText={setBairro}
                        />
                    </Field>
                    <Field segments={3 / 1}>
                        <Label><LabelText>UF</LabelText></Label>
                        <Input
                            value={uf}
                            onChangeText={setUf}
                        />
                    </Field>
                    <Field>
                        <Label><LabelText>Complemento</LabelText></Label>
                        <Input
                            value={complemento}
                            onChangeText={setComplemento}
                        />
                    </Field>

                    <SubmitField mgBottom={50}>
                        <SubmitButton width={windowWidth / 1.5} disabled={!validFormSecond} onPress={() => { if (validFormSecond) { submit() } }}>
                            <SubmitButtonText disabled={!validFormSecond}>PRÓXIMA ETAPA</SubmitButtonText>
                        </SubmitButton>
                    </SubmitField>

                </FormMain>
            </FloatPage>

            {transition === 2 &&
                <HeaderChevron onPress={() => setTransition(1)}>
                    <Icon name="chevron-left" size={40} color="#FFFFFF" />
                </HeaderChevron>
            }
        </Page>
    )
}