import React, { type PropsWithChildren, useState, useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, Animated, Text, Dimensions, Easing, View, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { CenterView, Field, FlipPageButton, FloatPage, FormMain, HeaderChevron, Input, Label, LabelText, Page, PageTitle, PageTitleView, SubmitButton, SubmitButtonText, SubmitField } from '../../styled';
import { ICadastro } from './ICadastro';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

export function Cadastro(props: ICadastro) {
    const navigation = useNavigation();
    const firstHalfPos = useRef(new Animated.Value(0)).current;
    const secondHalfPos = useRef(new Animated.Value(windowWidth)).current;
    const [transition, setTransition] = useState<1 | 2>(1);

    const [nome, setNome] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [senha, setSenha] = useState<string>("");
    const [senhaConfirma, setSenhaConfirma] = useState<string>("");
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
    validationsFirst.push(senha && senhaConfirma && senha === senhaConfirma);
    validationsSecond.push(cep);
    validationsSecond.push(numero);
    validationsSecond.push(rua);
    validationsSecond.push(bairro);
    validationsSecond.push(uf);

    const validFormFirst = validationsFirst.reduce((a,b) => a && b);
    const validFormSecond = validationsSecond.reduce((a,b) => a && b) && validFormFirst;
    
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
                            />
                        </Field>
                        <Field segments={2}>
                            <Label><LabelText>Senha</LabelText></Label>
                            <Input 
                                value={senha}
                                onChangeText={setSenha}
                            />
                        </Field>
                        <Field segments={2}>
                            <Label><LabelText>Confirmar Senha</LabelText></Label>
                            <Input 
                                value={senhaConfirma}
                                onChangeText={setSenhaConfirma}
                            />
                        </Field>
                    </FormMain>

                    <CenterView>
                        <FlipPageButton disabled={!validFormFirst} onPress={() => {if (validFormFirst) {setTransition(2)}}}>
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
                            <SubmitButton width={windowWidth / 1.5} disabled={!validFormSecond} onPress={() => {if (validFormSecond) {navigation.navigate("Cadastro_Fotos")}}}>
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