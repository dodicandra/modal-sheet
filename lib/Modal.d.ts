import React from 'react';
import { ColorValue } from 'react-native';
interface Modal {
    close(): void;
    open(): void;
}
export interface ModalProps {
    size?: 's' | 'm' | 'l' | 'xl' | 'full';
    dragColor?: ColorValue;
    dragShadowColor?: ColorValue;
    disableDrag?: boolean;
    backDropColor?: string;
    onClosed?(): void;
}
declare const Modal: React.MemoExoticComponent<React.ForwardRefExoticComponent<ModalProps & {
    children?: React.ReactNode;
} & React.RefAttributes<Modal>>>;
export default Modal;
