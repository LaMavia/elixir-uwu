@import "./components/list.mss";

.menu {
  $menu-height: $grid-menu-height;
  
  grid-area: menu;
  background-color: $bg-secondary;
  color: $text-secondary;
  width: 100%;
  height: $menu-height;
  position: relative;
  z-index: 2;

  &--main {
    border-bottom: 1px solid $bg-accent;
  }

  @media screen and (max-width: 800px) {
    & {
      position: fixed;
      top: 0;
    }
  }
}
