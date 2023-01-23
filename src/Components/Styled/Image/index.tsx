import * as React from 'react';
import { Image as RNImage, ImageProps, ImageSourcePropType } from 'react-native';

// : Hooks
import H from './../../../Hooks';
import { useImageFileCache } from './../../../Hooks/useImageFileCache';

// : Components
import C from './../../../Components';

// : Misc
import T from './../../../Misc/Tools';

export interface iProps extends ImageProps {
  source: { uri: string };
  predictedWidth?: number;
  predictedHeight?: number;
}

export const Image: React.FC<iProps> = (props) => {
  const [debug, log, warn, error, tags, titles, legacyLog] = H.Logs.useLog({ source: 'Components/Image.tsx' });
  const [src, setSrc] = React.useState<ImageSourcePropType>();
  const [width, setWidth] = React.useState<number>();
  const [height, setHeight] = React.useState<number>();
  const [stall, setStall] = React.useState(true);
  const [localImageUri, status] = useImageFileCache(props.source.uri);

  const handle_LongPress = () => {
    C.Alert.alert(
      'Image Status',
      `width:${width?.toString()}\n
      height:${height?.toString()}\n
      stalling:${stall ? 'true' : 'false'}\n
      status:${status}\n
      url:${src ? src.uri : 'undefined'}`,
    );
  };

  React.useEffect(() => {
    T.InteractionManager.runAfterInteractions(() => {
      setStall(false);
    });
  }, []);

  React.useEffect(() => {
    if (status === 'done' && localImageUri) {
      setSrc({ uri: localImageUri });
      RNImage.getSize(
        localImageUri,
        (w, h) => {
          setWidth(w);
          setHeight(h);
        },
        (err) => {
          error('Error getting image size', `${localImageUri}`, { id: '1635917199', extraData: err });
        },
      );
      setStall(false);
    }
  }, [localImageUri, status]);

  if (src && width && height && !stall) {
    return (
      <>
        <C.Pressable onLongPress={handle_LongPress}>
          <RNImage
            style={{ width: '100%', aspectRatio: width && height ? width / height : 1, borderWidth: 0 }}
            resizeMode="contain"
            resizeMethod="auto"
            {...props}
            source={src}
          />
        </C.Pressable>
      </>
    );
  }

  return (
    <>
      <C.Pressable onLongPress={handle_LongPress}>
        <C.SkeletonContent isLoading={true} layout={[{ width: props.predictedWidth || '100%', height: props.predictedHeight || 200 }]} />
      </C.Pressable>
    </>
  );
};
