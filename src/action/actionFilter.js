import {store} from "../App";
import {actionType} from "../reducers/Company";
import {host} from "../Host";

export async function ReportFilter(listReports) {
    store.dispatch({
        type: actionType.FILTER,
        payload: listReports
    })
}

export async function defaultInfo() {
    store.dispatch({
        type: actionType.DEFAULT
    })

}

export async function OnExport(type) {
    let token = localStorage.getItem('token');
    var filter = '';

    let state = store.getState();

    if (state.filter.user_id !== 'all') {
        filter = 'reports/' + type + '?filter'
    } else if (state.filter.user_id === 'all') {
        filter = 'reports/' + type
    }

    if (state.filter.user_id !== 'all') {
        filter += '&user_id=' + state.filter.user_id
    }

    let response = await fetch(host + filter,
        {
            method: "GET",
            headers: {
                "Authorization": token
            }
        });
        let blob = await response.blob();
        let url = window.URL.createObjectURL(blob);
        download(url, 'reports.' + type);
}

export function user(user) {
    store.dispatch({type:actionType.FILTER_USER, user})
}

function download( url, filename ) {
    let link = document.createElement('a');
    link.setAttribute('href',url);
    link.setAttribute('download',filename);
    let event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(event);
}