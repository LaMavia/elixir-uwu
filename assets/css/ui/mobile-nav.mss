.mobile-nav {
  $button-size: 3rem;
  $button-margin: 10px;

  display: none;

  @media screen and (max-width: 800px) {
    & {
      display: block;
      position: fixed;
      z-index: 3;
      @all (bottom, right): $button-margin;

      &__menu {
        margin: 0;
        list-style: none;
        display: flex;
        flex-flow: row nowrap;
        position: absolute;
        bottom: calc(($button-size + $button-margin) * -1);
        right: calc($button-size + $button-margin);
        transition: bottom 0.2s 0s ease-in-out;
      }

      &__burger:focus ~ &__menu {
        bottom: 0;
      }
    }

    &-button {
      display: block;
      text-align: center;
      @all (width, height, line-height): $button-size;
      text-decoration: none;
      border-radius: 50%;
      border: 1px solid $text-secondary;
      background-color: $bg-secondary;
      color: $text-secondary;
      position: relative;
      cursor: pointer;

      &:focus,
      &:hover {
        background-color: $bg-primary;
        color: $text-primary;
        border-color: $text-primary;
      }
    }

    .spread__item {
      margin-left: $button-margin;
    }
  }
}
