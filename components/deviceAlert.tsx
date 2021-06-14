import style from "../styles/devicealert.module.css";
import {isMobile}from 'react-device-detect'
import Cookies from 'js-cookie'
import { useEffect } from "react";

export default function DeviceAlert(){
    const DVALERTTOKEN = "isDeviceAlert_done"
    const showAlert = () =>{
        alert("This site is only for desktop view")
    }
    useEffect(()=>{
        if(!Cookies.get(DVALERTTOKEN) && isMobile){
            showAlert()
            Cookies.set(DVALERTTOKEN, "cjifo3fjc03-2j0")
        }
    },[])
    
    return <></>
}