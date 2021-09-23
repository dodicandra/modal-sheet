import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import {
  Animated,
  ColorValue,
  Dimensions,
  KeyboardAvoidingView,
  Modal as RNModal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewProps,
} from 'react-native';

const dimension = Dimensions.get('window');

interface Modal {
  close(): void;
  open(): void;
}
export interface ModalProps {
  size?: 's' | 'm' | 'l' | 'xl';
  dragColor?: ColorValue;
  dragShadowColor?: ColorValue;
  disableDrag?: boolean;
  onClosed?(): void;
  children: (() => React.ReactNode) | React.ReactNode[] | React.ReactNode;
}

const ModalComponent = forwardRef<Modal, ModalProps>(({ ...props }, ref) => {
  const panAnimated = useRef(new Animated.ValueXY()).current;
  const { height: H, width } = useWindowDimensions();

  const [visible, setVisible] = React.useState(false);

  let height = H * 0.3;

  switch (props.size) {
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
    default:
      height = H * 0.36;
      break;
  }

  const onClose = useCallback((val: boolean) => {
    setVisible(val);
  }, []);

  const panrespon = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, g) => {
        if (g.dy > 0) {
          Animated.event([null, { dy: panAnimated.y }], { useNativeDriver: false })(e, g);
        }
      },
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dy > 160) {
          onClose(false);
        } else {
          Animated.spring(panAnimated, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            speed: 30,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible === true) {
      Animated.spring(panAnimated, { toValue: { x: 0, y: 0 }, useNativeDriver: false, speed: 3 }).start();
    }
  }, [visible]);

  useImperativeHandle(ref, () => ({
    open: () => onClose(true),
    close: () => onClose(false),
  }));

  return (
    <RNModal
      pointerEvents="none"
      collapsable={true}
      needsOffscreenAlphaCompositing={true}
      removeClippedSubviews
      transparent
      animationType="slide"
      onDismiss={props.onClosed}
      visible={visible}
      onRequestClose={() => onClose(false)}
    >
      <KeyboardAvoidingView
        removeClippedSubviews
        renderToHardwareTextureAndroid
        enabled={true}
        behavior="padding"
        style={{ flex: 1 }}
        pointerEvents="auto"
      >
        <View style={styles.content}>
          <Animated.View
            pointerEvents="auto"
            collapsable={true}
            needsOffscreenAlphaCompositing={true}
            style={[styles.modal, { height, width, transform: [{ translateY: panAnimated.y }] }]}
            renderToHardwareTextureAndroid
            removeClippedSubviews
          >
            <View pointerEvents="auto" {...panrespon.panHandlers}>
              <TouchableOpacity activeOpacity={1} disabled={props.disableDrag}>
                <View pointerEvents="auto" style={[styles.drag, { shadowColor: props.dragShadowColor ?? '#000' }]}>
                  <View style={[styles.dgragIcon, { backgroundColor: props.dragColor }]} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }} pointerEvents="auto" collapsable={true} needsOffscreenAlphaCompositing={true}>
              {props.children}
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
});

const Modal = React.memo(ModalComponent);

export default Modal;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    overflow: 'hidden',
  },
  content: { backgroundColor: 'rgba(0,0,0,0.7)', flex: 1, justifyContent: 'flex-end' },
  wraper: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  drag: {
    backgroundColor: 'transparent',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 2.4,
    shadowOpacity: 0.2,
  },
  dgragIcon: { width: 50, height: 5, borderRadius: 8 },
  childrenContainer: { flex: 1, width: dimension.width * 0.98, height: '100%', marginVertical: 6, overflow: 'hidden' },
});
