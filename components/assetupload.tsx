import Cookie from 'js-cookie'
import { ENDPOINT } from '../utils/constanse'

import styles from '../styles/Home.module.scss'
import { useEffect, useRef, useState } from 'react'
import { progressBarRef } from './refs'
import { Button } from './stateless/stateless'
import Loader from 'react-loader-spinner'
import { fileURLToPath } from 'url'

interface propTypes {
    fetchFunc: Function,
    assetUploaderFunc: Function,
    allowedTypes: Array<string>
}

export default function AssetsUplode(props) {

    const [allAssets, setAllAssets] = useState([])

    const [uploadingFile, setUploadingFile] = useState(null)
    const [uploadingFileBas64, setUploadingBase64] = useState<string>('')
    const inputRef = useRef(null)

    const handleFileChange = async (e) => {
        try {

            setUploadingFile(e.target.files[0])
            console.log(e.target.files[0])
            progressBarRef.current.continuousStart()

            const base64 = await toBase64Async(e.target.files[0], e.target.files[0].type)
            // console.log(base64)
            const newAsset = await uploadAssetAsync(e.target.files[0].name, base64, 'image')

            progressBarRef.current.complete()

            setAllAssets([newAsset, ...allAssets])
        } catch (e) {
            console.log(e)
        }

    }
    const handleUploadClick = () => {
        inputRef.current.click()
    }

    useEffect(() => {
        (
            async () => {
                try {
                    const assets = await fetchAssetsAsync()
                    setAllAssets(assets)
                } catch (e) { }
            }
        )()
    }, [props.isLogin])

    const handleClickAsset = (each) => {
        let copyText = document.getElementById(each._id);
        window.prompt("Copy to clipboard: Ctrl+C, Enter", copyText['value']);
    }


    const overlayRef = useRef(null)
    const assetContRef = useRef(null)
    const handleDelete = async (each) => {
        assetContRef.current.style.overflowY = 'hidden'
        overlayRef.current.style.display = 'flex'
        try {

            const success = await deleteAssetAsync(each._id)

            const filtered = allAssets.filter(as => as._id !== each._id)
            setAllAssets(filtered)
        } catch (e) {

        }


        assetContRef.current.style.overflowY = 'auto'
        overlayRef.current.style.display = 'none'
    }



    return (
        <div className={styles.assetMain}>
            <div className={styles.assetHeading}>
                <span>Your Assets gallery</span>
            </div>
            <div className={styles.assetContainer} ref={assetContRef}>
                {
                    allAssets.map(each => (
                        <div className={styles.eachAsset} key={each._id}>
                            <img src={each.url} alt={each.name} />
                            <span>{each.name.slice(0, 16) + "..."}</span>
                            <div className={styles.assetBtngrp}>
                                <Button onclickCallBack={() => { handleClickAsset(each) }} text="get url" buttonStyle={{ backgroundColor: 'var(--first)', width: 'fit-content', fontSize: 'x-small', marginTop: '0.2rem', marginRight: '0.2rem', color: 'dodgerblue' }} />

                                <Button onclickCallBack={() => { handleDelete(each) }} text="delete" buttonStyle={{ backgroundColor: 'var(--first)', width: 'fit-content', fontSize: 'x-small', marginTop: '0.2rem', color: 'red' }} />
                            </div>
                            <input type="text" id={each._id} value={each.url} hidden />
                        </div>
                    ))
                }
                {
                    !props.isLogin && <div>Please signin for assets</div>
                }
                <div className={styles.assetOverlay} ref={overlayRef}>
                    <Loader
                        type="Oval"
                        color="grey"
                        height={50}
                        width={50}
                    />
                </div>
            </div>

            <div className={styles.uploadBtnBox}>
                <i className="fa fa-cloud-upload" aria-hidden="true" onClick={handleUploadClick}></i>
                <input type="file" id="fileUpload" onChange={handleFileChange} hidden ref={inputRef} accept="image/x-png,image/gif,image/jpeg" />
            </div>
        </div>
    )
}


const uploadAssetAsync = async (fileName: string, fileBase64: string, type: string) => {

    const token = Cookie.get('token')
    if (!token) throw new Error('authentication error')

    const { asset } = await fetch(ENDPOINT + '/asset/upload', { method: 'POST', body: JSON.stringify({ fileBase64, fileName, type, token }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())

    return asset
}


const toBase64Async = (item: any, type: string): Promise<string> => {
    /*
        takes any kind of file and the type of the file in the formate of standard types
        returns a new promise of string of base64 encoding   
    */

    let blob = new Blob([item], { type })
    let reader = new FileReader()

    return new Promise((resolve, reject) => {
        reader.readAsDataURL(blob)
        reader.onload = () => {
            let itemBase64 = reader.result
            resolve(itemBase64.toString())
        }
    })
}

const fetchAssetsAsync = async () => {
    const token = Cookie.get('token')
    if (!token) throw new Error('authentication error')

    const { assets } = await fetch(ENDPOINT + '/asset/get', { method: 'POST', body: JSON.stringify({ token }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())

    return assets
}

const deleteAssetAsync = async (id) => {
    const token = Cookie.get('token')

    if (!token) throw new Error('authentication error')

    const { success } = await fetch(ENDPOINT + '/asset/delete', { method: 'DELETE', body: JSON.stringify({ token, id }), headers: { "Content-Type": "application/json" } }).then(resp => resp.json())

    return success
}