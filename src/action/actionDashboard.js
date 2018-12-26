import {store} from '../index';
import {actionType} from '../reducers/Company'
import Api from "./api";


export async function infoDashboard() {
    let res = await Api.get('dashboard');
    let data = await res.json()
    store.dispatch({
        type: actionType.INFO_DASHBOARD,
        payload: data.message
    });
    return data
}
