import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { BaseTouchableAnimated, CenterView, Input, Page, Scrollable, Select } from '../../styled';
import { IMinhas_Vendas } from './IMinhas_Vendas';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/loading';
import Util from '../../classes/Utils';
import { IAlertMessage, ITableTitles } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';
import Rest from '../../classes/Rest';
import dayjs from 'dayjs';
import { BaseTable } from '../../components/baseTable';
require('dayjs/locale/pt')

const windowWidth = Dimensions.get('window').width;

export function Minhas_Vendas(props: IMinhas_Vendas) {
    const navigation = useNavigation();
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const tableTitles: ITableTitles[] = [
        { title: "Prod.", colspan: 1.2 },
        { title: "Data", colspan: 1 },
        { title: "Val.", colspan: 0.7 }
    ];

    let tableWidth = 0;

    tableTitles.map((title: ITableTitles) => {
        if (title.width) {
            tableWidth += title.width;
        } else if (title.colspan) {
            tableWidth += title.colspan * 100;
        } else {
            tableWidth += 100;
        }

    })
    if (tableWidth < windowWidth) {
        const lastIndex = tableTitles[tableTitles.length - 1];

        tableTitles[tableTitles.length - 1].width = (lastIndex && lastIndex.colspan ? lastIndex.colspan * 100 : 0) + (lastIndex && lastIndex.width ? lastIndex.width : 0) + (windowWidth - tableWidth)
    }


    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [codigoFiltro, setCodigoFiltro] = useState<string>("");
    const [dataFiltro, setDataFiltro] = useState<string>(dayjs().locale("pt-br").format("MMM YYYY"));
    const [produtoFiltro, setProdutoFiltro] = useState<string>("");
    const [items, setItems] = useState<any[][]>([]);

    useEffect(() => {
        (async () => {
            const log = await Util.getStorageItem("login");
            setLogged(log);

            if (!log || !log.id) {
                navigation.navigate("Login");
            }

            const vend = await Rest.getBase(`movitens/vendas/${log.id}`, log.token);

            setItems(vend.map((ven, venIndex) => ([
                { value: ven.descricao, type: "string", colspan: 1.2 },
                { value: ven.emissao, type: "date" },
                { value: ven.valor_unitario, type: "money", colspan: 0.7 },
            ])))

            setLoading(false);
        })();
    }, [])

    const pesquisaVendas = async () => {
        const query = `${produtoFiltro ? `produtos.descricao=${produtoFiltro}` : ""}${codigoFiltro ? `${produtoFiltro ? "&" : ""}codigo=${codigoFiltro}` : ""}${dataFiltro && dataFiltro != "TODAS" ? `${produtoFiltro || codigoFiltro ? "&" : ""}movimentacao.emissao=>=${Util.findDate(dataFiltro)}` : ""}`;
        
        setLoading(true);
        const vend = await Rest.getBase(`movitens/vendas/${logged.id}?${query}`, logged.token);
        
        console.log(vend);
        setItems(vend.map((ven, venIndex) => ([
            { value: ven.descricao, type: "string", colspan: 1.2 },
            { value: ven.emissao, type: "date" },
            { value: ven.valor_unitario, type: "money", colspan: 0.7 },
        ])))
        setLoading(false);
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

            <Header title="Minhas Vendas" navigation={navigation} />

            <View style={{ marginLeft: 5, width: windowWidth - 10, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Input
                    bRadius={1}
                    value={produtoFiltro}
                    onChangeText={(e: string) => setProdutoFiltro(e)}
                    placeholder={"Produto"}
                    width={(windowWidth / 2) - 15}
                    height={40}
                />
                <Select
                    data={[...[...Array(6)].map((e, index) => (dayjs().locale("pt-br").subtract(index, "month").format("MMM YYYY"))), "TODAS"]}
                    onSelect={(e: string) => setDataFiltro(e)}
                    defaultButtonText={"Data"}
                    buttonStyle={{ width: (windowWidth / 2) - 15, backgroundColor: "white", height: 40 }}
                />

            </View>

            <CenterView>
                <BaseTouchableAnimated onPress={() => pesquisaVendas()}><Text style={{padding: 8, backgroundColor: "#CBCBCB", color: "#343434", width: (windowWidth/3)-25, marginTop: 5, textAlign: "center"}}>Filtrar</Text></BaseTouchableAnimated>
            </CenterView>

            <Scrollable style={{marginTop:5}}>
                <Scrollable horizontal>
                    <BaseTable
                        itens={items}
                        titles={tableTitles}
                    />
                </Scrollable>
            </Scrollable>

        </Page >
    )
}