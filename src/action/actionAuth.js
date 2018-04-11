import {host} from '../Host'

export async function login (login, password) {
let response = await fetch(host + "company/login",
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            ownerEmail: login,
            ownerPassword: password,
        })
    });
    return response
}

export async function Reg (information) {
    let response = await fetch(host + "company",
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                name: information.name,
                ownerEmail: information.ownerEmail,
                ownerPassword: information.ownerPassword,
                description: information.description,
                logo: "noLogo",
                imageQuality: information.imageQuality,
                orderValue: information.orderValue,
                active: true,
                language: information.language
            })
        });
    return response

}