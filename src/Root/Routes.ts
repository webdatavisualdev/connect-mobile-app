export const Routes = {
  RootStack: 'ROOT',

  Start: 'START',

  walkthroughCards: 'WALKTHROUGH_CARDS',
  legalContent: 'LEGAL',

  internalContent: 'INTERNAL',

  dashboardStack: 'DASH_STACK',
  dashboard: 'DASHBOARD',
  dashboardSelect: 'DASH_SELECT',

  authStack: 'AUTH_STACK',
  auth: 'AUTH',
  authPin: 'AUTH_PIN_ENTRY',
  authRegister: 'AUTH_REGISTER',
  authLogout: 'AUTH_LOGOUT',

  chatbotStack: 'CHATBOT_STACK',
  chatbot: 'CHATBOT',

  userSettingsStack: 'USER_SETTINGS_STACK',
  userSettings: 'USER_SETTINGS',
  deviceInfo: 'DEVICE_INFO',

  feedStack: 'FEED_STACK',
  feed: 'FEED',
  feedPostExpand: 'FEED_POST_EXPAND',
  feedPostInfo: 'FEED_POST_INFO',
  feedReportPost: 'FEED_POST_REPORT',
  feedSharePost: 'FEED_POST_SHARE',

  feedProfileSettingsStack: 'FEED_PROFILE_SETTINGS_STACK',
  feedProfileSettings: 'FEED_PROFILE_SETTINGS',
  feedProfileSettingsSave: 'FEED_PROFILE_SETTINGS_SAVE',

  alertsStack: 'ALERTS_STACK',
  alerts: 'ALERTS',
  alertsSettings: 'ALERTS_SETTINGS',

  talentMatch: 'TALENT_MATCH',

  linksStack: 'LINKS_STACK',
  links: 'LINKS',
  linksMyLinks: 'LINKS_MYLINKS',
  linksQuickLinks: 'LINKS_QUICKLINKS',

  appsStack: 'APPS_STACK',
  apps: 'APPS',
  appsFavorites: 'APPS_FAVORITES',
  appsAll: 'APPS_ALL',

  webview: 'WEBVIEW',
  initialLoading: 'INITIAL_LOADING',

  dev: 'DEV',
  devMenu: 'DEV_MENU',
  devStoryBook: 'DEV_STORYBOOK',
  devExperiments: 'DEV_EXPERIMENTS',
  devAsyncStorage: 'DEV_ASYNCSTORAGE',
  devFCMManager: 'DEV_FCM_MANAGER',
  devNavMaster: 'DEV_NAV_MASTER',
  devLogs: 'DEV_LOGS',
};

export default Routes;

export interface iRoutesHierarchyItem {
  route: string;
  type: 'stack' | 'modal' | 'screen';
  routes?: iRoutesHierarchyItem[];
  params?: iParams[];
  navObject: [string, object];
  disableDirectNav?: boolean;
}

export interface iParams {
  optional: boolean;
  key: string;
  type: string;
  sample: any;
}

export const RoutesHierarchy: iRoutesHierarchyItem[] = [
  {
    route: Routes.Start,
    type: 'screen',
    navObject: [Routes.Start, {}],
  },
  {
    route: Routes.RootStack,
    type: 'stack',
    navObject: [Routes.RootStack, {}],
    routes: [
      {
        route: Routes.walkthroughCards,
        type: 'screen',
        navObject: [Routes.walkthroughCards, {}],
      },
      {
        route: Routes.legalContent,
        type: 'screen',
        navObject: [Routes.legalContent, {}],
      },
      {
        route: Routes.internalContent,
        type: 'stack',
        navObject: [Routes.internalContent, {}],
        routes: [
          {
            route: Routes.feed,
            type: 'stack',
            navObject: [Routes.internalContent, { screen: Routes.feedStack }],
            routes: [
              {
                route: Routes.feed,
                type: 'screen',
                navObject: [Routes.internalContent, { screen: Routes.feedStack }],
              },
              {
                route: Routes.feedPostExpand,
                type: 'screen',
                navObject: [Routes.internalContent, { screen: Routes.feedStack, params: { screen: Routes.feedPostExpand } }],
                disableDirectNav: true,
                params: [
                  {
                    optional: false,
                    key: 'data',
                    type: typeof {},
                    sample: undefined,
                  },
                ],
              },
              {
                route: Routes.feedPostInfo,
                type: 'screen',
                navObject: [Routes.internalContent, { screen: Routes.feedStack, params: { screen: Routes.feedPostInfo } }],
                disableDirectNav: true,
                params: [
                  {
                    optional: false,
                    key: 'data',
                    type: typeof {},
                    sample: undefined,
                  },
                ],
              },
              {
                route: Routes.feedReportPost,
                type: 'screen',
                navObject: [Routes.internalContent, { screen: Routes.feedStack, params: { screen: Routes.feedReportPost } }],
                disableDirectNav: true,
                params: [
                  {
                    optional: false,
                    key: 'data',
                    type: typeof {},
                    sample: undefined,
                  },
                ],
              },
              {
                route: Routes.feedSharePost,
                type: 'screen',
                navObject: [Routes.internalContent, { screen: Routes.feedStack, params: { screen: Routes.feedSharePost } }],
                disableDirectNav: true,
                params: [
                  {
                    optional: false,
                    key: 'data',
                    type: typeof {},
                    sample: undefined,
                  },
                ],
              },
              {
                route: Routes.feedProfileSettingsStack,
                type: 'stack',
                navObject: [Routes.internalContent, { screen: Routes.feedStack, params: { screen: Routes.feedProfileSettings } }],
                routes: [
                  {
                    route: Routes.feedProfileSettingsStack,
                    type: 'screen',
                    navObject: [Routes.internalContent, { screen: Routes.feedStack, params: { screen: Routes.feedProfileSettingsStack } }],
                  },
                  {
                    route: Routes.feedProfileSettingsSave,
                    type: 'screen',
                    navObject: [
                      Routes.internalContent,
                      { screen: Routes.feedStack, params: { screen: Routes.feedProfileSettingsStack, params: { screen: Routes.feedProfileSettingsSave } } },
                    ],
                    disableDirectNav: true,
                    params: [],
                  },
                ],
              },
            ],
          },
          {
            route: Routes.alerts,
            type: 'stack',
            navObject: [Routes.internalContent, { screen: Routes.alertsStack }],
            routes: [
              {
                route: Routes.alerts,
                type: 'screen',
                navObject: [Routes.internalContent, { screen: Routes.alertsStack }],
              },
              {
                route: Routes.alertsSettings,
                type: 'screen',
                navObject: [Routes.internalContent, { screen: Routes.alertsStack, params: { screen: Routes.alertsSettings } }],
              },
            ],
          },
          {
            route: Routes.links,
            type: 'stack',
            navObject: [Routes.internalContent, { screen: Routes.linksStack }],
            routes: [
              {
                route: Routes.links,
                type: 'stack',
                navObject: [Routes.internalContent, { screen: Routes.linksStack }],
                routes: [
                  {
                    route: Routes.linksMyLinks,
                    type: 'screen',
                    navObject: [Routes.internalContent, { screen: Routes.linksStack, params: { screen: Routes.linksMyLinks } }],
                  },
                  {
                    route: Routes.linksQuickLinks,
                    type: 'screen',
                    disableDirectNav: true,
                    navObject: [Routes.internalContent, { screen: Routes.linksStack, params: { screen: Routes.linksQuickLinks } }],
                  },
                ],
              },
            ],
          },
          {
            route: Routes.apps,
            type: 'stack',
            navObject: [Routes.internalContent, { screen: Routes.appsStack }],
            routes: [
              {
                route: Routes.apps,
                type: 'stack',
                navObject: [Routes.internalContent, { screen: Routes.appsStack, params: { screen: Routes.apps } }],
                routes: [
                  {
                    route: Routes.appsFavorites,
                    type: 'screen',
                    navObject: [Routes.internalContent, { screen: Routes.appsStack, params: { screen: Routes.appsFavorites } }],
                  },
                  {
                    route: Routes.appsAll,
                    type: 'screen',
                    disableDirectNav: true,
                    navObject: [Routes.internalContent, { screen: Routes.appsStack, params: { name: Routes.appsAll } }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    route: Routes.auth,
    type: 'stack',
    navObject: [Routes.authStack, {}],
    routes: [
      {
        route: Routes.authRegister,
        type: 'modal',
        navObject: [Routes.authStack, { screen: Routes.authRegister }],
      },
      {
        route: Routes.authPin,
        type: 'modal',
        navObject: [Routes.authStack, { screen: Routes.authPin }],
      },
      {
        route: Routes.authLogout,
        type: 'modal',
        navObject: [Routes.authStack, { screen: Routes.authLogout }],
      },
    ],
  },
  {
    route: Routes.dev,
    type: 'stack',
    navObject: [Routes.dev, {}],
    routes: [
      {
        route: Routes.devAsyncStorage,
        type: 'modal',
        navObject: [Routes.dev, { screen: Routes.devAsyncStorage }],
      },
      {
        route: Routes.devExperiments,
        type: 'modal',
        navObject: [Routes.dev, { screen: Routes.devExperiments }],
      },
      {
        route: Routes.devFCMManager,
        type: 'modal',
        navObject: [Routes.dev, { screen: Routes.devFCMManager }],
      },
      {
        route: Routes.devStoryBook,
        type: 'modal',
        navObject: [Routes.dev, { screen: Routes.devStoryBook }],
      },
      {
        route: Routes.devNavMaster,
        type: 'modal',
        navObject: [Routes.dev, { screen: Routes.devNavMaster }],
      },
      {
        route: Routes.devLogs,
        type: 'modal',
        navObject: [Routes.dev, { screen: Routes.devLogs }],
      },
    ],
  },
  {
    route: Routes.webview,
    type: 'modal',
    navObject: [Routes.webview, {}],
    params: [
      {
        optional: false,
        key: 'url',
        type: 'string',
        sample: 'https://www.google.com',
      },
    ],
  },
  {
    route: Routes.initialLoading,
    type: 'modal',
    navObject: [Routes.initialLoading, { hold: true }],
  },
  {
    route: Routes.userSettings,
    type: 'stack',
    navObject: [Routes.userSettings, {}],
    routes: [
      {
        route: Routes.userSettings,
        type: 'modal',
        navObject: [Routes.userSettingsStack, { screen: Routes.userSettings }],
      },
    ],
  },
  {
    route: Routes.chatbotStack,
    type: 'stack',
    navObject: [Routes.chatbotStack, {}],
    routes: [
      {
        route: Routes.chatbot,
        type: 'modal',
        navObject: [Routes.chatbotStack, { screen: Routes.chatbot }],
      },
    ],
  },
];
