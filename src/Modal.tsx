import React, { useEffect, useRef } from 'react';

import {
  useWindowDimensions, Animated, Dimensions,
  KeyboardAvoidingView, Modal as RnModal, PanResponder,
  StyleSheet, TouchableOpacity, View,
} from 'react-native';

const { width } = Dimensions.get('window');

type Props = {
  visible: boolean;
  close: (val: boolean) => void;
  size?: 's' | 'm' | 'l';
};

const Modal: React.FC<Props> = ({ ...props }) => {
  const panAnimated = useRef(new Animated.ValueXY()).current;
  const { height: H } = useWindowDimensions();
  const height = props.size === 'l' ? H * 0.7 : props.size === 's' ? H * 0.3 : H * 0.4;
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
          onClose();
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

  const onClose = () => {
    return props.close?.(false);
  };

  useEffect(() => {
    if (props.visible === true) {
      Animated.spring(panAnimated, { toValue: { x: 0, y: 0 }, useNativeDriver: false, speed: 3 }).start();
    }
  }, [props.visible]);

  return (
    <RnModal
      pointerEvents="none"
      collapsable={true}
      needsOffscreenAlphaCompositing={true}
      removeClippedSubviews
      transparent
      animationType="slide"
      visible={props.visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        removeClippedSubviews
        renderToHardwareTextureAndroid
        enabled={true}
        behavior="padding"
        style={{ flex: 1 }}
        pointerEvents="auto"
      >
        <TouchableOpacity touchSoundDisabled={true} activeOpacity={1} style={styles.content}>
          <Animated.View
            pointerEvents="auto"
            collapsable={true}
            needsOffscreenAlphaCompositing={true}
            style={[styles.modal, { height, transform: [{ translateY: panAnimated.y }] }]}
            renderToHardwareTextureAndroid
            removeClippedSubviews
          >
            <View pointerEvents="auto" {...panrespon.panHandlers}>
              <TouchableOpacity activeOpacity={1}>
                <View pointerEvents="auto" style={styles.drag}>
                  <View style={styles.dgragIcon} />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }} pointerEvents="auto" collapsable={true} needsOffscreenAlphaCompositing={true}>
              {props.children}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </RnModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modal: {
    width: width,
    backgroundColor: 'white',
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    overflow: 'hidden',
  },
  content: { backgroundColor: 'rgba(0,0,0,0.3)', flex: 1, justifyContent: 'flex-end' },
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
  },
  dgragIcon: { width: 80, height: 12, elevation: 4, backgroundColor: 'white', borderRadius: 8 },
  childrenContainer: { flex: 1, width: width * 0.98, height: '100%', marginVertical: 6, overflow: 'hidden' },
});
