export abstract class Listenable {
  abstract listen(type: number, fn: Function): Subscription;
  abstract unlisten(type: number, id: number): void;
  abstract trigger(type: number, value: any): void;
}

export class Subscription {
  constructor(private listenable: Listenable, private type: number, private id: number) {}

  public cancel() {
    this.listenable.unlisten(this.type, this.id);
  }
}

export const merge = (subscriptions: Subscription[]): Subscription => {
  return {
    cancel: () => {
      subscriptions.forEach(sub => {
        sub.cancel();
      });
    }
  } as Subscription;
}

type IdFnMap = Map<number, Function>
type OnTypeMap = Map<number, IdFnMap>

export class SimpleListenable implements Listenable {
  private listenMap: OnTypeMap = new Map();
  private id = 0;

  listen(type: number, fn: Function): Subscription {
    let map: IdFnMap;
    if (!this.listenMap.has(type)) {
      map = new Map();
    } else {
      map = this.listenMap.get(type)!;
    }

    this.id += 1;
    map.set(this.id, fn);
    this.listenMap.set(type, map);
    return new Subscription(this, type, this.id);
  }

  unlisten(type: number, id: number): void {
    if (id == undefined) {
      this.listenMap.delete(type);
    } else {
      this.listenMap.get(type)?.delete(id);
    }
  }

  trigger(type: number, value: any) {
    this.listenMap.get(type)?.forEach((callback, key: number) => {
      callback(value);
    });
  }
}