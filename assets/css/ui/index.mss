:root {
  $grid-menu-height: max(3rem, 5vh);
  $grid-config-height: max(300px, 20vh);
  $grid-fragment-width: minmax(50px, 2fr);
  $grid-files-width: max(250px, 15vw);
  $label-font-size: 1rem;
  $config-label-height: 2.5rem;
}

.page {
  display: grid;
  width: 100%;
  height: 100vh;
  padding: 0;
  margin: 0;
  grid-template:
    "menu  menu   menu    " $grid-menu-height
    "files editor fragment" 1fr
    "files config config  " $grid-config-height
    / $grid-files-width 3fr $grid-fragment-width;
  background-color: $bg-secondary;
  color: $text-primary;
  font-family: "Fira Code", ui-monospace;
  overflow: hidden;
}

.labeled-area {
  $margin-v: 5px;

  display: flex;
  flex-flow: column nowrap;
  position: relative;

  &__label {
    width: 100%;
    height: calc($label-font-size + 2 * $margin-v);
    @all (font-size, line-height): $label-font-size;
    background-color: $bg-secondary;
    padding: $margin-v 10px;
    font-weight: 800;
    text-transform: uppercase;
    flex-grow: 0;
    margin: 0;
  }

  &__button {
    position: absolute;
    right: 0;
    background: none;
    color: $text-secondary;
    border: none;
    cursor: pointer;

    &:hover,
    &:focus {
      color: $text-primary;
    }
  }

  &__content {
    width: 100%;
    flex-grow: 1;
    padding: $margin-v 10px;
    overflow-y: auto;
  }
}

@media screen and (max-width: 800px) {
  :root {
    $grid-config-height: 100vh;
    $grid-fragment-width: 100vw;
    $grid-files-width: 100vw;
  }

  .page {
    $row-height: calc(100vh - $grid-menu-height);
    $grid-config-height: calc($row-height + $grid-menu-height);

    height: calc($row-height * 3 + $grid-config-height);
    grid-template:
      "menu" 0
      "files" $row-height
      "editor" $row-height
      "fragment" $row-height
      "config" $grid-config-height
      / 1fr;

    & .files,
    & .editor,
    & .fragment,
    & .config {
      padding-top: $grid-menu-height;
    }
  }
}

@import "./menu.mss";
@import "./config.mss";
@import "./editor.mss";
@import "./files.mss";
@import "./fragment.mss";
@import "./mobile-nav.mss";
@import "./file-upload.mss";
