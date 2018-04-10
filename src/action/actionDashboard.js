import { store } from '../App';
import { actionType } from '../reducers/Company'
import {host} from '../Host'

export async function infoDashboard() {
    let token = localStorage.getItem('token');
    return await fetch( host + "dashboard",
        {
            method: "GET",
            headers: {
                "Authorization": token
            }
        }).then((response)=>response.json()).then((res)=> {
        store.dispatch({
            type: actionType.INFO_DASHBOARD,
            payload: res.message
        });
        return res;
    });
}