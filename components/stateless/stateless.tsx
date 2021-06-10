import React from 'react';
import css from "csstype"
interface propType {
    text: string,
    onclickCallBack: Function,
    buttonStyle?: css.Properties,
    disable?: boolean

}

const Button = (props: propType) => (
    <div className={props.disable ? "button button-disable" : "button"} id="ignore" onClick={(e) => { if (!props.disable) props.onclickCallBack(e) }} style={props.buttonStyle}>
        <span id="ignore" >{props.text}</span>
    </div>
)


export { Button }