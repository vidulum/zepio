@echo off

IF NOT EXIST %AppData%\Vidulum (
    mkdir %AppData%\Vidulum
)

IF NOT EXIST %AppData%\VidulumParams (
    mkdir %AppData%\VidulumParams
)

IF NOT EXIST %AppData%\Vidulum\vidulum.conf (
   (
    echo rpcuser=username 
    echo rpcpassword=password%random%%random%
    echo daemon=1 
    echo showmetrics=0 
    echo gen=0 
) > %AppData%\Vidulum\vidulum.conf
) 
