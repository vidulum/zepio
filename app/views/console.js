// @flow

import React, { PureComponent, Fragment } from 'react';
import styled, { withTheme } from 'styled-components';
import uuid from 'uuid/v4';
import eres from 'eres';
import humanizeDuration from 'humanize-duration';

import { TextComponent } from '../components/text';
import { InputComponent } from '../components/input';

import ConsoleSymbolDark from '../assets/images/console_vidulum_dark.png';
import ConsoleSymbolLight from '../assets/images/console_vidulum_light.png';
import { DARK } from '../constants/themes';
import rpc from '../../services/api';
import store from '../../config/electron-store';

import { METHODS, type APIMethods } from '../../services/utils';

const OutsideWrapper = styled.div`
  margin-top: ${props => props.theme.layoutContentPaddingTop};
`;

const Wrapper = styled.div`
  max-height: 100%;
  overflow-y: auto;
  background-color: ${props => props.theme.colors.consoleBg};
  border: 1px solid ${props => props.theme.colors.consoleBorder};
  margin-top: ${props => props.theme.layoutContentPaddingTop};
  margin-bottom: 10px;
  border-radius: ${props => props.theme.boxBorderRadius};
  padding: 30px;
`;

const ConsoleText = styled(TextComponent)`
  font-family: 'Source Code Pro', monospace;
`;

const ConsoleImg = styled.img`
  height: 100px;
  width: auto;
`;

const breakpoints = [1, 5, 7, 10, 13];

type Props = {
  theme: AppTheme,
};

type State = {
  blockHeight: number,
  connections: number,
  networkSolutionsRate: number,
  commandResults: string,
  commandPreview: string,
  inputCommand: string,
};

class Component extends PureComponent<Props, State> {
  interval: ?IntervalID = null;

  requestOnTheFly: boolean = false;

  state = {
    blockHeight: 0,
    connections: 0,
    networkSolutionsRate: 0,
    commandResults: '',
    commandPreview: '',
    inputCommand: '',
  };

  componentDidMount() {
    this.interval = setInterval(() => this.update(), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  update = async () => {
    if (this.requestOnTheFly) return;

    this.requestOnTheFly = true;

    const [err, result] = await eres(Promise.all([rpc.getinfo(), rpc.getmininginfo()]));

    if (err) return;

    this.setState(
      {
        blockHeight: result[0].blocks,
        connections: result[0].connections,
        networkSolutionsRate: result[1].networksolps,
      },
      () => {
        this.requestOnTheFly = false;
      },
    );
  };

  isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  // TODO: Work in progress
  showCommandResults = async (cmdSplit) => {
    let err;
    let result;

    if(METHODS.indexOf(cmdSplit[0]) >= 0){
      this.setState({ commandPreview: cmdSplit[0] });
      const cmd = cmdSplit[0];
      // console.log(cmdSplit)
      if(cmdSplit.length > 1){
        // const params = ' ' + cmdSplit.slice(1, cmdSplit.length).join(' ');
        let params = cmdSplit.slice(1, cmdSplit.length);
        // console.log(params)
        [err, result] = await eres(rpc[cmd](String(params)));
      }else{
        [err, result] = await eres(rpc[cmd]());
      }
      

      if (err) {
        result = err;
      }

      this.setState(
        {
          commandResults: JSON.stringify(result, undefined, 2),
        }
      );
    }else{
      console.log(cmdSplit)
    }
  };

  keyPressed = (event) => {
    if (event.key === "Enter") {
      let cmdSplit = [];

      if(event.target.value.includes(' ')){
        cmdSplit = event.target.value.split(' ');
      }else{
        cmdSplit = [event.target.value];
      }
      if(METHODS.indexOf(cmdSplit[0]) >= 0){
        this.showCommandResults(cmdSplit);
      }else{
        this.setState({ commandPreview: 'Unknown Command' });
      }
    }
  }

  getLog = (state: State) => `
    Thank you for running a Vidulum node! See <https://vidulum.app/>.

    Block height | ${state.blockHeight}
    Connections | ${state.connections}
    Network solution rate | ${state.networkSolutionsRate} Sol/s
    
    ** CONSOLE IS STILL IN DEVELOPMENT STAGE **
    Command preview: ${state.commandPreview}
    Command output: ${state.commandResults}
  `;

  render() {
    const { theme } = this.props;

    let { inputCommand } = this.state;

    const ConsoleSymbol = theme.mode === DARK ? ConsoleSymbolDark : ConsoleSymbolLight;

    return (
      <OutsideWrapper>
        <Wrapper id='console-wrapper'>
          <Fragment>
            <ConsoleImg src={ConsoleSymbol} alt='Vidulumd' />
            {this.getLog(this.state)
              .split('\n')
              .map((item, idx) => (
                <Fragment key={uuid()}>
                  <ConsoleText value={item} />
                  {breakpoints.includes(idx) ? <br /> : null}
                </Fragment>
              ))}
          </Fragment>
        </Wrapper>
        <InputComponent
            value={inputCommand}
            placeholder='help'
            onKeyPress={this.keyPressed}
            onChange={value => {
              this.setState({ inputCommand: value });
            }}
            inputType='input'
            rows={1}
          />
      </OutsideWrapper>
    );
  }
}

export const ConsoleView = withTheme(Component);
