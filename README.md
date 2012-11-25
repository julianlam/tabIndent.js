tabIndent.js
================

## Introduction

**tabIndent.js** does two things to enhance the traditional text-box:

1. Disables the default browser behaviour (moving to the next input box)
2. Enhances the existing textbox to capture the "tab" key and replicate
behaviour similar to that found in editors. (Inserting a tab character,
intentation)

## Usage

Upon invocation, tabIndent finds all `textarea` elements with the
`tabIndent` class, and applies its javascript to them.

To use, add the line of javascript to your `head` element:

    <script src="tabIndent.js"></script>

Invoke thusly:

    tabIndent.renderAll();

To invoke on one specific textarea:

    var el = document.getELementById('#targetTextArea');
    tabIndent.render(el);

To remove an instance of tabIndent:

    var el = document.getElementById('#textareaWithTabIndent');
    tabIndent.remove(el);

... and to remove all instances:

    tabIndent.removeAll();

For styling purposes, after a textarea is enhanced by tabIndent, it will have
the class `tabIndent-rendered`.

## Known Bugs

Please consult [the project buglist](https://github.com/julianlam/tabIndent.js/issues).