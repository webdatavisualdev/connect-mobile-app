import * as React from 'react';
import { Dimensions, ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

// : Hooks
import H, { Routes, iReduxState } from './../../Hooks';

// : Components
import C from './../../Components';

interface IContent {
  description: string;
  image: ImageSourcePropType;
}

interface IItem {
  item: IContent;
  index: number;
}

export const WalkthroughCards: React.FC<any> = () => {
  const { width, height } = Dimensions.get('window');

  const pageContents: IContent[] = [
    {
      description: 'Access work applications and save your favorites for quick access (e.g., The Hub, Outlook, Time and Attendance)',
      image: require('./../../Assets/onboardingImages/onboarding1.png'),
    },
    {
      description: 'Learn about the latest AdventHealth news, events, discounts and more.',
      image: require('./../../Assets/onboardingImages/onboarding2.png'),
    },
    {
      description: 'For managers, keep up with approvals to quickly review and respond.',
      image: require('./../../Assets/onboardingImages/onboarding3.png'),
    },
  ];

  const carouselRef = React.useRef(null);
  const nav = H.NPM.navigation.useNavigation();
  const isFocused = H.Misc.useScreenMount(Routes.walkthroughCards, {});
  const [_setReturningUserCache, _delReturningUserCache, getReturningUserCache, _allReturningUserCache] = H.Misc.useAsyncStorage({
    class: 'Auth',
    categories: ['ReturningUser'],
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (isFocused) {
      getReturningUserCache(['returningUser']).then((user) => {
        if (user[0][1] && user[0][1].length > 0) {
          nav.reset({ index: 1, routes: [{ name: Routes.RootStack }, { name: Routes.authStack, params: { screen: Routes.authPin } }] });
        } else {
          nav.reset({ index: 0, routes: [{ name: Routes.RootStack, params: { screen: Routes.walkthroughCards } }] });
        }
      });
    }
  }, []);

  const renderItem = (item: IContent, index: number, items: IContent[]) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.item}
        onPress={() => {
          (carouselRef.current as any).scrollToIndex(index);
        }}>
        <C.View style={styles.imageBackground}>
          <C.RNImage source={item.image} style={styles.image} />
        </C.View>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    emptyContainer: {
      width: 80,
    },
    btnLogin: {
      width: 80,
      alignSelf: 'center',
      backgroundColor: 'transparent',
      padding: 0,
    },
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      elevation: 3,
    },
    imageBackground: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    image: {
      resizeMode: 'contain',
      width: undefined,
      flex: 0.8,
    },
    lowerContainer: {
      backgroundColor: '#288AC8',
      height: height / 3.5,
    },
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
      padding: 30,
    },
    titleText: {
      fontSize: 18,
      color: 'white',
      textAlign: 'center',
    },
    dotsContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 20,
    },
    dots: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    baseDot: {
      borderRadius: 7,
      borderWidth: 1,
      borderColor: 'white',
      width: 14,
      height: 14,
      marginLeft: 4,
      marginRight: 4,
    },
    activeDot: {
      backgroundColor: 'white',
    },
    inActiveDot: {
      backgroundColor: 'transparent',
    },
  });

  return (
    <C.View style={styles.container}>
      <C.Carousel
        data={pageContents}
        itemWidth={width}
        containerWidth={width}
        inActiveOpacity={1}
        inActiveScale={1}
        renderItem={({ item, index }: IItem) => renderItem(item, index, pageContents)}
        ref={carouselRef}
        separatorWidth={0}
        onScrollEnd={(item: IItem, index: number) => setSelectedIndex(index)}
      />
      <C.View style={styles.lowerContainer}>
        <C.View style={styles.titleContainer}>
          <C.Text style={styles.titleText}>{pageContents[selectedIndex].description}</C.Text>
        </C.View>
        <C.View style={styles.dotsContainer}>
          <C.View style={styles.emptyContainer} />
          <C.View style={styles.dots}>
            {pageContents.map((_, i) => (
              <C.View style={[styles.baseDot, i === selectedIndex ? styles.activeDot : styles.inActiveDot]} />
            ))}
          </C.View>
          <C.Button
            style={styles.btnLogin}
            onPress={async () => {
              await AsyncStorage.setItem('HasViewedWelcomeCards', '1');
              nav.navigate(Routes.authStack);
            }}>
            <C.Text>Sign In</C.Text>
          </C.Button>
        </C.View>
      </C.View>
    </C.View>
  );
};
