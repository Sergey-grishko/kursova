import {store} from '../index.js';
import {actionType} from '../reducers/Company';

export function loading(enable) {
    store.dispatch({
        type: actionType.loading,
        payload: {
            enable: enable,
        }
    });
}