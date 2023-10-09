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
    Form,
} from 'perun-core'

class Machinery extends React.Component { }

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});

Machinery.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Machinery);
