import {
    React,
    connect,
    PropTypes,
} from "perun-core";

import Summary from '../../Summary';

const FarmWrapper = (props, context) => {

    return (
        <div>
            {props.children}
            <Summary farmWrapper={true} />
        </div>
    );
};

const mapStateToProps = (state) => ({
    svSession: state.security.svSession,
});
FarmWrapper.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(FarmWrapper);
