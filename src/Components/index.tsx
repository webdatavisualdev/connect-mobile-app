import { FlatList, Pressable, Modal, SafeAreaView, ScrollView, Switch, Alert, KeyboardAvoidingView } from 'react-native';
import * as RN from 'react-native';
import * as NB from 'native-base';
import * as paper from 'react-native-paper';
import { WebView } from 'react-native-webview';
import JSONTree from 'react-native-json-tree';
import DraggableList from 'react-native-draggable-flatlist';
import { BlurView } from '@react-native-community/blur';
import Ionicon from 'react-native-vector-icons/Ionicons';
import MarkDown from 'react-native-markdown-renderer';
import GiftedChat from 'react-native-gifted-chat';
import AdaptiveCard from 'adaptivecards-reactnative';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import Carousel from 'react-native-anchor-carousel';
import Svg, {
  Circle,
  Ellipse,
  G,
  Text as SvgText,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image as SvgImage,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';

import { Title } from './Styled/Title';
import { Text } from './Styled/Text';
import { Image } from './Styled/Image';
import { ImageBackground } from './Styled/ImageBackground';
import { FeedCard } from './Styled/FeedCard';
import { Error } from './Styled/Error';
import { PeoplePicker } from './Styled/PeoplePicker';
import { ProfilePicture } from './Styled/ProfilePicture';
import { ReleaseNotes } from './Styled/ReleaseNotes';
import { Picker as AHPicker } from './Styled/Picker';
import { MultiPicker as AHMultiPicker } from './Styled/MultiPicker';
import { Overlay } from './Styled/Overlay';

export default {
  ...NB,
  Paper: { ...paper },
  WebView,
  FlatList,
  Pressable,
  Modal,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  Title,
  Text,
  Image,
  ImageBackground,
  FeedCard,
  Error,
  JSONTree,
  PeoplePicker,
  ProfilePicture,
  DraggableList,
  BlurView,
  Ionicon,
  MarkDown,
  ReleaseNotes,
  AHPicker,
  AHMultiPicker,
  GiftedChat,
  AdaptiveCard,
  Carousel,
  Svg: {
    Svg,
    Circle,
    Ellipse,
    G,
    SvgText,
    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use,
    SvgImage,
    Symbol,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
  },
  KeyboardAvoidingView,
  RNImage: RN.Image,
  RNPlatform: RN.Platform,
  RNKeyboard: RN.Keyboard,
  RNAnimated: RN.Animated,
  RNLinking: RN.Linking,
  Overlay,
  SkeletonContent,
};
