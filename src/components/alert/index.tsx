import React, { type PropsWithChildren, useState, useEffect} from 'react';
import { IAlert } from './IAlert';
import { AlertMessage, AlertPressable } from '../../styled';

export function Alert(props: IAlert) {
    const [timer, setTimer] = useState<any>();
    
    useEffect(() => {
        setTimer(setTimeout(() => props.setAlert({ type: "", msg: "" }), 5000));
    }, [props.alert]);
       
    if (!props.alert.msg) {
        return (<></>);
    }
    
    return (
        <AlertPressable type={props.alert.type} onPress={() => props.setAlert({type: "", msg: ""})}>
            <AlertMessage type={props.alert.type}>
                {props.alert.msg}
            </AlertMessage>
        </AlertPressable>
    )
}
