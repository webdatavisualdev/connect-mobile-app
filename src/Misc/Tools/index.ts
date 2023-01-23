import * as CustomKeychain from './custom_Keychain';
import tags from './tags';
import TypeGuards from './TypeGuards';
import { helper_ClearAsyncStorage as ClearAsyncStorage } from './helper_ClearAsyncStorage';
import { faker_Feed as FakeFeed } from './faker_Feed';
import interpretAccentColor from './helper_interpretAccentColor';
import { hasDelta } from './helper_CheckDeltas';
import { NavitationScreenOptions } from './custom_NavitationScreenOptions';
import { getCorrectLink } from './helper_ModifyLink';
import { ServerTimeToLocal } from './helper_ConvertTime';
import { InteractionManager } from 'react-native';

export default {
  CustomKeychain,
  tags,
  TypeGuards,
  ClearAsyncStorage,
  interpretAccentColor,
  hasDelta,
  getCorrectLink,
  ServerTimeToLocal,
  faker: {
    FakeFeed,
  },
  InteractionManager,
  NavitationScreenOptions,
};
