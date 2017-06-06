<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## DropdownInput

**Extends Component**

Renders renders a text input inside a dropdown container to provide a free text dropdown component.
Possible options are value and placeholder which are both strings.

**Properties**

-   `props` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** React properties object
    -   `props.value` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Value of text input
    -   `props.placeholder` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Placeholder for text inputs (Filter input or Input only version)
    -   `props.handle` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Function used to propagate data

### constructor

**Parameters**

-   `props` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** React props

### componentDidMount

Prevent default change event to bubble up

Returns **void** 

### componentWillUnmount

Prevent default change event to bubble up

Returns **void** 

### onKeyDown

Call submit on enter key

**Parameters**

-   `event` **[KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)** JavaScript Event object

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

### onChange

Set input value to state

**Parameters**

-   `event` **[KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)** JavaScript event object

Returns **void** 

### onSubmit

Called when enter or submit key is pressed

Returns **void** 

### getHeight

Gets the height of the menu container to scale the outer container up

Returns **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

### render

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

### defaultProps

### propTypes