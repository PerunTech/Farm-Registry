import { React, connect, PropTypes, ExportableGrid, ComponentManager, GenericForm, axios, GridManager, elements } from 'perun-core'
const { alertUser } = elements
const { useState, useEffect } = React
import style from "../style/registration.module.css"
import { labelsManager } from '../utils_tools/LabelsExport';
let searchGridId;
const SearchComp = (props, context) => {
  const [formState, setFormState] = useState(undefined)
  const [gridResult, setGridResults] = useState(undefined)
  const [tableName, setTableName] = useState("FARM")
  useEffect(() => {
    if (props.person) {
      setTableName("PERSON")
    }
    return () => {
      ComponentManager.cleanComponentReducerState(searchGridId);
    }
  }, [])


  const showSearchForm = () => {
    let searchForm = (
      <div>
        <GenericForm
          className={`farm-registry-forms ${style["form-SC"]}`}
          params={'READ_URL'}
          key={`${tableName}_SEARCH_FORM`}
          id={`${tableName}_SEARCH_FORM`}
          method={`/ReactElements/getTableSearchJSONSchema/${props.svSession}/${tableName}`}
          uiSchemaConfigMethod={`/ReactElements/getTableUISchema/${props.svSession}/${tableName}`}
          tableFormDataMethod={`/ReactElements/getTableFormData/${props.svSession}/0/${tableName}`}
          addSaveFunction={(e) => assignSearchResultGrid(e)}
          hideBtns={'closeAndDelete'}
        />
      </div>
    );
    return searchForm
  };

  const assignSearchResultGrid = (e) => {
    console.log();
    let formData = e.formData
    if (formData['FULL_NAME']) {
      formData['FULL_NAME'] = formData['FULL_NAME']?.toUpperCase()
    }
    if (formData['NAME']) {
      formData['NAME'] = formData['NAME']?.toUpperCase()
    }
    console.log(formData);

    let url = `${window.server}/ReactElements/searchTable/${props.svSession}/${tableName}/1000`
    axios({
      method: 'post',
      data: formData,
      url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(res => {
      searchResult(res.data)
      setFormState(e.formData)
      ComponentManager.setStateForComponent(`${tableName}_SEARCH_FORM`, null, {
        saveExecuted: false,
      });

    }).catch(err => {
      console.error(err)
      alertUser(true, 'error', err)
      ComponentManager.setStateForComponent(`${tableName}_SEARCH_FORM`, null, {
        saveExecuted: false,
      });
    })

  };

  const searchResult = (data) => {
    //SEARCH CUSTOM BELOW
    let configWs = `/ReactElements/getTableFieldList/${props.svSession}/FARM`
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
        refreshData={() => assignSearchResultGrid(formState)}
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
      {showSearchForm()}
      {gridResult}
    </React.Fragment>
  )
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  farmObjId: state['farm_registry.mapData']?.farmData?.objectId
});

SearchComp.contextTypes = {
  intl: PropTypes.object.isRequired,
};
export default connect(mapStateToProps)(SearchComp);
