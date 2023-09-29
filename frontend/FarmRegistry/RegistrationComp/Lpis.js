import {
  React,
  connect,
  GenericGrid,
  GenericForm,
  Modal,
  ComponentManager,
  PropTypes,
} from "perun-core";

const cadParcelTable = "CAD_PARCEL";
class Lpis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      farmerObjId: this.props.farmObjId,
    };
  }

  componentDidMount() {
    const { farmerObjId } = this.state;
    let grid = (
      <GenericGrid
        gridType={"READ_URL"}
        key={cadParcelTable + "_" + farmerObjId}
        id={cadParcelTable + "_" + farmerObjId}
        configTableName={"/table/tableFieldList/%session/" + cadParcelTable}
        dataTableName={
          "/table/tableDataByParentId/%session/" +
          cadParcelTable +
          "/" +
          farmerObjId
        }
        onRowClickFunct={this.onRowClick}
      />
    );
    ComponentManager.setStateForComponent(
      cadParcelTable + "_" + farmerObjId,
      null,
      {
        onRowClickFunct: this.onRowClick,
      }
    );
    this.setState({ grid });
  }

  /* on row click function */
  onRowClick(id, idx, row) {
    console.log(row);
    this.setState(
      { cadParcelObjId: row[`${cadParcelTable}.OBJECT_ID`] },
      () => {
        this.generatePreview();
      }
    );
  }

  /* generate preview for the selected cad parcel */
  generatePreview() {
    let form = (
      <GenericForm
        params={"READ_URL"}
        className={'farm-registry-forms form-test'}
        key={cadParcelTable + "_FORM"}
        id={cadParcelTable + "_FORM"}
        method={"/table/formStyleTableJsonSchema/%session/" + cadParcelTable}
        uiSchemaConfigMethod={
          "/table/formStyleTableUiSchema/%session/" + cadParcelTable
        }
        tableFormDataMethod={
          "/table/formStyleTableData/%session/" +
          cadParcelObjId +
          "/" +
          cadParcelTable
        }
        hideBtns="all"
      />
    );
    this.genrateModal("Преглед на Катастарска парцела", form);
  }

  /* create modal fn */
  genrateModal = (modalTitle, modalData) => {
    this.setState({
      showModal: (
        <Modal
          key={modalTitle}
          modalTitle={modalTitle}
          closeModal={this.closeModal}
          modalContent={modalData}
        />
      ),
    });
  };
  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { grid, showModal } = this.state;
    return (
      <div>
        <div id="lpis">
          {showModal}
          
          {grid}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

Lpis.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Lpis);
