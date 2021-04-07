import React from 'react';
declare type Props = {
    visible: boolean;
    close: (val: boolean) => void;
    size?: 's' | 'm' | 'l' | 'xl';
};
interface ModalMethod {
    close(): void;
    open(): void;
}
declare class Modal extends React.Component<Pick<Props, 'size'>, {
    visible: boolean;
}> implements ModalMethod {
    constructor(props: Readonly<Props> | Props);
    close(): void;
    open(): void;
    render(): JSX.Element;
}
export default Modal;
