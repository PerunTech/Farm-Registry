import {
  React,
  connect,
  GenericGrid,
  elements,
  ComponentManager,
  createHashHistory,
  Form,
  PropTypes,
  GridManager,
  axios
} from "perun-core";
const { alertUser } = elements;
import { jsonData } from "./SearchFormJson";
import { labelsManager } from "../utils_tools/LabelsExport";
import style from "../style/registration.module.css";
let searchGridId;

class AdminComopnent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formId: this.props.formId,
      formState: {}
    };
    this.hashHistory = createHashHistory();
  }

  componentDidMount() {
    this.showSearchForm();
  }
  componentWillUnmount() {
    ComponentManager.cleanComponentReducerState(searchGridId);
  }

  showSearchForm = () => {
    let searchForm;
    let uischema = jsonData(this.context).uischema;
    let JSONSchema = jsonData(this.context).JSONSchema;
    searchForm = (
      <Form
        schema={JSONSchema}
        uiSchema={uischema}
        onSubmit={this.assignSearchResultGrid}
        className={`farm-registry-forms ${style["form-SC"]}`}
      >
        <div id="btnSeparator" style={{ width: "auto", float: "right" }}>
          <button
            id="submit_btn"
            type="submit"
            className={"btn-success btn_save_form"}
          >
            {" "}
            {labelsManager.importLabel(
              "search",
              this.context,
              "farm_registry"
            )}{" "}
          </button>
        </div>
      </Form>
    );
    this.setState({ showSearchForm: searchForm });
  };

  assignSearchResultGrid = (formParams) => {
    let formData = {}
    let tableName
    if (this.props.person) {
      if (formParams.formData['FULL_NAME']) {
        formData['NAME'] = formParams.formData['FULL_NAME']?.toUpperCase()
      }
      if (formParams.formData['FIC']) {
        formData['ID_NO'] = formParams.formData['FIC']
      }

      tableName = 'PERSON'
    } else {
      formData = formParams.formData
      formData['FULL_NAME'] = formData['FULL_NAME']?.toUpperCase()
      tableName = 'FARM'
    }

    let url = `${window.server}/ReactElements/searchTable/${this.props.svSession}/${tableName}/1000`
    axios({
      method: 'post',
      data: formData,
      url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(res => {
      this.searchResult(res.data)
      this.setState({ formState: formParams })
    }).catch(err => {
      console.error(err)
      alertUser(true, 'error', err)
    })

  };

  searchResult = (data) => {
    let tableName = 'FARM'
    if (this.props.person) {
      tableName = 'PERSON'
    }
    ComponentManager.cleanComponentReducerState(searchGridId);
    let dynamic_key = Math.floor(Math.random() * 999999).toString(36)
    let gridId = tableName
    searchGridId = gridId + dynamic_key
    let grid = <GenericGrid
      gridType={'SEARCH_GRID_DATA'}
      key={gridId + dynamic_key}
      id={gridId + dynamic_key}
      configTableName={"/ReactElements/getTableFieldList/%session/" + gridId}
      dataTableName={data}
      onRowClickFunct={this.props.onRowClick}
      heightRatio={0.48}
      className={"farm-registry-search-grid"}
      refreshData={() => this.assignSearchResultGrid(this.state.formState)}
    />

    ComponentManager.setStateForComponent(gridId + dynamic_key, null, {
      onRowClickFunct: this.props.onRowClick
    })
    GridManager.reloadGridData(gridId + dynamic_key)

    this.setState({ gridResult: grid })
  }

  render() {
    const { showSearchForm, gridResult } = this.state;
    return (
      <React.Fragment>
        {showSearchForm}
        {gridResult}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

AdminComopnent.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AdminComopnent);
