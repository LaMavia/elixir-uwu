.config {
  grid-area: config;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  background-color: $bg-primary;
  margin-bottom: 20px;

  &__list {
    border-top: 1px solid $bg-accent;
    background-color: $bg-secondary;
  }
}

.tab {
  $config-label-height: 2.5rem;

  &__content {
    position: fixed;
    left: $grid-files-width;
    width: calc(100vw - $grid-files-width);
    height: calc($grid-config-height - $config-label-height);
    flex-grow: 1;
    background-color: $bg-primary;
    padding: 10px;
    padding-bottom: 50px;
    display: none;
    grid-template-columns: repeat(4, 1fr);
    z-index: 1;

    @media screen and (max-width: 800px) {
      & {
        position: absolute;
        left: 0;
        height: calc(
          $grid-config-height - $config-label-height - $grid-menu-height + 2px
        );
        width: 100%;
      }
    }

    & form {
      width: 100%;
    }
  }

  &__switch {
    display: none;
  }

  &__label {
    background-color: $bg-secondary;
    color: $text-secondary;
    // border-bottom: 2px solid $bg-primary;
    position: relative;
    z-index: 1;
    @all (border-right, border-left): 1px solid $bg-secondary;

    &::after {
      $color: $bg-primary;

      display: none;
      position: absolute;
      content: "";
      width: 100%;
      height: 10px;
      border-bottom: 3px solid $color;
      background-color: $color;
      bottom: -4px;
      left: 0;
      z-index: -1;
    }
  }

  &__switch:checked ~ &__content {
    display: flex;
    border-top: 1px solid $bg-accent;
  }

  &__switch:checked ~ &__label {
    background-color: $bg-primary;
    color: $text-primary;
    border-color: $bg-accent;

    &::after {
      display: block;
    }
  }

  &:first-of-type &__label {
    border-left: none;
  }
}

.hidden {
  display: none;
}

@import "./components/form.mss";
