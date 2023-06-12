@import "./light.mss";
@import "./dark.mss";

#theme-switch {
  display: none;
}

.theme-switch { 
  $theme-switch-margin: 10px;
  $theme-switch-size: calc($grid-menu-height - $theme-switch-margin * 2);
  
  position: fixed;
  @all (width, height): $theme-switch-size;
  @all (right, top): $theme-switch-margin; 
  border-radius: 50%;
  cursor: pointer;
  z-index: 3;

  &::before {
    content: $theme-switch-content;
    font-size: $theme-switch-size;
    text-align: center;
    line-height: $theme-switch-size;
  }
}
