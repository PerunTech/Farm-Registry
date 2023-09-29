import {
  React,
  connect,
  GenericGrid,
  elements,
  ComponentManager,
  createHashHistory,
  Form,
  PropTypes,
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
    let gridId = "SEARCH_FARMER";
    if (formParams.formData.dropDownVal && formParams.formData.inputVal) {
      let dropdownValue = formParams.formData.dropDownVal;
      let fieldValue = formParams.formData.inputVal;
      let randomKey = (
        +new Date() + Math.floor(Math.random() * 999999)
      ).toString(36);
      if (fieldValue.length > 3) {
        if (dropdownValue == "FULL_NAME") {
          searchGridId = gridId + "_GRID" + randomKey;
          let gridResult = (
            <GenericGrid
              gridType={"READ_URL"}
              key={searchGridId}
              id={searchGridId}
              configTableName={"/farmer/searchFarmerFieldList/%session"}
              dataTableName={
                "/farmer/searchFarmer/%session/" +
                dropdownValue +
                "/" +
                fieldValue
              }
              onRowClickFunct={this.props.onRowClick}
              defaultHeight={false}
              heightRatio={0.6}
              className={"iacs-claim-grid"}
            />
          );
          ComponentManager.setStateForComponent(
            gridId + "_GRID" + randomKey,
            null,
            {
              onRowClickFunct: this.props.onRowClick,
            }
          );
          this.setState({ gridResult });
        }

        else if (
          (dropdownValue === "FIC" && fieldValue.length <= 11) ||
          (dropdownValue === "ID_NO" && fieldValue.length <= 13) ||
          (dropdownValue === "TAX_NO" && fieldValue.length <= 13)
        ) {
          let regExp = /^[0-9]*$/;

          if (!regExp.test(fieldValue)) {
            alertUser(
              true,
              "info",
              this.context.intl.formatMessage({ id: 'perun.farm_registry.info', defaultMessage: 'perun.farm_registry.info' }),
              this.context.intl.formatMessage({ id: 'perun.farm_registry.only_num_val', defaultMessage: 'perun.farm_registry.only_num_val' })
            )
          } else {
            searchGridId = gridId + "_GRID" + randomKey;
            let gridResult = (
              <GenericGrid
                gridType={"READ_URL"}
                key={searchGridId}
                id={searchGridId}
                configTableName={"/farmer/searchFarmerFieldList/%session"}
                dataTableName={
                  "/farmer/searchFarmer/%session/" +
                  dropdownValue +
                  "/" +
                  fieldValue
                }
                onRowClickFunct={this.props.onRowClick}
                defaultHeight={false}
                heightRatio={0.6}
                className={"iacs-claim-grid"}
              />
            );
            ComponentManager.setStateForComponent(
              gridId + "_GRID" + randomKey,
              null,
              {
                onRowClickFunct: this.props.onRowClick,
              }
            );
            this.setState({ gridResult });
          }
        } else {
          alertUser(
            true,
            "info",
            this.context.intl.formatMessage({ id: 'perun.farm_registry.info', defaultMessage: 'perun.farm_registry.info' }),
            this.context.intl.formatMessage({ id: 'perun.farm_registry.character_limit_exceeded', defaultMessage: 'perun.farm_registry.character_limit_exceeded' })
          )
        }
      } else {
        alertUser(
          true,
          "info",
          labelsManager.importLabel("info", this.context, "farm_registry"),
          labelsManager.importLabel(
            "please_enter_characters",
            this.context,
            "farm_registry"
          )
        );
      }
    } else {
      alertUser(
        true,
        "info",
        labelsManager.importLabel("info", this.context, "farm_registry"),
        labelsManager.importLabel(
          "please_fill_empty_fields",
          this.context,
          "farm_registry"
        )
      );
    }
  };

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
