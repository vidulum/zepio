// @flow
import React from 'react';
import { LIGHT, THEME_MODE } from '../constants/themes';
import electronStore from '../../config/electron-store';

export const VidulumLogo = () => {
  const themeInStore = String(electronStore.get(THEME_MODE));
  let img = 'https://github.com/vidulum/Vidulum-Press-Kit/raw/master/vidulum-BWicon.png';
  if (themeInStore === LIGHT) {
    img = 'https://github.com/vidulum/Vidulum-Press-Kit/raw/master/vidulum-BWicon.png';
  }

  return (
    <img vspace='0' hspace='57' width='65px' heigth='65px' src={img} alt='VDL' />
  );
};
