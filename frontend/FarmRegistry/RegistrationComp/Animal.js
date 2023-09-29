import {
  React,
  connect,
  GenericGrid,
  GridManager,
  Modal,
  ComponentManager,
  PropTypes,
} from "perun-core";
import style from "../style/registration.module.css";
import { labelsManager } from "../utils_tools/LabelsExport";

class Animal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animalSingleGroup: false,
      parentId: this.props.farmObjId,
      gridToDisplay: this.props.grid,
    };
  }

  componentDidMount() {
    this.holdings();
  }

  holdings = () => {
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
          "/1000"
        }
        onRowClickFunct={this.animalSingleGroup}
        toggleCustomButton={true}
        customButton={this.refreshAnimalList}
        customButtonLabel={labelsManager.importLabel(
          "refresh_data",
          this.context,
          "farm_registry"
        )}
        minHeight={750}
      />
    );

    let gridFarmerId = this.state.gridToDisplay + "_GRID" + this.state.parentId;
    ComponentManager.setStateForComponent(gridFarmerId, null, {
      onRowClickFunct: this.animalSingleGroup,
    });

    let livestockButton = (
      <div className={`${style["livestockButtonHolder"]}`}>
        <button
          onClick={() => this.groupAnimal(false, "GROUP", true)}
          className={`${style["livestock_btn_reg"]}`}
        >
          {" "}
          {labelsManager.importLabel(
            "show_animal_group",
            this.context,
            "farm_registry"
          )}{" "}
        </button>
        <button
          onClick={() => this.singleAnimal(false, "SINGLE", true)}
          className={`${style["livestock_btn_reg"]}`}
        >
          {" "}
          {labelsManager.importLabel(
            "show_livestock",
            this.context,
            "farm_registry"
          )}{" "}
        </button>
      </div>
    );
    this.setState({ liveStockGrid: grid, livestockButton: livestockButton });
  };

  singleAnimal = (ahvObjid, tableName, allHoldingsData) => {
    let parent_id = 0;
    if (ahvObjid) {
      parent_id = ahvObjid;
    }
    let url =
      "/ReactElements/getObjectsByParentId/%session/" +
      parent_id +
      "/" +
      tableName +
      "/1000";
    if (allHoldingsData) {
      url =
        "/WsFarmUtils/getAnimals/%session/" +
        tableName +
        "/" +
        this.props.farmObjId +
        "/1000";
    }

    let grid = (
      <GenericGrid
        gridType={"READ_URL"}
        key={tableName + "_GRID" + parent_id + this.props.farmObjId}
        id={tableName + "_GRID" + parent_id + this.props.farmObjId}
        configTableName={
          "/ReactElements/getTableFieldList/%session/AHV_SINGLE_ANIMAL"
        }
        dataTableName={url}
        minHeight={650}
      />
    );

    if (!allHoldingsData) return grid;

    this.setState({
      showModal: true,
      stateDataForm: (
        <Modal
          key={tableName + this.props.farmObjId}
          id={tableName + this.props.farmObjId}
          modalTitle={"Групен добиток"}
          nameSubmitBtn="close"
          closeModal={() => this.closeModalFn()}
          modalContent={grid}
        />
      ),
    });
  };

  groupAnimal = (ahvObjid, tableName, allHoldingsData) => {
    let parent_id = 0;
    if (ahvObjid) {
      parent_id = ahvObjid;
    }
    let url =
      "/ReactElements/getObjectsByParentId/%session/" +
      parent_id +
      "/" +
      tableName +
      "/1000";
    if (allHoldingsData) {
      url =
        "/WsFarmUtils/getAnimals/%session/" +
        tableName +
        "/" +
        this.props.farmObjId +
        "/1000";
    }

    let grid = (
      <GenericGrid
        gridType={"READ_URL"}
        key={tableName + "_GRID" + parent_id + this.props.farmObjId}
        id={tableName + "_GRID" + parent_id + this.props.farmObjId}
        configTableName={
          "/ReactElements/getTableFieldList/%session/AHV_ANIMAL_GROUP"
        }
        dataTableName={url}
        minHeight={650}
      />
    );

    if (!allHoldingsData) return grid;

    this.setState({
      showModal: true,
      stateDataForm: (
        <Modal
          key={tableName + this.props.farmObjId}
          id={tableName + this.props.farmObjId}
          modalTitle={labelsManager.importLabel(
            "group_livestock",
            this.context,
            "farm_registry"
          )}
          nameSubmitBtn="close"
          closeModal={() => this.closeModalFn()}
          modalContent={grid}
        />
      ),
    });
  };

  animalSingleGroup = (gridId, rowId, row) => {
    let singleAnimal = this.singleAnimal(
      row["AHV_HOLDING.OBJECT_ID"],
      "AHV_SINGLE_ANIMAL"
    );
    let groupAnimal = this.groupAnimal(
      row["AHV_HOLDING.OBJECT_ID"],
      "AHV_ANIMAL_GROUP"
    );

    const divHolder = (
      <div id="holder" className={`${style["animalSingleGroup"]}`}>
        <div id="grid1">
          <label>Добиток</label>
          {singleAnimal}
        </div>
        <div id="vLine" className={`${style["vLine"]}`} />
        <div id="grid2">
          <label>
            {" "}
            {labelsManager.importLabel(
              "group_livestock",
              this.context,
              "farm_registry"
            )}{" "}
          </label>
          {groupAnimal}
        </div>
      </div>
    );

    this.setState({
      showModal: true,
      stateDataForm: (
        <Modal
          key={row["AHV_HOLDING.OBJECT_ID"]}
          id={row["AHV_HOLDING.OBJECT_ID"]}
          modalTitle={
            "Добиток во одгледувалиште број - " +
            row["AHV_HOLDING.HOLDING_ID"] +
            " тип на животни " +
            row["AHV_HOLDING.HOLDING_ANIMAL_TYPE"]
          }
          nameSubmitBtn="close"
          closeModal={() => this.closeModalFn()}
          modalContent={divHolder}
        />
      ),
    });
  };

  refreshAnimalList = () => {
    GridManager.reloadGridData(this.state.gridToDisplay + "_GRID");
  };

  closeModalFn = () => {
    this.setState({ showModal: false });
  };

  render() {
    const {
      livestockButton,
      liveStockGrid,
      animalSingleGroup,
      showModal,
      stateDataForm,
    } = this.state;
    return (
      <div id="liveStockGrid">
        {livestockButton}
        {liveStockGrid}
        {animalSingleGroup}
        {showModal && stateDataForm}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

Animal.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Animal);
