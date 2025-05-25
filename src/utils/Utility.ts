export function getElementById<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

export function convertToPersianDate(unixTimestamp: number): string {
  const date = new Date(unixTimestamp); // Create Date object from UNIX timestamp

  const day = new Intl.DateTimeFormat("fa-IR", { day: "numeric" }).format(date); // Persian day
  const month = new Intl.DateTimeFormat("fa-IR", { month: "long" }).format(date); // Persian month name
  const year = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(date); // Persian year

  return `${day} ${month} ${year}`;
}

export function copyToClipboard(text: string): void {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard:", text);
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  } else {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      console.log("Text copied to clipboard (fallback):", text);
    } catch (err) {
      console.error("Fallback copy failed:", err);
    } finally {
      document.body.removeChild(textarea);
    }
  }
}