import React from 'react';
import { ColorValue } from 'react-native';
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
declare const Modal: React.MemoExoticComponent<React.ForwardRefExoticComponent<ModalProps & React.RefAttributes<Modal>>>;
export default Modal;
