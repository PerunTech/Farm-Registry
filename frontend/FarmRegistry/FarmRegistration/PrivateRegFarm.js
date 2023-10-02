import {
  React,
  connect,
  GenericGrid,
  GenericForm,
  axios,
  elements,
  PropTypes,
  Modal,
  GridManager,
  ComponentManager
} from "perun-core";
import "./privateRegForm.css";
import { labelsManager } from "../utils_tools/LabelsExport";
import { logOut } from "../utils_tools/LogOut";

const { alertUser } = elements;
const dynamicKey = function () {
  return (+ new Date() + Math.floor(Math.random() * 999999)).toString(36)
}

class PrivateRegFarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showForm: false,
      showEditModal: false,
      modalDataGrid: null,
      modalContent: []
    };
  }

  componentDidMount() {
    this.displayRegForm();
  }

  onRowClickWithModalSearch = (_gridId, _rowId, row) => {
    this.setState({ selectedPersonRow: row });
    this.setState(
      { formSearch: row["PERSON.NAME"], submitModalForm: true },
      () => {
        this.setState({
          personId: row["PERSON.OBJECT_ID"],
          fullName: row["PERSON.NAME"],
          showEditModal: '',
          modalContent: []
        });
        document.getElementById("root_FULL_NAME").placeholder =
          row["PERSON.NAME"];
        document.getElementById("root_PERSON_OBJECT_ID").placeholder =
          row["PERSON.OBJECT_ID"];
      }
    );
  };

  /* saveForm function, url should be recieved via fn param */
  saveRegForm = (e) => {
    let form_params = e.formData;
    if (form_params) {
      form_params.FULL_NAME = this.state.fullName;
      form_params.PERSON_OBJECT_ID = this.state.personId;
    }

    const th1s = this;
    let type;

    let restUrl =
      window.server + "/WsRegistration/saveFarm/" + th1s.props.svSession;
    axios({
      method: "post",
      data: form_params,
      url: restUrl,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then(response => {
        if (response.data) {
          alertUser(true, response.data.type.toLowerCase(), response.data.title, response.data.message)
          this.props.parentCallBackFunc(th1s.state.personId);
          this.setState({ dataForm: "" })
          ComponentManager.setStateForComponent(`FARM_G`, null, {
            saveExecuted: false,
          });
          this.props.showSearch()
        }
      })
      .catch(function (response) {
        if (response.data) {
          type = response.data.type;
          type = type.toLowerCase();
          th1s.setState({
            alert: alertUser(true, "success", this.context.intl.formatMessage({ id: 'perun.farm_registry.saved_success', defaultMessage: 'perun.farm_registry.saved_success' }), null, () =>
              th1s.setState({ dataForm: "" })
            ),
          });
        }
      });
  };

  displayRegForm = () => {
    let dataForm = (
      <div onMouseEnter={this.makeField}>
        <GenericForm
          params={"READ_URL"}
          key={"FARM_G"}
          id={"FARM_G"}
          method={"/ReactElements/getTableJSONSchema/%session/FARM"}
          uiSchemaConfigMethod={"/ReactElements/getTableUISchema/%session/FARM"}
          tableFormDataMethod={"/ReactElements/getTableFormData/%session/0/FARM"}
          addSaveFunction={(e) => this.saveRegForm(e)}
          hideBtns={"closeAndDelete"}
          addCustomFunction={""}
          className={'farm-registry-forms form-test'}
        />
      </div>
    );
    this.setState({ dataForm: dataForm, showForm: true });
  };

  makeField = () => {
    let field = document.getElementById("root_PERSON_OBJECT_ID");
    if (field) {
      if (field.placeholder === "") {
        field.placeholder = labelsManager.importLabel(
          "press_to_choose_submitter",
          this.context,
          "farm_registry"
        );
      }
    }
    field.onclick = this.getPersonId;
  };

  getPersonId = () => {
    let formId = 'PERSON'
    let modalContent = <GenericForm
      params={'READ_URL'}
      key={formId + 'search'}
      id={formId + 'search'}
      method={'/ReactElements/getTableSearchJSONSchema/%session/' + formId}
      uiSchemaConfigMethod={'/ReactElements/getTableUISchema/%session/' + formId}
      tableFormDataMethod={'/ReactElements/getTableFormData/%session/0/' + formId}
      addSaveFunction={this.searchComponentCallbackFromForm}
      hideBtns={'closeAndDelete'}
      customSave={true}
      customSaveButtonName={this.context.intl.formatMessage({ id: 'perun.farm_registry.search', defaultMessage: 'perun.farm_registry.search' })}
      className={'form-test farm-registry-forms'}
    />
    this.prepareModalData(modalContent, 'personForm')
  };

  prepareModalData = (renderContent, caseToRender) => {
    let arr = this.state.modalContent
    if (caseToRender === 'personForm') {
      let initialRender = <div>{renderContent}</div>
      this.setState({ modalContent: [...this.state.modalContent, initialRender] }, () => { this.generateModal(this.state.modalContent) })
    } else if (caseToRender === 'renderSearchResults') {
      let secondRender = <div>{renderContent}</div>
      arr.splice(1, 2, secondRender)
      this.setState({ modalContent: [...arr] }, () => { this.generateModal(this.state.modalContent) })
    }
  }

  generateModal = (dataArr) => {
    this.setState({
      showEditModal:
        <Modal
          key={'connection'}
          modalTitle={this.context.intl.formatMessage({ id: 'perun.ipardSpa.connect', defaultMessage: 'perun.ipardSpa.connect' })}
          closeModal={() => this.closeModal('closeCreateConnection')}
          modalContent={dataArr} />
    })
  }

  searchComponentCallbackFromForm = (formData, form) => {
    const { svSession } = this.props
    this.searchComponent(formData, form, this.callBack, svSession)
  }

  searchComponent(formData, form, callback, session) {
    var form_params
    if (formData.formData) {
      form_params = formData.formData
      if (form_params["NAME"] && form_params["NAME"].length > 0) {
        let dataTmp = form_params["NAME"]?.toUpperCase()
        form_params["NAME"] = dataTmp + "%25"
      }
      if (form_params["ID_NO"] && form_params["ID_NO"].length > 0) {
        let dataTmp = form_params["ID_NO"]
        form_params["ID_NO"] = dataTmp.trim()
      }
      if (form_params["TAX_NO"] && form_params["TAX_NO"].length > 0) {
        let dataTmp = form_params["TAX_NO"]
        form_params["TAX_NO"] = dataTmp.trim()
      }
    }

    var isUndefined = Object.keys(form_params).reduce((res, k) => res && !(!!form_params[k] || form_params[k] === false || !isNaN(parseInt(form_params[k]))), true)

    if (isUndefined === false) {
      let restUrl = `${window.server}/ReactElements/searchTable/${session}/PERSON/1000`
      axios({
        method: "post",
        data: form_params,
        url: restUrl,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      })
        .then(function (response) {
          if (response.data) {
            if (
              response.data.type === "ERROR" &&
              response.data.title === "Невалидна сесија"
            ) {
              alertUser(
                true,
                response.data.type.toLowerCase(),
                response.data.title,
                response.data.message
              );
              logOut(session);
            } else {
              callback(response.data)
            }
          }
        })
        .catch(function (error) {
          if (error.data) {
            alertUser(true, error.type.toLowerCase(), error.message, error.message)
          }
        });
    } else {
      callback('inside_error')
    }
  }

  callBack = (res) => {
    if (res !== 'inside_error') {
      let gridId = 'PERSON' + '_' + dynamicKey()
      let grid = <GenericGrid
        gridType={'SEARCH_GRID_DATA'}
        key={gridId}
        id={gridId}
        configTableName={"/ReactElements/getTableFieldList/%session/PERSON"}
        dataTableName={res}
        onRowClickFunct={this.onRowClickWithModalSearch}
      />

      ComponentManager.setStateForComponent(gridId, null, {
        onRowClickFunct: this.onRowClickWithModalSearch
      })

      GridManager.reloadGridData(gridId)

      this.prepareModalData(grid, 'renderSearchResults')
    }
  }

  closeModal = () => {
    this.setState({ showEditModal: '', modalContent: [] });
  };

  handleSubmit = (event) => {
    let dropdown = event.formData.DATA_TYPE;
    let searchInput = event.formData.DATA_INPUT;

    this.setState({
      modalDataGrid: (
        <div className="gridContainer">
          <GenericGrid
            gridType={"READ_URL"}
            key={`PERSON${dropdown}${searchInput}_GRID`}
            id={`PERSON${dropdown}${searchInput}_GRID`}
            configTableName={`/ReactElements/getTableFieldList/%session/PERSON`}
            dataTableName={`/ReactElements/getTableWithLike/%session/PERSON/${dropdown}/${searchInput}/100/1`}
            onRowClickFunct={this.onRowClickWithModalSearch}
          />
        </div>
      ),
    });
  };

  render() {
    const { dataForm, showEditModal, modalDataGrid } =
      this.state;
    return (
      <React.Fragment>
        <div className="formContainer">
          {modalDataGrid}
        </div>
        {dataForm}
        {showEditModal}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

PrivateRegFarm.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(PrivateRegFarm);
