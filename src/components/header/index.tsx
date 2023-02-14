import React, { type PropsWithChildren, useState } from 'react';
import { HeaderChevron, IconCart, NotificationCartView, NotificationCart, HeaderView, HeaderLogoView, HeaderLogo, HeaderTitleView, HeaderTitle } from '../../styled';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IHeader } from './IHeader';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../store/reducers/mainReducer';

export function Header(props: IHeader) {
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState<number>(0);

    return (
        <HeaderView>
            {(!props.hideBack && !props.logout) &&
                <HeaderChevron onPress={() => props.navigation.goBack()}>
                    <Icon name="chevron-left" size={40} color="#FFFFFF" />
                </HeaderChevron>
            }
            {props.logout &&
                <HeaderChevron style={{ backgroundColor: "black" }} onPress={() => { dispatch(setLogout()); props.navigation.goBack() }}>
                    <Icon name="logout" size={30} color="red" />
                </HeaderChevron>
            }
            {!props.hideCart &&
                <>
                    <IconCart name="shopping-cart" size={32} color="#FFFFFF" onPress={() => setNotifications(notifications + 1)}/>
                    {notifications > 0 &&
                        <NotificationCartView>
                            {notifications <= 9 &&
                                <NotificationCart>{notifications}</NotificationCart>
                            }
                            {notifications > 9 &&
                                <NotificationCart>9+</NotificationCart>
                            }
                        </NotificationCartView>
                    }
                </>
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
