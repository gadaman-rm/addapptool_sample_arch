import { html, render } from "lit";
import { router } from "./src/Router";
import { SamplePage } from "./src/view/pages/sample/sample";

const appContainer = document.getElementById("appContainer") as HTMLDivElement;

router.addRoute("/", () => {
    const samplePage = new SamplePage();
    samplePage.setup();
    samplePage.load();
});

router.addRoute("/404", () => {
    const page = html`<h1>Not found</h1>`;
    render(page, appContainer);
});

async function init() {
    router.navigateTo("/");
}

init();