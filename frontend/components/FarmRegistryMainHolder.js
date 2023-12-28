import { React, connect, PropTypes, redux, createHashHistory, } from "perun-core";;
import Farm from './Farm'
const { store } = redux
class FarmRegistryMainHolder extends React.Component {
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
      const href = '/main/farm-registry/farm/search'
      this.hashHistory.push(href)
      store.dispatch({ type: 'SET_ACTIVE_MODULE_MENU_ITEM', payload: 'FARMER' })
      store.dispatch({ type: 'IS_CLICKED', payload: '#/main/farm-registry/farm/search' })
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
          case path.includes('#/main/farm-registry/farm/search'): {
            component = <Farm paramsComponent={'search'} />
            break;
          }
          case path.includes('#/main/farm-registry/farm'): {
            component = <Farm paramsComponent={this.props.match.params} />
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
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  menuIsClicked: state.clickedMenuReducer.isClicked
});

FarmRegistryMainHolder.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FarmRegistryMainHolder);
