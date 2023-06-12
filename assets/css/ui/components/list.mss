.list {
  display: flex;
  flex-flow: column nowrap;
  padding: 0;
  margin: 0;
  list-style: none;

  &--horizontal {
    width: 100%;
    height: $list-height;
    flex-direction: row;
  }

  &__item {
    display: block;

    &__button {
      padding: 5px;
      width: 100%;
      height: 100%;
      background-color: inherit;
      color: inherit;
      border: none;
      text-align: left;
      cursor: pointer;
      text-decoration: none;

      &:hover,
      &:focus {
        text-decoration: underline;
      }
    }
  }
}

.list-button {
  display: block;
  padding: 10px;
  width: 100%;
  height: $list-height;
  background-color: inherit;
  border: none;
  color: $text-secondary;
  cursor: pointer;

  &:hover,
  &:focus,
  &--active {
    background-color: $bg-primary;
    color: $text-primary;
  }
}

.dropdown {
  width: auto;
  height: auto;
  z-index: 2;

  &__label {
    height: $menu-height;
    width: auto;
  }

  &__content {
    display: none;
    position: absolute;
    background-color: $bg-primary;
    color: $text-primary;
    padding: 10px;
    @all (border-left, border-right, border-bottom): 1px solid $bg-accent;
  }

  &__label:hover ~ &__content,
  &__label:focus ~ &__content {
    display: block;
  }

  &:hover &__label {
    background-color: $bg-primary;
    color: $text-primary;
  }

  &:hover &__content,
  &__label:hover ~ &__content,
  &__label:focus ~ &__content {
    display: inherit;
  }
}
