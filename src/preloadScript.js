import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getDisplayName from 'react-display-name';
import load from 'little-loader';

const DEFAULT_SCRIPT_URL = 'https://static.opentok.com/v2/js/opentok.min.js';

/*
This higher-order component will load the OpenTok client thru a script tag.
It will render its inner component only when the OpenTok client has loaded.
In the meantime, it will render a loading element chosen by the developer.
*/
export default function preloadScript(InnerComponent) {
  class PreloadScript extends Component {
    constructor(props) {
      super(props);

      this.state = {
        scriptLoaded: typeof OT !== 'undefined',
      };
      this.isPresent = false;
    }

    componentDidMount() {
      this.isPresent = true;

      if (this.scriptLoading || this.state.scriptLoaded) {
        return;
      }

      this.scriptLoading = true;

      const scriptUrl = this.props.opentokClientUrl;
      load(scriptUrl, this.onScriptLoad);
    }

    componentWillUnmount() {
      this.isPresent = false;
    }

    onScriptLoad = () => {
      if (this.isPresent) {
        this.setState({ scriptLoaded: true });
      }
    }

    render() {
      const { opentokClientUrl, loadingDelegate, ...restProps } = this.props;

      if (this.state.scriptLoaded) {
        return <InnerComponent {...restProps} />;
      }

      return loadingDelegate;
    }
  }

  PreloadScript.displayName = `preloadScript(${getDisplayName(InnerComponent)})`;
  PreloadScript.propTypes = {
    opentokClientUrl: PropTypes.string,
    loadingDelegate: PropTypes.node,
  };
  PreloadScript.defaultProps = {
    opentokClientUrl: DEFAULT_SCRIPT_URL,
    loadingDelegate: <div />,
  };

  return PreloadScript;
}
