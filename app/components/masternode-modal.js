// @flow

import React from 'react';
import styled, { withTheme } from 'styled-components';

import CloseIcon from '../assets/images/close_icon.svg';

import { TextComponent } from './text';
import type { StartMasternodeResult } from './masternode-item';

const Wrapper = styled.div`
  width: 460px;
  background-color: ${props => props.theme.colors.transactionDetailsBg};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: ${props => props.theme.boxBorderRadius};
  box-shadow: ${props => props.theme.colors.transactionDetailsShadow};
  position: relative;
`;

const TitleWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
`;

const CloseIconWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: flex-end;
  position: absolute;
`;

const CloseIconImg = styled.img`
  width: 16px;
  height: 16px;
  margin-top: 12px;
  margin-right: 12px;
  cursor: pointer;

  &:hover {
    filter: brightness(150%);
  }
`;

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`;

type Props = {
  result: StartMasternodeResult,
  handleClose: () => void,
  theme: AppTheme,
};

const Component = ({
  result,
  handleClose,
  theme,
}: Props) => (
  <Wrapper>
    <CloseIconWrapper>
      <CloseIconImg src={CloseIcon} onClick={handleClose} />
    </CloseIconWrapper>
    <TitleWrapper>
      <TextComponent value='Start Masternode Result' align='center' />
    </TitleWrapper>
    <DetailsWrapper>
      <TextComponent
        value={String(result)}
        align='center'
        isBold
        color={theme.colors.transactionDetailsLabel({ theme })}
      />
    </DetailsWrapper>
  </Wrapper>
);

export const StartMasternodeModalComponent = withTheme(Component);
