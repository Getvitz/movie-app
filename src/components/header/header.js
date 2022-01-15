
import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Header = function Header() {
    return (
  <Tabs defaultActiveKey="1" centered>
    <TabPane tab="Search" key="1" />
    <TabPane tab="Rated" key="2" />
  </Tabs>
    )};

export default Header;