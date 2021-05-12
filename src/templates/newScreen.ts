export default `
import React from 'react';
import { StyleSheet } from 'react-native';

import { pushScreen } from '~/core/navigation/helper';

interface SCREEN_NAMEProps {
  componentId: string;
}

const SCREEN_NAME = ({ componentId }: SCREEN_NAMEProps) => {
  return (
    <>

    </>
  );
};

const styles = StyleSheet.create({

});

export function goToSCREEN_NAME(id: string) {
  return pushScreen(id, 'myLuko.SCREEN_NAME', {
    navigationVisible: true,
    bottomTabsVisible: false,
  });
}

export default SCREEN_NAME;
`;