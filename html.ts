export default function Html({ head, body }): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                ${head}
            </head>
            <body>
                ${body}
            </body>
        </html>
    `;
}
