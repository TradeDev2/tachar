import React, { type PropsWithChildren, useEffect, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ICadastroCamera } from './ICadastroCamera';
import { Dimensions, Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { useCameraDevices } from 'react-native-vision-camera';
import Util from '../../classes/Utils';
import { Camera } from 'react-native-vision-camera';
import { FullCamera, ShootButton } from '../../styled';

export function CadastroCamera(props: ICadastroCamera) {
    const [cameraPermission, setCameraPermission] = useState<boolean>(false);
    const [snapshot, setSnapshot] = useState<any>();

    const devices = useCameraDevices('wide-angle-camera');
    const camera = useRef<Camera>(null)
    let device = null;
    if (!devices.front) {
        device = devices.back;
    }
    device = devices.front;
    const isFocused = useIsFocused();


    useEffect(() => {
        forceCameraPermission();
    }, [])

    const forceCameraPermission = async () => {
        const permission: string = await Camera.getCameraPermissionStatus();

        if (permission === "denied") {
            await Camera.requestCameraPermission();
            forceCameraPermission();
        } else if (permission === "authorized") {
            setCameraPermission(true);
        }
    }

    const takeSnapshot = async () => {
        if (camera) {
            const snap = await camera.current?.takeSnapshot({
                quality: 85,
            })

            props.handlePictures(snap);
        }
    }

    return (
        <>
            {cameraPermission && device && isFocused &&
                <>
                    <FullCamera
                        ref={camera}
                        isActive={true}
                        device={device}
                        photo={true}
                    />
                    <ShootButton onPress={() => takeSnapshot()}>
                    </ShootButton>
                </>
            }
        </>
    )
}