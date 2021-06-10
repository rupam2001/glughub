import { useContext, useEffect, useRef, useState } from 'react'
import DraftPanle, { saveDraft, updateDraft } from '../components/draftPanel'
import Editor from '../components/editor'
import MarkDown from '../components/markdown'
import NavBar from '../components/navbar'
import { Button } from '../components/stateless/stateless'
import moment from 'moment'
import router, { useRouter } from 'next/router'


const notify = (msg: string) => {
    alert(msg)
}
import jsPDF from 'jspdf'
import { AuthContext } from '../context/authcontext'
import { progressBarRef, signinAlertRef } from '../components/refs'
import Tags from '../components/tags'
import { createQuestionAsync } from '../utils/globalapicalls'
import AssetsUplode from '../components/assetupload'

export default function Create() {
    const authContext = useContext(AuthContext)

    const doc = new jsPDF();
    const router = useRouter()

    const [markdownText, setMarkdownText] = useState<string>('')
    const [title, setTitle] = useState<string>('')

    const [currentDraft, setCurrentDraft] = useState(null)

    const [reloadDraftPanel, setReloadDraftPanel] = useState<any>(null)

    const saveAsDraftLocaly = () => {
        //if the draft is already been loaded and editing
        if (currentDraft) {
            let updated = { name: currentDraft.name, title: title, body: markdownText, time: new Date().toString() }
            updateDraft(updated)
            // notify("Saved!")
            setReloadDraftPanel(Math.random())
            setCurrentDraft(updated)
            return
        }
        //it is a new draft  , show the modal
        draftModalRef.current.style.display = "flex"
    }



    useEffect(() => {
        // loadFromLocalDraft();
        if (!currentDraft) return
        const { title, body } = currentDraft
        setTitle(title)
        setMarkdownText(body)
    }, [currentDraft])

    const draftModalRef = useRef(null)
    const draftInputRef = useRef(null)
    const handleDraftModalButton = () => {
        if (!draftInputRef.current.value) return
        const draft = { name: draftInputRef.current.value, title: title, body: markdownText, time: new Date().toString() }
        const { sucess, msg } = saveDraft(draft)
        notify(msg)
        if (!sucess) return
        draftModalRef.current.style.display = 'none'
        setReloadDraftPanel(Math.random())
        setCurrentDraft(draft)
    }


    const ModalDraft = ({ title }) => (
        <div className="ed-modal" ref={draftModalRef}>
            <div className="ed-main">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <i className="fa fa-times" aria-hidden="true" onClick={() => { draftModalRef.current.style.display = 'none' }}></i>
                </div>
                <p>{title}</p>
                <input placeholder="" ref={draftInputRef} autoFocus={true} />
                <div className="ed-btns">
                    <div>
                        <Button text="Add" onclickCallBack={() => { handleDraftModalButton() }} />
                    </div>
                </div>
            </div>
        </div>
    )

    const DraftInfo = () => (
        <div className="cr-draft-info-box">
            <span><strong>Currently editing: </strong></span>
            {currentDraft.name}
            <span className="cr-draft-info-time"><b>last edited:</b> <i>{moment(currentDraft.time).fromNow()}</i></span>
        </div>
    )

    useEffect(() => {
        //prevent ctrl + s
        window.addEventListener("keydown", (e) => {
            if (e.ctrlKey && (e.keyCode == 83)) {
                e.preventDefault();
                // saveAsDraftLocaly()
                return false;
            }
        })
    }, [])

    const mdDivRef = useRef(null)

    const handleExportPdf = (id) => {
        let html = document.getElementById(id).innerHTML
        console.log(html)
        doc.html(html.toString())
        doc.save('a4.pdf')
    }

    const handleExportHtml = (id) => {
        let html = document.getElementById(id).innerHTML
        download(html, (currentDraft && currentDraft.name ? currentDraft.name : new Date().getTime()) + '.html', 'text/plain')
    }


    //for aut scrolling to end when a new element is added
    useEffect(() => {
        var elem = document.getElementById('mdbox');
        elem.scrollTop = elem.scrollHeight;
    }, [markdownText])

    const [tags, setTags] = useState([])
    const showTagsModalRef = useRef(null)

    const [isCreatingQuestion, setIsCreatingquestion] = useState(false)

    const handlePostQuestion = () => {
        if (!authContext.isLogin) {
            signinAlertRef.current.style.display = 'flex'
            return
        }
        if (title.length < 5) {
            alert("Title too short")
            return
        }
        if (markdownText.length < 20) {
            alert("Body too short")
            return
        }
        if (tags.length === 0) //if no tags are selected prompt the user to select tags
        {
            showTagsModalRef.current.style.display = 'flex'
            return
        }

        //send to the server
        setIsCreatingquestion(true)
        progressBarRef.current.continuousStart()

        createQuestionAsync({ title: title, body: markdownText, tags: tags, type: 'question', time: new Date })
            .then(({ success, newQuestion }) => {
                setIsCreatingquestion(false);
                //go to that page.
                progressBarRef.current.continuousStart()

                router.push("/posts/questions/" + newQuestion._id)

            }).catch(err => {
                alert("Error")
            })
    }
    const handleAddTags = () => {
        showTagsModalRef.current.style.display = 'flex'
    }


    const ModalTags = () => (
        <div ref={showTagsModalRef} className="ed-modal">
            <div className="ed-main hide-scrollbar" style={{ maxWidth: '40vw', height: '40vh', overflow: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <i className="fa fa-times" aria-hidden="true" onClick={() => { showTagsModalRef.current.style.display = 'none' }}></i>
                </div>
                <Tags onClickTagsCallBack={setTags} />
            </div>
        </div>
    )

    const [showAssetGallery, setShowAssetGallery] = useState(false)
    const handleAssetGalleryOpen = () => {
        if (!authContext.isLogin) {
            signinAlertRef.current.style.display = 'flex'
            return
        }
        setShowAssetGallery(true)
        setTimeout(() => {

            window.scrollTo(0, document.body.scrollHeight);
        }, 1000);
    }

    return (
        <div>
            <NavBar />
            <div style={{ marginTop: '1rem' }} className="cr-main">
                <div className="cr-left">
                    <div className="cr-left-editor">
                        {currentDraft && DraftInfo()}
                        <div className="cr-title">
                            <input placeholder="Title" onChange={(e) => { setTitle("## " + e.target.value); }} defaultValue={title.substring(2)} />
                        </div>
                        <Editor
                            onChangeCallBack={(text) => { setMarkdownText(text) }}
                            onChangeImageCallBack={() => { }}
                            containerStyle={{ border: '1px solid gray', height: '30rem' }}
                            textAreaPlaceholder={"Type your question body here"}
                            text={markdownText}
                            textAreaStyle={{ fontSize: 'medium' }}
                            openAssetGalleryFunc={handleAssetGalleryOpen}
                        />
                        <div className="cr-ed-btns">
                            <Button onclickCallBack={() => { handlePostQuestion() }} text="Post question" disable={isCreatingQuestion} />
                            <Button onclickCallBack={() => { handleAddTags() }} text="add tags" disable={isCreatingQuestion} buttonStyle={{ backgroundColor: 'transparent', color: 'var(--third)' }} />
                            <Button onclickCallBack={() => { saveAsDraftLocaly() }} text="Save as draft in this device" buttonStyle={{ backgroundColor: 'transparent', color: '#e63e32', marginLeft: '1rem', flex: 1, fontSize: 'small' }} />
                            <Button onclickCallBack={() => { handleExportHtml('mdbox') }} text="Export as html" buttonStyle={{ backgroundColor: 'transparent', color: 'green', fontSize: 'small', float: 'right' }} />
                        </div>
                    </div>
                </div>
                <div className="cr-right">
                    <div className="cr-preview-2" ref={mdDivRef} id="mdbox" onClick={() => { handleFlash("mdbox") }}>
                        <MarkDown markdownText={title + "\n" + markdownText} disablePopups={true} />
                    </div>
                    <DraftPanle visible={true} onDraftSelectCallback={(draft) => { setCurrentDraft(draft) }} reload={reloadDraftPanel} />
                </div>
            </div>
            {showAssetGallery && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5vh' }}>
                <AssetsUplode isLogin={authContext.isLogin} />
            </div>}
            {ModalDraft({ title: "Name of the draft" })}
            {ModalTags()}
        </div>
    )
}

const handleFlash = (id) => {
    let elem = document.getElementById(id)
    if (elem.classList.contains("flash")) {
        elem.classList.remove('flash')
    } else {
        elem.classList.add('flash')
    }
}





function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}