import "./sample.scss";
import { html, render } from 'lit';
import "@material/web/all";


export class SamplePage {
    setup() {
        this.addEventListener();
        this.firstLoad();
    }

    addEventListener() {
        // Add any event listeners here
    }

    firstLoad() {
        // Any first load operations
    }

    load() {
        const page = html`
      <div class="sample-page">
        <div class="sample-page__header">
          <h1>Sample Page</h1>
        </div>
      </div>
    `;
        const appContainer: HTMLDivElement = document.getElementById("appContainer") as HTMLDivElement;
        render(page, appContainer);
    }
}
