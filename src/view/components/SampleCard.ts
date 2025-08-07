import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("sample-card")
export class SampleCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 0;
      transition: transform 0.2s;
      max-height: 80vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card h2 {
      font-size: 18px;
      margin-bottom: 16px;
    }
  `;

  render() {
    return html`
      <div class="card">
        <slot></slot>
      </div>
    `;
  }
}
