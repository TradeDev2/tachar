import React, { type PropsWithChildren, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ICadastroCamera } from './ICadastroCamera';
import { Camera } from 'react-native-vision-camera';
import { Linking, Text } from 'react-native';
import { useCameraDevices } from 'react-native-vision-camera';

export function CadastroCamera(props: ICadastroCamera) {
    const [cameraPermission, setCameraPermission] = useState<boolean>(false);
    const [device, setDevice] = useState<any>();

    useEffect(() => {
        forceCameraPermission();
    }, [])

    useEffect(() => {
        const devices = useCameraDevices('wide-angle-camera');
        console.log(devices);

    }, [cameraPermission]);


    const forceCameraPermission = async () => {
        const permission: string = await Camera.getCameraPermissionStatus();

        if (permission === "not-determined") {
            await Camera.requestCameraPermission();
            forceCameraPermission();
        } else if (permission === "denied") {
            Linking.openSettings();
            forceCameraPermission();
        } else if (permission === "authorized") {
            setCameraPermission(true);
        }
    }

    return (
        <>
            {!cameraPermission &&
                <Text style={{ color: "white" }}>Nay</Text>
            }
            {cameraPermission &&
                <Text style={{ color: "white" }}>Yay</Text>
            }
        </>
    )
}