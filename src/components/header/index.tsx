import React, { type PropsWithChildren } from 'react';
import { HeaderChevron, HeaderView, HeaderLogoView, HeaderLogo, HeaderTitleView, HeaderTitle } from '../../styled';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IHeader } from './IHeader';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../store/reducers/mainReducer';

export function Header(props: IHeader) {
    const dispatch = useDispatch();
    
    return (
        <HeaderView>
            {(!props.hideBack && !props.logout) &&
                <HeaderChevron onPress={() => props.navigation.goBack()}>
                    <Icon name="chevron-left" size={40} color="#FFFFFF" />
                </HeaderChevron>
            }
            {props.logout &&
                <HeaderChevron style={{backgroundColor: "black"}} onPress={() => {dispatch(setLogout); props.navigation.goBack()}}>
                    <Icon name="logout" size={30} color="red" />
                </HeaderChevron>
            }
            <HeaderLogoView>
                <HeaderLogo resizeMode='contain' source={require("../../images/logo.png")} />
            </HeaderLogoView>
            {props.title &&
                <HeaderTitleView>
                    <HeaderTitle>{props.title}</HeaderTitle>
                </HeaderTitleView>
            }
        </HeaderView>
    )
}
