
import CryptoJS from 'crypto-js';
// or specific modules like:


import { JSEncrypt } from 'jsencrypt';

export async function encryptPayload(payload: object): Promise<{
  data: any;
  key: any;
  iv: any;
}> {
    const jsonData = JSON.stringify(payload);
    const aes_key = CryptoJS.lib.WordArray.random(32);
    const aes_iv = CryptoJS.lib.WordArray.random(16);

    const dataEnc = CryptoJS.AES.encrypt(jsonData, aes_key, { iv: aes_iv });
    const dataEncBase64 = CryptoJS.enc.Base64.stringify(dataEnc.ciphertext);

    const aes_key_hex = CryptoJS.enc.Hex.stringify(aes_key);
    const aes_iv_hex = CryptoJS.enc.Hex.stringify(aes_iv);

    let public_key = '';
    try {
        public_key = await fetch('/public.pem').then(res => res.text());
    } catch (error) {
        return { data: null, key: null, iv: null };
    }

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(public_key);

    const aes_key_enc = encrypt.encrypt(aes_key_hex);

    return {
        data: dataEncBase64,
        key: aes_key_enc,
        iv: aes_iv_hex,
    };
}
