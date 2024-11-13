import { React, PropTypes, ExportableGrid, connect, redux, elements, axios, GenericForm, createHashHistory } from 'perun-core'
import { labelsManager } from '../utils_tools/LabelsExport';
const { alertUser, ReactBootstrap } = elements
const { Modal } = ReactBootstrap
const { store, dataToRedux, removeAsyncReducer } = redux
const { useState, useEffect } = React
const hashHistory = createHashHistory()

const SearchDynamic = (props, context) => {
    const tableName = props.match?.params?.tableName?.toUpperCase() || ''
    const gridId = `${tableName}_SEARCH_GRID`
    const [resultsData, setResultsData] = useState([])

    const generateForm = () => {
        const searchConfig = props.configuration?.searchForm
        return (
            <GenericForm
                params='FORM_DATA'
                key='AR_SEARCH_FORM'
                id='AR_SEARCH_FORM'
                method={searchConfig?.configuration?.onSubmit}
                uiSchemaConfigMethod={searchConfig?.uischema?.onSubmit}
                tableFormDataMethod={searchConfig?.data?.onSubmit}
                hideBtns='closeAndDelete'
                customSave
                addSaveFunction={(e) => { handleSearch(e.formData) }}
                customSaveButtonName={`getMainLabel('search', context)`}
            />
        )
    }


    const onRowClick = (_id, _idx, row) => {
        const href = `/main/aims/${tableName}/${row[`${tableName}.OBJECT_ID`]}/summary`
        hashHistory.push(href)
    }

    const generateGrid = (data) => {
        const buttonsArray = []
        const configWs = props.configuration?.configuration?.onSubmit
        // const addFormConfig = configuration?.addForm
        // // if (addFormConfig) {
        // //     const addButton = {
        // //         type: 'button',
        // //         id: 'add-new-record-btn',
        // //         action: () => setShowRegistrationModal(true),
        // //         name: `${getMainLabel('add', context)}`
        // //     }
        // //     buttonsArray.push(addButton)
        // // }
        return (
            <ExportableGrid
                gridType='SEARCH_GRID_DATA'
                key={gridId}
                id={gridId}
                heightRatio={0.6}
                configTableName={configWs}
                dataTableName={data}
                onRowClickFunct={onRowClick}
                className='animals-search-grid'
                buttonsArray={buttonsArray}
            />
        )
    }

    const handleSearch = (formData) => {
        setResultsData(undefined)
        removeAsyncReducer(store, gridId)
        dataToRedux(null, 'componentIndex', gridId, '')
        const searchConfig = configuration?.searchForm
        const searchType = searchConfig?.save?.type || 'GET'
        const url = searchConfig?.save?.onSave
        const reqConfig = { method: searchType, url: `${window.server}${url}` }
        if (searchType === 'POST') {
            reqConfig.data = JSON.stringify(formData)
        }
        axios(reqConfig).then(res => {
            if (res.data) {
                setResultsData(res.data)
            }
        }).catch(err => {
            console.error(err)
            const title = err.response?.data?.title || err
            const msg = err.response?.data?.message || ''
            alertUser(true, 'error', title, msg)
        })
    }

    return (
        <>
            <div className='animals-search-main-container'>
                <div className='animals-search-form'>
                    {props.configuration && generateForm()}
                </div>
                <div className='animals-search-grid-container'>
                    {generateGrid(resultsData)}
                </div>
            </div>
        </>
    )
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
})

SearchDynamic.contextTypes = {
    intl: PropTypes.object.isRequired,
}

export default connect(mapStateToProps)(SearchDynamic)
