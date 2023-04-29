import {getCookie, getCookies, setCookie, removeCookie} from "cookies-next"
export default async function handler(req, res){

    try {
        setCookie('test', 'iniValuenya', { req, res, maxAge: 60 * 6 * 24 })

        res.status(200)
    } catch (error) {
        
    }
}