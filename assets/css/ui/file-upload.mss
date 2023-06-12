.dialog {
  background-color: $bg-secondary;
  border: 1px solid $bg-secondary;
  flex-flow: column nowrap;

  &::backdrop {
    background-color: rgba(0 0 0 / 60%);
  }

  &__title {
    text-align: center;
    color: $text-primary;
    text-transform: uppercase;
  }

  &__contents {
    padding: 15px;
    color: $text-primary;

    &--vertical {
      display: flex;
      flex-flow: column;

      .dialog__row {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
        margin-bottom: 10px;

        & label {
          margin: 0;
          align-self: center;
        }
      }
    }
  }

  &__text {
    text-align: center;
    color: inherit;
  }

  &__form {
    background-color: inherit;
    display: flex;
    flex-flow: column nowrap;
  }

  &__actions {
    margin-top: 15px;
    display: flex;
    flex-flow: row nowrap;
  }

  &__input-group {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
  }

  &__input {
    color: $text-primary;
    margin-bottom: 10px;
    padding: 10px;
  }

  &__button {
    flex-basis: 1;
    flex-grow: 1;
    padding: 10px;
    background-color: $bg-secondary;
    border: none;
    color: $text-secondary;

    &:hover,
    &:focus {
      background-color: $bg-primary;
      color: $text-primary;
      cursor: pointer;
    }
  }
}
