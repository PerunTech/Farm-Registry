import { React, PropTypes, ExportableGrid, connect, redux, elements, axios, GenericForm, ComponentManager, GridManager, createHashHistory } from 'perun-core'
import { labelsManager } from '../utils_tools/LabelsExport';
import { jsonToURI, flattenObject } from '../../utils';
const { alertUser } = elements
const { store, dataToRedux, removeAsyncReducer } = redux
const { useState, useEffect } = React
const hashHistory = createHashHistory()

const SearchDynamic = (props, context) => {
    const tableName = props.tableName?.toUpperCase() || ''
    const gridId = `${props.tableName}_SEARCH`
    const [resultsData, setResultsData] = useState(undefined)
    useEffect(() => {
        performSearch({}, false)
    }, [])

    const generateForm = () => {
        const searchConfig = props.configuration?.searchForm
        return (
            <GenericForm
                className={`sectioned-search-form hide-all-legends`}
                params='FORM_DATA'
                key={gridId + '_FORM'}
                id={gridId + '_FORM'}
                method={searchConfig?.configuration?.onSubmit}
                uiSchemaConfigMethod={searchConfig?.uischema?.onSubmit}
                tableFormDataMethod={searchConfig?.data?.onSubmit}
                hideBtns='closeAndDelete'
                customSave
                addSaveFunction={(e) => {
                    performSearch(e.formData, true)
                }}
                customSaveButtonName={labelsManager.importLabel('search', context, 'farm_registry')}
            />
        )
    }

    const onRowClick = (_id, _idx, row) => {
        const href = `/main/aims/${tableName}/${row[`${tableName}.OBJECT_ID`]}/summary`
        hashHistory.push(href)
    }

    const generateGrid = () => {
        const buttonsArray = []
        const configWs = props.configuration?.configuration?.onSubmit
        return (
            <ExportableGrid
                gridType='SEARCH_GRID_DATA'
                key={gridId + '_GRID'}
                id={gridId + '_GRID'}
                heightRatio={0.8}
                configTableName={configWs}
                dataTableName={resultsData}
                onRowClickFunct={onRowClick}
                className='animals-search-grid'
                buttonsArray={buttonsArray}
            />
        )
    }

    const performSearch = (formData, isForm) => {
        const searchConfig = props.configuration?.searchForm;
        const searchType = searchConfig?.save?.type || 'GET';
        const url = searchConfig?.save?.onSave;
        const reqConfig = { method: searchType, url: `${window.server}${url}` };
        const shouldEncode = props.configuration?.searchForm.save.encode;
        if (searchType === 'POST') {
            reqConfig.data = shouldEncode ? jsonToURI(flattenObject(formData)) : JSON.stringify(formData)
        }

        // Handle form-specific logic
        if (isForm) {
            setResultsData(undefined);
            removeAsyncReducer(store, gridId + '_GRID');
            dataToRedux(null, 'componentIndex', gridId + '_GRID', '');
        }

        axios(reqConfig)
            .then(res => {

                if (res.data?.data && Array.isArray(res.data.data)) {
                    setResultsData(res.data.data)
                    GridManager.reloadGridData(gridId + '_GRID');
                }
            })
            .catch(err => {
                console.error(err);
                const title = err.response?.data?.title || err;
                const msg = err.response?.data?.message || '';
                alertUser(true, 'error', title, msg);

                // Handle form-specific error logic
                if (isForm) {
                    ComponentManager.setStateForComponent(`${gridId}_FORM`, null, {
                        saveExecuted: false,
                    });
                }
            });
    };

    return (
        <>
            <div className='dynamic-search-main-container'>
                <div className='dynamic-search-form'>
                    {props.configuration && generateForm()}
                </div>
                <div className='dynamic-search-grid-container'>
                    {resultsData && generateGrid()}
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
