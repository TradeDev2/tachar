import { useColorScheme } from "react-native";
import Rest from "../classes/Rest";

const isDarkMode = useColorScheme() === 'dark';

export const defaultColors = {
    background: isDarkMode ? "#000000" : "#000000",
    letter: isDarkMode ? "#FFFFFF" : "#FFFFFF",
    item: isDarkMode ? "#212121" : "#212121",
}

//export const DB_URL = "http://ftptrade.ddns.net:3003/"
export const DB_URL = "http://192.168.15.22:3334/"
export const DB_SENHA = "816";
export const DB_CNPJ = "55555555555555";

export const USER_SESSION_INITIAL = {
    id: 0,
    name: "",
    token: ""
}

export const INNER_URL = "http://tacharpelotas.ddns.net:8080/android.php";

export const EMPRESA_CODIGO = 1;

export const CFOP_MESMO_ESTADO = "1.917";
export const CFOP_DIFERENTE_ESTADO = "2.917";
export const CFOP_EXTERIOR = "3.918";

export const DATE_LIMIT = 30;

export async function PARAMS() {
    return await Rest.postBase(`parametros/empresa-alt/${EMPRESA_CODIGO}`, {password: DB_SENHA, cnpj: DB_CNPJ}, "");
} 
