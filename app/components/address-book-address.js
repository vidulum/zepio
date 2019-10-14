// @flow

import React, { PureComponent } from 'react';
import styled, { withTheme } from 'styled-components';

import { ColumnComponent } from './column';
import { TextComponent } from './text';
import { InputComponent } from './input';

import EditIconDark from '../assets/images/edit_icon_dark.svg';
import EditIconLight from '../assets/images/edit_icon_light.svg';
import { DARK } from '../constants/themes';

import { getAddressLabel, setAddressLabel } from '../utils/address-book-utils';

const AddressWrapper = styled.div`
  align-items: center;
  display: flex;
  border-radius: ${props => props.theme.boxBorderRadius};
  padding: 0 13px 0 0;
  margin-bottom: 10px;
  width: 100%;
  background: ${props => props.theme.colors.walletAddressBg};
  border: 1px solid ${props => props.theme.colors.walletAddressBorder};
`;

const Address = styled(TextComponent)`
  border-radius: ${props => props.theme.boxBorderRadius};
  border: none;
  background-color: ${props => props.theme.colors.inputBg};
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  width: 90%;
  outline: none;
  font-family: ${props => props.theme.fontFamily};
  font-size: 13px;
  color: ${props => props.theme.colors.walletAddressInput};
  line-height: 1;
  letter-spacing: 0.5px;
  overflow-x: scroll;
  cursor: pointer;
  user-select: text;

  ::-webkit-scrollbar {
    display: none;
  }

  ${AddressWrapper}:hover & {
    color: ${props => props.theme.colors.walletAddressInputHovered};
  }

  ::placeholder {
    opacity: 0.5;
  }
`;

const AddressLabel = styled(TextComponent)`
  font-weight: 700;
  padding-left: 12px;
  font-size: 12px;
  color: ${props => props.theme.colors.walletAddressInput};
  width: 10%;

  ${AddressWrapper}:hover & {
    color: ${props => props.theme.colors.walletAddressInputHovered};
  }
`;

const InnerWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 90%;
  padding: 10px 0;
`;

const EditContainer = styled.div`
  align-items: center;
  display: flex;
  background-color: ${props => props.theme.colors.qrCodeWrapperBg}
  border: 1px solid ${props => props.theme.colors.qrCodeWrapperBorder}
  border-radius: ${props => props.theme.boxBorderRadius};
  padding: 10px 10px 10px 10px;
  margin-bottom: 10px;
  width: 100%;
`;

const IconButton = styled.button`
  background: transparent;
  cursor: pointer;
  outline: none;
  border: none;
  display: flex;
  width: 28px;
  margin-left: 3px;
  position: relative;
`;

const IconImage = styled.img`
  max-width: 23px;
  opacity: 0.4;

  ${IconButton}:hover & {
    opacity: 1;
  }
`;

const ActionsWrapper = styled.div`
  width: 8%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const AddressDetailsLabel = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
  color: ${props => props.theme.colors.transactionLabelText};
  font-size: 0.759375em;
  font-weight: 700;
  font-family: Roboto;
  margin-left: 15px;
  margin-right: 12px;
  margin-top: 5px;
`;

const LabelInputComponent = styled(InputComponent)`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

type Props = {
  address: string,
  theme: AppTheme,
  balance: number,
};

type State = {
  isSecondaryCopied: boolean,
  showDetails: boolean,
  label: string
};

class Component extends PureComponent<Props, State> {
  state = {
    showDetails: false,
    isSecondaryCopied: false,
    label: getAddressLabel(this.props.address),
  };

  showDetails = () => this.setState(() => ({ showDetails: true }));

  toggleDetails = () => this.setState(prevState => ({
    showDetails: !prevState.showDetails,
  }));

  hideTooltip = () => this.setState(() => ({ showCopiedTooltip: false }));

  unCopySecondary = () => this.setState(() => ({ isSecondaryCopied: false }));

  copySecondaryAddress = () => this.setState(
    () => ({ isSecondaryCopied: true }),
    () => setTimeout(() => this.unCopySecondary(), 1500),
  );

  handleChange = (field: string) => (value: string | number) => {
    this.setState(
      () => ({ [field]: value }),
      () => {
        if (field === 'label') {
          setAddressLabel(this.props.address, this.state.label);
        }
      },
    );
  };

  render() {
    const { address, theme } = this.props;
    const { showDetails, isSecondaryCopied, label } = this.state;

    const editIcon = theme.mode === DARK ? EditIconDark : EditIconLight;

    return (
      <ColumnComponent id='wallet-address' width='100%'>
        <AddressWrapper>
          <InnerWrapper>
            <AddressLabel
              id='wallet-address-label'
              value={this.state.label}
            />
            <Address
              id='wallet-address-text'
              value={address}
              onClick={this.toggleDetails}
              onDoubleClick={this.showDetails}
            />
          </InnerWrapper>
          <ActionsWrapper>
            <IconButton id='wallet-address-show-details' onClick={this.toggleDetails}>
              <IconImage src={editIcon} alt='Edit Address Details' />
            </IconButton>
          </ActionsWrapper>
        </AddressWrapper>
        {!showDetails ? null : (
          <EditContainer id='wallet-address-edit'>
            <AddressDetailsLabel>Address Label</AddressDetailsLabel>
            <LabelInputComponent
                      type='input'
                      onChange={this.handleChange('label')}
                      value={this.state.label}
                      bgColor={theme.colors.sendAdditionalInputBg(this.props)}
                      color={theme.colors.sendAdditionalInputText(this.props)}
                      name='label'
                    />
          </EditContainer>
        )}
      </ColumnComponent>
    );
  }
}

export const AddressBookAddress = withTheme(Component);
