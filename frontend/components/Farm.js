import { React, connect, GridManager, PropTypes, Loading, axios, redux, createHashHistory } from "perun-core";
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
      activeChild: '',
      activeParent: ''
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
    if (this.props.paramsComponent.params && this.props.paramsComponent.params !== 'search' || this.props.paramsComponent.params !== 'register') {
      //extra code added to ensure that project wont crash on reload/hard reload -remove this after perun-core route fix
      if (this.props.farmData) {
        this.displayComponent('DYNAMIC', this.props.paramsComponent.params);
        this.getConfiguration(this.props.farmObjId, this.props.paramsComponent.params)
        this.generateInfo(this.props.farmData.rowsData)
        this.setState({ showDynamicMenu: true })
      } else {
        this.setState({ showSearchForm: true, dataForm: undefined, componentAddReg: undefined })
        let href = `/main/farm-registry/farm/search`
        this.hashHistory.push(href)
        this.setState({ activeElement: 'SEARCH', activeChild: '', activeParent: '' })
        this.setState({
          showDynamicMenu: false,
          showFarmInfo: false,
        })
      }
    }
    if (this.props.lpisback.backFromLpis) {
      this.getConfiguration(this.props.farmObjId, this.props.lpisback.tableName)
      this.generateInfo(this.props.farmData.rowsData)
      this.setState({ showDynamicMenu: true })
    }
  }
  removePrefix = (str) => {
    return str.replace(/^SUB-/, '');
  }

  hasSubPrefix = (str) => {
    return str.includes("SUB-");
  }

  //function used to get the side menu confirguration from backend
  getConfiguration = (objid, preSelectedTable) => {
    this.setState({ loading: true })
    let isSubElement = false
    let url = window.server + `/custom-menu/get-configuration/sid/${this.props.svSession}/component-name/db-menu/object-id/${objid}/object-type/FARM`
    axios.get(url).then(res => {
      this.setState({ configuration: res.data, loading: false })
      //condition used to determine if the user reloaded the page while looking at farm details
      if (preSelectedTable) {
        if (this.hasSubPrefix(preSelectedTable)) {
          isSubElement = true
        }
        res.data.data.map(el => {
          if (el.data) {
            el.data.map(child => {
              if (child.ID.includes(this.removePrefix(preSelectedTable))) {
                this.onButtonClick(child, true);
                this.setActive(el)
              }
            })
          } else if (el.ID.includes(this.removePrefix(preSelectedTable))) {
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

  displayComponent = (component, tableName, configuration, child) => {
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
        if (child) {
          href = `/main/farm-registry/farm/SUB-${tableName}`
        }
        else href = `/main/farm-registry/farm/${tableName}`
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

  setActive = (el) => {
    if (el.ID === this.state.activeParent) {
      this.setState({ activeParent: '', loading: false });
    } else {
      this.setState({ activeParent: el.ID })
    }
  }

  generateCustomButtons = () => {
    const { activeElement, activeChild, activeParent } = this.state
    if (this.state.configuration && Array.isArray(this.state.configuration.data)) {
      return this.state.configuration.data.map(el => {
        let modifiedID = el.ID.replace(/\d/g, '').replace(/_$/, '');
        return (
          <>
            <button
              className={`${style["btn_sub"]} ${activeElement === el.ID && !el.data && style['active']}`}
              onClick={() => (el.data ? this.setActive(el) : this.onButtonClick(el))}
            >
              <span className={style['dynamic-comp-icon-holder']}>{iconManager.getIcon(modifiedID)}</span><p>{el.label}</p>
            </button>
            {el.data && <div className={el.ID === activeParent ? style['sub-menu-sub-item-active'] : style['sub-menu-sub-item-hidden']}>
              {el.data.map(sub => {
                modifiedID = sub.ID.replace(/\d/g, '').replace(/_$/, '')
                return < button
                  className={`${style["btn_sub"]} ${activeChild === sub.ID && style['active']}`
                  }
                  onClick={() => (sub.ID.includes('PRINT') ? this.printFunc(sub) : this.onButtonClick(sub, true))}
                >
                  <span className={style['dynamic-comp-icon-holder']}>{iconManager.getIcon(modifiedID)}</span><p>{sub.label}</p>
                </button>
              })}
            </div >}
          </>
        );
      });
    } else {
      return <></>;
    }
  }

  printFunc = (sub) => {
    let url = window.server + sub.onSubmit;
    window.open(url, '_blank');
  }

  onButtonClick = (element, childEl) => {
    const id = element.ID;
    const splitID = id.replace(/\d/g, '').replace(/_$/, '');
    if (childEl) {
      this.displayComponent('DYNAMIC', splitID, element, true);
      this.setState({ activeChild: id, loading: false, activeElement: '' });
    } else {
      this.displayComponent('DYNAMIC', splitID, element);
      this.setState({ activeElement: id, loading: false, activeChild: '' });
    }
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
                this.setState({ activeElement: 'SEARCH', activeChild: '', activeParent: '' })
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
                  this.setState({ activeElement: 'ADD_FARM', activeChild: '', activeParent: '' })
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