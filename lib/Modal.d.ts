import React from 'react';
declare type Props = {
    visible: boolean;
    close: (val: boolean) => void;
    size?: 's' | 'm' | 'l';
};
declare const Modal: React.FC<Props>;
export default Modal;
