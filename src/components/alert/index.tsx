import React, { type PropsWithChildren, useState, useEffect} from 'react';
import { IAlert, IAlertMessage } from './IAlert';
import { AlertMessage, AlertPressable } from '../../styled';

export function Alert(props: IAlert) {
    const [timer, setTimer] = useState<any>();
    
    useEffect(() => {
        setTimer(setTimeout(() => props.setAlert({ type: "", msg: "" }), 1500));
    }, [props.alert]);
       
    if (props.alert.msg) {
        return (<></>);
    }
    
    return (
        <AlertPressable type={props.alert.type} onPress={() => props.setAlert({type: "", msg: ""})}>
            <AlertMessage>
                {props.alert.msg}
            </AlertMessage>
        </AlertPressable>
    )
}
