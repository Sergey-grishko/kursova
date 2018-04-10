import { store } from '../../App';
import { actionType } from '../reducers/Company'


const host = "http://web.bidon-tech.com:65059/";

export async function infoCompany() {
    const token = await localStorage.getItem('token');
    return await fetch( host + "company/current",
        {
            method: "GET",
            headers: {
                "Authorization": token
            }
        }).then((response)=>response.json()).then((res)=>{
        store.dispatch({
            type: actionType.INFO_COMPANY,
            payload: res.message
        })
        return res;
    });
}

export async function defaultInfo() {
    store.dispatch({
        type: actionType.DEFAULT
    })
}

export async function changeCompany(company) {
    let token = localStorage.getItem('token');
    let response = await fetch(host + "company",
        {
            method: "PUT",
            headers: {
                "Authorization": token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: company._id,
                name: company.name,
                ownerEmail: company.ownerEmail,
                ownerPassword: company.ownerPassword,
                description: company.description,
                logo: company.logo,
                imageQuality: company.imageQuality,
                orderValue: company.orderValue,
                active: true,
                language: company.language
            })
        });
    let data = await response.json();
    if (data.error) {
        console.log(data.message.toString());
    } else {
        infoCompany();
    }
}

