// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components';

import { RowComponent } from './row';
import { ColumnComponent } from './column';
import { TextComponent } from './text';


const Wrapper = styled(RowComponent)`
  background-color: ${props => props.theme.colors.masternodesItemBg};
  padding: 15px 15px;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.masternodesItemBorder};
  border-bottom: none;

  &:last-child {
    border-bottom: 1px solid ${props => props.theme.colors.masternodesItemBorder};
  }
`;

const MasternodeText = styled(TextComponent)`
  font-family: 'Source Code Pro', monospace !important;
  color=${props => props.theme.colors.text};
`;

const RankColumn = styled(ColumnComponent)`
  margin-left: 10px;
  margin-right: 10px;
  min-width: 50px;
`;

// const IpColumn = styled(ColumnComponent)`
//   margin-left: 10px;
//   margin-right: 10px;
//   min-width: 200px;
// `;

const StatusColumn = styled(ColumnComponent)`
  margin-left: 10px;
  margin-right: 10px;
  min-width: 80px;
`;

const AddrColumn = styled(ColumnComponent)`
  margin-left: 10px;
  margin-right: 10px;
  min-width: 310px;
`;

const LastSeenColumn = styled(ColumnComponent)`
  margin-left: 10px;
  margin-right: 10px;
  min-width: 160px;
`;

const ActiveTimeColumn = styled(ColumnComponent)`
  margin-left: 10px;
  margin-right: 10px;
  min-width: 160px;
`;

const LastPaidColumn = styled(ColumnComponent)`
  margin-left: 15px;
  margin-right: 10px;
  width: 170px;
`;

const RelativeRowComponent = styled(RowComponent)`
  position: relative;
`;
export type MasternodeHeader = {
  theme: AppTheme,
};

const Component = ({
  theme,
}: MasternodeHeader) => (
  <Wrapper
    id='header'
    alignItems='center'
    justifyContent='space-between'
  >
    <RowComponent alignItems='center'>
      <RelativeRowComponent alignItems='center'>
        <RankColumn>
          <MasternodeText
            value='Rank'
          />
        </RankColumn>
        <StatusColumn>
          <MasternodeText
            value='Status'
          />
        </StatusColumn>
        <AddrColumn>
          <MasternodeText
            value='Address'
          />
        </AddrColumn>
        <LastSeenColumn>
          <MasternodeText
            value='Last seen'
          />
        </LastSeenColumn>
        <LastPaidColumn>
          <MasternodeText
            value='Last paid'
          />
        </LastPaidColumn>
        <ActiveTimeColumn>
          <MasternodeText
            value='Active Time'
          />
        </ActiveTimeColumn>
      </RelativeRowComponent>
    </RowComponent>
  </Wrapper>
);

export const MasternodeHeaderComponent = withTheme(Component);
