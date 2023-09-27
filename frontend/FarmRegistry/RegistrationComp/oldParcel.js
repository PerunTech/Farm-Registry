import { React, connect, GenericGrid, ComponentManager, PropTypes, createHashHistory, GridManager } from "perun-core";
import style from "../style/registration.module.css";
import { iconManager } from "../../assets/svgHolder";

const tableName = "AGRI_PARCEL";
const gridId = `${tableName}_GRID`
const history = createHashHistory();


class Parcel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //farmerObjId: this.props.farmObjId,
    };
  }

  componentDidMount () {
    const { farmerObjId } = this.props
    this.initialAgriParcelGrid();
    GridManager.reloadGridData(gridId + "_" + farmerObjId);
  }


  initialAgriParcelGrid = () => {
    const { farmerObjId } = this.props;
    GridManager.reloadGridData(gridId + "_" + farmerObjId);
    let grid = (
      <GenericGrid
        gridType={"READ_URL"}
        key={gridId + "_" + farmerObjId}
        id={gridId + "_" + farmerObjId}
        configTableName={"/table/tableFieldList/%session/" + tableName}
        dataTableName={
          "/table/tableDataByParentId/%session/" +
          tableName +
          "/" +
          farmerObjId
        }
        onRowClickFunct={this.onRowClick}
        minHeight={700}
      />
    );

    ComponentManager.setStateForComponent(
      tableName + "_" + farmerObjId,
      null,
      {
        onRowClickFunct: this.onRowClick,
      }
    );
    this.setState({ grid });
  }

  /* on row click function */
  onRowClick (id, idx, row) {
    console.log(row);
    this.setState(
      { cadParcelObjId: row[`${tableName}.OBJECT_ID`] },
      () => {
        this.generatePreview();
      }
    );
  }

  /* generate preview for the selected cad parcel */
  // generatePreview() {
  //   let form = (
  //     <GenericForm
  //       params={"READ_URL"}
  //       key={tableName + "_FORM"}
  //       id={tableName + "_FORM"}
  //       method={"/table/formStyleTableJsonSchema/%session/" + tableName}
  //       uiSchemaConfigMethod={
  //         "/table/formStyleTableUiSchema/%session/" + tableName
  //       }
  //       tableFormDataMethod={
  //         "/table/formStyleTableData/%session/" +
  //         tableName +
  //         "/" +
  //         tableName
  //       }
  //       hideBtns="all"
  //     />
  //   );
  //   this.genrateModal("Преглед на Катастарска парцела", form);
  // }

  /* create modal fn */
  // genrateModal = (modalTitle, modalData) => {
  //   this.setState({
  //     showModal: (
  //       <Modal
  //         key={modalTitle}
  //         modalTitle={modalTitle}
  //         closeModal={this.closeModal}
  //         modalContent={modalData}
  //       />
  //     ),
  //   });
  // };
  // closeModal = () => {
  //   this.setState({ showModal: false });
  // };

  openMap = () => {
    const { farmData } = this.props
    const objectId = farmData?.objectId
    const objectTypeId = farmData?.objectTypeId
    const params = `id=${objectId}&type=${objectTypeId}&action=sizp`
    history.push(`/main/farm-registry/map?${params}`)
  }

  render () {
    const { grid } = this.state;
    return (
      <div>
        <button className={`${style.mapBtn}`} onClick={() => this.openMap()}>{iconManager.getIcon("parcel")}Графички приказ на  парцели</button>
        <div id="parcel">
          {grid}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  farmData: state.farm_registry.mapData?.farmData,
  farmerObjId: state.farm_registry.mapData?.farmData?.objectId
});

Parcel.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Parcel);
