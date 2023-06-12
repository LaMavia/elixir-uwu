// @ts-check

import { FragmentController } from "./fragment_controller.mjs"
import { html } from "./render_tools.mjs"
import { file_id_regex } from "./selectors.mjs"

export class CompilerOption {
  /**
   *
   * @param {string} display
   * @param {string} value
   */
  constructor(display, value = display) {
    this.display = display
    this.value = value
  }
}

export class CompilationController {
  /**
   * @type {Object<string, CompilerOption[]>}
   */
  #options = {
    standard: [
      new CompilerOption("C89", "std-c89"),
      new CompilerOption("C99", "std-c99"),
      new CompilerOption("C11", "std-c11"),
    ],
    optimization: [
      new CompilerOption(
        "Disable overlaying leaf function auto variables",
        "--nooverlay"
      ),
      new CompilerOption("Disable the GCSE optimisation", "--nogcse"),
      new CompilerOption("Disable label optimisation", "--nolabelopt"),
      new CompilerOption("Disable optimisation of invariants", "--noinvariant"),
      new CompilerOption("Disable loop variable induction", "--noinduction"),
      new CompilerOption(
        "Disable the loop reverse optimisation",
        "--noloopreverse"
      ),
      new CompilerOption(
        "Disable the peephole assembly file optimisation",
        "--no-peep"
      ),
      new CompilerOption(
        "On some ports, disable passing some parameters in registers",
        "--no-reg-params"
      ),
      new CompilerOption(
        "Enable peephole optimization on inline assembly",
        "--peep-asm"
      ),
      new CompilerOption(
        "Enable peephole optimization for return instructions",
        "--peep-return"
      ),
      new CompilerOption(
        "Disable peephole optimization for return instructions",
        "--no-peep-return"
      ),
      new CompilerOption(
        "Optimize for code speed rather than size",
        "--opt-code-speed"
      ),
      new CompilerOption(
        "Optimize for code size rather than speed",
        "--opt-code-size"
      ),
      new CompilerOption(
        "Maximum number of register assignments considered at each node of the tree decomposition",
        "--max-allocs-per-"
      ),
      new CompilerOption("Disable lospre", "--nolospre"),
      new CompilerOption(
        "Allow optimizations to read any memory location anytime",
        "--allow-unsafe-read"
      ),
      new CompilerOption(
        "Disable optimization of calls to standard library",
        "--nostdlibcall"
      ),
    ],
    processor: [
      new CompilerOption("mcs51"),
      new CompilerOption("z80"),
      new CompilerOption("z180"),
      new CompilerOption("r2k"),
      new CompilerOption("r2ka"),
      new CompilerOption("r3ka"),
      new CompilerOption("sm83"),
      new CompilerOption("tlcs90"),
      new CompilerOption("ez80_z80"),
      new CompilerOption("z80n"),
      new CompilerOption("ds390"),
      new CompilerOption("pic16"),
      new CompilerOption("pic14"),
      new CompilerOption("TININative"),
      new CompilerOption("ds400"),
      new CompilerOption("hc08"),
      new CompilerOption("s08"),
      new CompilerOption("stm8"),
      new CompilerOption("mos6502"),
    ],
    dependent: [],
  }

  #state = {
    standard: "",
    optimizations: [],
    processor: "",
    dependent: [],
  }
  /**
   *
   * @param {HTMLElement} compile_button
   * @param {HTMLFormElement} standard_tab
   * @param {HTMLFormElement} optimization_tab
   * @param {HTMLFormElement} processor_tab
   * @param {HTMLFormElement} dependent_tab
   * @param {FragmentController} fragment_controller
   */
  constructor(
    compile_button,
    standard_tab,
    optimization_tab,
    processor_tab,
    dependent_tab,
    fragment_controller
  ) {
    this.compile_button = compile_button
    this.standard_tab = standard_tab
    this.optimization_tab = optimization_tab
    this.processor_tab = processor_tab
    this.dependent_tab = dependent_tab
    this.fragment_controller = fragment_controller

    this.#on_mount()
  }

  #on_mount = () => {
    this.processor_tab
      .querySelector("select")
      ?.addEventListener("change", this.#handle_processor_change)
    this.compile_button.addEventListener("click", this.#handle_submit)

    this.#render_standard()
    this.#render_optimization()
    this.#render_processor()
  }

  #handle_submit = () => {
    const file_id_match = file_id_regex.exec(location.href)
    if (!file_id_match) {
      return alert("Failed to find file id in the url")
    }
    const file_id = +file_id_match[1]
    const standard = this.#get_selected(this.standard_tab)
    const processor = this.#get_selected(this.processor_tab)
    const optimizations = this.#get_checked(this.optimization_tab)
    const dependent = this.#get_checked(this.dependent_tab)

    if (!standard) {
      alert("No standard selected")
      return
    }

    if (!processor) {
      alert("No processor selected")
      return
    }

    fetch(`/file/${file_id}/compile/`, {
      method: "POST",
      body: JSON.stringify({
        standard,
        processor,
        optimizations,
        dependent,
      }),
    })
      .then(r => r.json())
      .then(r => {
        const key = `asm_${file_id}`
        localStorage.removeItem(key)
        localStorage.setItem(
          key,
          JSON.stringify({
            asm: r.data.asm,
            name: r.data.name,
            warnings: r.data.warnings,
            errors: r.data.errors,
          })
        )
        this.fragment_controller.render()
      })
  }

  /**
   *
   * @param {HTMLElement} element
   * @returns {string | undefined}
   */
  #get_selected = element => element.querySelector("select")?.value

  /**
   *
   * @param {HTMLElement} element
   * @returns {string[]}
   */
  #get_checked = element =>
    [...element.querySelectorAll("input[type=checkbox]")]
      //@ts-ignore
      .filter(c => c.checked)
      .map(x => {
        // @ts-ignore
        return x.value
      })

  #fetch_dependent = processor =>
    fetch(`/compiler/${processor}/options/`, {
      method: "POST",
    })
      .then(r => r.json())
      .then(r =>
        r.ok
          ? (this.#options.dependent = r.data.map(
              s => new CompilerOption(s.display, s.value)
            ))
          : alert(r.error)
      )
      .catch(alert)

  /**
   *
   * @param {CompilerOption[]} options
   * @returns {string}
   */
  #render_select = options =>
    html`<option value="" disabled selected>Select your option</option>
      ${options.map(o => html`<option value=${o.value}>${o.display}</option>`)}`

  /**
   * @param {string} name
   * @param {CompilerOption[]} options
   * @returns {string}
   */
  #render_check = (name, options) =>
    html`${options.map(
      (o, i) => html` <div>
        <input
          type="checkbox"
          id="${name}_${i}"
          name="${name}"
          value="${o.value}"
        />
        <label for="${name}_${i}">${o.display}</label>
      </div>`
    )}`

  #render_standard = () =>
    //@ts-ignore
    (this.standard_tab.querySelector("select").innerHTML = this.#render_select(
      this.#options.standard
    ))

  #render_optimization = () =>
    //@ts-ignore
    (this.optimization_tab.querySelector("fieldset").innerHTML =
      this.#render_check("optimizations", this.#options.optimization))

  #render_processor = () => {
    //@ts-ignore
    this.processor_tab.querySelector("select").innerHTML = this.#render_select(
      this.#options.processor
    )
  }

  #render_dependent = () =>
    //@ts-ignore
    (this.dependent_tab.querySelector("fieldset").innerHTML =
      this.#render_check("dependent", this.#options.dependent))

  /**
   *
   * @param {Event} e
   */
  #handle_processor_change = e =>
    // @ts-ignore
    this.#fetch_dependent(e.target?.value).then(this.#render_dependent)
}
