import React, { type PropsWithChildren, useState } from 'react';
import { Dimensions } from 'react-native';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { ButtonLink, ButtonLinkIcon, ButtonLinks, ButtonLinkText, FooterImage, FooterImageView, Page, PageTitle, PageTitleView, Scrollable } from '../../styled';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Util from '../../classes/Utils';

const windowWidth = Dimensions.get('window').width;

export function HomeScreen() {
    const navigation = useNavigation();
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const links = [
        { name: "Acertos", icon: "hourglass-empty", link: "Acertos" },
        { name: "Parcelas em Aberto", icon: "person-pin", link: "Parcelas_Aberto" },
        { name: "Pedidos", icon: "pending", link: "Pedidos" },
        { name: "Catálogo", icon: "plagiarism", link: "Catalogo" },
        { name: "Minhas Vendas", icon: "store", link: "Minhas_Vendas" },
        { name: "Meus Rendimentos", icon: "stacked-line-chart", link: "Meus_Rendimentos" }
    ];

    useEffect(() => {
        (async () => {
            const log = await Util.getStorageItem("login");
            setLogged(log);

            if (!log || !log.id) {
                navigation.navigate("Login");
            }
        })();
    }, [])


    return (
        <Page>
            <FixatedStatusBar />
            <Header navigation={navigation} logout={true} title={`Seja bem-vinda(o) ${logged.name}`} />
            <Scrollable>
                <ButtonLinks mgBottom={20}>
                    {links.map((link, linkIndex) => (
                        <ButtonLink
                            style={{
                                shadowOffset: { width: 20, height: 20 },
                                shadowColor: 'black',
                                shadowOpacity: 1,
                                elevation: 2,
                            }}
                            key={linkIndex} width={windowWidth / 1.1} onPress={() => navigation.navigate(link.link)}>
                            <ButtonLinkText>{link.name}</ButtonLinkText>
                            <ButtonLinkIcon><Icon name={link.icon} size={28} color="gold" /></ButtonLinkIcon>
                        </ButtonLink>
                    ))}
                </ButtonLinks>
            </Scrollable>
        </Page>
    )
}