// @flow

import React, { PureComponent, Fragment } from 'react';
import { AutoSizer, List } from 'react-virtualized';
import 'react-virtualized/styles.css';
import styled, { withTheme, keyframes } from 'styled-components';
import store from '../../config/electron-store';

import { MasternodeItemComponent } from '../components/masternode-item';
import { MasternodeHeaderComponent } from '../components/masternode-header';
import { TextComponent } from '../components/text';
import { EmptyMasternodesComponent } from '../components/empty-masternodes';

import type { MapDispatchToProps, MapStateToProps } from '../containers/masternodes';
import { MasternodeControlComponent } from '../components/masternode-control';
import { DARK } from '../constants/themes';
import LoadingIconDark from '../assets/images/sync_icon_dark.png';
import LoadingIconLight from '../assets/images/sync_icon_light.png';
import { ColumnComponent } from '../components/column';
import { Button } from '../components/button';
import { ConfirmDialogComponent } from '../components/confirm-dialog';

type Props = {
  theme: AppTheme,
} & MapStateToProps &
  MapDispatchToProps;

const PAGE_SIZE = 15;
const ROW_HEIGHT = 60;

const ListWrapper = styled.div`
  margin-top: 10px;
`;

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Loader = styled.img`
  width: 45px;
  height: 45px;
  animation: 2s linear infinite;
  animation-name: ${rotate};
  margin-bottom: 30px;
`;

const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 40px;
  width: 100%;
`;

const SuccessContentWrapper = styled.div`
  padding: 0 0 40px 0;
  width: 100%;
`;

const SuccessLabel = styled(TextComponent)`
  color: ${props => props.theme.colors.success};
  font-weight: 700;
  font-size: 30px;

`;

const FormButton = styled(Button)`
  width: 100%;
  margin: 5px 0;

  &:first-child {
    margin-top: 0;
  }
`;
const PreWrapper = styled.pre`
  width: 100%;
  color: ${props => props.theme.colors.text};
  white-space: pre-wrap;
  word-wrap: break-word;
  height: auto;
  max-height: 250px;
  overflow: auto;
`;

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 20px 40px;
`;

const ErrorLabel = styled(TextComponent)`
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 16px;
`;

const ErrorMessage = styled(TextComponent)`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.error};
  text-align: center;
  margin-bottom: 20px;
`;

const ModalContent = styled(ColumnComponent)`
  min-height: 400px;
  align-items: center;
  justify-content: center;

  p {
    word-break: break-word;
  }
`;

export class Component extends PureComponent<Props> {
  componentDidMount() {
    const { getMasternodes, resetMasternodesList } = this.props;

    resetMasternodesList();
    getMasternodes({
      count: PAGE_SIZE,
      offset: 0,
    });
  }

  isRowLoaded = ({ index }: { index: number }) => {
    const { hasNextPage, masternodes } = this.props;
    const masternodesSize = masternodes.length;

    return !hasNextPage || index < masternodesSize;
  };

  renderMasternodes = ({ index }: { index: number }) => {
    const { masternodes } = this.props;
    const masternodesConfObj = store.get('masternode_conf');
    const masternodesConf = Object.keys(masternodesConfObj).map(key => masternodesConfObj[key]);

    const ownedOutputTxs = masternodesConf.map(item => item.output_txid);

    const ownedMasternode = masternodes
      .filter(item => item.txHash && ownedOutputTxs.indexOf(item.txHash) !== -1)
      .map(item => ({ ...item, isOwned: true }));
    const otherMasternode = masternodes
      .filter(item => item.txHash && ownedOutputTxs.indexOf(item.txHash) === -1)
      .map(item => ({ ...item, isOwned: false }));

    const sortedMasternodes = [...ownedMasternode, ...otherMasternode];
    const masternode = sortedMasternodes[index];

    return (
      <MasternodeItemComponent
        txHash={masternode.txHash}
        rank={masternode.rank}
        ip={masternode.ip}
        network={masternode.network}
        addr={masternode.addr}
        status={masternode.status}
        lastSeen={masternode.lastSeen}
        lastPaid={masternode.lastPaid}
        activeTime={masternode.activeTime}
        isOwned={masternode.isOwned}
      />
    );
  };

  renderRow = ({ index, key, style }: { index: number, key: string, style: Object }) => (
    <div key={key} style={style}>
      {this.isRowLoaded({ index }) ? this.renderMasternodes({ index }) : ''}
    </div>
  );

  renderMasternodeHeader = () => (
    <MasternodeHeaderComponent />
  );

  renderHeader = ({ style }: { index: number, key: string, style: Object }) => (
    <div key='header' style={style}>
      {this.renderMasternodeHeader()}
    </div>
  );

  getRowHeight = () => ROW_HEIGHT;

  loadNextPage = () => {
    const { masternodes, getMasternodes } = this.props;

    getMasternodes({ count: PAGE_SIZE, offset: masternodes.length });
  };

  loadMoreRows = async () => {
    const { isLoading } = this.props;

    return isLoading ? Promise.resolve([]) : this.loadNextPage();
  };

  renderModalContent = ({
    toggle,
  }: {
    toggle: () => void,
  }) => {
    const {
      startMasternodesResult, error, theme, isLoading,
    } = this.props;
    const loadingIcon = theme.mode === DARK ? LoadingIconDark : LoadingIconLight;

    if (isLoading) {
      return (
        <LoaderWrapper>
          <Loader src={loadingIcon} />
          <TextComponent value='Starting masternodes...' />
        </LoaderWrapper>
      );
    }

    if (startMasternodesResult) {
      return (
        <SuccessWrapper id='send-success-wrapper'>
          <SuccessLabel value='Start Masternode Result' />
          <SuccessContentWrapper>
            <PreWrapper>{JSON.stringify(startMasternodesResult, null, 2)}</PreWrapper>
          </SuccessContentWrapper>
          <FormButton
            label='Done'
            variant='primary'
            onClick={() => {
              toggle();
            }}
          />
        </SuccessWrapper>
      );
    }

    if (error) {
      return (
        <ErrorWrapper>
          <ErrorLabel value='Error' />
          <ErrorMessage id='send-error-message' value={error} />
          <FormButton
            label='Try Again'
            variant='primary'
            onClick={() => {
              this.reset();
              toggle();
            }}
          />
        </ErrorWrapper>
      );
    }
  };

  render() {
    const {
      error, masternodes, hasNextPage, triggerStartMasternodes, startMasternodesResult, isLoading,
    } = this.props;

    const masternodesSize = masternodes.length;
    const isRowLoaded = ({ index }) => !hasNextPage || index < masternodesSize;
    const rowCount = masternodesSize ? masternodesSize + 1 : masternodesSize;
    const masternodeConf = store.get('masternode_conf');
    const ownedMasternodesSize = Object.keys(masternodeConf).length;


    if (error) {
      return <TextComponent value={error} />;
    }

    return (
      <Fragment>
        <ConfirmDialogComponent
          title='Start Masternodes Status'
          showButtons={false}
          renderTrigger={toggle => (
            <MasternodeControlComponent
              toggle={toggle}
              startAllTrigger={() => triggerStartMasternodes()}
              startMasternodesResult={startMasternodesResult}
              masternodesCount={masternodesSize}
              ownedMasternodesCount={ownedMasternodesSize}
            />
          )}
        >
          {toggle => (
            <ModalContent id='start-masternodes-modal' width='100%'>
              {this.renderModalContent({
                toggle,
              })}
            </ModalContent>
          )}
        </ConfirmDialogComponent>

        <AutoSizer>
          {({ width, height, registerChild }) => (
            <ListWrapper style={{ overflow: 'hidden !important' }}>
              <List
                rowRenderer={this.renderHeader}
                rowHeight={50}
                rowCount={1}
                width={width}
                height={50}
              />
              <List
                noRowsRenderer={EmptyMasternodesComponent}
                ref={registerChild}
                rowRenderer={this.renderRow}
                rowHeight={this.getRowHeight}
                rowCount={rowCount}
                width={width}
                height={height - 40}
              />
            </ListWrapper>
          )}
        </AutoSizer>
      </Fragment>
    );
  }
}

export const MasternodesView = withTheme(Component);
