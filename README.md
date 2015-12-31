# jquery-optional-input
Adds checkbox over text input to enable\disable it

Usage:

```javascript

    var $input = $('input');

    // init
    $input.optionalInput({
        value: 'foobar'
    });

    console.log('1. Value is', $input.optionalInput('value'));

    $input.optionalInput('value', null); // checkbox will be unchecked
    console.log('2. Value is', $input.optionalInput('value'));

    $input.optionalInput('value', 'foobar'); // set value back, checbox will be checked
    console.log('3. Value is', $input.optionalInput('value'));

    $input.on('optional-input.change', function(event, value) {
        console.log('New value on change', value);
    });

    $input.on('keyup', function(event) {
        console.log('New value instantly', $input.val());
    });


```
