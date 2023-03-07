import React, { type PropsWithChildren, useState, useEffect } from 'react';
import { Header } from '../../components/header';
import { FixatedStatusBar } from '../../components/fixatedStatusBar';
import { Cell, CellText, Page, Row, Scrollable, TableTitle, TableTitleText, Table } from '../../styled';
import { IParcelas, IParcelas_Aberto, ITableTitles } from './IParcelas_Aberto';
import { Link, useNavigation } from '@react-navigation/native';
import Loading from '../../components/loading';
import Util from '../../classes/Utils';
import { IAlertMessage } from '../../interfaces/IGeneral';
import { Alert } from '../../components/alert';
import Rest from '../../classes/Rest';
import dayjs from 'dayjs';
import { Text, Dimensions } from 'react-native';
import { DATE_LIMIT, PARAMS } from '../../config/constants';
import { BaseTable } from '../../components/baseTable';

const windowWidth = Dimensions.get('window').width;

export function Parcelas_Aberto(props: IParcelas_Aberto) {
    const navigation = useNavigation();
    const [logged, setLogged] = useState<any>({ id: 0, name: "", token: "" });
    const tableTitles: ITableTitles[] = [
        { title: "Docto.", colspan: 1 },
        { title: "Vencto.", colspan: 1 },
        { title: "Val.", colspan: 1 },
        { title: "Sald.", colspan: 1 },
        { title: "Mostra", colspan: 1 },
        { title: "Boleto", colspan: 1 }];

    const [alert, setAlert] = useState<IAlertMessage>({ type: "", msg: "" });
    const [loading, setLoading] = useState<boolean>(true);

    const [parcelas, setParcelas] = useState<IParcelas[]>([]);
    const [items, setItems] = useState<any[][]>([]);
    const [limite, setLimite] = useState<number>(0);
    const [reserva, setReserva] = useState<number>(0);
    const [totalAberto, setTotalAberto] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const log = await Util.getStorageItem("login");

            if (!log || !log.id) {
                navigation.navigate("Login");
            }
            const PARAM = await PARAMS();

            const grupos_excluidos = PARAM.grupos_excluidos_reserva_limite ? PARAM.grupos_excluidos_reserva_limite.replaceAll("and ", "&").replaceAll("<>", "=!=") : "";

            const parcel = await Rest.getBase(`recebimento/filter?pessoa=${log.id}&saldo=!0`, log.token);

            if (parcel.error) {
                setAlert({ type: "error", msg: parcel.msg });
                setLoading(false);
                return;
            }

            setItems(parcel.map((parc:IParcelas, parcIndex:number) => {
                return ([
                    {value: parc.docto, type: "string"},
                    {value: parc.vencimento, type: "date"},
                    {value: parc.valor, type: "money"},
                    {value: parc.saldo, type: "money"},
                    {value: "Mostra", type: "link", link: ""},
                    {value: "Boleto", type: "link", link: ""},
                ])
            }))

            const limPecas = await Rest.getBase(`movitens/count?movimentacao.pessoa==${log.id}&movimentacao.emissao=>=${dayjs().subtract(DATE_LIMIT, "days").format("YYYY-MM-DD")}&movimentacao.cancelada==0&movimentacao.tipo==S${grupos_excluidos}`, log.token);

            if (limPecas[0]) {
                setLimite(limPecas[0].quantidade && (limPecas[0].quantidade * 4) > PARAM.limite_pecas_condicional ? parseInt(limPecas[0].quantidade) : PARAM.limite_pecas_condicional);
            }

            const resPecas = await Rest.getBase(`movitens/count?movimentacao.pessoa==${log.id}&movimentacao.emissao=>=${dayjs().subtract(DATE_LIMIT, "days").format("YYYY-MM-DD")}&movimentacao.cancelada==0&movimentacao.tipo==R`, log.token);

            if (resPecas[0]) {
                setReserva(resPecas[0].quantidade ? parseInt(resPecas[0].quantidade) : 0);
            }

            setParcelas(parcel);
            setLoading(false);

        })();
    }, [])

    useEffect(() => {
        let valorTotal = 0;

        parcelas.map((parcela, parcelaIndex) => {
            valorTotal += parseFloat(parcela.saldo);
        })

        setTotalAberto(valorTotal)
    },[parcelas]);

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <Page>
            <FixatedStatusBar />

            <Alert alert={alert} setAlert={setAlert} />

            <Header title="Parcelas em Aberto" navigation={navigation} />
            <Scrollable>
                <Scrollable horizontal>
                    <BaseTable
                        titles={tableTitles}
                        itens={items}                        
                    />
                </Scrollable>
                <Scrollable horizontal>
                    <Table background='white'>
                        <Row>
                            <Cell width={windowWidth * 0.75}><CellText>Limite Reserva Peças</CellText></Cell>
                            <Cell width={windowWidth * 0.25}><CellText align={"right"}>{limite ? limite : 0}</CellText></Cell>
                        </Row>
                        <Row>
                            <Cell width={windowWidth * 0.75}><CellText>Numero de peças em reserva</CellText></Cell>
                            <Cell width={windowWidth * 0.25}><CellText align={"right"}>{reserva ? reserva : 0}</CellText></Cell>
                        </Row>
                        <Row>
                            <Cell width={windowWidth * 0.75}><CellText>Limite Disp. Peças em reserva</CellText></Cell>
                            <Cell width={windowWidth * 0.25}><CellText align={"right"}>{isNaN(limite - reserva) ? 0 : limite - reserva}</CellText></Cell>
                        </Row>
                        <Row>
                            <Cell width={windowWidth * 0.75}><CellText>Total em Aberto</CellText></Cell>
                            <Cell width={windowWidth * 0.25}><CellText align={"right"}>R${totalAberto ? Util.formatMoney(`${totalAberto}`) : "0,00"}</CellText></Cell>
                        </Row>
                    </Table>
                </Scrollable>
            </Scrollable>

        </Page >
    )
}