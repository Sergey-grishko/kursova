// import { store } from '../index'


export default class Api {

    static host = "http://127.0.0.1:65059/";

    static async getTokenFromLocalStorage() {
        return await localStorage.getItem('token');
    }

    static async setTokenToLocalStorage(token) {
        return await localStorage.setItem('token', token);
    }

    static deleteTokenFromLocalStorage() {
        return localStorage.removeItem('token');
    }

    static async get(endpoint, authorization = true) {
        let headers = {}

        if (authorization) headers.Authorization = await Api.getTokenFromLocalStorage()

        return fetch(`${Api.host}${endpoint}`, {
            method: 'GET',
            headers
        })
    }

    static async post(endpoint, body = null, authorization = true, headers = {}, convertToJSON = true) {

        if (convertToJSON) body = JSON.stringify(body)
        if (headers !== false && Object.keys(headers).length === 0) headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        if (headers === false) headers = {}
        if (authorization) headers.Authorization = await Api.getTokenFromLocalStorage()
        return fetch(`${Api.host}${endpoint}`, {
            headers,
            method: 'POST',
            body
        })
    }

    static async put(endpoint, body = null, authorization = true, headers = {}) {
        body = JSON.stringify(body)

        if (Object.keys(headers).length === 0) headers = {
            'Content-Type': 'application/json',
            'Content-Length': body ? body.length : 0
        }

        if (authorization) headers.Authorization = await Api.getTokenFromLocalStorage()

        return fetch(`${Api.host}${endpoint}`, {
            mode: 'cors',
            method: 'PUT',
            headers,
            body
        })
    }

    static deletion(endpoint, body = null, authorization = true, headers = {}) {
        body = JSON.stringify(body)

        if (Object.keys(headers).length === 0) headers = {
            'Content-Type': 'application/json',
            'Content-Length': body ? body.length : 0
        }

        if (authorization) headers.Authorization = Api.getTokenFromLocalStorage()

        return fetch(`${Api.host}${endpoint}`, {
            mode: 'cors',
            method: 'DELETE',
            headers,
            body
        })
    }

    // static getLanguage(){
    //     let language = localStorage.getItem('language');
    //     if(!language) language = navigator.language || navigator.userLanguage
    //     if(!language || ['en','nl'].indexOf(language) < 0) language = 'en'
    //
    //     return language
    // }
}