import { React, connect, GridManager, PropTypes, Loading, ComponentManager, GenericGrid, axios, redux, createHashHistory, elements } from "perun-core";
import style from "./style/registration.module.css";
import { iconManager } from "../assets/svgHolder";
import { labelsManager } from "./utils_tools/LabelsExport";
import SearchComponent from './SearchComp/SearchComponent';
import CustomButtons from "./FarmDetails/CustomButtons";
import CreateFarm from './CreateFarm/CreateFarm';
const { store } = redux
class Farm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showGrid: false,
      dataForm: false,
      showSearchForm: true,
      showDynamicMenu: false,
      hideSearchForm: true,
      defaultCountry: undefined,
      activeElement: 'SEARCH',
      activeChild: null,
    };
    this.hashHistory = createHashHistory();
  }

  componentDidMount = () => {
    let url = window.server + `/WsConf/params/get/sys/DEFAULT_COUNTRY`
    axios.get(url).then(res => {
      if (res.data.VALUE) {
        this.setState({ defaultCountry: res.data.VALUE })
      }
    })
    if (this.props.paramsComponent.params && this.props.paramsComponent.params !== 'search') {
      this.displayComponent(this.props.paramsComponent.params);
    }
    if (this.props.lpisback.backFromLpis) {
      this.getConfiguration(this.props.farmObjId, this.props.lpisback.tableName)
      this.generateInfo(this.props.farmData.rowsData)
      this.setState({ showDynamicMenu: true })
    }
  }

  //function used to get the side menu confirguration from backend
  getConfiguration = (objid, fromLpisTable) => {
    this.setState({ loading: true })
    let url = window.server + `/custom-menu/get-configuration/sid/${this.props.svSession}/component-name/FARM-EXTENDED/object-id/${objid}`
    axios.get(url).then(res => {
      this.setState({ configuration: res.data, loading: false })
      if (fromLpisTable) {
        res.data.data.map(el => {
          if (el.ID.includes(fromLpisTable)) {
            this.onButtonClick(el);
            store.dispatch({ type: 'BACK_FROM_LPIS', payload: { backFromLpis: false, tableName: undefined } })
          }
        })
      }
    }).catch(err => {
      console.error(err)
      this.setState({ loading: false })
    })
  }

  displayComponent = (component, tableName, configuration) => {
    let componentAddReg;
    let href = '/main/farm-registry/farm/'
    switch (component) {
      case "ADD_FARM":
        href = `/main/farm-registry/farm/register`
        this.hashHistory.push(href)
        componentAddReg = (
          <CreateFarm personObjId={this.state.personObj} />
        );
        break;
      case "DYNAMIC":
        href = `/main/farm-registry/farm/${tableName}`
        this.hashHistory.push(href)
        const customButtonsProps = {
          key: tableName,
          tableName,
          configuration,
          personObjId: this.state.personObj,
          defaultCountry: this.state.defaultCountry,
          getConfiguration: (objId) => this.getConfiguration(objId)
        }

        componentAddReg = <CustomButtons {...customButtonsProps} />
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

  onRowClick = (_rowId, _rowPosition, rowsData) => {
    const objectId = rowsData["FARM.OBJECT_ID"]
    const objectTypeId = rowsData["FARM.OBJECT_TYPE"]
    store.dispatch({ type: 'WRITE_FARM_INFO', payload: rowsData })
    store.dispatch({ type: 'GET_FR_MAP_DATA', payload: { objectId, objectTypeId, rowsData, tableName: "FARM" } })
    this.setState({
      showDynamicMenu: true,
      farmObjId: rowsData["FARM.OBJECT_ID"],
      personObj: rowsData["FARM.PERSON_OBJECT_ID"],
    }, () => {
      this.getConfiguration(rowsData["FARM.OBJECT_ID"])
    });
    this.generateInfo(rowsData)
  };
  //this function generates  the farm info box in the side menu 
  generateInfo = (rowData) => {
    let status = rowData['FARM.STATUS']
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
    let info = <>
      <div className={`${style['farmer-info-right']}`}>
        <p>{labelsManager.importLabel("status", this.context, "farm_registry")}: <b>{labelStatus}</b></p>
        <p>{labelsManager.importLabel("full_name", this.context, "farm_registry")}: <b>{rowData['FARM.FULL_NAME']}</b></p>
        <p>{labelsManager.importLabel("holding_code", this.context, "farm_registry")}: <b>{rowData['FARM.FIC']}</b></p>
        <p>{labelsManager.importLabel("archive_number", this.context, "farm_registry")}: <b>{rowData['FARM.ARCHIVE_NUMBER'] || ''}</b></p>
      </div>
    </>
    this.setState({ showFarmInfo: info })
  }

  generateCustomButtons = () => {
    if (this.state.configuration && Array.isArray(this.state.configuration.data)) {
      return this.state.configuration.data.map(el => {
        const modifiedID = el.ID.replace(/\d/g, '').replace(/_$/, '');
        const isActive = this.state.activeElement === el.ID; // Check if the element is active
        const hasChildren = this.state[el.ID] !== undefined;  // Check if the element has children
        return (
          <>
            <button
              className={isActive && !hasChildren ? `${style["btn_sub"]} ${style["active"]}` : `${style["btn_sub"]}`}
              onClick={() => (el.data ? this.generateChild(el.ID, el.data) : this.onButtonClick(el))}
            >
              <span className={style['dynamic-comp-icon-holder']}>{iconManager.getIcon(modifiedID)}</span><p>{el.label}</p>
            </button>
            {el.data && <div>
              {this.state[el.ID]}
            </div>}
          </>
        );
      });
    } else {
      return <></>;
    }
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
              if (el.ID.includes('PRINT')) {
                let url = window.server + el.onSubmit;
                window.open(url, '_blank');
              } else {
                this.onButtonClick(el)
              }
            }}
          >
            <span className={style['dynamic-comp-icon-holder']}>{iconManager.getIcon(modifiedID)}</span><p>{el.label}</p>
          </button>
        );
      });
      this.setState({ [id]: html });
    }
  }

  onButtonClick = (element) => {
    const id = element.ID;
    const splitID = id.replace(/\d/g, '').replace(/_$/, '');
    this.displayComponent('DYNAMIC', splitID, element);
    this.setState({ activeElement: id, loading: false });
  }
  render() {
    const {
      dataHolder,
      showGrid,
      componentAddReg,
      dataForm,
      showSearchForm,
      showDynamicMenu,
      showFarmInfo,
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
                let href = `/main/farm-registry/farm/search`
                this.hashHistory.push(href)
                this.setState({ activeElement: 'SEARCH' })
                this.setState({
                  showDynamicMenu: false,
                  showFarmInfo: false,
                })
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
                  this.setState({
                    showDynamicMenu: false,
                    showFarmInfo: false,
                  })
                  GridManager.reloadGridData("FARM_GRID");
                  this.displayComponent('ADD_FARM');
                  this.setState({ activeElement: 'ADD_FARM' })
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
            {showFarmInfo}
            {showDynamicMenu && (<div className={[style['dynamic-comp-main-div']]}>
              {this.generateCustomButtons()}
              <div className={style['side-menu-bottom-div']} />
            </div>)}
          </div>
          <div className={`${style["farm-registry-content"]}`} id="farm-registry-content">
            {showSearchForm && (
              <div className={`${style["farm-registry-content-search"]}`} id="farm-registry-content-search">
                <SearchComponent onRowClick={this.onRowClick} />
              </div>
            )}
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
  farmObjId: state['farm_registry.mapData']?.farmData?.objectId,
  lpisback: state['farm_registry.mapData']?.lpisback
});

Farm.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Farm);