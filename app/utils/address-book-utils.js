import electronStore from '../../config/electron-store';

// @flow
export const getAddressLabel = (address: string): string => {
    return electronStore.get('label_'+address, '');
}

export const setAddressLabel = (address: string, label: string = '') => {
    electronStore.set('label_'+address, label);
}

export const formatAddressLabel = (address: string): string => {
    var label = getAddressLabel(address);
    if (label.length > 0) {
        return label+' ('+address+')';
    }
    return address;
}