import React, { useState } from 'react'

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'




const link = props => {
    return (
        <a href={props.href} target="_blank" style={{ color: "blue", }}>{props.children}</a>
    )
}



interface propType {
    markdownText: string,
    disablePopups?: boolean
}

export default function MarkDown(props: propType) {

    const [fullSize, setFullSize] = useState('');
    const MyImage = _props => {
        const handleClick = (e) => {

            if (props.disablePopups) {
                //edit mode
                // makeDraggable(e.target.id)
                return;
            }
            setFullSize(fullSize.length ? '' : _props.src);

        };

        return (
            <div className={fullSize === _props.src ? "md-large-box" : "md-img-box"} style={{
                display: 'flex',
                justifyContent: 'center',
                // height: '20vh'
            }}>
                <div>

                    {fullSize === _props.src && <p>{_props.alt}</p>}
                    {
                        _props.src.includes("youtube") ?
                            (<iframe width="560" height="315" src={_props.src} className="md-img-box" allowFullScreen></iframe>) :
                            (<img
                                className={fullSize == _props.src ? "md-large md-img" : "md-small md-img"}
                                alt={_props.alt}
                                src={_props.src}
                                onClick={handleClick}
                                width="560"
                                height="auto"
                                id={Math.random().toString()}
                            />)
                    }
                </div>
            </div>
        );
    };
    const renderers = {
        image: MyImage,
        link: link,
        code: ({ language, value }) => {
            return (
                <div className="md-code">
                    <SyntaxHighlighter language={language} children={value} />
                </div>
            )
        },
        blockquote: (p) => {

            return (<blockquote {...p}
                style={{
                    color: 'rgb(110, 110, 110)',
                    margin: 0,
                    padding: '0.01rem',
                    paddingLeft: '2em',
                    backgroundColor: "rgba(243, 243, 243, 0.521)",
                    borderLeft: "0.5em #eee solid",
                    minHeight: "2rem"
                }}
            ></blockquote>)
        }
    };
    return (
        <ReactMarkdown plugins={[gfm]} children={props.markdownText} renderers={renderers} />
    )
}

const makeDraggable = (id) => {
    document.getElementById(id).style.position = 'absolute'
    // document.getElementById(id).style.removeProperty('bottom')
    dragElement(document.getElementById(id));
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id)) {
            /* if present, the id is where you move the DIV from:*/
            document.getElementById(elmnt.id).onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}