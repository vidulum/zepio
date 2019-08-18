// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components';

import { TextComponent } from './text';
import { Button } from './button';

const OutsideWrapper = styled.div`
  margin-top: ${props => props.theme.layoutContentPaddingTop};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid ${props => props.theme.colors.masternodesSummaryBorder};
  border-radius: ${props => props.theme.boxBorderRadius};
  background-color: ${props => props.theme.colors.masternodesSummaryBg};
`;

const OutsideLabel = styled(TextComponent)`
  text-transform: uppercase;
  color: ${props => props.theme.colors.transactionsDate};
  font-size: ${props => `${props.theme.fontSize.regular * 0.9}em`};
  font-weight: ${props => String(props.theme.fontWeight.bold)};
  margin-bottom: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 130px;
  border-right: 1px solid ${props => props.theme.colors.masternodesSummaryColumnBorder};
  padding: 30px 30px;
  position: relative;
  background-color: ${props => props.theme.colors.masternodesSummaryBg};
`;

const MasternodeTotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 130px;
  border-right: 1px solid ${props => props.theme.colors.masternodesSummaryColumnBorder};
  padding: 30px 30px;
  position: relative;
  background-color: ${props => props.theme.colors.masternodesSummaryBg};
  text-align: center;
`;

const MasternodeOwnedContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 130px;
  padding: 30px 30px;
  position: relative;
  background-color: ${props => props.theme.colors.masternodesSummaryBg};
  text-align: center;
`;

type Props = {
  startAllTrigger: () => void,
  toggle: () => void,
  masternodesCount: number,
  ownedMasternodesCount: number,
  theme: AppTheme,
};

export const Component = ({
  startAllTrigger,
  toggle,
  masternodesCount,
  ownedMasternodesCount,
  theme,
}: Props) => (
  <OutsideWrapper>
    <OutsideLabel value='Masternode Control' />
    <Wrapper>
      <ButtonContainer>
        <Button
          id='send-show-additional-options-button'
          onClick={() => {
            startAllTrigger();
            toggle();
          }}
          label='Start All Masternodes'
        />
      </ButtonContainer>
      <MasternodeTotalContainer>
        <TextComponent value='Total Masternodes' isBold size={theme.fontSize.large} align='center' />
        <TextComponent
          value={masternodesCount}
          isBold
          size={theme.fontSize.large * 1.5}
          align='center'
        />
      </MasternodeTotalContainer>
      <MasternodeOwnedContainer>
        <TextComponent value='Owned Masternodes' isBold size={theme.fontSize.large} align='center' />
        <TextComponent
          value={ownedMasternodesCount}
          isBold
          size={theme.fontSize.large * 1.5}
          align='center'
        />
      </MasternodeOwnedContainer>
    </Wrapper>
  </OutsideWrapper>
);

export const MasternodeControlComponent = withTheme(Component);
