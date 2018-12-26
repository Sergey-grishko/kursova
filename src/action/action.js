import { store } from '../index';
import { actionType } from '../reducers/Company'
import {host} from '../host'
import Api from "./api";

export async function infoCompany() {
    let res = await Api.get('company/current');
    let data = await res.json()
    store.dispatch({
        type: actionType.INFO_COMPANY,
        payload: data.message
    });
    return data
}

export async function defaultInfo() {
    store.dispatch({
        type: actionType.DEFAULT
    })
}

export async function changeCompany(information) {
    let res = await Api.put('company', information);
    let data = await res.json()
    if (data.error) {
        console.log(data.message.toString());
    } else {
        infoCompany();
    }
    return data
}



