import {actionType} from "../reducers/Company";
import {store} from "../../App";
import {infoUsers} from "./actionUsers";

const host = "http://web.bidon-tech.com:65059/";

export async function infoReports() {
    let token = localStorage.getItem('token');
    return await fetch(host + "reports",
        {
            method: "GET",
            headers: {
                "Authorization": token
            }
        }).then((response)=>response.json()).then((res)=> {
        store.dispatch({
            type: actionType.INFO_REPORTS,
            payload: res.message
        });
        return res;
    });
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
        infoUsers();
    }
}

