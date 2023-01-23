import React, { type PropsWithChildren } from 'react';
import { Dimensions } from 'react-native';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { ButtonLink, ButtonLinkIcon, ButtonLinks, ButtonLinkText, Page, PageTitle, PageTitleView, Scrollable } from '../../styled';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { selectLogin } from '../../store/reducers/mainReducer';

const windowWidth = Dimensions.get('window').width;

export function HomeScreen() {
    const logged = useSelector(selectLogin);
    const navigation = useNavigation();
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
            if (!logged.id) {
                return navigation.navigate("Login");
            }
            console.log(logged);
        })();
    },[]);

    return (
        <Page>
            <FixatedStatusBar />
            <Header navigation={navigation} logout={true}/>
            <Scrollable>
                <PageTitleView>
                    <PageTitle>Seja bem-vinda(o) {logged.name}</PageTitle>
                </PageTitleView>
                <ButtonLinks mgBottom={20}>
                    {links.map((link, linkIndex) => (
                        <ButtonLink key={linkIndex} width={windowWidth / 1.4} onPress={() => console.log(link.link)}>
                            <ButtonLinkText>{link.name}</ButtonLinkText>
                            <ButtonLinkIcon><Icon name={link.icon} size={25} color="gold" /></ButtonLinkIcon>
                        </ButtonLink>
                    ))}
                </ButtonLinks>
            </Scrollable>
        </Page>
    )
}