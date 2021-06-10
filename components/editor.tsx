import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/editor.module.scss'
import CSS from 'csstype'
import { Button } from './stateless/stateless';

interface propsType {
    onChangeCallBack?: Function,
    onChangeImageCallBack?: Function,
    containerStyle?: CSS.Properties,
    textAreaPlaceholder?: string,
    text?: string,
    textAreaStyle?: CSS.Properties,
    openAssetGalleryFunc?: Function
}



const Editor = (props: propsType) => {

    const [text, setText] = useState<string>("")
    const txtarea = useRef(null)
    const linkModalRef = useRef(null)
    const ImgModalRef = useRef(null)
    const VideoModalRef = useRef(null)

    const inputTitleRef = useRef(null)
    const inputLinkRef = useRef(null)

    const inputTitleImgRef = useRef(null)
    const inputLinkImgRef = useRef(null)

    const inputTitleVideoRef = useRef(null)
    const inputLinkVideoRef = useRef(null)

    const mdlRef = useRef(null)

    useEffect(() => {
        setText(props.text)
    }, [props.text])

    const applyTool = (pre: string, post: string, goend?: boolean) => {
        var start = txtarea.current.selectionStart;
        var end = txtarea.current.selectionEnd;
        var sel = txtarea.current.value.substring(start, end);
        var finText = txtarea.current.value.substring(0, start) + pre + sel + post + txtarea.current.value.substring(end);
        txtarea.current.value = finText;
        txtarea.current.focus();

        if (end == start && !goend) {
            txtarea.current.selectionEnd = end + pre.length;
        }

        setText(txtarea.current.value)
        props.onChangeCallBack(txtarea.current.value)

    }

    const onSelectTool = (e) => {

        switch (e.target.id) {
            case "bold":
                applyTool("**", "**")
                break;
            case "italic":
                applyTool("*", "*")
                break;
            case "code":
                applyTool("\r\n", "")
                applyTool("~~~js\n", "\r\n\r\n~~~")
                break;
            case "blockquote":
                applyTool("\r\n", "")
                applyTool("> ", "")
                break;
            case "link":
                linkModalRef.current.style.display = 'flex'
                mdlRef.current.style.display = 'flex'
                break;
            case 'image':
                ImgModalRef.current.style.display = 'flex'
                mdlRef.current.style.display = 'flex'
                break;
            case "video":
                VideoModalRef.current.style.display = 'flex'
                mdlRef.current.style.display = 'flex'
                break;
            default:
                break;
        }
    }
    const handleOnChangeText = (e) => {
        props.onChangeCallBack(e.target.value)
        setText(e.target.value)
    }


    const handleModalLinkAdd = () => {
        if (inputLinkRef.current.value.length < 10 || inputTitleRef.current.value.length < 1) return;
        applyTool(`[${inputTitleRef.current.value}]`, `(${inputLinkRef.current.value})`, true)
        linkModalRef.current.style.display = 'none'
        mdlRef.current.style.display = 'none'
        inputLinkRef.current.value = ''
        inputTitleRef.current.value = ''
    }

    const handleModalImgAdd = () => {
        if (inputLinkImgRef.current.value.length < 10 || inputTitleImgRef.current.value.length < 1) return;
        applyTool(`![${inputTitleImgRef.current.value}]`, `(${inputLinkImgRef.current.value})`, true)
        ImgModalRef.current.style.display = 'none'
        mdlRef.current.style.display = 'none'
        inputLinkImgRef.current.value = ''
        inputTitleImgRef.current.value = ''
    }
    const handleModalVideoAdd = () => {
        if (inputLinkVideoRef.current.value.length < 10 || inputTitleVideoRef.current.value.length < 1) return;

        let url: string = inputLinkVideoRef.current.value

        if (url.includes("youtu.be")) {
            url = url.replace("youtu.be", "youtube.com")
            let id = url.split("/")[url.split("/").length - 1]
            url = url.substring(0, url.length - id.length) + "embed/" + id
        } else if (url.includes("youtube.com/watch")) {

            let urlParser = new URLSearchParams(new URL(url).search)
            url = "https://www.youtube.com/embed/" + urlParser.get("v")
        } else {
            return;
        }

        applyTool(`![${inputTitleVideoRef.current.value}]`, `(${url})`, true)
        VideoModalRef.current.style.display = 'none'
        mdlRef.current.style.display = 'none'
        inputLinkVideoRef.current.value = ''
        inputTitleVideoRef.current.value = ''
    }

    const Modal = ({ title }) => (
        <div className="ed-modal" ref={linkModalRef}>
            <div className="ed-main">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <i className="fa fa-times" aria-hidden="true" onClick={() => { linkModalRef.current.style.display = 'none'; mdlRef.current.style.display = 'none' }}></i>
                </div>
                <p>{title}</p>
                <input placeholder="Give a title" ref={inputTitleRef} />
                <input placeholder="Paste your link here" ref={inputLinkRef} />
                <div className="ed-btns">
                    <div>
                        <Button text="Add" onclickCallBack={() => { handleModalLinkAdd() }} />
                    </div>
                </div>
            </div>
        </div>
    )

    const ModalImg = ({ title, onclickCallBack }) => (
        <div className="ed-modal" ref={ImgModalRef}>
            <div className="ed-main">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <i className="fa fa-times" aria-hidden="true" onClick={() => { ImgModalRef.current.style.display = 'none'; mdlRef.current.style.display = 'none' }}></i>
                </div>
                <p>{title}</p>
                <input placeholder="Give a title" ref={inputTitleImgRef} />
                <input placeholder="Paste the url to image here" ref={inputLinkImgRef} />
                <div className="ed-btns">
                    {props.openAssetGalleryFunc && <div>
                        <Button text="Assets" onclickCallBack={props.openAssetGalleryFunc} buttonStyle={{ backgroundColor: 'transparent', color: 'dodgerblue' }} />
                    </div>
                    }
                    <div>
                        <Button text="Add" onclickCallBack={handleModalImgAdd} />
                    </div>
                </div>
            </div>
        </div>
    )
    const ModalVideo = ({ title, onclickCallBack }) => (
        <div className="ed-modal" ref={VideoModalRef}>
            <div className="ed-main">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <i className="fa fa-times" aria-hidden="true" onClick={() => { VideoModalRef.current.style.display = 'none'; mdlRef.current.style.display = 'none' }}></i>
                </div>
                <p>{title}</p>
                <input placeholder="Give a title" ref={inputTitleVideoRef} />
                <input placeholder="Paste the url here" ref={inputLinkVideoRef} />
                <div className="ed-btns">
                    <div>
                        <Button text="Add" onclickCallBack={() => { handleModalVideoAdd() }} />
                    </div>
                </div>
            </div>
        </div>
    )




    return (
        <div style={props.containerStyle} className={styles.containerStyle}>
            <div className={styles.toolWrapper}>
                <i className="fa fa-bold" aria-hidden="true" id="bold" onClick={onSelectTool}></i>
                <i className="fa fa-italic" aria-hidden="true" id="italic" onClick={onSelectTool}></i>
                <i className="fa fa-code" aria-hidden="true" id="code" onClick={onSelectTool}></i>
                <i className="fa fa-quote-left" aria-hidden="true" id="blockquote" onClick={onSelectTool}></i>
                <i className="fa fa-link" aria-hidden="true" id="link" onClick={onSelectTool}></i>
                <i className="fa fa-file-image-o" aria-hidden="true" id="image" onClick={onSelectTool}></i>
                <i className="fa fa-youtube-square" aria-hidden="true" id="video" onClick={onSelectTool}></i>
            </div>
            <div className={styles.textAreaWrapper}>
                <textarea spellCheck={"false"} style={props.textAreaStyle} className={styles.textArea} placeholder={props.textAreaPlaceholder} value={text} ref={txtarea} onChange={handleOnChangeText} />
                <div className={styles.mdl} ref={mdlRef}>
                    {Modal({ title: "Add a link" })}
                    {ModalImg({ title: "Add your image here", onclickCallBack: handleModalImgAdd })}
                    {ModalVideo({ title: "Add a youtube video", onclickCallBack: handleModalVideoAdd })}
                </div>
            </div>
        </div>
    )
}

export default Editor

function MakeCenter(ref) {
    let m = window.pageYOffset - ref.current.clientHeight / 2
    ref.current.style.margintTop = m
}


