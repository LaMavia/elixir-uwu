//@ts-check

import { get_file_id } from "./selectors.mjs";
import { Editor } from "./editor.mjs";
import { CompilationController } from "./compilation_controller.mjs";
import { FragmentController } from "./fragment_controller.mjs";
import { DownloadController } from "./download_controller.mjs";
import { is_logged_in } from "./session.mjs";
import { Router, RouterStateType } from "./router.mjs";
import { select_or_throw } from "./helpers.mjs";
import { TreeCrudControlled } from "./tree_crud_controller.mjs";

const main = async () => {
  if (!(await is_logged_in())) {
    location.replace("/login/");
  }

  const editor = new Editor(
    "#code",
    "",
    select_or_throw("[js-role=file-save]")
  );
  const tree_crud_controller = new TreeCrudControlled();
  const fragment_controller = new FragmentController(
    select_or_throw("#fragment > [js-role='fragment-title']"),
    select_or_throw("#fragment > [js-role='fragment-code']"),
    editor
  );
  const compilation_controller = new CompilationController(
    select_or_throw('[js-role="file-compile"]'),
    // @ts-ignore
    select_or_throw("#config-standard"),
    select_or_throw("#config-optimization"),
    select_or_throw("#config-processor"),
    select_or_throw("#config-dependent"),
    fragment_controller
  );
  const download_controller = new DownloadController(
    select_or_throw("[js-role='file-download-asm']"),
    fragment_controller
  );

  const file_id = get_file_id();
  if (file_id) {
    editor.fetch_file(file_id);
  }

  const router = new Router();
  router.hook((state) => {
    if (state.type !== RouterStateType.file_change) {
      return;
    }

    editor.fetch_file(get_file_id());
    fragment_controller.render();
  });

  window.addEventListener("unload", () => {
    tree_crud_controller.unmount();
  });
};

window.addEventListener("DOMContentLoaded", main, {
  passive: true,
});
