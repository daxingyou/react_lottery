import 'whatwg-fetch';
import { JSEncrypt } from './jsencrypt';
import { hashHistory } from 'react-router';
import { message } from 'antd';
import CryptoJS  from 'crypto-js';// 定义加/解密的
import config from './config';

// 密钥 16 位
let key = '0123456789abcdef';
key = CryptoJS.enc.Utf8.parse(key);
let token = "";
let init=0;//页面初始化
//加密
const encryptedFunc =function (str, key) {
    let encrypted = CryptoJS.AES.encrypt(str, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    encrypted = encrypted.toString();
    return encrypted
};
//解密
const decryptedFunc =function (encrypted, key) {
    let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
    return decrypted
};

function RSAapi(path, req, callback) {
    const domain = config.api_domain;
    const encrypt = new JSEncrypt();
    let request;
    encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----\n'+
        'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCz+9OdWejOpGtxlNld9F4dFKoq\n'+
        'RKCiw+OaPXMGknERDO2sSRXM6ArIVtep4koexJSVVMKbAj+e5qFmRtDfg41ZySCm\n'+
        'MTMJWlSqlzz2cWBc9Dn1jl8WK6K89kkhoSKG5/kW5ifEuAC3M15YVp3or7lsjSfC\n'+
        'TAjDxSU7bIu0a4Q7oQIDAQAB\n'+
        '-----END PUBLIC KEY-----');

    const initData = {
        method: 'POST',
    };

    let form_data = new FormData();
    let key = req.datas.key;
    key = CryptoJS.enc.Utf8.parse(key);
    form_data.append("datas", encrypt.encrypt(JSON.stringify(req.datas)));
    initData['body'] = form_data;
    request = new Request(domain + path, initData);
    fetch(request).then(res => {
        res.text().then(d => {
            let data = JSON.parse(d);
            if(!data.errno){
                let tokenData = decryptedFunc(data.data,key);
                token=JSON.parse(tokenData).token;
                callback();
            }
        });
    });
}
//AES加密解密
function AESApi(path, req, callback) {

    const domain = config.api_domain;
    let request;
    const initData = {
        method: 'POST',
    };
    const user = JSON.parse(sessionStorage.getItem("user"));
    // path最后参数&remind=0  不提醒
    let remind = true;
    if(path.substr(-9)==="&remind=0"){
        remind=false;
        path=path.substr(0,path.length-9);
    }
    if (user !== null && user.sid !== undefined && user.user_id !== undefined) {
        path += '&sid=' + user.sid + '&user_id=' + user.user_id;
    }
    if(req !== null) {
        let form_data = new FormData();
        form_data.append("datas", encryptedFunc(JSON.stringify(req),key));

        initData['body'] = form_data;
        request = new Request(domain + path+"&is_wap=3&apiToken="+token, initData);
    } else {

        request = new Request(domain + path+"&is_wap=3&apiToken="+token, {
            method: 'GET',
        });
    }
    fetch(request).then(res => {
        res.text().then(d => {
            d = JSON.parse(d);
            if(d.errno===7032){
                //获取apiToken失败
                token="";
                init=0;
                Api(path, req, callback);
            }else if(d.errno === 0){
                if(d.data){
                    d.data = JSON.parse(decryptedFunc((d.data).replace(/\\/g,""),key));
                }
                callback(d);
            }else if(d.errno === 7001 || d.errno === 7006) {
                //实现不累加显示，重复点击只显示一个
                message.config({
                  top: 20,
                  duration: 1,
                });
                message.warning(d.errstr);
                setTimeout(function() {
                    if(sessionStorage.getItem("user")){
                        sessionStorage.removeItem("user");
                    }
                    hashHistory.push('login');
                }, 3000);

            }else if(d.errno===6009){
                //维护页面跳转
                //模拟接口真实数据，用于测试
                var data = {id:3,name:'sam',age:36};
                  var path =
                  {
                    pathname:"/vindicate",
                    state:data   //state类似于表单post方法,query类似于get方法
                  };
                //hashHistory页面不会刷新
                hashHistory.push(path);
            }else{
                if(remind){
                  //实现不累加显示，重复点击只显示一个
                  message.config({
                    top: 20,
                    duration: 1,
                  });
                    message.warning(d.errstr);
                }
                callback(d);
            }
        });
    });
}
export default function Api(path, req, callback) {
        if(token){
            AESApi(path, req, callback);
        }else{
            if(init===0){
                init=1;
                RSAapi("c=default&a=getAppToken",{
                    datas:{key:"0123456789abcdef"}
                },()=>{
                    AESApi(path, req, callback);
                })
            }else{
                setTimeout(()=>{
                    Api(path, req, callback);
                },50)
            }
        }
}
