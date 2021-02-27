## React Native Modal sheets

### Simple react native modal sheet

#### Install

using yarn : `yarn add modal-sheet` <br>
using npm : `npm i modal-sheet`

```JSX
import Modal from 'modal-sheet';

// ...
<Modal size="m" visible={shown} close={onClose}>
  {children}
</Modal>
// ...
```

| Props   | Require | Description                                       |
| ------- | ------- | ------------------------------------------------- |
| visible | yes     | show/hide modal                                   |
| close   | yes     | callback for close modal `(bol)=>setVisible(bol)` |
| size    | no      | `"s"`, `"m"` ,`"l"`                               |
