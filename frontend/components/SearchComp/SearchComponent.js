import { React, connect, PropTypes, ExportableGrid, ComponentManager, GenericForm, axios, GridManager, elements, Loading } from 'perun-core'
const { alertUserResponse, alertUserV2 } = elements
const { useState, useEffect } = React
import { labelsManager } from '../utils_tools/LabelsExport';
import SearchFormWrapper from './SearchFormWrapper';
let searchGridId;
const SearchComp = (props, context) => {
  const [gridResult, setGridResults] = useState(undefined)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    return () => {
      ComponentManager.cleanComponentReducerState(searchGridId);
    }
  }, [])

  useEffect(() => {
    if (props?.samlFlag) {
      let url = window.server + `/SvSecurity/getPersonalUserInfo/${props.svSession}/user_info`
      axios.get(url).then(res => {
        if (res.data?.data) {
          const userName = res.data?.data?.['com.prtech.svarog_common.DbDataObject']?.values[2]?.['USER_NAME'] || undefined
          const userGroup = res.data?.data?.['default_user_group']?.['GROUP_SECURITY_TYPE'] || undefined
          if (userGroup === 'POA') {
            let data = {
              "SEARCH_OPTION": "PERSON.ID_NO",
              "SEARCH_VALUES": userName
            }
            searchCurrentUser(data)
          }

        }
      }).catch(err => {
        console.error(err)
      })
    }
  }, [])

  const showSearchForm = () => {
    let configWs = `/WsFarmUtils/getTableSearchJSONSchemaCustom/${props.svSession}/FARM`
    let tableName = "FARM"
    if (props.person) {
      tableName = "PERSON"
      configWs = `/ReactElements/getTableSearchJSONSchema/${props.svSession}/PERSON`
    }
    let searchForm = (
      <div>
        <GenericForm
          className={`farm-registry-forms farm-registry-form-SC`}
          params={'READ_URL'}
          key={`${tableName}_SEARCH_FORM`}
          id={`${tableName}_SEARCH_FORM`}
          method={configWs}
          uiSchemaConfigMethod={`/ReactElements/getTableUISchema/${props.svSession}/${tableName}`}
          tableFormDataMethod={`/ReactElements/getTableFormData/${props.svSession}/0/${tableName}`}
          addSaveFunction={(e) => assignSearchResultGrid(e.formData)}
          customSaveButtonName={labelsManager.importLabel('search', context, 'farm_registry')}
          hideBtns={'closeAndDelete'}
          customSave={true}
          inputWrapper={SearchFormWrapper}
        />
      </div>
    );
    return searchForm
  };
  const searchCurrentUser = (data) => {
    let url = `${window.server}/WsFarmUtils/search-farm-person/sid/${props.svSession}`
    setLoading(true)
    axios({
      method: 'post',
      data: JSON.stringify(data),
      url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(res => {
      setLoading(false)
      if (res?.data) {
        if (res.data.length === 0) {
          alertUserV2({ type: 'info', title: labelsManager.importLabel('no_farm_data', context, 'farm_registry') })
        } else {
          props.onRowClick(null, null, res.data[0])
        }
        searchResult(res.data, data)
      }
    }).catch(err => {
      console.error(err)
      setLoading(false)
      alertUserResponse({ response: err.response?.data })
    })
  }

  const assignSearchResultGrid = (data) => {
    let tableName = "FARM"
    let url = `${window.server}/WsFarmUtils/search-farm-person/sid/${props.svSession}`
    if (props.person) {
      tableName = "PERSON"
      url = `${window.server}/ReactElements/searchTable/${props.svSession}/${tableName}/1000`
    }
    ComponentManager.setStateForComponent(`${tableName}_SEARCH_FORM`, null, {
      saveExecuted: false,
    });
    let formData = data
    if ((!props.person && formData['SEARCH_VALUES'] && formData['SEARCH_OPTION']) || (props.person && formData)) {
      formData['SEARCH_VALUES'] = formData['SEARCH_VALUES']?.toUpperCase()
      if (props.person) {
        if (formData['FULL_NAME']) {
          formData['FULL_NAME'] = formData['FULL_NAME']?.toUpperCase()
        }
        if (formData['NAME']) {
          formData['NAME'] = formData['NAME']?.toUpperCase()
        }
      }
      setLoading(true)
      axios({
        method: 'post',
        data: formData,
        url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(res => {
        setLoading(false)
        if (res?.data) {
          searchResult(res.data, data)
          ComponentManager.setStateForComponent(`${tableName}_SEARCH_FORM`, null, { saveExecuted: false });
        }
      }).catch(err => {
        console.error(err)
        setLoading(false)
        alertUserResponse({
          response: err.response?.data,
          onConfirm: () => ComponentManager.setStateForComponent(`${tableName}_SEARCH_FORM`, null, { saveExecuted: false })
        })
      })
    } else {
      alertUserV2({
        type: 'info',
        title: labelsManager.importLabel('enter_valid_criteria', context, 'farm_registry'),
        onConfirm: () => ComponentManager.setStateForComponent(`${tableName}_SEARCH_FORM`, null, { saveExecuted: false })
      })
    }
  };

  const searchResult = (data, formData) => {
    //SEARCH CUSTOM BELOW
    let configWs = `/farm-registry/getTableFieldListCustom/${props.svSession}/FARM`
    let tableName = "FARM"
    if (props.person) {
      tableName = "PERSON"
      configWs = `/ReactElements/getTableFieldList/${props.svSession}/PERSON`
    }
    ComponentManager.cleanComponentReducerState(searchGridId);
    let dynamic_key = Math.floor(Math.random() * 999999).toString(36)
    searchGridId = tableName + dynamic_key
    let grid = (<div>
      <ExportableGrid
        gridType={"SEARCH_GRID_DATA"}
        key={tableName + dynamic_key}
        id={tableName + dynamic_key}
        configTableName={configWs}
        dataTableName={data}
        onRowClickFunct={props.onRowClick}
        heightRatio={0.50}
        className={"farm-registry-search-grid"}
        refreshData={() => assignSearchResultGrid(formData)}
      />
    </div>)

    ComponentManager.setStateForComponent(tableName + dynamic_key, null, {
      onRowClickFunct: props.onRowClick
    })
    GridManager.reloadGridData(tableName + dynamic_key)

    setGridResults(grid)
  }

  return (
    <React.Fragment>
      {loading && <Loading />}
      {showSearchForm()}
      {gridResult}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  farmObjId: state['farm_registry.mapData']?.farmData?.objectId,
  samlFlag: state.security?.saml
});

SearchComp.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(SearchComp);
