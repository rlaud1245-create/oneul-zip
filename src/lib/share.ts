export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

interface ShareData {
  title: string;
  text: string;
  url: string;
}

/** Web Share API를 우선 사용하고, 지원하지 않으면 클립보드 복사로 대체합니다. */
export async function shareOrCopy(data: ShareData): Promise<ShareResult> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share(data);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
      // 그 외 오류는 복사로 대체
    }
  }
  return (await copyText(`${data.text}\n${data.url}`)) ? "copied" : "failed";
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      textarea.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
