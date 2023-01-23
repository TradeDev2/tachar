import React, { type PropsWithChildren, useState, useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme, Animated, Text, Dimensions, Easing, View, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { CenterView, Field, FlipPageButton, FloatPage, FormMain, HeaderChevron, Input, Label, LabelText, Page, PageTitle, PageTitleView, SubmitButton, SubmitButtonText, SubmitField } from '../../styled';
import { ICadastro } from './ICadastro';
import { useNavigation } from '@react-navigation/native';
import { CadastroCamera } from '../../components/cadastroCamera';

const windowWidth = Dimensions.get('window').width;

export function Cadastro(props: ICadastro) {
    const navigation = useNavigation();

    const firstHalfPos = useRef(new Animated.Value(0)).current;
    const secondHalfPos = useRef(new Animated.Value(windowWidth)).current;
    const [transition, setTransition] = useState<1 | 2>(1);

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

    return (
        <Page>
            <FixatedStatusBar />
            <Header title="Cadastro" hideBack={transition == 1 ? false : true} hideCart={true} navigation={navigation} />
            {false &&
                <FloatPage style={{ transform: [{ translateX: firstHalfPos }] }}>
                    <PageTitleView>
                        <PageTitle>Dados Pessoais</PageTitle>
                    </PageTitleView>
                    <FormMain>
                        <Field>
                            <Label><LabelText>Nome</LabelText></Label>
                            <Input />
                        </Field>
                        <Field>
                            <Label><LabelText>CPF</LabelText></Label>
                            <Input />
                        </Field>
                        <Field segments={2}>
                            <Label><LabelText>Senha</LabelText></Label>
                            <Input />
                        </Field>
                        <Field segments={2}>
                            <Label><LabelText>Confirmar Senha</LabelText></Label>
                            <Input />
                        </Field>
                    </FormMain>

                    <CenterView>
                        <FlipPageButton onPress={() => setTransition(2)}>
                            <Icon name="arrow-right" size={25} color="#FFFFFF" />
                        </FlipPageButton>
                    </CenterView>
                </FloatPage>
            }
            {false &&
                <FloatPage style={{ transform: [{ translateX: secondHalfPos }] }}>
                    <PageTitleView>
                        <PageTitle>Endereço</PageTitle>
                    </PageTitleView>
                    <FormMain>
                        <Field segments={2}>
                            <Label><LabelText>CEP</LabelText></Label>
                            <Input />
                        </Field>
                        <Field segments={2}>
                            <Label><LabelText>Numero</LabelText></Label>
                            <Input />
                        </Field>
                        <Field>
                            <Label><LabelText>Rua</LabelText></Label>
                            <Input />
                        </Field>
                        <Field segments={3 / 2}>
                            <Label><LabelText>Bairro</LabelText></Label>
                            <Input />
                        </Field>
                        <Field segments={3 / 1}>
                            <Label><LabelText>UF</LabelText></Label>
                            <Input />
                        </Field>
                        <Field>
                            <Label><LabelText>Complemento</LabelText></Label>
                            <Input />
                        </Field>

                        <SubmitField mgBottom={50}>
                            <SubmitButton width={windowWidth / 1.5} onPress={() => console.log("CADASTRADO")}>
                                <SubmitButtonText>FINALIZAR CADASTRO</SubmitButtonText>
                            </SubmitButton>
                        </SubmitField>

                    </FormMain>
                </FloatPage>
            }

            {true &&
                <CadastroCamera />
            }

            {transition === 2 &&
                <HeaderChevron onPress={() => setTransition(1)}>
                    <Icon name="chevron-left" size={40} color="#FFFFFF" />
                </HeaderChevron>
            }
        </Page>
    )
}