import React from 'react';
import propTypes from 'prop-types';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Header = function Header(props) {
  const { onTabsChange } = props;
  return (
    <Tabs defaultActiveKey="1" centered onChange={onTabsChange}>
      <TabPane tab="Search" key="search" />
      <TabPane tab="Rated" key="rated" />
    </Tabs>
  );
};

export default Header;

Header.propTypes = {
  onTabsChange: propTypes.func.isRequired,
};
