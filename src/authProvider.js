import axios from 'axios';
import { stringify } from 'query-string';

export default {
    // called when the user attempts to log in
    login: ({ username, password }) => {
        // localStorage.setItem('username', username);
        // // accept all username/password combinations
        // return Promise.resolve();
 
        let data = {
            user_id:username,
            password:password,
        }
        // axios({
        //     url:`http://localhost/e_tiket_api/public/system_user/masuk?${stringify(data)}`,
        //     method:'GET',
        // }).then((res)=>{
        //     if (res.data.status === 'berhasil'){
        //         for (let v in res.data.data){
        //             localStorage.setItem(v, res.data.data[v]);
        //         }
        //         localStorage.setItem('username', res.data.data.user_id);
        //         return Promise.resolve();
        //     }
        // });
        // return Promise.resolve();

        const request = new Request(`http://localhost/e_tiket_api/public/system_user/masuk?${stringify(data)}`, {
            method: 'GET',
            // body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                console.log(response);
                
                if (response.status < 200 || response.status >= 300 ) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((json) => {
                if (json.status !== 'berhasil'){
                    throw new Error(json.pesan);
                }
                for (let v in json.data){
                    localStorage.setItem(v, json.data[v]);
                }
                localStorage.setItem('username', json.data.user_id);
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
    getPermissions: () => Promise.resolve(),
};