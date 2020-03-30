import axios from 'axios';
import { stringify } from 'query-string';
import {userType} from './resource/user';
import { API_URL, MY_BOOL } from './settings';
export default {
    // called when the user attempts to log in
    login: ({ username, password }) => {
        let data = {
            user_id:username,
            password:password,
        }
        const request = new Request(`${API_URL}system_user/masuk?${stringify(data)}`, {
            method: 'GET',
            // body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                // console.log(response);
                if (response.status < 200 || response.status >= 300 ) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((json) => {
                if (json.status !== 'berhasil'){
                    throw new Error(json.pesan);
                }
                for (let v in json.data[0]){
                    localStorage.setItem(v, json.data[0][v]);
                }
                let permission = []
                for (let ut in userType){
                    if (userType[ut].id === json.data[0]['tipe']){
                        permission.push(userType[ut].name);   
                    }
                }
                if (MY_BOOL[json.data[0].is_tambah_user]) {
                    permission.push('superadmin');   
                }
                localStorage.setItem('permission',JSON.stringify(permission))
                // localStorage.setItem('permission','Admin')
                localStorage.setItem('username', json.data[0].user_id);
                // console.log(localStorage)
                // console.log(localStorage.getItem('permission'))
            });
     },
    // called when the user clicks on the logout button
    logout: () => {
        localStorage.removeItem('username');
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: ({ status }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('username');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem('username')
            ? Promise.resolve()
            : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => {
        // console.log(localStorage.getItem('permission'))
        const role = localStorage.getItem('permission');
        const res = role
                ? Promise.resolve(role)
                : Promise.reject();
        // console.log(res);
        return res
    },
};