import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const BASE_URL = 'https://reqres.in';
export const STORE_ID = 153

const loaddata = async (url, options) => {
    try {
        console.log('Api data=>', url, options);
        const res = await fetch(url, options);
        console.log(res);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
};

const getToken = async () => {
    var ud_json = await AsyncStorage.getItem('user_details');
   // console.log('getToken', ud_json);
    const user_detail = JSON.parse(ud_json);
    return user_detail.token;
}

const getHeader = async () => {
    let token = await getToken();
    //console.log('getHeader', token);
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    return config;
}

export const CallApiPost = async (apiPath, params) => {
    let header = await getHeader();
    return axios.post(`${BASE_URL + apiPath}`, params, header);
}

export const CallApiGet = async (apiPath) => {
    let header = await getHeader();
    return axios.get(`${BASE_URL + apiPath}`, header);
}


export const CallApi = async (method, apiPath, params) => {
    let header = { "Content-Type": "multipart/form-data" }
    var ud_json = await AsyncStorage.getItem('user_details');
    if (ud_json != null) {
        const user_detail = JSON.parse(ud_json);
        header = { "Content-Type": "multipart/form-data", "Authorization": "Bearer " + user_detail.access_token }
        console.log('header', header);
    }

    const url = `${BASE_URL + apiPath}`;
    let options = {
        method: method,
        headers: header,
        body: params,
    };

    return fetch(url, options)
        .then((res) => res.json())
        .then((response) => {
            return response;
        })
        .catch((err) => {
            console.log('error', err);
            return { message: err, type: 'danger' };
        });
};
