export default function Head({ pageTitle, styles }: { pageTitle?: string, styles?: string }): string {
  return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ pageTitle || "MyTube App"}</title>
    <style>
    #dropzone {
        width: 75%;
        height: 10px;
        transition: height 100ms ease-out;
    }
    #dropzone.active {
        height: 25px;
        border: 4px dashed red;
    }
    body {
        background: black;
        color: white;
    }
    ${styles || ""}
    </style>
    <script src="https://unpkg.com/htmx.org@2.0.0"></script>
    <script type="module" src="/static/MyTube.js"></script>
    `;
}
