import React, { type PropsWithChildren, useState, useEffect, useRef } from 'react';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { CenterView, ExamplePic, ExamplePicView, FlipPageButton, FullCamera, InfoText, LinkRecuperacao, LinkRecuperacaoView, ListPicturesItem, ListPicturesView, Page, ShootButton, ErrorMessageView, ErrorMessage, ShowPicture, BaseTouchable } from '../../styled';
import Icon from 'react-native-vector-icons/MaterialIcons'
import dayjs from 'dayjs';
import { ICadastroFotos } from './ICadastroFotos';
import { Header } from '../../components/header';
import { RNCamera } from 'react-native-camera';
import { Animated, Easing, Dimensions, Alert } from 'react-native';
import { Link } from '@react-navigation/native';
import Util from '../../classes/Utils';
import Rest from '../../classes/Rest';
import { DB_SENHA, INNER_URL } from '../../config/constants';
import Loading from '../../components/loading';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export function CadastroFotos({ route }: any, props: ICadastroFotos) {
    const [face, setFace] = useState<any>(null);
    const [phase, setPhase] = useState<number>(0);
    const [error, setError] = useState<string>("");
    const [pictures, setPictures] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const opacity = useRef(new Animated.Value(0)).current;
    const typeF = RNCamera.Constants.Type.front;
    const typeB = RNCamera.Constants.Type.back;
    const camera = useRef<RNCamera>(null)
    const a = {user_id: 1, user_name: 3};
    const { user_id, user_name } = a;//route.params;

    const [activePic, setActivePic] = useState<string>("");

    const takePicture = async () => {
        if (face || phase !== 1) {
            if (phase !== 1 || pictures.length === 0 && face.yawAngle >= -10 && face.yawAngle <= 10 || pictures.length === 1 && face.yawAngle >= 30 || pictures.length === 2 && face.yawAngle <= -30) {
                if (camera.current) {
                    const options = { quality: 0.5, base64: true };
                    const data = await camera.current?.takePictureAsync(options);

                    setPictures([...pictures, data.uri]);
                }
            } else {
                setError("Por favor, vire seu rosto de acordo com o ângulo pedido nas imagens acima");
            }
        } else {
            setError("Nenhum rosto detectado!");
        }
    };

    const handleFaceDetection = async ({ faces }: any) => {
        if (faces.length === 1) {
            setFace(faces[0])
        } else {
            setFace(null);
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

    useEffect(() => {
        setTimeout(() => {
            setError("");
        }, 5000)
    }, [error])

    const changePhase = () => {
        Animated.timing(
            opacity,
            {
                toValue: 0,
                duration: 1,
                useNativeDriver: true,
                easing: Easing.ease
            }
        ).start();


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

    const finishSignUp = async () => {
        setLoading(true);

        const response = await Rest.postUrl(INNER_URL, {
            user_id,
            photos: [
                await Util.returnAsBase64(pictures[0]),
                await Util.returnAsBase64(pictures[1]),
                await Util.returnAsBase64(pictures[2]),
                await Util.returnAsBase64(pictures[3]),
                await Util.returnAsBase64(pictures[4]),
            ]
        })

        const responseAnexo = await Rest.postBase(`anexos/save-alt`, {
            password: DB_SENHA,
            anexos: [{
                tipo: "Cadastro Pessoa",
                chave_aux: user_id,
                data: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                descricao: "ROSTO (FRENTE)",
                arquivo: response[0],
                docto: user_name
            }, {
                tipo: "Cadastro Pessoa",
                chave_aux: user_id,
                data: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                descricao: "ROSTO (DIREITA)",
                arquivo: response[1],
                docto: user_name
            }, {
                tipo: "Cadastro Pessoa",
                chave_aux: user_id,
                data: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                descricao: "ROSTO (ESQUERDA)",
                arquivo: response[2],
                docto: user_name
            }, {
                tipo: "Cadastro Pessoa",
                chave_aux: user_id,
                data: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                descricao: "IDENTIDADE",
                arquivo: response[3],
                docto: user_name
            }, {
                tipo: "Cadastro Pessoa",
                chave_aux: user_id,
                data: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                descricao: "COMPROVANTE RESIDENCIA",
                arquivo: response[4],
                docto: user_name
            }]
        }, "")

        if (responseAnexo.error) {
            setLoading(false);
            console.log(responseAnexo.error);
            return;
        }
        
        changePhase();
        setPhase(7);
        setLoading(false);
    }

    if (loading) {
        return (
            <Loading/>
        )
    }

    return (
        <Page>
            <FixatedStatusBar />
            
            {activePic &&
                <BaseTouchable
                    style={{width: windowWidth, height: windowHeight, elevation: activePic ? 300 : -1, zIndex: activePic ? 300 : -1}}
                    onPress={() => setActivePic("")}>
                    <ShowPicture
                        source={{ uri: `file://${activePic}` }}
                    />
                </BaseTouchable>
            }

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
                    <FullCamera
                        ref={camera}
                        type={typeF}
                        androidCameraPermissionOptions={{
                            title: 'Permissão para usar camera',
                            message: 'Por favor, permita que o app acesse a sua camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancelar',
                        }}
                        onFacesDetected={handleFaceDetection}
                    />
                    {error &&
                        <ErrorMessageView>
                            <ErrorMessage>{error}</ErrorMessage>
                        </ErrorMessageView>
                    }
                    <ShootButton onPress={() => takePicture()}>
                    </ShootButton>
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
                        {pictures.map((pic: string, picIndex: number) => (
                            <BaseTouchable
                                key={picIndex}
                                onPress={() => setActivePic(pic)}>
                                <ListPicturesItem
                                    style={{ height: windowHeight / 4, width: 75 }}
                                    source={{ uri: `file://${pic}` }}
                                />
                            </BaseTouchable>
                        ))}
                    </ListPicturesView>
                    <InfoText style={{ opacity }}>Se sim, aperte para continuar e tire uma foto de seu documento de identidade</InfoText>

                    <CenterView>
                        <FlipPageButton mgTop={30} mgRight={20} onPress={() => { setPhase(1), setPictures([]) }}>
                            <Icon name="rotate-left" size={25} color={`#FFFFFF`} />
                        </FlipPageButton>
                        <FlipPageButton mgTop={30} mgLeft={20} onPress={() => { setPhase(3); changePhase(); }}>
                            <Icon name="arrow-right" size={25} color={`#FFFFFF`} />
                        </FlipPageButton>
                    </CenterView>
                </>
            }
            {phase == 3 &&
                <>
                    <FullCamera
                        ref={camera}
                        type={typeB}
                        androidCameraPermissionOptions={{
                            title: 'Permissão para usar camera',
                            message: 'Por favor, permita que o app acesse a sua camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancelar',
                        }}
                    />
                    {error &&
                        <ErrorMessageView>
                            <ErrorMessage>{error}</ErrorMessage>
                        </ErrorMessageView>
                    }
                    <ShootButton onPress={async () => { await takePicture(); changePhase(); setPhase(4) }}>
                    </ShootButton>
                </>
            }
            {phase == 4 &&
                <>
                    <Header hideBack hideCart navigation={{}} />
                    <InfoText style={{ opacity }}>Verifique a qualidade da imagem</InfoText>

                    <ListPicturesView>
                        <BaseTouchable
                            onPress={() => setActivePic(pictures[3])}>
                            <ListPicturesItem
                                style={{ height: windowHeight / 4, width: 80, marginLeft: (windowWidth / 2) - 70 }}
                                source={{ uri: `file://${pictures[3]}` }}
                            />
                        </BaseTouchable>
                    </ListPicturesView>
                    <InfoText style={{ opacity }}>Por último, aperte em continuar e envie uma foto de um comprovante de residencia</InfoText>

                    <CenterView>
                        <FlipPageButton mgTop={30} mgRight={20} onPress={() => { setPhase(3), setPictures([pictures[0], pictures[1], pictures[2]]) }}>
                            <Icon name="rotate-left" size={25} color={`#FFFFFF`} />
                        </FlipPageButton>
                        <FlipPageButton mgTop={30} mgLeft={20} onPress={() => { setPhase(5); changePhase(); }}>
                            <Icon name="arrow-right" size={25} color={`#FFFFFF`} />
                        </FlipPageButton>
                    </CenterView>
                </>
            }
            {phase == 5 &&
                <>
                    <FullCamera
                        ref={camera}
                        type={typeB}
                        androidCameraPermissionOptions={{
                            title: 'Permissão para usar camera',
                            message: 'Por favor, permita que o app acesse a sua camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancelar',
                        }}
                    />
                    {error &&
                        <ErrorMessageView>
                            <ErrorMessage>{error}</ErrorMessage>
                        </ErrorMessageView>
                    }
                    <ShootButton onPress={async () => { await takePicture(); changePhase(); setPhase(6) }}>
                    </ShootButton>
                </>
            }
            {phase == 6 &&
                <>
                    <Header hideBack hideCart navigation={{}} />
                    <InfoText style={{ opacity }}>Verifique a qualidade da imagem</InfoText>

                    <ListPicturesView>
                        <BaseTouchable
                            onPress={() => setActivePic(pictures[4])}
                        >
                            <ListPicturesItem
                                style={{ height: windowHeight / 4, width: 80, marginLeft: (windowWidth / 2) - 70 }}
                                source={{ uri: `file://${pictures[4]}` }}
                            />
                        </BaseTouchable>
                    </ListPicturesView>

                    <CenterView>
                        <FlipPageButton mgTop={30} mgRight={20} onPress={() => { setPhase(4), setPictures([pictures[0], pictures[1], pictures[2], pictures[3]]) }}>
                            <Icon name="rotate-left" size={25} color={`#FFFFFF`} />
                        </FlipPageButton>
                        <FlipPageButton mgTop={30} mgLeft={20} onPress={() => { finishSignUp(); }}>
                            <Icon name="arrow-right" size={25} color={`#FFFFFF`} />
                        </FlipPageButton>
                    </CenterView>
                </>
            }
            {
                phase === 7 &&
                <>
                    <Header hideBack hideCart navigation={{}} />
                    <InfoText style={{ opacity }}>Suas fotos foram enviadas para avaliação. Você poderá fazer login em breve, aguarde alguns minutos...</InfoText>

                    <LinkRecuperacaoView>
                        <Link to={{ screen: 'Login' }}>
                            <LinkRecuperacao>
                                Voltar para a tela de Login
                            </LinkRecuperacao>
                        </Link>
                    </LinkRecuperacaoView>
                </>
            }
        </Page >
    )
}