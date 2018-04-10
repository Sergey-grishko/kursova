import { store } from '../../App';
import { actionType } from '../reducers/Company'


const host = "http://web.bidon-tech.com:65059/";

export async function infoUsers() {
    let token = localStorage.getItem('token');
    let response = await fetch(host + "user",
        {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });
    let data = await response.json();
    store.dispatch({
        type: actionType.INFO_USERS,
        payload: data.message
    });
    return data
}

export async function addUser(fullName, email, password) {
    let token = localStorage.getItem('token');
    let response = await fetch(host + "user",
        {
            method: "POST",
            headers: {
                "Authorization": token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password,
                active: true,
            })
        });
    let data = await response.json();
    if (data.error) {
        console.log(data.message.toString());
    }else {
        infoUsers();
    }
}

export async function EditUsers(_id, fullName, email, password, active) {
    let token = localStorage.getItem('token');
    let response = await fetch( host + "user",
        {
            method: "PUT",
            headers: {
                "Authorization": token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: _id,
                fullName: fullName,
                email: email,
                password: password,
                active: active,
            })
        });
    let data = await response.json();
    if (data.error) {
        console.log(data.message.toString());
    }else {
        infoUsers();
    }
}
