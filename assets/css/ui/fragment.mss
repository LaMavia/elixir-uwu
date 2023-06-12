.fragment {
  grid-area: fragment;
  background-color: $bg-primary;
  border-left: 1px solid $bg-accent;
  overflow-y: auto;
}

.asm {
  margin-bottom: 15px;
  &__header {
    display: block;
    color: $text-secondary;
    cursor: pointer;

    &:hover {
      font-weight: bold;
    }
  }

  &__body {
    color: $text-primary;
    display: none;
    word-wrap: break-word;
    margin-left: 10px;
  }

  &__comment {
    color: $text-secondary;
    text-decoration: underline;
    font-style: italic;
  }

  &__annotation--link {
    cursor: pointer;

    &:hover,
    &:focus {
      color: $text-accent;
    }
  }

  &__error,
  &__warning {
    white-space: pre-line;
    word-wrap: normal;
    display: block;
  }

  &__error {
    color: #d73a25;
  }

  &__warning {
    color: #d7c825;
  }

  &__switch {
    display: none;
  }

  &__switch:checked ~ &__body {
    display: block;
  }
}
