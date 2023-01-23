import { api } from "../services/api";

export default class Rest {

    static async getBase(url: string, token: string) {
        try {
            const res = await api.get(url, {
                headers: {
                    Authorization: token
                }
            })
            return res.data;
        } catch (err:any) {
            if (err.response) {
                return {msg: err.response.data.msg, error: true};
            } else {
                return {msg: "Erro de Conexão", error: true};
            }
        }
    }

    static async postBase(url: string, body: object, token: string) {
        try {
            const res = await api.post(url, {
                ...body
            }, {
                headers: {
                    Authorization: token
                }
            })
            return res.data
        } catch (err:any) {
            if (err.response) {
                return {msg: err.response.data.msg, error: true};
            } else {
                return {msg: "Error de Conexão", error: true};
            }
        }
    }

    static async putBase(url: string, body: object, token: string) {
        try {
            const res = await api.put(url, {
                ...body
            }, {
                headers: {
                    Authorization: token
                }
            });
            return res.data;
        } catch (err: any) {
            if (err.response) {
                return {msg: err.response.data.msg, error: true};
            } else {
                return {msg: "Error de Conexão", error: true};
            }
        }
    }

    static async deleteBase(url: string, token: string) {
        try {
            const res = await api.delete(url, {
                headers: {
                    Authorization: token
                }
            })
            return res.data;
        } catch (err:any) {
            if (err.response) {
                return {msg: err.response.data.msg, error: true};
            } else {
                return {msg: "Error de Conexão", error: true};
            }
        }
    }

}