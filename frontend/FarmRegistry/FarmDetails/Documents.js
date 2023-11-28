
import {
    React,
    connect,
    elements,
    PropTypes,
    axios
} from "perun-core";
import style from "../style/registration.module.css";
const { useState, useEffect } = React;
const { alertUser } = elements;
import { labelsManager } from '../utils_tools/LabelsExport';
import { iconManager } from "../../assets/svgHolder";
const Documents = (props, context) => {
    const [fileItems, setFileItems] = useState(undefined)
    useEffect(() => {
        generateFileItem()
    }, [])
    const handleUploadedFiles = (e) => {
        let arr = []
        Object.values(e.target.files).map(file => {
            arr.push(file)
        })
        handleMultiAttach(arr)
    }
    const downloadFile = (el, e) => {
        e.preventDefault()
        if (el['object_id'] && el['FILE_NAME']) {
            let url = window.server + `/ReactElements/downloadFile/sid/${props.svSession}/object-id/${el['object_id']}/file-name/${el['FILE_NAME']}`
            window.open(url, '_blank')
        }
    }
    const deleteDownload = (el, e) => {
        e.preventDefault()
        let deleteObj = { 'OBJECT_ID': el['object_id'], 'OBJECT_TYPE': 2 }
        let url = window.server + `/ReactElements/deleteObject/${props.svSession}`
        axios({
            method: "post",
            data: deleteObj,
            url: url,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
            .then((res) => {
                if (res.data.type === 'SUCCESS') {
                    generateFileItem()
                }
            })
    }


    const generateFileItem = () => {
        axios.get(`${window.server}${props.getUploadedFiles}`).then(res => {
            if (res.data) {
                if (res.data.data.items.length > 0) {
                    let files = res.data.data.items.map((el) => (<div className={`${style['downloadable-item-div']}`}>
                        <div className={style['download-icon-text']}>
                            <span>{iconManager.getIcon('docs')}</span>  <button id='file-name-upload' className={`${style['file-name-upload']}`} onClick={(e) => downloadFile(el, e)}>{iconManager.getIcon('downloadFile')}{el.FILE_NAME}</button>
                        </div>
                        <div>
                            <button type='button' id='deleteBtn' className={`${style['delete-file-btn']}`}
                                onClick={(e) => { alertUser(true, 'warning', labelsManager.importLabel('delete_uploaded_file', context, 'farm_registry'), "", () => { deleteDownload(el, e,) }, () => { }, true, labelsManager.importLabel('yes', context, 'farm_registry'), labelsManager.importLabel('no', context, 'farm_registry')) }}>{iconManager.getIcon('delete')}
                            </button>
                            <button type='button' id='downloadBtn' className={`${style['download-file-btn']} ${style['upload-to-download-btn']}`}
                                onClick={(e) => downloadFile(el, e)}>{iconManager.getIcon('upload')}
                            </button>
                        </div>
                    </div>))
                    setFileItems(files)
                }
            }
        })

    }

    const handleMultiAttach = (arr) => {
        if (arr.length > 0) {
            let errorArr = []
            const promises = arr.map(async (file, i) => {
                let data = new FormData()
                data.append('file', file)
                return await axios({
                    method: 'post',
                    data: data,
                    url: `${window.server}${props.uploadFileUrl}`,
                    headers: { 'Content-Type': 'multipart/fosrm-data' }
                }).then(res => {
                    return { res, file }
                }).catch((error) => {
                    return { error, file }
                })
            })

            Promise.allSettled(promises).
                then((results) => {
                    results.forEach(result => {
                        if (result.value?.error) {
                            errorArr.push(result.value.file)
                        } else {
                            if (result.value.res.data.type !== "SUCCESS") {
                                errorArr.push(result.value.file)
                            }
                        }
                    })
                    responseFunc(errorArr)
                })
        } else {
            alertUser(true, 'info', labelsManager.importLabel('no_file_selected', context, 'farm_registry'))
        }
        generateFileItem()
    }

    const responseFunc = (errorArr) => {
        if (errorArr.length > 0) {
            let erroArrNames = []
            let nameString = " "
            errorArr.forEach(error => {
                erroArrNames.push(error.name)
            })
            nameString = erroArrNames.join(',')
            alertUser(true, 'warning', `${labelsManager.importLabel('desc_error_upload', context, 'farm_registry')} :`, ` ${nameString}`)
        } else {
            alertUser(true, 'success', labelsManager.importLabel('desc_success_upload_title', context, 'farm_registry'))
        }
        generateFileItem()
    }

    return (
        <>
            <div className={style['farm-registry-documents-container']}>
                <div className={style['farm-registry-upload']}>
                    <p>{labelsManager.importLabel('attachment_title', context, 'farm_registry')}</p>
                    <label title={labelsManager.importLabel('upload_file_btn', context, 'farm_registry')} for={'upload-file'} className={`${style['upload-file-btn']}`} id='uploadBtn'>{iconManager.getIcon('addAttachment')}</label>
                    <input className={style['farm-registry-upload-input']} type="file" id='upload-file' onChange={handleUploadedFiles} multiple={true} />
                </div>
                <div className={style['farm-registry-files']}>
                    {fileItems}
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
    farmObjId: state['farm_registry.mapData']?.farmData?.objectId
});

Documents.contextTypes = {
    intl: PropTypes.object.isRequired,
};
export default connect(mapStateToProps)(Documents);