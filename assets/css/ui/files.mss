.files {
  $switch-width: 1.5rem;
  $switch-height: 1.5rem;

  grid-area: files;
  background-color: $bg-secondary;
  color: $text-secondary;
  border-right: 1px solid $bg-accent;
  padding: 0 10px;
  word-break: break-all;
  position: relative;

  .labeled-area__content--files {
    overflow: scroll;
  }
}

.tree {
  list-style: none;
  height: auto;
  width: 100%;
  margin: 0;
  padding: 0;

  &__item {
    width: 100%;
    min-height: 1.5rem;
    display: flex;
    flex-flow: column nowrap;
    margin-left: 1.5rem;
  }
}

.dir {
  display: grid;
  grid-template:
    "switch label  " $switch-height
    "input  content" 1fr
    / $switch-width 1fr;
  margin-left: 0;

  &::before {
    display: none;
  }

  &__input {
    display: none;
    grid-area: input;
  }

  &__switch {
    display: block;
    grid-area: switch;

    &::before {
      position: absolute;
      display: block;
      width: $switch-width;
      height: $switch-height;
      cursor: pointer;
      content: "|>";
    }
  }

  &__label {
    grid-area: label;
    white-space: pre-line;
  }

  &__content {
    grid-area: content;
    display: none;
    height: auto;
    flex-flow: column nowrap;
  }

  &__input:checked ~ &__content {
    display: flex;
  }

  &__input:checked ~ &__switch::before {
    content: "<|";
  }

  &__input:checked ~ &__label {
    color: $text-primary;
  }
}

.file {
  text-decoration: none;
  position: relative;

  &:hover,
  &--active {
    color: $text-primary;
  }

  &::before {
    position: absolute;
    display: block;
    content: "|-";
    width: 1.5rem;
    left: -1.5rem;
  }
}

.label {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  color: $text-secondary;

  &__header {
    font-size: inherit;
    margin: 0;
    position: relative;
  }

  &__actions {
    display: none;
  }

  &:focus &__actions,
  &:hover &__actions {
    display: flex;
  }

  &__link {
    color: $text-secondary;
    text-decoration: none;

    &:hover,
    &:focus {
      color: $text-primary;
    }
  }
}

.actions {
  position: absolute;
  flex-flow: row nowrap;
  right: 10px;

  &--show {
    display: flex;
  }

  &__button {
    background: none;
    border: none;
    @all (width, height): $switch-height;
    display: flex;
    justify-content: center;
    padding: 4px;
    cursor: pointer;
    background-color: $bg-secondary;

    & svg {
      flex-grow: 1;
      fill: $text-secondary;
    }

    & * {
      pointer-events: none;
    }

    &:hover {
      & svg {
        fill: $text-primary;
      }
    }
  }
}
