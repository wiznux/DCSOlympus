import { LatLng } from "leaflet";
import { getActiveCoalition, setActiveCoalition } from "..";

export class SelectionScroll {
    #container: HTMLElement | null;
    #display: string;

    constructor(id: string,) {
        this.#container = document.getElementById(id);
        this.#display = '';
        if (this.#container != null) {
            this.#container.querySelector("#coalition-switch")?.addEventListener('change', (e) => this.#onSwitch(e))
            this.#display = this.#container.style.display;
            this.hide();
        }
    }

    show(x: number, y: number, title: string, options: any, callback: CallableFunction, showCoalition: boolean) {
        /* Hide to remove buttons, if present */
        this.hide();

        if (this.#container != null && options.length >= 1) {
            var titleDiv = this.#container.querySelector("#ol-selection-scroll-top-bar")?.querySelector(".ol-selection-scroll-title");
            if (titleDiv)
                titleDiv.innerHTML = title;
            this.#container.style.display = this.#display;

            var scroll = this.#container.querySelector(".ol-selection-scroll");
            if (scroll != null)
            {
                for (let optionID in options) {
                    var node = document.createElement("div");
                    node.classList.add("ol-selection-scroll-element");
                    if (typeof options[optionID] === 'string' || options[optionID] instanceof String){
                        node.appendChild(document.createTextNode(options[optionID]));
                        node.addEventListener('click', () => callback(options[optionID]));
                    }
                    else {
                        node.appendChild(document.createTextNode(options[optionID].tooltip));
                        node.addEventListener('click', () => options[optionID].callback());
                    }
                    scroll.appendChild(node);
                }
            }

            /* Hide the coalition switch if required */
            var switchContainer = <HTMLElement>this.#container.querySelector("#ol-selection-scroll-top-bar")?.querySelector("#coalition-switch-container");
            if (showCoalition == false) {
                switchContainer.style.display = "none";
                document.documentElement.style.setProperty('--active-coalition-color', getComputedStyle(this.#container).getPropertyValue("--neutral-coalition-color"));
            }
            else {
                switchContainer.style.display = "block";
                if (getActiveCoalition() == "blue")
                    document.documentElement.style.setProperty('--active-coalition-color', getComputedStyle(this.#container).getPropertyValue("--blue-coalition-color"));
                else
                    document.documentElement.style.setProperty('--active-coalition-color', getComputedStyle(this.#container).getPropertyValue("--red-coalition-color"));
            }

            if (x - this.#container.offsetWidth / 2 + this.#container.offsetWidth < window.innerWidth)
                this.#container.style.left = x - this.#container.offsetWidth / 2 + "px";
            else
                this.#container.style.left = window.innerWidth - this.#container.offsetWidth + "px";

            console.log(y - 20 + this.#container.offsetHeight)
            if (y - 20 + this.#container.offsetHeight < window.innerHeight)
                this.#container.style.top = y - 20 + "px";
            else
                this.#container.style.top = window.innerHeight - this.#container.offsetHeight + "px";

        }
    }

    hide() {
        if (this.#container != null) {
            this.#container.style.display = "none";
            var buttons = this.#container.querySelectorAll(".ol-selection-scroll-element");
            var scroll = this.#container.querySelector(".ol-selection-scroll");
            if (scroll != null)
            {
                for (let child of buttons) {
                    scroll.removeChild(child);
                }
            }
        }
    }

    #onSwitch(e: any) {
        if (this.#container != null) {
            if (e.currentTarget.checked) {
                document.documentElement.style.setProperty('--active-coalition-color', getComputedStyle(this.#container).getPropertyValue("--red-coalition-color"));
                setActiveCoalition("red");
            }
            else {
                document.documentElement.style.setProperty('--active-coalition-color', getComputedStyle(this.#container).getPropertyValue("--blue-coalition-color"));
                setActiveCoalition("blue");
            }
        }
    }
}