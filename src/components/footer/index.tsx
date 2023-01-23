import React, { type PropsWithChildren } from 'react';
import { FooterText, FooterView } from '../../styled';
import { IFooter } from './IFooter';


export function Footer(props: IFooter) {
    return (
        <FooterView login={props.login ? true : false}>
            {props.login &&
                <FooterText>Desenvolvido por Trade System Informática</FooterText>
            }
        </FooterView>
    )
}
