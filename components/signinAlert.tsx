import { signinAlertRef } from "./refs"
import * as React from 'react';

const SigninAlert = () => {


    return (
        <div ref={signinAlertRef} className="ed-modal" style={{ backgroundColor: 'black' }}>
            <div className="ed-main" style={{ width: '30vw', }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <i className="fa fa-times" aria-hidden="true" onClick={() => { signinAlertRef.current.style.display = 'none'; document.querySelector("body").style.overflow = 'auto' }}></i>
                </div>
                <p style={{ color: 'red' }}>Please signin</p>

                <div className="ed-btns">

                </div>
            </div>
        </div>
    )
}

export default SigninAlert