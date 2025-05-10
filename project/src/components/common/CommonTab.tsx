"use client";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";

type MenuTabPropsType = {
  tabList: {
    label: string;
    component: React.ReactNode;
  }[];
};

export const MenuTab = ({ tabList }: MenuTabPropsType) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container>
      {/* 탭 라벨  */}
      <TabsWrapper value={value} onChange={handleChange} aria-label="basic tabs example">
        {tabList.map((tab, idx) => (
          <StyledTab key={idx} label={tab.label} />
        ))}
      </TabsWrapper>

      {/* 탭 판넬 */}
      {tabList.map((tab, idx) => (
        <CustomTabPanel key={idx} value={value} index={idx}>
          {tab.component}
        </CustomTabPanel>
      ))}
    </Container>
  );
};

//////////////////////////////////////// 스타일 ////////////////////////////////////////
const Container = styled(Box)`
  width: 100%;
`;

const TabsWrapper = styled(Tabs)`
  width: 100%;
  display: flex;
`;

const StyledTab = styled(Tab)`
  flex: 1;
`;

//////////////////////////////////////// 하위 컴포넌트 ////////////////////////////////////////
//////////////////// 커스텀 탭 판넬 ////////////////////
const CustomTabPanel = (props: { children?: React.ReactNode; index: number; value: number }) => {
  const { children, value, index, ...other } = props;

  return (
    <CustomTabPanelContainer role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </CustomTabPanelContainer>
  );
};

const CustomTabPanelContainer = styled(Box)``;
