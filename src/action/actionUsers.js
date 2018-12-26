import {store} from '../index';
import {actionType} from '../reducers/Company'
import Api from "./api";


export async function infoUsers() {
    let res = await Api.get('user', true);
    let data = await res.json()
    store.dispatch({
        type: actionType.INFO_USERS,
        payload: data.message
    });
    return data
}

export async function addUser(user) {
    let res = await Api.post('user', user);
    let data = await res.json()
    return data
}


export async function EditUsers(user) {
    let res = await Api.put('user', user);
    let data = await res.json()
    if (data.error) {
        console.log(data.message.toString());
    } else {
        infoUsers();
    }
    return data
}

