import React, { type PropsWithChildren, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ICadastroCamera } from './ICadastroCamera';
import { RNCamera } from 'react-native-camera';
import { FullCamera, ShootButton } from '../../styled';

export function CadastroCamera(props: ICadastroCamera) {
    const [face, setFace] = useState<any>(null);
    const type = RNCamera.Constants.Type.back;
    const camera = useRef<RNCamera>(null)
    const isFocused = useIsFocused();

    const takePicture = async () => {
        if (face) {
            if (camera.current) {
                const options = { quality: 0.5, base64: true };
                const data = await camera.current?.takePictureAsync(options);
                console.log(data.uri);
            }
        };
    }

    const handleFaceDetection = async ({ faces }: any) => {
        if (faces.length === 1) {
            setFace(faces[0])
        }
    }

    return (
        <>
            {type && isFocused &&
                <>
                    <FullCamera
                        ref={camera}
                        type={type}
                        androidCameraPermissionOptions={{
                            title: 'Permissão para usar camera',
                            message: 'Por favor, permita que o app acesse a sua camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancelar',
                        }}
                        onFacesDetected={handleFaceDetection}
                        captureAudio={false}
                    />
                    <ShootButton onPress={() => takePicture()}>
                    </ShootButton>
                </>
            }
        </>
    )
}