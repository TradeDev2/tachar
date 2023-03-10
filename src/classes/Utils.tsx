import { useAsyncStorage } from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';

export default class Util {

    static async setStorageItem(item: string, value: any) {
        try {
            console.log(JSON.stringify(value));
            return await useAsyncStorage(item).setItem(JSON.stringify(value));
        } catch (err) {
            console.log(err);
        }
    }

    static async getStorageItem(item: string) {
        try {
            const store = await useAsyncStorage(item).getItem();

            if (store) console.log(JSON.parse(store));
            return store ? JSON.parse(store) : null;
        } catch (err) {
            console.log(err);
        }
    }

    static async returnAsBlob(uri: string) {
        return await (await fetch(uri)).blob()
    }

    static async returnAsBase64(uri: string) {
        return RNFS.readFile(uri, 'base64')
            .then(res => {
                return res;
            });
    }

    static formatMoney(value: string) {
        if (isNaN(parseInt(value))) {
            return "";
        }

        const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(value));

        return formattedValue;
    }

    static findDate(date:string) {
        const meses = [{name: "jan", number: '01'}, {name: "feb", number: '02'}, {name: "mar", number: '03'}, {name: "abr", number: "04"}, {name: "mai", number: "05"}, {name: "jun", number: "06"}, {name: "jul", number: "7"}, {name: "ago", number: "08"}, {name: "set", number: "09"}, {name: "oct", number: "10"}, {name: "nov", number: "11"}, {name: "dec", number: "12"}]
        return `${date.substring(4,8)}-${meses.find((mes) => mes.name == date.substring(0,3))?.number}-01`;
    }
}