## React Native Modal sheets

### Simple react native modal sheet

#### Install

using yarn : `yarn add modal-sheet` <br>
using npm : `npm i modal-sheet`

```JSX
import Modal from 'modal-sheet';

const ref = useRef(null)

const onOpen = () => ref.current.open()

const onClose = () => ref.current.close()

// ...
<Modal ref={ref} size="m">
  {children}
</Modal>
// ...
```

## Props

| Props | Require | Description         |
| ----- | ------- | ------------------- |
| size  | no      | `"s"`, `"m"` ,`"l"` |

## Methods

### `open()`

Open Modal

### `close()`

Close Modal
