import React, { type PropsWithChildren, useState } from 'react';
import { HeaderChevron, IconCart, NotificationCartView, NotificationCart, HeaderView, HeaderLogoView, HeaderLogo, HeaderTitleView, HeaderTitle } from '../../styled';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { IHeader } from './IHeader';
import Util from '../../classes/Utils';

export function Header(props: IHeader) {
    const [items, setItems] = useState<number>(0);

    return (
        <HeaderView>
            {(!props.hideBack && !props.logout) &&
                <HeaderChevron onPress={() => props.navigation.goBack()}>
                    <Icon name="chevron-left" size={40} color="#FFFFFF" />
                </HeaderChevron>
            }
            {props.logout &&
                <HeaderChevron background={"white"} onPress={async () => { await Util.setStorageItem("login", {id: 0, name: "", token: ""}); props.navigation.goBack() }}>
                    <Icon name="logout" size={30} color={"black"} />
                </HeaderChevron>
            }
            {!props.hideCart &&
                <>
                    <IconCart name="shopping-cart" size={32} color="#FFFFFF"/>
                    {items > 0 &&
                        <NotificationCartView>
                            {items <= 99 &&
                                <NotificationCart>{items}</NotificationCart>
                            }
                            {items > 99 &&
                                <NotificationCart>99+</NotificationCart>
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
