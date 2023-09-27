import {
  React,
  connect,
  GenericGrid,
  GridManager,
  GenericForm,
  Modal,
  axios,
  ComponentManager,
  PropTypes,
} from "perun-core";
import { Connector } from "persons-registry";
import { labelsManager } from "../utils_tools/LabelsExport";
import { logOut } from "../utils_tools/LogOut";

class FarmMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridToDisplay: this.props.grid,
    };
  }

  componentDidMount() {
    let grid = (
      <GenericGrid
        gridType={"READ_URL"}
        key={this.state.gridToDisplay + "_GRID" + this.props.farmObjId}
        id={this.state.gridToDisplay + "_GRID" + this.props.farmObjId}
        configTableName={
          "/ReactElements/getTableFieldList/%session/" +
          this.state.gridToDisplay
        }
        dataTableName={
          "/ReactElements/getObjectsByParentId/%session/" +
          this.props.farmObjId +
          "/" +
          this.state.gridToDisplay +
          "/100000"
        }
        toggleCustomButton={true}
        customButton={this.addFarmMember}
        customButtonLabel={labelsManager.importLabel(
          "add_agri_holding_member",
          this.context,
          "farm_registry"
        )}
        minHeight={800}
      />
    );
    this.setState({ farmMgrid: grid });
    ComponentManager.setStateForComponent(
      this.state.gridToDisplay + "_GRID" + this.props.farmObjId,
      null,
      {
        customButton: this.addFarmMember,
      }
    );
  }

  makeField = () => {
    let field = document.getElementById("root_PERSON_OBJECT_ID");
    if (field) field.onclick = this.getPersonId;
  };

  getPersonId = () => {
    this.setState({
      conncterComp: (
        <Connector
          tableName="PHYSICAL_ENTITY"
          persRegConnRowClickFn={this.onRowClickWithModalSearch}
          closeConnector={this.closeModal2Fn}
        />
      ),
    });
  };

  onRowClickWithModalSearch = (rowid, index, row) => {
    this.setState({ selectedPersonRow: row });
    this.setState(
      { formSearch: row["PHYSICAL_ENTITY.FIRST_NAME"], submitModalForm: true },
      () => {
        this.setState({
          personId: row["PHYSICAL_ENTITY.OBJECT_ID"],
          fullName:
            row["PHYSICAL_ENTITY.FIRST_NAME"] +
            " " +
            row["PHYSICAL_ENTITY.LAST_NAME"],
        });
        document.getElementById("root_FULL_NAME").placeholder =
          row["PHYSICAL_ENTITY.FIRST_NAME"] +
          " " +
          row["PHYSICAL_ENTITY.LAST_NAME"];
        document.getElementById("root_PERSON_OBJECT_ID").placeholder =
          row["PHYSICAL_ENTITY.OBJECT_ID"];
        this.closeModal2Fn(row["PHYSICAL_ENTITY.OBJECT_ID"]);
      }
    );
  };

  refreshFarmMemberList = () => {
    GridManager.reloadGridData(
      this.state.gridToDisplay + "_GRID" + this.props.farmObjId
    );
  };

  addFarmMember = () => {
    let dataForm = (
      <GenericForm
      className={'farm-registry-forms form-test'}
        params={"READ_URL"}
        key={this.state.gridToDisplay}
        id={this.state.gridToDisplay}
        method={"/ReactElements/getTableJSONSchema/%session/FARM_MEMBERS"}
        uiSchemaConfigMethod={
          "/ReactElements/getTableUISchema/%session/FARM_MEMBERS"
        }
        tableFormDataMethod={
          "/ReactElements/getTableFormData/%session/0/FARM_MEMBERS"
        }
        addSaveFunction={(e) => this.saveFarmMember(e)}
        hideBtns={"closeAndDelete"}
        addCustomFunction={""}
      />
    );

    this.setState({
      stateDataForm: (
        <Modal
          onMouseEnterFunction={this.makeField}
          key={this.props.farmObjId}
          id={this.props.farmObjId}
          modalTitle={labelsManager.importLabel(
            "agri_members",
            this.context,
            "farm_registry"
          )}
          nameSubmitBtn="close"
          closeModal={() => this.closeModalFn()}
          modalContent={dataForm}
        />
      ),
    });
  };

  closeModalFn = () => {
    this.setState({ stateDataForm: false });
  };

  closeModal2Fn = (memberObjId) => {
    if (memberObjId) {
      this.setState({ memberObjId: memberObjId });
    }
    this.setState({ conncterComp: false });
  };

  saveFarmMember = (e) => {
    let th1s = this;
    let form_params = e.formData;
    let type;
    let restUrl =
      window.server +
      "/WsRegistration/saveFarmMembers/" +
      th1s.props.svSession +
      "/" +
      th1s.props.farmObjId;
    if (form_params) {
      form_params.FULL_NAME = th1s.state.fullName;
      form_params.PERSON_OBJECT_ID = th1s.state.personId;
    }
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
            th1s.refreshFarmMemberList();
          }
        }
      })
      .catch(function (response) {
        alert(response);
      });
    th1s.closeModalFn();
  };

  render() {
    const { farmMgrid, stateDataForm, conncterComp } = this.state;
    return (
      <div>
        <div id="farmMembersGrid">
          {stateDataForm}
          {conncterComp}
          {farmMgrid}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

FarmMember.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FarmMember);
