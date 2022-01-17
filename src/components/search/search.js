import React from 'react';
import { Input } from 'antd';
import propTypes from 'prop-types';
import { Component } from 'react/cjs/react.production.min';
import debounce from 'lodash.debounce';

export default class Search extends Component {

  onInputChange = (event) => {
    const {onSearchInput} = this.props;
    const inputValue = event.target.value;
    onSearchInput(inputValue)
  } 

  render() {
    return (
      <Input  placeholder="Type to search..." onChange={debounce(this.onInputChange, 1000)} />
    )
  }

}

Search.propTypes = {
  onSearchInput: propTypes.func.isRequired
}