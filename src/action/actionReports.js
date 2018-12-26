import {actionType} from "../reducers/Company";
import {store} from "../index";
import {infoUsers} from "./actionUsers";
import {host} from '../host'
import Api from "./api";


export async function infoReports() {
    let res = await Api.get('reports');
    let data = await res.json()
    store.dispatch({
        type: actionType.INFO_REPORTS,
        payload: data.message
    });
    return data
}


export async function EditReport(_id, category_id, comment, approved) {
    let token = localStorage.getItem('token');
    let response = await fetch( host + "reports",
        {
            method: "PUT",
            headers: {
                "Authorization": token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: _id,
                category_id: category_id,
                comment:comment,
                approved:approved
            })
        });
    let data = await response.json();
    if (data.error) {
        console.log(data.message.toString());
    }else {
        infoReports();
    }
}



