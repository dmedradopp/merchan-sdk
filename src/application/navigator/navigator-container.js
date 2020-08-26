import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation'

class AppNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
  }

  render() {
    const { dispatch, nav, AppNavigator, AddListener } = this.props
    return (
      <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav, addListener : AddListener })} />
    );
  }
}

const mapStateToProps = state => ({
    nav: state.navigator,
});

export default connect(mapStateToProps)(AppNavigationState)
