import { React, connect, FormManager, PropTypes } from "perun-core";
import Modal from "react-modal";
import { labelsManager } from "../utils_tools/LabelsExport";

class Documentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.displayRegForm = this.displayRegForm.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    this.displayRegForm();
  }

  displayRegForm() {
    const params = [];
    params.push(
      {
        PARAM_NAME: "formWeWant",
        PARAM_VALUE: this.props.formId,
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
        PARAM_VALUE: this.props.formId,
      }
    );

    let dataForm = FormManager.generateForm(
      this.props.formId,
      this.props.formId,
      params,
      "formData",
      "GET_FORM_BUILDER_MAVEN",
      "GET_UISCHEMA_MAVEN",
      "GET_DATA_FROM_FORM_MAVEN",
      null,
      null,
      null,
      null,
      "form-container",
      null,
      "close",
      null
    );
    this.setState({ dataForm: dataForm });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  render() {
    const { dataForm } = this.state;
    return (
      <div>
        <button onClick={this.handleOpenModal}>
          {" "}
          {labelsManager.importLabel(
            "open_modal",
            this.context,
            "farm_registry"
          )}{" "}
        </button>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Minimal Modal Example"
        >
          <button onClick={this.handleCloseModal}>
            {" "}
            {labelsManager.importLabel(
              "close_modal",
              this.context,
              "farm_registry"
            )}{" "}
          </button>
          {dataForm}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

Documentation.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Documentation);
