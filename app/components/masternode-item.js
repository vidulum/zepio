// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components';
import dateFns from 'date-fns';
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

  &.is-owned {
    background-color: ${props => props.theme.colors.masternodesItemOwnedBg};
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

export type Masternode = {
  rank: string,
  network: string,
  // ip: string,
  txHash: string,
  status: string,
  addr: string,
  lastSeen: string,
  activeTime: string,
  lastPaid: string,
  isOwned: boolean,
  theme: AppTheme,
};

export type StartMasternodeResult = {
  result: string
}

const Component = ({
  rank,
  network,
  // ip,
  txHash,
  status,
  addr,
  lastSeen,
  activeTime,
  lastPaid,
  isOwned,
  theme,
}: Masternode) => {
  const lastSeenAt = dateFns.format(new Date(lastSeen), 'YYYY-MM-DD HH:mm A');
  const activeDuration = dateFns.distanceInWordsToNow(
    dateFns.subSeconds(new Date(), activeTime),
    { includeSeconds: true, addSuffix: false },
  );
  const lastPaidAt = lastPaid === 0 ? 'n/a' : dateFns.format(new Date(lastPaid), 'YYYY-MM-DD HH:mm A');

  return (
    <Wrapper
      id={`mn-${txHash}`}
      alignItems='center'
      justifyContent='space-between'
      color={theme.colors.text}
      className={isOwned ? 'is-owned' : ''}
    >
      <RowComponent alignItems='center'>
        <RelativeRowComponent alignItems='center'>
          <RankColumn>
            <MasternodeText
              value={rank}
            />
          </RankColumn>
          <StatusColumn>
            <MasternodeText
              value={status}
              color={status === 'ENABLED' ? theme.colors.masternodesEnable : theme.colors.masternodesExpire}
            />
          </StatusColumn>
          <AddrColumn>
            <MasternodeText
              value={addr}
            />
          </AddrColumn>
          <LastSeenColumn>
            <MasternodeText
              value={lastSeenAt}
            />
          </LastSeenColumn>
          <LastPaidColumn>
            <MasternodeText
              value={lastPaidAt}
            />
          </LastPaidColumn>
          <ActiveTimeColumn>
            <MasternodeText
              value={activeDuration}
            />
          </ActiveTimeColumn>
        </RelativeRowComponent>
      </RowComponent>
    </Wrapper>
  );
};

export const MasternodeItemComponent = withTheme(Component);
