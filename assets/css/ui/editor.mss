:root {
  $editor-line-height: 21px;
}

.editor {
  grid-area: editor;
  background-color: $bg-secondary;
}

.code {
  display: inline-flex;
  gap: 10px;
  font-family: monospace;
  line-height: $editor-line-height;
  background-color: $bg-primary;
  border-radius: 2px;
  padding: 20px 10px;
  width: 100%;
  height: 100%;
  padding: 10px 20px;
  max-height: calc(100vh - $label-font-size - 20px - $grid-config-height);
  overflow-y: auto;
  position: relative;

  &__textarea {
    background-color: inherit;
    line-height: $editor-line-height;
    overflow-y: hidden;
    padding: 0;
    color: $text-primary;
    width: 100%;
    min-height: 100%;
    height: 1000vh;
    white-space: pre-wrap;
    border: none;
    resize: none;
    outline: none;
    word-wrap: normal;
    overflow-y: visible;
  }

  & .line-numbers {
    width: 20px;
    text-align: right;
    position: relative;

    &__nr {
      counter-increment: linenumber;
      &::before {
        content: counter(linenumber);
        display: block;
        color: $text-secondary;
      }
    }
  }

  &__section {
    $top: 0;
    $color: $bg-secondary;
    $w: 10px;

    &::after {
      position: absolute;
      width: 5px;
      height: 100%;
      content: "";
      background-color: $color;
    }

    cursor: pointer;
    height: calc($size * $editor-line-height);
    position: absolute;
    top: calc($top * $editor-line-height);
    left: -15px;
    margin: 0;
    padding: 0;
    width: $w;

    & svg {
      display: none;
      position: absolute;
      left: -2px;
      width: 10px;
      fill: $text-secondary;
      z-index: 10;

      &:hover,
      &:focus {
        fill: $text-primary;
      }

      & * {
        pointer-events: none;
      }
    }

    &:hover svg,
    &:focus svg {
      display: block;
    }
  }
}
