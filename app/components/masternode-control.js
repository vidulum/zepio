// @flow

import React, { useState } from 'react';
import styled, { withTheme } from 'styled-components';

import { TextComponent } from './text';
import { Button } from './button';
import { InputComponent } from '../components/input';

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
  padding: 20px 20px;
  position: relative;
  background-color: ${props => props.theme.colors.masternodesSummaryBg};
`;

const AliasInputComponent = styled(InputComponent)`
  border: 1px solid ${props => props.theme.colors.masternodesSummaryColumnBorder};
  font-size: 12px;
`;

const MasternodeTotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 130px;
  border-right: 1px solid ${props => props.theme.colors.masternodesSummaryColumnBorder};
  padding: 20px 20px;
  position: relative;
  background-color: ${props => props.theme.colors.masternodesSummaryBg};
  text-align: center;
`;

const MasternodeOwnedContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 130px;
  border-right: 1px solid ${props => props.theme.colors.masternodesSummaryColumnBorder};
  padding: 20px 20px;
  position: relative;
  background-color: ${props => props.theme.colors.masternodesSummaryBg};
  text-align: center;
`;

const MasternodeRewardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 130px;
  padding: 20px 15px;
  position: relative;
  background-color: ${props => props.theme.colors.masternodesSummaryBg};
  text-align: center;
`;

type Props = {
  startAliasTrigger: (alias: string) => void,
  toggle: () => void,
  masternodesCount: number,
  ownedMasternodesCount: number,
  theme: AppTheme,
};

export const Component = ({
  startAliasTrigger,
  toggle,
  masternodesCount,
  ownedMasternodesCount,
  theme,
}: Props) => {

  const [alias, setAlias] = useState('');

  return <OutsideWrapper>
    <OutsideLabel value='Masternode Control' />
    <Wrapper>
      <ButtonContainer>
        <AliasInputComponent
          type='input'
          onFocus={event => event.currentTarget.select()}
          onChange={setAlias}
          value={alias}
        />
        <Button
          id='send-show-additional-options-button'
          onClick={() => {
            startAliasTrigger(alias);
            toggle();
          }}
          label='Start Alias'
          disabled={alias.length == 0}
        />
      </ButtonContainer>
      <MasternodeTotalContainer>
        <TextComponent value='Total Masternodes' isBold size={theme.fontSize.large * 0.9} align='center' />
        <TextComponent
          value={masternodesCount}
          isBold
          size={theme.fontSize.large * 1.5}
          align='center'
        />
      </MasternodeTotalContainer>
      <MasternodeOwnedContainer>
        <TextComponent value='Owned Masternodes' isBold size={theme.fontSize.large * 0.9} align='center' />
        <TextComponent
          value={ownedMasternodesCount}
          isBold
          size={theme.fontSize.large * 1.5}
          align='center'
        />
      </MasternodeOwnedContainer>
      <MasternodeRewardContainer>
        <TextComponent value='Estimated Reward' isBold size={theme.fontSize.large * 0.9} align='center' />
        <TextComponent
          value={masternodesCount == 0 ? '' : Math.floor(((4608 / masternodesCount) * ownedMasternodesCount))+' VDL/Day'}
          isBold
          size={theme.fontSize.large}
          align='center'
        />
      </MasternodeRewardContainer>
    </Wrapper>
  </OutsideWrapper>;
};

export const MasternodeControlComponent = withTheme(Component);
