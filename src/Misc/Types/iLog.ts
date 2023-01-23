export interface iLog {
  type: 'log' | 'warn' | 'error' | 'debug';
  source: string;
  id: string;
  timestamp: number;
  analytics?: {
    name: string;
    stripExtraData: boolean;
  };
  title: string;
  message: string;
  tags: eLogTags[];
  extras?: any; // : Extra data to be included in the log...
}

/** Prefab Tags, all tags should be referenced here... */
export enum eLogTags {
  // The user did something
  userInteraction = 'interaction_userInteraction',
  gesture = 'interaction_gesture',
  press = 'interaction_press',
  longPress = 'interaction_longPress',
  userTriggerEvent = 'interaction_analyticsEvent',

  // Resulting Actions
  navigate = 'action_navigate',

  // Event source type
  button = 'source_button',
  text = 'source_text',
  image = 'source_image',

  // Networking Related Tags
  network = 'net_network',
  fetch = 'net_fetch',

  // Problems or Errors
  error = 'error_error',
  warning = 'error_warning',

  // Misc Tags (Could have meaning in multiple categories)
  refresh = 'misc_refresh',
  analyticsEvent = 'misc_analyticsEvent',

  // Event/Error Sources
  firebase = 'firebase',
}

/** Prefab Titles for easy re-use */
export enum eLogTitles {
  ScreenView = 'SCREEN_VIEW',
}
