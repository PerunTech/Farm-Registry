import {
    React,
    connect,
    GenericGrid,
    GridManager,
    FormManager,
    Modal,
    axios,
    ComponentManager,
    PropTypes,
    Form
} from 'perun-core'

class Equipment extends React.Component {
    render() {
        return (<> </>)
    }
}

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

Equipment.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Equipment);
