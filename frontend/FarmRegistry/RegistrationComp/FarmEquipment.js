import {
  React,
  connect,
  GenericGrid,
  GridManager,
  FormManager,
  Modal,
  axios,
  ComponentManager,
  PropTypes,
} from "perun-core";
import { labelsManager } from "../utils_tools/LabelsExport";
import { logOut } from "../utils_tools/LogOut";

class FarmEquipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animalSingleGroup: false,
      parentId: this.props.farmObjId,
      gridToDisplay: 'FARM_EQUIPMENT',
    };
  }

  componentDidMount() {
    let grid = (
      <GenericGrid
        gridType={"READ_URL"}
        key={this.state.gridToDisplay + "_GRID" + this.state.parentId}
        id={this.state.gridToDisplay + "_GRID" + this.state.parentId}
        configTableName={
          "/ReactElements/getTableFieldList/%session/" +
          this.state.gridToDisplay
        }
        dataTableName={
          "/ReactElements/getObjectsByParentId/%session/" +
          this.state.parentId +
          "/" +
          this.state.gridToDisplay +
          "/100000"
        }
        toggleCustomButton={true}
        customButton={this.addEquipment}
        customButtonLabel={labelsManager.importLabel(
          "add_equipment",
          this.context,
          "farm_registry"
        )}
        heightRatio={0.7}
      />
    );
    this.setState({ equipmentGrid: grid });
    ComponentManager.setStateForComponent(
      this.state.gridToDisplay + "_GRID" + this.state.parentId,
      null,
      {
        customButton: this.addEquipment,
      }
    );
  }

  refreshEquipmentList = () => {
    GridManager.reloadGridData(
      this.state.gridToDisplay + "_GRID" + this.state.parentId
    );
  };

  addEquipment = () => {
    const params = [];
    params.push(
      {
        PARAM_NAME: "formWeWant",
        PARAM_VALUE: this.state.gridToDisplay,
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
        PARAM_VALUE: this.props.svSession,
      },
      {
        PARAM_NAME: "table_name",
        PARAM_VALUE: this.state.gridToDisplay,
      }
    );

    let dataForm = FormManager.generateForm(
      this.state.gridToDisplay + "_FORM" + this.state.parentId,
      this.state.gridToDisplay + "_FORM" + this.state.parentId,
      params,
      "formData",
      "GET_FORM_BUILDER_MAVEN",
      "GET_UISCHEMA_MAVEN",
      "GET_DATA_FROM_FORM_MAVEN",
      null,
      this.saveEquipment,
      "",
      null,
      "form-test",
      null,
      "close",
      null
    );

    this.setState({
      showModal: true,
      stateDataForm: (
        <Modal
          key={this.state.parentId}
          id={this.state.parentId}
          modalTitle={this.context.intl.formatMessage({ id: 'perun.farm_registry.machine_equipment', defaultMessage: 'perun.farm_registry.machine_equipment' })}
          nameSubmitBtn="close"
          closeModal={() => this.closeModalFn()}
          modalContent={dataForm}
        />
      ),
    });
  };

  closeModalFn = () => {
    this.setState({ showModal: false });
  };

  saveEquipment = (e) => {
    let th1s = this;
    let type;
    let restUrl =
      window.server +
      "/ReactElements/createTableRecordFormData/" +
      this.props.svSession +
      "/FARM_EQUIPMENT/" +
      this.state.parentId;
    let form_params = e.formData;
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
            logOut(th1s.props.svSession);
          } else {
            type = response.data.type;
            type = type.toLowerCase();
            th1s.refreshEquipmentList();
          }
        }
      })
      .catch(function (response) {
        alert(response);
      });
    th1s.closeModalFn();
  };

  render() {
    const { equipmentGrid, showModal, stateDataForm } = this.state;
    return (
      <div id="equipmentGrid">
        {equipmentGrid}
        {showModal && stateDataForm}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

FarmEquipment.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FarmEquipment);
