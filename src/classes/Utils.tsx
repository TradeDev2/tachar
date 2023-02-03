import {useAsyncStorage} from '@react-native-community/async-storage';

export default class Util {

    static async setStorageItem(item:string, value:any) {
        try {
            return await useAsyncStorage(item).setItem(value); 
        } catch (err) {
            console.log(err);
        }
    }

    static async getStorageItem(item:string) {
        try {
            return await useAsyncStorage(item).getItem();
        } catch (err) {
            console.log(err);
        }
    }

    static async returnAsBlob(uri:string) {
        return await (await fetch(`file://${uri}`)).blob()
    }

}