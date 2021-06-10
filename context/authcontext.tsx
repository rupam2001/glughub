import React, { useEffect, useState } from 'react';
import { AuthRoute, AutoAuthRoute, ENDPOINT, LogoutRoute } from '../utils/constanse';
import Cookie from 'js-cookie'
import SigninAlert from '../components/signinAlert';
interface AuthResp {
    success: boolean,
    profile_pic: string,
    name: string
}
interface AuthContextTypes {
    isLogin: boolean,
    AutoAuthFromTokenAsync(): Promise<AuthResp>,
    AuthenticateAsync(tokenId: string): Promise<AuthResp>,
    AuthRespObj: AuthResp,
    LogoutAsync(): Promise<boolean>,
    getCookieToken(): string
}


const AuthContext = React.createContext<AuthContextTypes>(null)

export default function AuthContextProvider(props) {

    const [isLogin, setIsLogin] = useState(false);
    const [AuthRespObj, setAuthRespObj] = useState<AuthResp>({ success: false, profile_pic: '', name: 'name' })

    const getCookieToken = (): string => {
        const token = Cookie.get('token')
        if (!token) return ''
        return token
    }
    const setCookieToken = (token: string, exp: Number) => {
        Cookie.set('token', token, { expires: exp })
    }
    const removeCookieToken = () => {
        Cookie.remove('token')
    }


    const AutoAuthFromTokenAsync = async (): Promise<any> => {
        try {
            //get the token from the cookie
            const token = getCookieToken()
            //if token not found return
            if (!token) return { success: false, profile_pic: '>>', name: 'name' }
            //api call with token
            const { success, profile_pic, name } = await fetch(ENDPOINT + AutoAuthRoute, { method: 'POST', body: JSON.stringify({ token }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
            setAuthRespObj({ success, profile_pic, name })
            setIsLogin(success)
            return { success, profile_pic, name }
        } catch (e) {
            setIsLogin(false)
            return { success: false, profile_pic: '>>', name: '' }
        }
    }

    const AuthenticateAsync = async (tokenId: string): Promise<AuthResp> => {
        try {
            //send the tokenId got from google oauth
            const { token, success, profile_pic, name } = await fetch(ENDPOINT + AuthRoute, { method: 'POST', body: JSON.stringify({ tokenId: tokenId }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())
            //if oauth failed in api
            if (!success) return { success, profile_pic: '>>', name }
            //oauth sucess setting the token as cookie
            setCookieToken(token, 10)
            setAuthRespObj({ success, profile_pic, name })
            setIsLogin(true)
            return { success, profile_pic, name }
        } catch (e) {
            // server responded with error
            return { success: false, profile_pic: '>>', name: '' }
        }
    }
    const LogoutAsync = async (): Promise<boolean> => {
        try {
            const token = getCookieToken()

            const { success } = await fetch(ENDPOINT + LogoutRoute, { method: 'DELETE', body: JSON.stringify({ token: token }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())

            if (success)
                removeCookieToken()
            else return false

            setIsLogin(false)
            setAuthRespObj({ success: false, profile_pic: '>>', name: 'name' })
            return success
        } catch (e) {

            return false
        }
    }


    return (
        <AuthContext.Provider
            value={{
                isLogin,
                AutoAuthFromTokenAsync, AuthenticateAsync,
                AuthRespObj, LogoutAsync, getCookieToken
            }}
        >
            {props.children}
            <SigninAlert />
        </AuthContext.Provider>
    )
}



export { AuthContext }