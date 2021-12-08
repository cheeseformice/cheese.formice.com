type NoticeType = "info" | "error";

interface Callback {
  (action: "close", idx: number): void;
  (action: "add"): void;
}

export interface Notice {
  type: NoticeType;
  text: string;
}

export class NoticeController {
  public notices: Notice[] = [];
  callback?: Callback;

  setNoticesCallback(callback: Callback): this {
    this.callback = callback;
    return this;
  }

  closeNotice(idx: number): void {
    this.notices.splice(idx, 1);
    if (this.callback) this.callback("close", idx);
  }

  showNotice(type: NoticeType, translationKey: string): void {
    this.notices.push({ type, text: translationKey });
    if (this.callback) this.callback("add");
  }
}

export const controller = new NoticeController();
