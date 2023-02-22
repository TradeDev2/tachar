import { useAsyncStorage } from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';

export default class Util {

    static async setStorageItem(item: string, value: any) {
        try {
            return await useAsyncStorage(item).setItem(value);
        } catch (err) {
            console.log(err);
        }
    }

    static async getStorageItem(item: string) {
        try {
            return await useAsyncStorage(item).getItem();
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
}