import React, { type PropsWithChildren, useState, useEffect, useReducer } from 'react';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { BaseTouchable, BaseTouchableAnimated, DropdownBroadView, DropdownButton, DropdownItemButton, DropdownItemText, DropdownItemView, DropdownText, DropdownView, PadBottomView, Page, Scrollable } from '../../styled';
import { ICatalogo } from './ICatalogo';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/loading';
import Util from '../../classes/Utils';
import { IAlertMessage } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';
import Rest from '../../classes/Rest';
import { Text, View, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export function Catalogo(props: ICatalogo) {
    const navigation = useNavigation();
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });

    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [produtos, setProdutos] = useState<any[]>([]);
    const [grupos, setGrupos] = useState<any[]>([]);
    const [subgrupos, setSubgrupos] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            const log = await Util.getStorageItem("login");
            setLogged(log);

            if (!log || !log.id) {
                navigation.navigate("Login");
            }

            const prod = await Rest.getBase(`produtos/subgrupos`, log.token);

            const grup: any[] = [];
            const subgrup: any[] = [];

            prod.map((produto: any) => {
                if (!grup.find((grupo) => grupo.chave == produto.grupo3)) {
                    grup.push({ ...produto.gruponv3, show: false });
                }

                if (!subgrup.find((grupo) => grupo.chave == produto.grupo2 && grupo.pai == produto.grupo3)) {
                    subgrup.push({ ...produto.gruponv2, pai: produto.grupo3 });
                }
            })

            setProdutos(prod);
            setGrupos(grup);
            setSubgrupos(subgrup);

            setLoading(false);
        })();
    }, [])

    const showGroups = (index: number) => {
        const groups = grupos;
        groups[index].show = !groups[index].show;

        setGrupos(groups);
        forceUpdate();
    }

    const getProdutos = (chaveSub:number, chaveGrupo:number) => {
        if (!chaveSub) {
            navigation.navigate("Produtos",{produtos})
        } else {
            navigation.navigate("Produtos",{produtos: produtos.filter((produto) => produto.grupo2 == chaveSub && produto.grupo3 == chaveGrupo)});
        }
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <Page>
            <FixatedStatusBar />

            <Alert alert={alert} setAlert={setAlert} />

            <Header title="Catálogo" navigation={navigation} />

            <Scrollable>
                <PadBottomView>
                {grupos.map((grupo, grupoIndex) => (
                    <DropdownBroadView>
                        <DropdownView>
                            <DropdownButton onPress={() => showGroups(grupoIndex)} style={{ padding: 10 }}>
                                <DropdownText>{grupo.descricao_web ? grupo.descricao_web : grupo.descricao}</DropdownText>
                            </DropdownButton>
                            {grupo.show &&
                                <DropdownItemView>
                                    <DropdownItemButton onPress={() => getProdutos(0, grupo.chave)} >
                                        <DropdownItemText>Todas</DropdownItemText>
                                    </DropdownItemButton>
                                    {subgrupos.filter((subgrupo) => subgrupo.pai == grupo.chave).map((subgrupo) => (
                                        <DropdownItemButton onPress={() => getProdutos(subgrupo.chave, grupo.chave)}>
                                            <DropdownItemText>{subgrupo.descricao_web ? subgrupo.descricao_web : subgrupo.descricao}</DropdownItemText>
                                        </DropdownItemButton>
                                    ))}
                                </DropdownItemView>
                            }
                        </DropdownView>
                    </DropdownBroadView>
                ))}
                </PadBottomView>
            </Scrollable>

        </Page >
    )
}