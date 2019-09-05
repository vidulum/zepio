// @flow
import React, { PureComponent, Fragment } from 'react';
import { TextComponent } from '../components/text';
import styled, { withTheme } from 'styled-components';
import { openExternal } from '../utils/open-external';

const INFO1_TITLE = 'Official Vidulum Links';

const VDL_GITHUB = 'https://github.com/vidulum'
const VDL_WALLET = 'https://gtihub.com/vidulum/DesktopWallet'
const V_APP = 'https://wallet.vidulum.app'
const WEB_PAGE = 'https://vidulum.app'
const VDL_TWITTER = 'https://twitter.com/VidulumApp'
const VDL_FB = 'https://www.facebook.com/VidulumTeam'
const VDL_DCORD = 'https://discord.gg/fxuYqX8'

const INFO0_TITLE = 'Cross-platform, Sapling-enabled, full-node Vidulum Desktop Wallet';
const INFO0_CONTENT = 'This desktop wallet is tailored specifically to mangage and store your VDL, as well ' +
    'as provide an easy-to-use and responsive interface to configure, monitor, and provision your VDL masternodes ' +
    'in just a few clicks. There is a dedicated page for shielding funds, tapping into the power of the Sapling technology one is able to execute a private transaction - within a second or two!\n\n ' +
    ' ' +
    'Sapling drastically improved the efficiency of the Zerocash protocol, allowing for much cheaper computation of the zero-knowledge ' +
    'proofs that are at the heart of zk-Snark technology. This is a game changer because now it is feasible to use private transactions ' +
    'in big industry, banking, and e-commerce - becuase, now a transaction can be executed within a matter of seconds - where as pre Sapling transactions took several ' +
    'minutes at best! Its about 50 times as cheap, and at least 50 fold faster. ' +
    'This will pave the way for practical use cases on mobile devices and smartphones.\n\n ' +
    ' ' +
    '**IDEAS AND FEATURES UNDER DEVELOPMENT**\n\n ' +
    'x The Console is still under development, formatting of data output is needed, and some RPC calls are not working properly.\n\n ' +
    'x The Masternode tab is incomplete, needs more granular control of starting nodes.\n\n ' +
    'x The wallet is currently available for Windows and Linux - OSX is coming soon.\n\n ' +
    'x Address Book, or at the very least a Contact List or labeling system.\n\n ' +
    'x Finish the main menu at the top - need to add some RPC calls to make some cool menu options.\n\n ' +
    'x Get the binaries signed by Apple and Microsoft so the wallet is whitelisted as an officially signed application, and trusted by each OS.\n\n ' +
    'x Multisig wallet support, Viewing Keys/Watching wallets, HD compatibility for Sapling addresses.\n\n ' +
    ' ' +
    '~ The Vidulum Team is dedicated to maintaining good code and even building and improving the wallet as much as possible! ~ '
    ;

const INFO2_TITLE = 'About the Vidulum App and Blockchain';
const INFO2_CONTENT = `Vidulum (VDL) is the native asset of the Vidulum Blockchain. VDL can be mined (PoW - Equihash 192_7), earned from hosting a V-Node, or just from holding VDL and other assets in your web wallet! V-Staking is a unique cold-staking feature that rewards users in VDL the more they use the app. And of course you can purchase VDL on several exchanges. 

The Vidulum App is a multi-asset web wallet that gives users control of their private keys and can be used to store and access funds from any modern browser; wherever - whenever.

The Vidulum Team believes in the power of fostering a good community, and we will always strive to maintain transparency and integrity when dealing with our userbase - and when developing new applications in the Vidulum ecosystem.

Our mandate is to provide ease-of-use and accessibility through our applications, while never sacrificing security. We believe this is crucial to help drive further adoption of crypto and blockchain on a global scale.
`;

const addLineBreaks = string =>
    string.split('\n').map((text, index) => (
        <React.Fragment key={`${text}-${index}`}>
            {text}
            <br />
        </React.Fragment>
    ));

const Wrapper = styled.div`
  max-height: 100%;
  overflow-y: auto;
  background-color: ${props => props.theme.colors.consoleBg};
  border: 1px solid ${props => props.theme.colors.consoleBorder};
  margin-top: ${props => props.theme.layoutContentPaddingTop};
  border-radius: ${props => props.theme.boxBorderRadius};
  padding: 25px;
`;

const InfoInnerWrapper = styled.div`
  margin-bottom: 50px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoTitle = styled(TextComponent)`
  text-transform: uppercase;
  color: gray;
  font-size: ${props => `${props.theme.fontSize.regular * 1.2}em`};
  font-weight: 500;
  margin-bottom: 5px;
`;

const InfoContent = styled(TextComponent)`
  margin-bottom: 5px;
  margin-top: 15px;
  font-weight: 1000;
  letter-spacing: 0.5px;
  line-height: 1.75;
`;

const ContentLink = styled(TextComponent)`
  margin-bottom: 5px;
  margin-top: 7.5px;
  font-weight: 1000;
  letter-spacing: 0.5px;
  line-height: 1.75;
  color: #3054bc;
`;

const HoverText = styled.p`
    margin-bottom: 5px;
    margin-top: 7.5px;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 1.75;
	color: blue;
	:hover {
		color: #000;
		cursor: pointer;
	}
`;

type Props = {
    theme: AppTheme,
};

type State = {
    log: string,
};

class Component extends PureComponent<Props, State> {

    componentDidMount() {
        // ipcRenderer.on('vidulumd-log', (event: empty, message: string) => {
        //   this.setState(() => ({ log: initialLog + message }));
        // });
    }

    componentWillUnmount() {
        // ipcRenderer.removeAllListeners('vidulumd-log');
    }

    render() {
        return (
            <div>
                <Wrapper id='console-wrapper'>
                    <Fragment>
                        <InfoInnerWrapper>
                            <InfoTitle value={INFO0_TITLE} />
                            <InfoContent value={addLineBreaks(INFO0_CONTENT)} />
                        </InfoInnerWrapper>
                    </Fragment>
                </Wrapper>
                <Wrapper>
                    <Fragment>
                        <InfoInnerWrapper>
                            <InfoTitle value={INFO1_TITLE} />
                            <HoverText>
                                <ContentLink value={`GitHub: https://github.com/vidulum `} onClick={() => openExternal(VDL_GITHUB)} />
                                <ContentLink value={`GUI Wallet: https://gtihub.com/vidulum/DesktopWallet`} onClick={() => openExternal(VDL_WALLET)} />
                                <ContentLink value={`V-App: https://wallet.vidulum.app`} onClick={() => openExternal(V_APP)} />
                                <ContentLink value={`Webpage: https://vidulum.app`} onClick={() => openExternal(WEB_PAGE)} />
                                <ContentLink value={`Twitter: https://twitter.com/VidulumApp`} onClick={() => openExternal(VDL_TWITTER)} />
                                <ContentLink value={`Facebook: https://www.facebook.com/VidulumTeam`} onClick={() => openExternal(VDL_FB)} />
                                <ContentLink value={`Discord: https://discord.gg/fxuYqX8`} onClick={() => openExternal(VDL_DCORD)} />
                            </HoverText>
                            <InfoContent value={`Email: support@vidulum.org`} />
                        </InfoInnerWrapper>
                    </Fragment>
                </Wrapper>
                <Wrapper>
                    <Fragment>
                        <InfoInnerWrapper>
                            <InfoTitle value={INFO2_TITLE} />
                            <InfoContent value={addLineBreaks(INFO2_CONTENT)} />
                        </InfoInnerWrapper>
                    </Fragment>
                </Wrapper>
            </div>
        );
    }
}

export const InfoView = withTheme(Component);