@echo off

IF NOT EXIST %AppData%\Vidulum (
    mkdir %AppData%\Vidulum
)

IF NOT EXIST %AppData%\VidulumParams (
    mkdir %AppData%\VidulumParams
)

IF NOT EXIST %AppData%\Vidulum\vidulum.conf (
   (
    echo addnode=downloads.vidulum.app
    echo rpcuser=username%random%%random%
    echo rpcpassword=password%random%%random%%random%
    echo daemon=1
    echo txindex=1
    echo showmetrics=0
    echo server=1
    echo gen=0
) > %AppData%\Vidulum\vidulum.conf
)

IF NOT EXIST %AppData%\Vidulum\wallet.datm (
    copy %AppData%\Vidulum\wallet.dat %AppData%\Vidulum\wallet.datm
)

IF NOT EXIST %AppData%\Vidulum\masternode.conf (
   (
    echo # Masternode config file
    echo # Format: alias IP:port masternodeprivkey collateral_output_txid collateral_output_index
    echo # Example: mn1 123.123.123.123:7676 5iHaYBVUCYjEMeeH1Y4sBGLALQZE1Yc1K64xiqgX37tGBDQL8Xg 2bcd3c84c84f87eaa86e4e56834c92927a07f9e18718810b92e0d0324456a67c 0
) > %AppData%\Vidulum\masternode.conf
)
