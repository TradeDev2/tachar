import React, { type PropsWithChildren, useState, useEffect, useRef } from 'react';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { CenterView, ExamplePic, ExamplePicView, Field, FlipPageButton, FloatPage, FormMain, HeaderChevron, InfoScreen, InfoText, Input, Label, LabelText, ListPicturesItem, ListPicturesView, Page, PageTitle, PageTitleView, SubmitButton, SubmitButtonText, SubmitField } from '../../styled';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ICadastroFotos } from './ICadastroFotos';
import { CadastroCamera } from '../../components/cadastroCamera';
import Util from '../../classes/Utils';
import { Header } from '../../components/header';
import { Animated, Easing, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function CadastroFotos(props: ICadastroFotos) {
    const [phase, setPhase] = useState<number>(0);
    const [pictures, setPictures] = useState<any[]>([]);
    const opacity = useRef(new Animated.Value(0)).current;

    const handlePictures = async (snap: any) => {
        if (snap) {
            //await Util.returnAsBlob(snap.path);
            setPictures([...pictures, snap.path]);
        }
    }

    useEffect(() => {
        changePhase();
    }, []);

    useEffect(() => {
        if (pictures.length === 3) {
            setPhase(2);
        }
    }, [pictures]);

    const changePhase = () => {
        Animated.timing(
            opacity,
            {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.ease
            }
        ).start();
    }

    return (
        <Page>
            <FixatedStatusBar />
            {phase == 0 &&
                <>
                    <Header hideBack hideCart navigation={{}} />
                    <InfoText style={{ opacity }}>Para concluir o seu cadastro, é preciso tirar algumas fotos para confirmar sua identidade</InfoText>
                    <InfoText style={{ opacity }}></InfoText>
                    <InfoText style={{ opacity }}>Aperte para continuar, dê a permissão de uso da camera e tire suas fotos de acordo com os exemplos que aparecerem em cima</InfoText>

                    <CenterView>
                        <FlipPageButton mgTop={50} onPress={() => setPhase(1)}>
                            <Icon name="arrow-right" size={25} color={`#FFFFFF`} />
                        </FlipPageButton>
                    </CenterView>
                </>
            }
            {phase == 1 &&
                <>
                    <CadastroCamera
                        handlePictures={async (snap: any) => await handlePictures(snap)}
                    />
                    <ExamplePicView>
                        {[...Array(3)].map((item: any, index: number) => (
                            <React.Fragment key={index}>
                                {pictures[index] &&
                                    <ExamplePic source={{ uri: `file://${pictures[index]}` }} />
                                }
                                {!pictures[index] &&
                                    <>
                                        {index == 0 &&
                                            <ExamplePic source={require("../../images/Front_View.png")} />
                                        }
                                        {index == 1 &&
                                            <ExamplePic source={require("../../images/Side_View.png")} />
                                        }
                                        {index == 2 &&
                                            <ExamplePic style={{ transform: [{ scaleX: -1 }] }} source={require("../../images/Side_View.png")} />
                                        }
                                    </>
                                }
                            </React.Fragment>
                        ))}
                    </ExamplePicView>
                </>
            }
            {phase === 2 &&
                <>
                <Header hideBack hideCart navigation={{}} />
                <InfoText style={{ opacity }}>Verifique se as fotos estão em boa qualidade e que seu rosto está visível</InfoText>

                <ListPicturesView>
                    {pictures.map((pic:string, picIndex:number) => (
                        <ListPicturesItem 
                            key={picIndex}
                            style={{height: windowHeight/4, width: 75}}
                            source={{uri: `file://${pic}`}}
                        />
                    ))}
                </ListPicturesView>

                <CenterView>
                <FlipPageButton mgTop={50} mgRight={20} onPress={() => {setPhase(1), setPictures([])}}>
                        <Icon name="rotate-left" size={25} color={`#FFFFFF`} />
                    </FlipPageButton>
                    <FlipPageButton mgTop={50} mgLeft={20} onPress={() => setPhase(1)}>
                        <Icon name="arrow-right" size={25} color={`#FFFFFF`} />
                    </FlipPageButton>
                </CenterView>
            </>
            }
        </Page >
    )
}