import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';

import {
  Animated,
  ColorValue,
  KeyboardAvoidingView,
  Modal as RNModal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';

interface Modal {
  close(): void;
  open(): void;
}

export interface ModalProps {
  size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'full';
  dragColor?: ColorValue;
  dragShadowColor?: ColorValue;
  disableDrag?: boolean;
  backDropColor?: string;
  onClosed?(): void;
  innerKey?: React.Key;
}

function getHeight(size: ModalProps['size'], H: number) {
  let height = H * 0.3;

  switch (size) {
    case 'xs':
      height = H * 0.25;
      break;
    case 's':
      height = H * 0.36;
      break;
    case 'm':
      height = H * 0.5;
      break;
    case 'l':
      height = H * 0.6;
      break;
    case 'xl':
      height = H * 0.7;
      break;
    case 'full':
      height = H - 20;
      break;
    default:
      height = H * 0.36;
      break;
  }
  return height;
}

const ModalComponent: React.ForwardRefRenderFunction<Modal, React.PropsWithChildren<ModalProps>> = (props, ref) => {
  const { backDropColor = '', disableDrag = false, onClosed, size, dragShadowColor, dragColor, children, innerKey } = props;

  const panAnimated = useRef(new Animated.ValueXY()).current;
  const backgroundColor = useRef(new Animated.Value(0)).current;

  const { height: H, width } = useWindowDimensions();
  const height = useMemo(() => getHeight(size, H), [H, size]);

  const [visible, setVisible] = React.useState(false);

  const onClose = useCallback(() => {
    Animated.timing(backgroundColor, { toValue: 0, duration: 300, useNativeDriver: false }).start(() => {
      onClosed?.();
      setVisible(() => false);
    });
  }, [backgroundColor, onClosed]);

  const onOpen = useCallback(() => {
    setVisible(() => true);
  }, []);

  const onShow = useCallback(() => {
    Animated.timing(backgroundColor, { toValue: 1, useNativeDriver: false, duration: 300, delay: 200 }).start();
  }, [backgroundColor]);

  const panrespon = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, g) => {
        if (g.dy > 0) {
          Animated.event([null, { dy: panAnimated.y }], { useNativeDriver: false })(e, g);
        }
      },
      onPanResponderRelease: (_e, gesture) => {
        if (gesture.dy > height / 2.5) {
          onClose();
        } else {
          Animated.spring(panAnimated, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            speed: 30
          }).start();
        }
      }
    })
  ).current;

  const bgColorMemo = useMemo(
    () =>
      backgroundColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', backDropColor || 'rgba(0,0,0,0.7)']
      }),
    [backDropColor, backgroundColor]
  );

  useEffect(() => {
    if (visible === true) {
      Animated.spring(panAnimated, { toValue: { x: 0, y: 0 }, useNativeDriver: false, speed: 3 }).start();
    }
  }, [panAnimated, visible]);

  useImperativeHandle(
    ref,
    () => ({
      open: onOpen,
      close: onClose
    }),
    [onClose, onOpen]
  );

  return (
    <RNModal
      key={innerKey}
      pointerEvents="none"
      collapsable={true}
      statusBarTranslucent
      needsOffscreenAlphaCompositing={true}
      transparent
      animationType="slide"
      onShow={onShow}
      visible={visible}
      onRequestClose={onClose}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: bgColorMemo
          }
        ]}
      />
      <KeyboardAvoidingView
        removeClippedSubviews
        renderToHardwareTextureAndroid
        enabled={true}
        behavior="padding"
        style={{ flex: 1 }}
        pointerEvents="auto">
        <TouchableOpacity touchSoundDisabled={true} disabled={disableDrag} activeOpacity={1} style={styles.content}>
          <Animated.View
            pointerEvents="auto"
            collapsable={true}
            needsOffscreenAlphaCompositing={true}
            style={[styles.modal, { height, width, transform: [{ translateY: panAnimated.y }] }]}
            renderToHardwareTextureAndroid
            removeClippedSubviews>
            <View pointerEvents="auto" {...panrespon.panHandlers}>
              <TouchableOpacity activeOpacity={1} disabled={disableDrag}>
                <View
                  pointerEvents="auto"
                  style={[styles.drag, { shadowColor: dragShadowColor ? dragShadowColor : '#000' }]}>
                  <View style={[styles.dgragIcon, { backgroundColor: dragColor }]} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }} pointerEvents="auto" collapsable={true} needsOffscreenAlphaCompositing={true}>
              <React.Fragment>{children}</React.Fragment>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

const ComponentRef = forwardRef(ModalComponent);
const Modal = React.memo(ComponentRef);

export default Modal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    overflow: 'hidden'
  },
  content: { flex: 1, justifyContent: 'flex-end' },
  drag: {
    backgroundColor: 'transparent',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2.4,
    shadowOpacity: 0.2
  },
  dgragIcon: { width: 50, height: 5, borderRadius: 8 }
});
