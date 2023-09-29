import { React, connect, createHashHistory } from "perun-core";

class TransitionToSubmission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.hashHistory = createHashHistory();
  }

  componentDidMount() {
    /* redirect to new route measures_type with the objId and farmer data */
    let redirectUrl = "/main/iacs-claims/app_type";
    this.hashHistory.push(redirectUrl);
  }

  closeIframe = () => {
    this.setState({ iframe: "" });
  };

  render() {
    const { iframe } = this.state;
    return <>{iframe}</>;
  }
}

const mapStateToProps = (state) => ({
  svSession: state.security.svSession,
});

export default connect(mapStateToProps)(TransitionToSubmission);
