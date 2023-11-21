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
        configTableName={"/ReactElements/getTableFieldList/%session/" + cadParcelTable}
        dataTableName={
          `/ReactElements/getObjectsByParentId/%session/${farmerObjId}/${cadParcelTable}/10000`

        }
        onRowClickFunct={this.onRowClick}
        heightRatio={0.7}
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
  onRowClick = (_id, _idx, row) => {
    const objectId = row[`${cadParcelTable}.OBJECT_ID`]
    this.generatePreview(objectId)
  }

  /* generate preview for the selected cad parcel */
  generatePreview = (objectId) => {
    let form = (
      <GenericForm
        params={"READ_URL"}
        className={'farm-registry-forms form-test'}
        key={cadParcelTable + "_FORM"}
        id={cadParcelTable + "_FORM"}
        method={"/ReactElements/getTableJSONSchema/%session/" + cadParcelTable}
        uiSchemaConfigMethod={
          "/ReactElements/getTableUISchema/%session/" + cadParcelTable
        }
        tableFormDataMethod={
          "/ReactElements/getTableFormData/%session/" +
          objectId +
          "/" +
          cadParcelTable
        }
        hideBtns="all"
      />
    );
    this.genrateModal(this.context.intl.formatMessage({ id: 'perun.farm_registry.cadastral_parcel', defaultMessage: 'perun.farm_registry.cadastral_parcel' }), form);
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
