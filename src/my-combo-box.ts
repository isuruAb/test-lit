import { html, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ref } from "lit/directives/ref.js";
import "./components/my-badge";
import { MyDropdown } from "./components/my-dropdown";
import "./components/my-dropdown-item";
import { MyDropdownItem } from "./components/my-dropdown-item";
import styles from "./my-combo-box.scss";

type FilterFunction = (inputValue: string, menuItem: string) => boolean;

@customElement("my-combo-box")
export class MyComboBox extends MyDropdown {
  static styles = [MyDropdown.styles, styles];

  @query("#user-input") userInputElement: HTMLInputElement;

  /**The input's placeholder text. */
  @property({ type: String, reflect: true }) placeholder = "placeholder";

  /**The input's value attribute. */
  @property({ reflect: true, type: String }) value = "";

  /**The list of items to display in the dropdown. */
  @property({ type: Array }) menuList: string[] = [];

  /**The function used to determine if a menu item should be shown in the menu list, given the user's input value. */
  @property()
  filterMenu: FilterFunction = (inputValue: string, menuItem: string) => {
    const itemLowerCase = menuItem.toLowerCase();
    const valueLower = inputValue.toLowerCase();
    return itemLowerCase.startsWith(valueLower);
  };

  @state()
  filteredMenuList: string[] = [];
  selectedList: string[] = [];
  unselectedItems: string[] = [];

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this._handleKeyDown);
  }

  private _handleKeyDown(e) {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (this.filteredMenuList[0]) {
          this._handleSelectChange(e, "enter", this.filteredMenuList[0]);
        }
        this.value = "";
        break;
      case "Backspace":
        e.preventDefault();
        if (!this.value) {
          const deletedItem = this.selectedList.pop();
          this.unselectedItems.push(deletedItem);
          this.unselectedItems.sort();
        } else {
          this.value = this.value.slice(0, -1);
        }
        break;
    }
    this.requestUpdate();
  }

  private _handleInputChange(e: CustomEvent) {
    e.stopPropagation();
    this.showMenu();
    this.value = (e.target as HTMLInputElement).value;
    this.filteredMenuList = this.filteredMenuList.filter((item) =>
      this.filterMenu(this.value, item)
    );
  }

  clickRemove(e) {
    this.selectedList = this.selectedList.filter(
      (item) => item != e.target.innerText
    );
    this.unselectedItems.push(e.target.innerText);
    this.unselectedItems.sort();
    this.userInputElement.blur();
  }

  private _handleSelectChange(
    e: KeyboardEvent | MouseEvent,
    mode: string,
    text?: string
  ) {
    const selectedItem =
      mode === "select" ? (e.target as MyDropdownItem).innerText : text;
    this.selectedList.push(selectedItem);
    this.unselectedItems = this.menuList.filter(
      (item) => !this.selectedList.includes(item)
    );
    this._handleSelectSlot(e);
  }

  /** When clicked on any part of div-looking input, the embedded input is focus.  */
  private _handleToggleUserInput(e: CustomEvent) {
    e.stopPropagation();
    this._onClickDropdownToggle();
    this.userInputElement.focus();
  }

  render() {
    this.filteredMenuList =
      this.unselectedItems.length > 0
        ? this.unselectedItems.filter((item) =>
            this.filterMenu(this.value, item)
          )
        : this.menuList.filter((item) => this.filterMenu(this.value, item));
    return html`
      <div class="combobox dropdown multiselect">
        <div
          @click=${this._handleToggleUserInput}
          ${ref(this.myDropdown)}
          class="form-control"
        >
          ${this.selectedList.length > 0
            ? this.selectedList.map(
                (item) =>
                  html`<my-badge @click=${this.clickRemove}>${item}</my-badge>`
              )
            : html`<span></span>`}
          <input
            id="user-input"
            class="form-control-multiselect"
            type="text"
            @input=${this._handleInputChange}
            placeholder=${this.placeholder}
            .value=${this.value}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
            />
          </svg>
        </div>
        <ul class="dropdown-menu" part="menu">
          ${this.filteredMenuList.length > 0
            ? this.filteredMenuList.map(
                (item) =>
                  html`<my-dropdown-item
                    href="javascript:void(0)"
                    @click=${(e) => this._handleSelectChange(e, "select")}
                    >${item}</my-dropdown-item
                  >`
              )
            : html`<em>No results found</em>`}
        </ul>
      </div>
    `;
  }
}

export default MyComboBox;
