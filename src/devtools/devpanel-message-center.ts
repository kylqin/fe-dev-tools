import { Listenable, SimpleListenable, Subscription } from '../utils/listenable';

export enum DevpanelMessageType {
  showBarcode
}

export class DevpanelMessage<T> {
  constructor(public type: DevpanelMessageType, public payload: T) {}
}

export class DevpanelMessageCenter {
  private constructor() {}

  private static _instance: DevpanelMessageCenter;
  public static get instance () {
    if (!this._instance) {
      this._instance = new DevpanelMessageCenter;
    }
    return this._instance;
  }

  receive(msg: DevpanelMessage<any>) {
    console.log("[DevpanelMessageCenter] <<<", msg);
    this.fire(msg);
  }

  private _responseFn?: Function;
  response(msg: any) {
    console.log("[DevpanelMessageCenter] >>>", msg);
    this._responseFn?.(msg);
  }

  setResponseFn(fn: Function) {
    this._responseFn = fn;
  }

  private listenable: Listenable = new SimpleListenable();
  public listen<T>(type: DevpanelMessageType, fn: ((msg: DevpanelMessage<T>) => void)): Subscription {
    return this.listenable.listen(type as number, fn);
  }

  public fire<T>(msg: DevpanelMessage<T>) {
    this.listenable.trigger(msg.type, msg);
  }
}