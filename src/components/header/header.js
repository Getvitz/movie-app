import React from 'react';
import propTypes from 'prop-types';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Header = function Header(props) {
  const { onTabsChange } = props;
  // console.log(getRatedMovies)
  return (
    <Tabs defaultActiveKey="1" centered onChange={onTabsChange}>
      <TabPane tab="Search" key="1" />
      <TabPane tab="Rated" key="2" />
    </Tabs>
  );
};

export default Header;

Header.propTypes = {
  onTabsChange: propTypes.func.isRequired,
};
