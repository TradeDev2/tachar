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
}