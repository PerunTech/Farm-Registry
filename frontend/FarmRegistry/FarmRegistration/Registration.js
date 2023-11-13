import { React, connect, GridManager, PropTypes, Loading, ComponentManager, GenericGrid, axios, redux, createHashHistory, elements } from "perun-core";
const { alertUser } = elements
import style from "../style/registration.module.css";
import { iconManager } from "../../assets/svgHolder";
import CompanyRegFarm from "./CompanyRegFarm";
import { labelsManager } from "../utils_tools/LabelsExport";
import Animal from "../RegistrationComp/Animal";
import Lpis from "../RegistrationComp/Lpis";
import AddDocuments from "../RegistrationComp/AddDocuments";
import FarmMembers from "../RegistrationComp/FarmMembers";
import Parcel from "../RegistrationComp/Parcel";
import SearchComponent from '../SearchComp/SearchComponent';
import Intersection from '../RegistrationComp/Intersection'
import FarmEquipment from "../RegistrationComp/FarmEquipment";
import Equipment from "../RegistrationComp/Equipment";
import Machinery from "../RegistrationComp/Machinery";
import Address from '../RegistrationComp/Address/Address';
import CustomMenu from "../RegistrationComp/CustomMenu";
import CreateFarm from './CreateFarm/CreateFarm';
const { store } = redux

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showGrid: false,
      formContainer: "",
      tableName: 'FARM',
      dataForm: false,
      showSearchForm: true,
      fullName: '',
      fic: '',
      farmType: '',
      id_no: '',
      tax_no: '',
      showCapacities: false,
      hideSearchForm: true,
      showSubMenu: false,
      showPrintBtn: false,
      defaultCountry: undefined,
      activeElement: 'SEARCH',
      activeChild: null,
    };
    this.hashHistory = createHashHistory();
  }

  toggleSubMeu = () => {
    this.setState((prevState) => ({
      showSubMenu: !prevState.showSubMenu
    }))
  }

  componentDidMount = () => {
    if (this.props.paramsComponent.params && this.props.paramsComponent.params !== 'search') {
      this.displayComponent(this.props.paramsComponent.params);
      this.generateInfo()
      let url = window.server + `/WsConf/params/get/sys/DEFAULT_COUNTRY`
      axios.get(url).then(res => {
        if (res.VALUE) {
          this.setState({ defaultCountry: res.VALUE })
        }
      })
    }
  }

  showSearch = () => {
    this.setState({ showSearchForm: true })
    this.setState({ dataForm: '' })
  }

  showAddFarm = () => {
    GridManager.reloadGridData("FARM_GRID");
    this.displayComponent('ADD_FARM');
    this.setState({ activeElement: 'ADD_FARM' })
  };

  getConfiguration = (objid) => {
    this.setState({ loading: true })
    let url = window.server + `/custom-menu/get-configuration/sid/${this.props.svSession}/component-name/FARM-EXTENDED/object-id/${objid}`
    axios.get(url).then(res => {
      this.setState({ reports: res.data, loading: false })
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
    })
  }

  displayCompanyRegForm = () => {
    GridManager.reloadGridData("FARM_GRID");
    this.setState({
      componentAddReg: false,
      showGrid: false,
      formKey: "reg_company",
      hideSearchForm: false,
      showSearchForm: false,
      dataForm: <CompanyRegFarm parentCallBackFunc={this.getPersonId} showSearch={this.showSearch} />,
    });
  };

  getPersonId = (personObj) => {
    this.setState({ personObj: personObj });
  };

  displayGridFarm = () => {
    store.dispatch({ type: 'RESET_FR_MAP_DATA' })
    const { fullName, fic, farmType, id_no, tax_no, tableName } = this.state
    const { svSession } = this.props
    if (!fullName && !fic && !farmType && !id_no && !tax_no) {
      alertUser(true, 'error', this.context.intl.formatMessage({ id: 'perun.farm_registry.no_search_val', defaultMessage: 'perun.farm_registry.no_search_val' }), this.context.intl.formatMessage({ id: 'perun.farm_registry.please_enter_search_val', defaultMessage: 'perun.farm_registry.please_enter_search_val' }))
    } else {
      let multipleFilterData = []
      if (fullName) {
        multipleFilterData.push({ fieldName: 'FULL_NAME', fieldValue: fullName, operand: 'AND' })
      }
      if (fic) {
        multipleFilterData.push({ fieldName: 'FIC', fieldValue: fic, operand: 'AND' })
      }
      if (farmType) {
        multipleFilterData.push({ fieldName: 'FARM_TYPE', fieldValue: farmType, operand: 'AND' })
      }
      if (id_no) {
        multipleFilterData.push({ fieldName: 'ID_NO', fieldValue: id_no, operand: 'AND' })
      }
      if (tax_no) {
        multipleFilterData.push({ fieldName: 'TAX_NO', fieldValue: tax_no, operand: 'AND' })
      }
      const names = multipleFilterData.map((element) => element.fieldName).join(',');
      const values = multipleFilterData.map((element) => element.fieldValue).join(',');

      let operandFinal = []
      multipleFilterData.map((element) => {
        operandFinal.push(element.operand)
      });

      if (operandFinal.length > 1) {
        operandFinal.pop();
        operandFinal = JSON.stringify(operandFinal)
      }

      const gridId = `INITIAL_${tableName}_GRID`
      const gridConfig = `/ReactElements/getTableFieldList/${svSession}/${tableName}`
      const gridData = `/ReactElements/getTableWithMultipleFilters/${svSession}/${tableName}/${names}/${operandFinal}/${values}/1000`
      let grid = (
        <GenericGrid
          gridType={"READ_URL"}
          key={gridId}
          id={gridId}
          configTableName={gridConfig}
          dataTableName={gridData}
          onRowClickFunct={this.onRowClick}
          minHeight={610}
        />
      )

      ComponentManager.setStateForComponent(gridId, null, {
        onRowClickFunct: this.onRowClick,
        rowClicked: undefined,
      });

      ComponentManager.cleanComponentReducerState(gridId)
      this.setState({ dataHolder: undefined, showGrid: true, dataForm: false, }, () => this.setState({ dataHolder: grid }));
    };
  }

  handleSearchByTheEnterKey = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      this.displayGridFarm()
    }
  }

  resetFields = () => {
    this.setState({ fullName: '', fic: '', farmType: '' })
  }

  refreshAgriParcels() {
    const { svSession, farmObjId } = this.props
    const resturl = window.server + '/farmer/refreshFarmData/' + svSession
    let params = ''
    params = { 'farmId': farmObjId }
    alertUser(true, 'info',
      labelsManager.importLabel('data_refreshing', this.context, 'farm_registry'),
      labelsManager.importLabel('please_wait', this.context, 'farm_registry'),
      null, null, null, null, null, null, null, null, null, true
    )
    axios({
      method: 'post',
      data: params,
      url: resturl,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((response) => {
      if (response.data) {
        const wrapper = document.createElement('div')
        if (response.data.data) {
          let isNotError = true
          for (const [key, value] of Object.entries(response.data.data)) {
            const parentGrid = document.createElement('div')
            parentGrid.setAttribute('id', 'parentgrid')
            parentGrid.classList.add(style.parentgrid);
            let keySplit = key.split('_')[1]
            let icon
            switch (keySplit) {
              case 'ERROR':
                isNotError === false
                parentGrid.setAttribute('style', 'border-left: 3px solid red')
                icon = document.createElement('div')
                icon.style.cssText = 'width: 25px; height:25px; border: 2px solid red; border-radius: 25px;'
                icon.innerHTML = '<i class="fa fa-times" style="color:red; margin-left: 24%;"></i>'
                break;
              case 'WARNING':
                parentGrid.setAttribute('style', 'border-left: 3px solid #c7c226')
                icon = document.createElement('div')
                icon.style.cssText = 'width: 27px; height:27px; border: 2px solid #c7c226; border-radius: 25px;'
                icon.innerHTML = '<i class="fa fa-exclamation-triangle" style="color:#c7c226; margin-left: 3px;"></i>'
                break;
              case 'SUCCESS':
                parentGrid.setAttribute('style', 'border-left: 4px solid green')
                icon = document.createElement('div')
                icon.style.cssText = 'width: 25px; height:25px; border: 2px solid green; border-radius: 25px;'
                icon.innerHTML = '<i class="fa fa-check" style="color:green; margin-left: 13%;"></i>'
              default:
                break;
            }
            parentGrid.appendChild(icon)
            /* js way to solve sweetalert custom html  */
            let childEl = document.createElement('div')
            let arrayIds = ''
            childEl.setAttribute('id', 'childEl')
            if (typeof value === 'object') {
              for (const [id, label] of Object.entries(value)) {
                arrayIds += (` ${id},`)
              }
              if (arrayIds) {
                arrayIds = arrayIds.substr(0, arrayIds.length - 1)
                const parcelLabel = this.context.intl.formatMessage({ id: 'perun.farm_registry.parcel', defaultMessage: 'perun.farm_registry.parcel' })
                const errorLabel = this.context.intl.formatMessage({ id: 'perun.farm_registry.have_errors', defaultMessage: 'perun.farm_registry.have_errors' })
                childEl.innerHTML = `(${parcelLabel}) (${arrayIds}) (${errorLabel})`
              }
            } else {
              childEl.innerHTML = value
            }
            parentGrid.appendChild(childEl)
            wrapper.appendChild(parentGrid)
          }
          alertUser(true, response.data.type.toLowerCase(), response.data.title, null, isNotError ? this.reload : null, null, null, null, null, null, null, null, wrapper)
        }
      }
    }).catch((error) => {
      if (error) {
        alertUser(true, 'error', 'Error', error.message, null)
      }
    })
  }

  displayComponent = (component, tableName, configuration) => {
    let componentAddReg;
    let href = '/main/farm-registry/registration/'
    switch (component) {
      case "ADD_FARM":
        href = `/main/farm-registry/registration/register`
        this.hashHistory.push(href)
        componentAddReg = (
          <CreateFarm personObjId={this.state.personObj} />
        );
        break;
      case "AHV_HOLDING":
        href = `/main/farm-registry/registration/${component}`
        this.hashHistory.push(href)
        componentAddReg = (
          <Animal farmObjId={this.props.farmObjId} grid={component} paramsComponent={component} />
        );
        break;
      case "LPIS":
        href = `/main/farm-registry/registration/${component}`
        this.hashHistory.push(href)
        componentAddReg = <Lpis farmObjId={this.props.farmObjId} paramsComponent={component} />;
        break;
      case "INTERSECTIONS":
        href = `/main/farm-registry/registration/${component}`
        this.hashHistory.push(href)
        componentAddReg = <Intersection farmObjId={this.props.farmObjId} paramsComponent={component} />;
        break;
      case "FARM_MEMBERS":
        href = `/main/farm-registry/registration/${component}`
        this.hashHistory.push(href)
        componentAddReg = (
          <FarmMembers
            farmObjId={this.props.farmObjId}
            personObjId={this.state.personObj}
            grid={component}
            paramsComponent={component}
          />
        );
        break;
      case "DOCS":
        href = `/main/farm-registry/registration/${component}`
        this.hashHistory.push(href)
        componentAddReg = <AddDocuments key="addDoc" paramsComponent={component} />;
        break;
      case "SIZP":
        href = `/main/farm-registry/registration/${component}`
        this.hashHistory.push(href)
        this.setState({ showCapacities: true })
        componentAddReg = <Parcel farmObjId={this.props.farmObjId} paramsComponent={component} />
        break;
      case "FARM_EQUIPMENT":
        href = `/main/farm-registry/registration/${component}`
        this.hashHistory.push(href)
        this.setState({ showCapacities: true })
        componentAddReg = <FarmEquipment farmObjId={this.props.farmObjId} paramsComponent={component} />
        break;
      case "MACHINERY":
        href = `/main/farm-registry/registration/${component}`
        this.hashHistory.push(href)
        componentAddReg = <Machinery />
        break;
      case "EQUIPMENT":
        href = `/main/farm-registry/registration/${component}`
        this.hashHistory.push(href)
        componentAddReg = <Equipment />
        break;
      case "ADDRESS":
        href = `/main/farm-registry/registration/${component}`
        this.hashHistory.push(href)
        componentAddReg = <Address personObjId={this.state.personObj} defaultCountry={this.state.defaultCountry} />
        break;
      case "DYNAMIC":
        href = `/main/farm-registry/registration/${tableName}`
        this.hashHistory.push(href)
        const customMenuProps = {
          key: tableName,
          tableName,
          configuration,
          getConfiguration: (objId) => this.getConfiguration(objId)
        }
        componentAddReg = <CustomMenu {...customMenuProps} />
        break;
      default:
        break;
    }
    this.setState({
      componentAddReg: componentAddReg,
      showGrid: false,
      showSearchForm: false,
      hideSearchForm: false

    });
  };

  onRowClick = (rowId, rowPosition, rowsData) => {
    const objectId = rowsData["FARM.OBJECT_ID"]
    const objectTypeId = rowsData["FARM.OBJECT_TYPE"]
    store.dispatch({ type: 'WRITE_FARM_INFO', payload: rowsData })
    store.dispatch({ type: 'GET_FR_MAP_DATA', payload: { objectId, objectTypeId, rowsData, tableName: "FARM" } })
    this.setState({
      showCapacities: true,
      farmObjId: rowsData["FARM.OBJECT_ID"],
      personObj: rowsData["FARM.PERSON_OBJECT_ID"],
      farmFic: rowsData["FARM.FIC"],
      archiveNumber: rowsData["FARM.ARCHIVE_NUMBER"],
      status: rowsData["FARM.STATUS"],
      allFarmData: rowsData,
      farmFullName: rowsData["FARM.FULL_NAME"]
    }, () => {
      this.generateInfo(true)
      this.getConfiguration(rowsData["FARM.OBJECT_ID"])
    });
  };

  privateRegForm = () => {
    this.setState({
      showCapacities: false,
      generateInfoState: false,
    })
  }

  generateInfo = (isFromRowClick) => {
    let { status, farmFic, archiveNumber, farmFullName } = this.state
    const { farmData } = this.props
    if (farmData?.rowsData && !isFromRowClick) {
      const rowData = farmData.rowsData
      status = rowData['FARM.STATUS']
      farmFic = rowData['FARM.FIC']
      archiveNumber = rowData['FARM.ARCHIVE_NUMBER'] || ''
      farmFullName = rowData['FARM.FULL_NAME']
    }
    let htmlElement
    let elementArr = []
    let labelStatus
    if (status === 'VALID') {
      labelStatus = this.context.intl.formatMessage({ id: 'perun.farm_registry.active', defaultMessage: 'perun.farm_registry.active' })
    }
    if (status === 'PENDING') {
      labelStatus = this.context.intl.formatMessage({ id: 'perun.farm_registry.in_progress', defaultMessage: 'perun.farm_registry.in_progress' })
    }
    if (status === 'CLOSED') {
      labelStatus = this.context.intl.formatMessage({ id: 'perun.farm_registry.inactive', defaultMessage: 'perun.farm_registry.inactive' })
    }
    htmlElement = <div style={{ color: 'white' }} className={`${style['farmerInfo']}`}>
      <div className={`${style['farmer-info-right']}`}>
        <p>{labelsManager.importLabel("status", this.context, "farm_registry")}: <b>{labelStatus}</b></p>
        <p>{labelsManager.importLabel("full_name", this.context, "farm_registry")}: <b>{farmFullName}</b></p>
        <p>{labelsManager.importLabel("fic", this.context, "farm_registry")}: <b>{farmFic}</b></p>
        <p>{labelsManager.importLabel("archive_number", this.context, "farm_registry")}: <b>{archiveNumber}</b></p>
      </div>
    </div>

    elementArr.push(htmlElement)
    this.setState({ generateInfoState: elementArr })
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };


  generateCustomMenu = () => {
    if (this.state.reports && Array.isArray(this.state.reports.data)) {
      return this.state.reports.data.map(el => {
        const modifiedID = el.ID.replace(/\d/g, '').replace(/_$/, '');
        const isActive = this.state.activeElement === el.ID; // Check if the element is active
        const hasChildren = this.state[el.ID] !== undefined;  // Check if the element has children
        return (
          <div key={el.ID}>
            <button
              className={isActive && !hasChildren ? `${style["btn_sub"]} ${style["active"]}` : `${style["btn_sub"]}`}
              onClick={() => (el.data ? this.generateChild(el.ID, el.data) : this.onButtonClick(el))}
            >
              {iconManager.getIcon(modifiedID)}{el.label}
            </button>
            <div>
              {this.state[el.ID]}
            </div>
          </div>
        );
      });
    } else {
      return <></>;
    }
  }

  onButtonClick = (element) => {
    const id = element.ID;
    const splitID = id.replace(/\d/g, '').replace(/_$/, '');
    this.displayComponent('DYNAMIC', splitID, element);
    this.setState({ activeElement: id });
  }

  generateChild = (id, children) => {
    if (this.state[id]) {
      this.setState({ [id]: null });
    } else {
      let html = children.map(el => {
        const modifiedID = el.ID.replace(/\d/g, '').replace(/_$/, '');
        const isActive = this.state.activeChild === el.ID; // Check if the child is active
        return (
          <button
            className={isActive ? `${style["btn_sub"]} ${style["submenu-print"]} ${style["active"]}` : `${style["btn_sub"]} ${style["submenu-print"]}`}
            id={el.ID}
            onClick={() => {
              let url = window.server + el.onSubmit;
              window.open(url, '_blank');
              //this.setState({ activeChild: el.ID }) 
            }}
          >
            {iconManager.getIcon(modifiedID)}{el.label}
          </button>
        );
      });
      this.setState({ [id]: html });
    }
  }

  handleButtonClick = (componentName) => {
    if (componentName === "FARM_EQUIPMENT") {
      this.toggleSubMeu();
    }

    this.setState({ activeElement: componentName });
  }

  toggleSubMeu = () => {
    this.setState((prevState) => ({ showSubMenu: !prevState.showSubMenu }));
  }

  render() {
    const {
      dataHolder,
      showGrid,
      formKey,
      componentAddReg,
      dataForm,
      showSearchForm,
      showCapacities,
      generateInfoState,
      showSubMenu,
      loading,
      activeElement,
    } = this.state;

    return (

      <>
        {loading && <Loading />}
        <div className={`${style["farm-registry-main-container"]}`} id="farm-registry-main-container">
          <div className={`${style["farm-registry-sidemenu"]}`} id="farm-registry-sidemenu">
            <div className={`${style["btnHolder"]}`}>
              <button className={`${style["btn_sub"]} ${style['initial-farm-registry-btns']} ${activeElement === 'SEARCH' && style['active']}`} onClick={() => {
                this.setState({ showSearchForm: true, dataForm: undefined, componentAddReg: undefined })
                let href = `/main/farm-registry/registration/search`
                this.hashHistory.push(href)
                this.setState({ activeElement: 'SEARCH' })
                this.privateRegForm();
              }}>
                {iconManager.getIcon("search")}
                {labelsManager.importLabel(
                  "searching",
                  this.context,
                  "farm_registry"
                )}
              </button>
              <button
                className={`${style["btn_sub"]} ${style['initial-farm-registry-btns']} ${activeElement === 'ADD_FARM' && style['active']}`}
                onClick={() => {
                  this.privateRegForm();
                  this.showAddFarm()
                }}
              >
                {iconManager.getIcon("add")}
                {labelsManager.importLabel(
                  "add_family_agri_holding",
                  this.context,
                  "farm_registry"
                )}
              </button>
            </div>
            <div className={`${style["btnHolder"]}`}>
              {generateInfoState}
            </div>
            {showCapacities && (
              <div
                className={`${'reg-btn-holder'} ${style["registrationbtnCapacitiesHolder"]}`}
                id="btnCapacities"
              >
                <button
                  className={activeElement === 'FARM_MEMBERS'
                    ? `${style["btn_sub"]} ${style["active"]}`
                    : style["btn_sub"]}
                  onClick={() => {
                    this.displayComponent("FARM_MEMBERS")
                    this.handleButtonClick("FARM_MEMBERS")
                  }}
                >
                  {iconManager.getIcon("group")}
                  {labelsManager.importLabel(
                    "agri_members",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={activeElement === "AHV_HOLDING"
                    ? `${style["btn_sub"]} ${style["active"]}`
                    : style["btn_sub"]}
                  onClick={() => {
                    this.displayComponent("AHV_HOLDING")
                    this.handleButtonClick("AHV_HOLDING")
                  }}
                >
                  {iconManager.getIcon("animal")}
                  {labelsManager.importLabel(
                    "livestock",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={activeElement === "LPIS"
                    ? `${style["btn_sub"]} ${style["active"]}`
                    : style["btn_sub"]}
                  onClick={() => {
                    this.displayComponent("LPIS")
                    this.handleButtonClick("LPIS")
                  }}
                >
                  {iconManager.getIcon("parcel")}
                  {labelsManager.importLabel(
                    "parcels",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={activeElement === "INTERSECTIONS"
                    ? `${style["btn_sub"]} ${style["active"]}`
                    : style["btn_sub"]}
                  onClick={() => {
                    this.displayComponent("INTERSECTIONS")
                    this.handleButtonClick("INTERSECTIONS")
                  }}
                >
                  {iconManager.getIcon("parcel")}
                  {labelsManager.importLabel(
                    "cadastral_intersection",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={activeElement === "SIZP"
                    ? `${style["btn_sub"]} ${style["active"]}`
                    : style["btn_sub"]}
                  onClick={() => {
                    this.displayComponent("SIZP")
                    this.handleButtonClick("SIZP")
                  }}
                >
                  {iconManager.getIcon("parcelIcon")}
                  {labelsManager.importLabel(
                    "lpis",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={`${style["btn_sub"]}`}
                  onClick={() => this.toggleSubMeu()}
                >
                  {iconManager.getIcon("docs")}
                  {labelsManager.importLabel(
                    "farm_equipment",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                {showSubMenu && (
                  <>
                    <button
                      className={`${style["btn_sub"]} ${style["submenu"]} ${activeElement === "MACHINERY" ? style["active"] : ""
                        }`}
                      onClick={() => {
                        this.displayComponent("MACHINERY")
                        this.handleButtonClick("MACHINERY")
                      }}
                    >
                      {iconManager.getIcon("machinery")}
                      {labelsManager.importLabel(
                        "machinery",
                        this.context,
                        "farm_registry"
                      )}
                    </button>
                    <button
                      className={`${style["btn_sub"]} ${style["submenu"]} ${activeElement === "EQUIPMENT" ? style["active"] : ""
                        }`}
                      onClick={() => {
                        this.displayComponent("EQUIPMENT")
                        this.handleButtonClick("EQUIPMENT")
                      }}
                    >
                      {iconManager.getIcon("equipment")}
                      {labelsManager.importLabel(
                        "equipment",
                        this.context,
                        "farm_registry"
                      )}
                    </button>
                  </>
                )}
                <button
                  className={activeElement === "ADDRESS"
                    ? `${style["btn_sub"]} ${style["active"]}`
                    : style["btn_sub"]}
                  onClick={() => {
                    this.displayComponent("ADDRESS")
                    this.handleButtonClick("ADDRESS")
                  }}
                >
                  {iconManager.getIcon("address")}
                  {labelsManager.importLabel(
                    "address",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <button
                  className={activeElement === "DOCS"
                    ? `${style["btn_sub"]} ${style["active"]}`
                    : style["btn_sub"]}
                  onClick={() => {
                    this.displayComponent("DOCS")
                    this.handleButtonClick("DOCS")
                  }}
                >
                  {iconManager.getIcon("docs")}
                  {labelsManager.importLabel(
                    "docs",
                    this.context,
                    "farm_registry"
                  )}
                </button>
                <>
                  {this.generateCustomMenu()}
                </>
              </div>)}
          </div>
          <div className={`${style["farm-registry-content"]}`} id="farm-registry-content">
            {showSearchForm && <div className={`${style["farm-registry-content-search"]}`} id="farm-registry-content-search">

              <SearchComponent onRowClick={this.onRowClick} />
            </div>}

            <div id="dataHolder" className={`${dataForm ? style["dataHolder"] : ''} ${componentAddReg ? style['farm-registry-submenu-comp'] : ""}`}>
              {showGrid && dataHolder}
              {componentAddReg}
            </div>
          </div>
        </div >
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
  farmData: state['farm_registry.mapData']?.farmData,
  farmObjId: state['farm_registry.mapData']?.farmData?.objectId
});

Registration.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Registration);
