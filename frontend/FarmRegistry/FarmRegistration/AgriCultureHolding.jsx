import {
  React,
  connect,
  GenericGrid,
  FormManager,
  PropTypes,
  ComponentManager,
  redux,
  createHashHistory,
} from "perun-core";
const { store, lastSelectedItem } = redux;
const history = createHashHistory();
// CSS
import style from "../style/registration.module.css";
import { iconManager } from "../../assets/svgHolder";
// Components
import Animal from "../RegistrationComp/Animal";
import Lpis from "../RegistrationComp/Lpis";
import Bank from "../RegistrationComp/Bank";
import AddDocuments from "../RegistrationComp/AddDocuments";
import FarmMembers from "../RegistrationComp/FarmMembers";
import TransitionToSubmission from "./TransitionToSubmission";
// Label Manager
import { labelsManager } from "../utils_tools/LabelsExport";

class AgriCultureHolding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showGrid: false,
      formContainer: "",
      showSearchForm: true,
      fieldName: "0",
      showRegList: false,
      bankAcc: false,
      dataForm: false,
    };
  }

  displaySearchForm = () => {
    this.setState({
      showCapacities: false,
      componentAddReg: "",
      showSearchForm: true,
      dataForm: false,
      showRegList: false,
      showGrid: false,
    });
  };

  displayGridFarmer = (e) => {
    store.dispatch({ type: "RESET_FR_MAP_DATA" });
    let fieldName = this.state.fieldName;
    let fieldValue = this.state.fieldValue;

    if (
      fieldName === "FIC" ||
      fieldName === "ID_NO" ||
      fieldName === "TAX_NO"
    ) {
      if (fieldValue.length < 11) {
        return alert("min 11");
      }
    }

    const gridFarmerId = "FARM";
    let grid;

    if (fieldName === "FULL_NAME") {
      fieldValue = fieldValue.toUpperCase();
      grid = (
        <GenericGrid
          gridType={"READ_URL"}
          key={gridFarmerId + fieldName + fieldValue + "_GRID"}
          id={gridFarmerId + fieldName + fieldValue + "_GRID"}
          configTableName={"/ReactElements/getTableFieldList/%session/FARM"}
          dataTableName={
            "/ReactElements/getTableWithLike/%session/FARM/" +
            fieldName +
            "/" +
            fieldValue +
            "/100000"
          }
          onRowClickFunct={this.onRowClick}
          minHeight={600}
        />
      );

      const gridId = gridFarmerId + fieldName + fieldValue + "_GRID";

      ComponentManager.setStateForComponent(gridId, null, {
        onRowClickFunct: this.onRowClick,
        rowClicked: undefined,
      });
    } else {
      grid = (
        <GenericGrid
          gridType={"READ_URL"}
          key={gridFarmerId + fieldName + fieldValue + "_GRID"}
          id={gridFarmerId + fieldName + fieldValue + "_GRID"}
          configTableName={"/ReactElements/getTableFieldList/%session/FARM"}
          dataTableName={
            "/ReactElements/getTableWithFilter/%session/FARM/" +
            fieldName +
            "/" +
            fieldValue +
            "/100000"
          }
          onRowClickFunct={this.onRowClick}
          minHeight={700}
        />
      );

      const gridId = gridFarmerId + fieldName + fieldValue + "_GRID";

      ComponentManager.setStateForComponent(gridId, null, {
        onRowClickFunct: this.onRowClick,
        rowClicked: undefined,
      });
    }
    this.setState({
      dataHolder: grid,
      showGrid: true,
      dataForm: false,
    });
  };

  displayGridFarmers = () => {
    store.dispatch({ type: "RESET_FR_MAP_DATA" });
    let grid;
    const gridFarmerId = "FARM_GRID";
    const gridId = gridFarmerId + "_GRID";

    grid = (
      <GenericGrid
        gridType={"READ_URL"}
        key={gridFarmerId + "_GRID"}
        id={gridFarmerId + "_GRID"}
        configTableName={"/ReactElements/getTableFieldList/%session/FARM"}
        dataTableName={"/ReactElements/getTableData/%session/FARM" + "/100000"}
        onRowClickFunct={this.onRowClick}
        minHeight={700}
      />
    );

    ComponentManager.setStateForComponent(gridId, null, {
      onRowClickFunct: this.onRowClick,
      rowClicked: undefined,
    });

    this.setState({
      dataHolder: grid,
      showGrid: true,
      dataForm: false,
    });
  };

  onRowClick = (rowId, rowPosition, rowsData) => {
    const farmObjId = rowsData["FARM.OBJECT_ID"];
    const personObjId = rowsData["FARM.PERSON_OBJECT_ID"];
    store.dispatch({ type: "GET_FR_MAP_DATA", payload: farmObjId });
    this.setState({
      showCapacities: true,
      farmObjId,
      personObjId,
      allFarmData: rowsData,
    });
  };

  displayRegForm = (formId) => {
    const params = [];
    params.push(
      {
        PARAM_NAME: "formWeWant",
        PARAM_VALUE: formId,
      },
      {
        PARAM_NAME: "object_id",
        PARAM_VALUE: "0",
      },
      {
        PARAM_NAME: "parent_id",
        PARAM_VALUE: "0",
      },
      {
        PARAM_NAME: "session",
        PARAM_VALUE: this.state.svSession,
      },
      {
        PARAM_NAME: "table_name",
        PARAM_VALUE: formId,
      }
    );

    let dataForm = FormManager.generateForm(
      formId,
      formId,
      params,
      "formData",
      "GET_FORM_BUILDER_MAVEN",
      "GET_UISCHEMA_MAVEN",
      "GET_DATA_FROM_FORM_MAVEN",
      null,
      null,
      null,
      null,
      "form-test",
      null,
      "close",
      null
    );
    this.setState({
      dataForm: dataForm,
      dataForm: true,
      showGrid: false,
      showSearchForm: false,
      formKey: formId,
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  displaylistReg = () => {
    if (!this.state.showRegList) {
      this.displayRegForm("FARM");
    }
    this.setState({ showRegList: !this.state.showRegList });
  };

  getPersonId = (personObj) => {
    console.log(personObj);
    this.setState({ personObj: personObj });
  };

  /* display diff comp. that is part of the registration process f.r */
  displayComponent = (component) => {
    let componentAddReg;
    switch (component) {
      case "AHV_HOLDING":
        componentAddReg = (
          <Animal farmObjId={this.state.farmObjId} grid={component} />
        );
        break;
      case "LPIS":
        componentAddReg = <Lpis farmObjId={this.state.farmObjId} />;
        break;
      case "BANKACC":
        componentAddReg = (
          <Bank
            personObjId={this.state.personObj}
            farmObjId={this.state.farmObjId}
            grid={component}
          />
        );
        break;
      case "FARM_MEMBERS":
        componentAddReg = (
          <FarmMembers
            farmObjId={this.state.farmObjId}
            personObjId={this.state.personObj}
            grid={component}
          />
        );
        break;
      case "DOCS":
        componentAddReg = <AddDocuments key="addDoc" />;
        break;
      case "SUBMISSION":
        componentAddReg = <TransitionToSubmission key="submission" />;
        break;
      case "FRMAP":
        componentAddReg = history.push("/main/farm-registry/map");
        break;
      default:
        console.log("default");
    }
    this.setState({
      componentAddReg: componentAddReg,
      showGrid: false,
      showSearchForm: false,
    });
  };

  render() {
    const {
      dataHolder,
      showGrid,
      formKey,
      componentAddReg,
      showSearchForm,
      fieldName,
      dataForm,
      showCapacities,
    } = this.state;
    return (
      <div className={`${style["registrationHolder"]}`} id="registrationHolder">
        <div className={`${style["listButton"]}`} id="listButton">
          <div className={`${style["btnHolder"]}`}>
            <button
              className={`${style["btn_reg"]} ${style["btn_text_start"]}`}
              onClick={this.displaySearchForm}
            >
              {iconManager.getIcon("show")}
              {labelsManager.importLabel(
                "show_holding",
                this.context,
                "farm_registry"
              )}
            </button>
            {showCapacities && (
              <div
                className={`${style["registrationbtnCapacitiesHolder"]}`}
                id="btnCapacities"
              >
                <button
                  className={`${style["btn_sub"]}`}
                  onClick={() => this.displayComponent("BANKACC")}
                >
                  {iconManager.getIcon("bankAccount")}
                  {labelsManager.importLabel(
                    "bank_acc",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={`${style["btn_sub"]}`}
                  onClick={() => this.displayComponent("FARM_MEMBERS")}
                >
                  {iconManager.getIcon("group")}
                  {labelsManager.importLabel(
                    "agri_members",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={`${style["btn_sub"]}`}
                  onClick={() => this.displayComponent("AHV_HOLDING")}
                >
                  {iconManager.getIcon("animal")}
                  {labelsManager.importLabel(
                    "livestock",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={`${style["btn_sub"]}`}
                  onClick={() => this.displayComponent("LPIS")}
                >
                  {iconManager.getIcon("parcel")}
                  {labelsManager.importLabel(
                    "parcels",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={`${style["btn_sub"]}`}
                  onClick={() => this.displayComponent("FRMAP")}
                >
                  {iconManager.getIcon("parcel")}
                  {labelsManager.importLabel(
                    "lpis_map",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={`${style["btn_sub"]}`}
                  onClick={() => this.displayComponent("DOCS")}
                >
                  {iconManager.getIcon("docs")}
                  {labelsManager.importLabel(
                    "docs",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={`${style["btn_sub"]}`}
                  onClick={() => this.displayComponent("SUBMISSION")}
                >
                  {iconManager.getIcon("docs")}
                  {labelsManager.importLabel(
                    "submission",
                    this.context,
                    "farm_registry"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={`${style["gridHolder"]}`} id="gridHolder">
          {showSearchForm && (
            <div id="searchForm" className={`${style["searchForm"]}`}>
              <select
                value={fieldName}
                onChange={this.onChange}
                className={`${style["distanceBetweenElements"]}`}
                name="farmersfields"
                id="fieldName"
              >
                <option disabled value="0">
                  {labelsManager.importLabel(
                    "choose_val",
                    this.context,
                    "farm_registry"
                  )}
                </option>
                <option value="FIC">
                  {labelsManager.importLabel(
                    "fic",
                    this.context,
                    "farm_registry"
                  )}
                </option>
                <option value="FULL_NAME">
                  {labelsManager.importLabel(
                    "full_name",
                    this.context,
                    "farm_registry"
                  )}
                </option>
              </select>
              <input
                onChange={this.onChange}
                className={`${style["distanceBetweenElements"]}`}
                id="fieldValue"
                placeholder={labelsManager.importLabel(
                  "enter_val",
                  this.context,
                  "farm_registry"
                )}
              />
              <button
                style={{ width: "13vh" }}
                className={`${style["btn_reg_right"]}`}
                onClick={this.displayGridFarmer}
              >
                {iconManager.getIcon("search")}
                {labelsManager.importLabel(
                  "search",
                  this.context,
                  "farm_registry"
                )}
              </button>
              <button
                className={`${style["btn_reg_right"]}`}
                onClick={this.displayGridFarmers}
              >
                {iconManager.getIcon("show_all")}
                {labelsManager.importLabel(
                  "show_all_agri",
                  this.context,
                  "farm_registry"
                )}
              </button>
            </div>
          )}
          <div id="dataHolder" className={`${style["dataHolder"]}`}>
            {showGrid && dataHolder}
            {componentAddReg}
            {dataForm && (
              <div
                key={formKey}
                id="createRegForm"
                className={`${style["createFormHolder"]}`}
              >
                {dataForm}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

AgriCultureHolding.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AgriCultureHolding);
