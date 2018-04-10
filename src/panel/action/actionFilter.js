import {store} from "../../App";
import {actionType} from "../reducers/Company";

export async function ReportFilter(listReports) {
    store.dispatch({
        type: actionType.FILTER,
        payload: listReports
    })
}