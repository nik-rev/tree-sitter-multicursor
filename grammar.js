/**
 * @file A parser for the multicursor file type
 * @author Nikita Revenco <pm@nikrev.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "multicursor",

  rules: {
    source_file: ($) =>
      repeat(choice($.left_primary, $.right_primary, $.right, $.left, $.text)),

    start_right_primary: () => "#[",
    end_right_primary: () => "|]#",
    right_primary: ($) =>
      seq(
        $.start_right_primary,
        repeat(alias($.char_primary, $.char)),
        $.cursor_primary,
        $.end_right_primary,
      ),

    char: ($) => choice($.char_primary, $.char_regular),
    _text_primary: () => /[^#\[\]\|]+/,
    char_primary: () => /[^#\[\]\|]/,
    char_regular: () => /[^#\(\)\|]/,
    cursor_primary: ($) => alias($.char_primary, "cursor_primary"),
    cursor: ($) => alias($.char_regular, "cursor"),

    start_left_primary: () => "#[|",
    end_left_primary: () => "]#",
    left_primary: ($) =>
      seq(
        $.start_left_primary,
        $.cursor_primary,
        repeat(alias($.char_primary, $.char)),
        $.end_left_primary,
      ),

    text: ($) => choice($._text, $._text_primary),

    _text: () => /[^#\(\)\|]+/,

    start_right: () => "#(",
    end_right: () => "|)#",
    right: ($) =>
      seq(
        $.start_right,
        repeat(alias($.char_regular, $.char)),
        $.cursor,
        $.end_right,
      ),

    start_left: () => "#(|",
    end_left: () => ")#",
    left: ($) =>
      seq(
        $.start_left,
        $.cursor,
        repeat(alias($.char_regular, $.char)),
        $.end_left,
      ),
  },
});
