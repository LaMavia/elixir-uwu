.form {
  display: flex;
  flex-flow: column nowrap;

  &__label {
    margin-bottom: 5px;
    text-transform: uppercase;
    color: $text-secondary;
  }

  &__input {
    background-color: inherit;
    color: $text-secondary;
    border: none;
    border: 1px solid $text-secondary;
    padding: 5px 10px;

    &:hover,
    &:focus {
      color: $text-primary;
      outline: none;
    }
  }

  &__fieldset {
    width: 100%;
    height: 100%;
    margin: 0;
    overflow-y: auto;
    border: none;
  }
}

.auth-form {
  display: flex;
  flex-flow: column nowrap;
  width: min(300px, 100vw);
  margin: auto;

  padding: 15px;
  border: 1px solid $text-secondary;

  &__input {
    margin-bottom: 5px;
  }

  &__button {
    margin-top: 5px;
    height: 30px;
    cursor: pointer;
    color: $text-secondary;
    background-color: $bg-primary;
    border: none;

    &:hover,
    &:focus {
      color: $text-primary;
      outline: none;
    }
  }

  &__link {
    text-align: center;
    margin-top: 20px;
    color: $text-secondary;

    &:hover,
    &:focus {
      color: $text-primary;
    }
  }
}

.center-block {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  overflow: hidden;
}
