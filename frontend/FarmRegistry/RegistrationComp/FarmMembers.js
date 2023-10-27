import {
  React,
  connect,
  elements,
  GenericGrid,
  ComponentManager,
  PropTypes,
  axios,
  GridManager,
  GenericForm,
} from "perun-core";
import style from "../style/registration.module.css";
const { useState, useEffect } = React;
const { alertUser } = elements;
const { ReactBootstrap } = elements;
const { Modal } = ReactBootstrap;
import FarmMembersWrapper from "./FarmMembersWrapper";
const tableName = "FARM_MEMBERS";
let gridId = `${tableName}_GRID`;
import { labelsManager } from '../utils_tools/LabelsExport';
const FarmMembers = (props, context) => {
  const [grid, setGrid] = useState(undefined);
  const [show, setShow] = useState(false);
  const [memberId, setMemberId] = useState(undefined)
  useEffect(() => {
    generateFarmMembersGrid();
  }, []);

  useEffect(() => {
    return () => {
      ComponentManager.cleanComponentReducerState(gridId);
    };
  }, []);
  //handle infinite loading

  //edit on row click
  const handleRowClick = (_id, _rowIdx, row) => {
    setMemberId(row["FARM_MEMBERS.OBJECT_ID"] || 0)
    setShow(true)
  };
  //togglemodal
  //initial grid of FarmMembers
  const generateFarmMembersGrid = () => {
    const { svSession } = props;
    gridId = `${tableName}_GRID`;
    let grid = (
      <GenericGrid
        gridType={"READ_URL"}
        key={gridId}
        id={gridId}
        configTableName={`/ReactElements/getTableFieldList/${svSession}/${tableName}`}
        dataTableName={
          `/ReactElements/getObjectsByParentId/${props.svSession}/${props.farmObjId}/${tableName}/100000`}
        onRowClickFunct={handleRowClick}
        refreshData={true}
        toggleCustomButton={true}
        customButton={() => {
          setShow(true)
          setMemberId(0)
        }}
        customButtonLabel={labelsManager.importLabel(
          "add_member",
          context,
          "farm_registry"
        )}
        heightRatio={0.7}
      />
    );
    setGrid(grid);
  };
  //create new team
  const saveMember = (e) => {
    const { svSession } = props;
    let url =
      window.server +
      `/ReactElements/createTableRecordFormData/${svSession}/${tableName}/${props.farmObjId}`;
    axios({
      method: "post",
      data: e.formData,
      url,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((res) => {
        if (res.data) {
          GridManager.reloadGridData(gridId);
          setShow(false);
        }

      })
      .catch(err => {
        console.error(err)
        const title = err.response?.data?.title || err
        const msg = err.response?.data?.message || ''
        alertUser(true, "error", title, msg);

      });
  };
  //create new team form
  const generateFarmMembersForm = (memberId) => {
    const { svSession } = props;
    return <GenericForm
      params={"READ_URL"}
      key={`${tableName}_FORM`}
      id={`${tableName}_FORM`}
      method={`/ReactElements/getTableJSONSchema/${svSession}/${tableName}`}
      uiSchemaConfigMethod={`/ReactElements/getTableUISchema/${svSession}/${tableName}`}
      tableFormDataMethod={`/ReactElements/getTableFormData/${svSession}/${memberId}/${tableName}`}
      addSaveFunction={(e) => saveMember(e)}
      hideBtns={memberId === 0 ? 'closeAndDelete' : 'close'}
      inputWrapper={FarmMembersWrapper}
      addDeleteFunction={deleteFunc}
      className={'farm-registry-forms'}
    />
  };

  const deleteFunc = (_id, _action, _session, formData) => {
    const { svSession } = props;
    let url = window.server + `/ReactElements/deleteObject/${svSession}`;
    axios({
      method: "post",
      data: formData[4]["PARAM_VALUE"],
      url: url,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((res) => {
        if (res.data.type === "SUCCESS") {
          alertUser(true, "success", res.data.title, res.data.message);
          setShow(false);
          ComponentManager.setStateForComponent(`${tableName}_FORM`, null, {
            saveExecuted: false,
          });
          ComponentManager.setStateForComponent(gridId, null, {
            rowClicked: undefined,
          });
          GridManager.reloadGridData(gridId);
        }
      })
      .catch(err => {
        console.error(err)
        const title = err.response?.data?.title || err
        const msg = err.response?.data?.message || ''
        alertUser(true, "error", title, msg);

      });
  };


  return (
    <>
      <div id="farmMembersGrid">
        {grid}
      </div>
      {show && <Modal className={style["farm-registry-modal"]} show={show} onHide={() => setShow(false)}>
        <Modal.Header className={style["farm-registry-modal-header"]} closeButton>
          <Modal.Title>{labelsManager.importLabel(
            "add_member",
            context,
            "farm_registry"
          )}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={style["farm-registry-modal-body"]}>
          {generateFarmMembersForm(memberId)}
        </Modal.Body>
        <Modal.Footer className={style["farm-registry-modal-footer"]}></Modal.Footer>
      </Modal>}
    </>
  );
};

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  farmObjId: state['farm_registry.mapData']?.farmData?.objectId
});

FarmMembers.contextTypes = {
  intl: PropTypes.object.isRequired,
};
export default connect(mapStateToProps)(FarmMembers);
