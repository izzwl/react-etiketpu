import { fetchUtils } from 'react-admin';
import { stringify } from 'query-string';

const apiUrl = 'http://localhost/e_tiket_api/public/';
const httpClient = fetchUtils.fetchJson;

function getTotal(resource, params){
    return httpClient(`${apiUrl}/${resource}/load`).then(({json})=>({
        total:json.data.length,
    }))
}
export default {
    getList: (resource, params) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const {tgl_non_aktif} = params.filter;
        const {jenis} = params.filter;
        let is_aktif = tgl_non_aktif ? 'F' : 'T'; 
        const query = {
            order_by: JSON.stringify(field),
            limit: JSON.stringify(perPage),
            offset: JSON.stringify((page - 1)),
            is_aktif: is_aktif,
            jenis: jenis,
            // filter: JSON.stringify(params.filter),
        };
        const url = `${apiUrl}/${resource}/load?${stringify(query)}`;
        // const total = getTotal(resource,params)
        return httpClient(url).then(({ headers, json }) => ({
            data: json.data,
            total:json.data[0]?json.data[0].jml_data:0,
            // total: total.total,
            // total: parseInt(headers.get('content-range').split('/').pop(), 10),
        }));
    },

    getOne: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/get?id=${params.id}`).then(({ json }) => ({
            data: json.data,
        })),

    getMany: (resource, params) => {
        const url = `${apiUrl}/${resource}/load}`;
        return httpClient(url).then(({ json }) => ({ data: json.data }));
    },

    getManyReference: (resource, params) => {
        const url = `${apiUrl}/${resource}/load`;
        return httpClient(url).then(({ headers, json }) => ({
            data: json.data,
            total: json.data.length,
        }));
    },
    aktivasi: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}/aktivasi`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },
    update: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}/edit`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },   
    updateMany: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}/edit`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json.data }));
    },

    create: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/save`, {
            method: 'POST',
            body: JSON.stringify({
                ...params.data,
            }),
        }).then(({ json }) => ({
            data: { ...params.data, id:0 },
        })),

    delete: (resource, params) =>
        httpClient(`${apiUrl}/${resource}/delete/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json.data })),

    deleteMany: (resource, params) => {
        return httpClient(`${apiUrl}/${resource}/delete/${params.id}`, {
            method: 'DELETE',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json.data }));
    }
};
