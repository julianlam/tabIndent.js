tabIndent.js
================

## Demo

Play with the [latest stable demo](http://julianlam.github.com/tabIndent.js/)

## Introduction

**tabIndent.js** does two things to enhance the traditional text-box:

1. Disables the default browser behaviour (moving to the next input box)
2. Enhances the existing textbox to capture the "tab" key and replicate
behaviour similar to that found in editors. (Inserting a tab character,
intentation)

## Installation

The repository contains four folders. Of those, only the `/js` folder is
required.

## Usage

Upon invocation, tabIndent finds all `textarea` elements with the
`tabIndent` class, and applies its javascript to them.

To use, add the line of javascript to your `head` element:

    <script src="tabIndent.js"></script>

Invoke thusly:

    tabIndent.renderAll();

On the other hand, to invoke on one specific textarea:

    var el = document.getELementById('#targetTextArea');
    tabIndent.render(el);

Likewise, to remove an instance of tabIndent:

    var el = document.getElementById('#textareaWithTabIndent');
    tabIndent.remove(el);

... and to remove all instances:

    tabIndent.removeAll();

For styling purposes, after a textarea is enhanced by tabIndent, it will have
the class `tabIndent-rendered`.

The default tab sequence is '\t', but it can be set to any string you want. For
example, to use four spaces instead of the tab character, just add the following
line before rendering:

    tabIndent.config.tab = '    ';

## Caveat

**tabIndent.js** willingly breaks the default action of the `tab` button, whose
normal behaviour would bring you to the next element in the tab index (likewise,
`shift-tab` would bring you to the previous one). To bring back the regular
behaviour, *escape* out of the textarea by hitting the `esc` key. The textarea
enhancements will then be temporarily disabled until you return to it at a later
time.

An icon will be present at the top right of the textarea, signifying when the
enhancements are active.

## Known Bugs

Please consult [the project buglist](https://github.com/julianlam/tabIndent.js/issues).

## Attribution / Credits

Use of the "active" icon courtesy of [IconShock](http://www.iconshock.com/)
([retrieved from findicons.com](http://findicons.com/icon/499821/edit_gear?id=530587))
