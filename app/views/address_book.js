// @flow

import React, { PureComponent } from 'react';
import styled, { withTheme } from 'styled-components';

import { FETCH_STATE } from '../constants/fetch-states';

import { InputLabelComponent } from '../components/input-label';
import { AddressBookAddress } from '../components/address-book-address';
import { LoaderComponent } from '../components/loader';

import ShieldGrayImage from '../assets/images/shield_dark_gray.png';

import type { MapStateToProps, MapDispatchToProps } from '../containers/addressbook';

const Label = styled(InputLabelComponent)`
  text-transform: uppercase;
  color: ${props => props.theme.colors.transactionsDate};
  font-size: ${props => `${props.theme.fontSize.regular * 0.9}em`};
  font-weight: ${props => String(props.theme.fontWeight.bold)};
  margin-bottom: 5px;
`;

const ShieldedLabel = styled(Label)`
  padding-left: 14px;
  position: relative;

  &:before {
    position: absolute;
    left: 0;
    top: -1px;
    content: '';
    background: url(${ShieldGrayImage});
    background-size: cover;
    height: 12px;
    width: 11px;
  }
`;

type Props = MapDispatchToProps &
  MapStateToProps & {
    theme: AppTheme,
  };

type State = {
};

class Component extends PureComponent<Props, State> {

  componentDidMount() {
    const { loadAddresses } = this.props;

    loadAddresses();
  }

  render() {
    const { addresses, theme, fetchState } = this.props;

    if (fetchState === FETCH_STATE.INITIALIZING) {
      return <LoaderComponent />;
    }

    const shieldedAddresses = addresses.filter(({ address }) => address.startsWith('z'));
    const transparentAddresses = addresses.filter(({ address }) => address.startsWith('v'));

    return (
      <div id='receive-wrapper'>
        <ShieldedLabel value='Shielded Address' id='shielded-address-label' />
        {shieldedAddresses.map(({ address, balance, label }) => (
          <AddressBookAddress key={address} address={address} balance={balance} label={label} />
        ))}
        <Label value='Transparent Address (not private)' />
        {transparentAddresses.map(({ address, balance, label }) => (
          <AddressBookAddress key={address} address={address} balance={balance} label={label} />
        ))}
      </div>
    );
  }
}

export const AddressBookView = withTheme(Component);
