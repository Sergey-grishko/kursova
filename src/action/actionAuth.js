import Api from "./api";

export async function login(login) {
    let res = await Api.post('company/login', login, false, true);
    let data = await res.json()
    !data.error && await Api.setTokenToLocalStorage(data.message.token)
    return data
}
export async function Reg(information) {
    let res = await Api.post('company', information, false, true);
    let data = await res.json();
    if(data.error) throw new Error(data.message);
    return data
}
