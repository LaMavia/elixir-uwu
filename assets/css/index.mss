* {
  box-sizing: border-box;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;

  &::selection {
    background-color: rgb(107 180 254 / 40%);
  }
}

.body {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  position: relative;
  overflow: scroll;
}

@import "./ui/index.mss";
@import "./theme/index.mss";
