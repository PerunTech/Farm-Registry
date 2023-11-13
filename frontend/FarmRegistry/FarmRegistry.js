import { React, connect, MenuHolder, PropTypes, redux, createHashHistory, } from "perun-core";
import AgriCultureHolding from "./FarmRegistration/AgriCultureHolding";
import ERZS from "./FarmRegistration/ERZS";
import Registration from './FarmRegistration/Registration'
import CalendarComponent from './FarmRegistration/CalendarComponent'
import CompanyRegFarm from "./FarmRegistration/CompanyRegFarm";
import AnimalsComp from "./FarmRegistration/AnimalsComp";

const { store } = redux
class FarmRegistry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentToRender: null,
    };
    this.checkComponent = this.checkComponent.bind(this)
    this.hashHistory = createHashHistory();
  }


  componentDidMount() {
    if (document.getElementById("identificationScreen")) {
      document.getElementById("identificationScreen").className =
        "identificationScreen";
      document.getElementById("identificationScreen").innerText =
        this.context.intl.formatMessage({ id: 'perun.plugin.farm_registry', defaultMessage: 'perun.plugin.farm_registry' });
    }

    if (window.location.hash === '#/main/farm-registry') {
      const href = '/main/farm-registry/registration/search'
      this.hashHistory.push(href)
      store.dispatch({ type: 'SET_ACTIVE_MODULE_MENU_ITEM', payload: 'FARMER' })
      store.dispatch({ type: 'IS_CLICKED', payload: '#/main/farm-registry/registration/search' })
    } else {
      this.checkComponent();
    }

  }

  checkComponent(redirectUrl) {
    let path
    if (redirectUrl) {
      path = redirectUrl
    } else {
      path = window.location.hash
    }
    let component
    this.setState({ componentToRender: null }, () => {
      if (path) {
        switch (true) {
          case path.includes('#/main/farm-registry/registration/search'): {
            component = <Registration paramsComponent={'search'} />
            break;
          }
          case path.includes('#/main/farm-registry/registration'): {
            component = <Registration paramsComponent={this.props.match.params} />
            break;
          }
          case path === '#/main/farm-registry': {
            component = <ERZS />
            break;
          }
          case path === '#/main/farm-registry/animal': {
            component = <AnimalsComp />
            break;
          }
          case path === '#/main/farm-registry/cad-parcel': {
            component = <CompanyRegFarm />
            break;
          }
          case path === '#/main/farm-registry/calendar': {
            component = <CalendarComponent />
            break;
          }
          case path === '#/main/farm-registry/show_holding': {
            component = <AgriCultureHolding />
            break;
          }
        }
        this.setState({ componentToRender: component })
      }
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.menuIsClicked !== nextProps.menuIsClicked) {
      this.setState({ componentToRender: null }, () => this.checkComponent())
    }
  }

  render() {
    const { componentToRender } = this.state
    return (
      <>
        {componentToRender}
        {/* <AgriCultureHolding /> */}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  menuIsClicked: state.clickedMenuReducer.isClicked
});

FarmRegistry.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FarmRegistry);
