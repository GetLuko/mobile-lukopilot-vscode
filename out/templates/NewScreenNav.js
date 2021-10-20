"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
import { pushScreen } from '~/core/navigation/helper';
import { registerComponent } from '~/core/navigation/registerComponent';
import { SCREEN_NAME } from '.';

const screenName = 'myLuko.SCREEN_NAME';
export const goToSCREEN_NAME = (componentId: string) => {
  return pushScreen(componentId, screenName, {
    bottomTabsVisible: false,
    noBorder: true,
    largeTitle: false,
  });
};

export const registerSCREEN_NAME = () => {
  registerComponent(screenName, SCREEN_NAME);
};
`;
//# sourceMappingURL=NewScreenNav.js.map