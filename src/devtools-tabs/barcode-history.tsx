import React, { useEffect, useState } from "react";
import { SimpleListenable, merge, Subscription } from "../utils/listenable";

abstract class Internal {
  abstract add (barcode: string): void;
  abstract onAdd (callback: Function): Subscription;
  abstract select (barcode: string): void;
  abstract onSelect (callback: Function): Subscription;
}

export class BarcodeHistoryController {
  public static EventType = { addFromInternal: 0, addFromExternal: 2, selectFromInternal: 3, selectFromExternal: 4 };
  private listenable = new SimpleListenable();

  public add(barcode: string) {
    this.listenable.trigger(BarcodeHistoryController.EventType.addFromExternal, barcode);
    this.listenable.trigger(BarcodeHistoryController.EventType.selectFromExternal, barcode);
  }

  public onAdd(callback: ((barcode: string) => void)) {
    return merge([
      this.listenable.listen(BarcodeHistoryController.EventType.addFromInternal, callback),
      this.listenable.listen(BarcodeHistoryController.EventType.addFromExternal, callback),
    ]);
  }

  public async select(barcode: string) {
    this.listenable.trigger(BarcodeHistoryController.EventType.selectFromExternal, barcode);
  }

  public onSelect(callback: ((barcode: string) => void)) {
    return merge([
      this.listenable.listen(BarcodeHistoryController.EventType.selectFromInternal, callback),
      this.listenable.listen(BarcodeHistoryController.EventType.selectFromExternal, callback),
    ]);
  }

  private _internal?: Internal;
  public get internal(): Internal {
    return this._internal!;
  }

  public init(applyInit: () => Subscription) {
    this._internal = {
      add: (barcode: string) => {
        this.listenable.trigger(BarcodeHistoryController.EventType.addFromInternal, barcode);
      },
      onAdd: (callback: Function) => {
        return this.listenable.listen(BarcodeHistoryController.EventType.addFromExternal, callback);
      },
      select: (barcode: string) => {
        this.listenable.trigger(BarcodeHistoryController.EventType.selectFromInternal, barcode);
      },
      onSelect: (callback: (barcode: string) => void) => {
        return this.listenable.listen(BarcodeHistoryController.EventType.selectFromExternal, callback);
      }
    }

    return applyInit();
  }
}

export const BarcodeHistory = (props: { controller: BarcodeHistoryController }) => {
  const [selected, setSelected] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const subscriptions = [
      props.controller.init(() => {
        return merge([
          props.controller.internal.onAdd((barcode: string) => {
            setHistory((history) => [barcode].concat(history.filter(item => item !== barcode)));
          }),
          props.controller.internal.onSelect(async (barcode: string) => {
            const hsitory = await new Promise<string[]>((resolve, reject) => {
              setHistory((history) => {
                resolve(history);
                return history;
              });
            });
            const index = hsitory.indexOf(barcode);
            if (-1 !== index) {
              setSelected(index);
            }
          })
        ])
      }),
    ];
    return () => {
      return subscriptions.forEach(sub => {
        sub.cancel();
      });
    }
  }, []);

  return <div className="history-list">
    {history.map((barcode: string, index: number) => {
      return <div key={barcode} className={"history-item" + (index === selected ? " history-item-selected" : "")} onClick={() => {
        setSelected(index);
        console.log("to select", barcode);
        props.controller.internal.select(barcode);
      }}>
        <span className="history-item-name">{barcode}</span>
        <span className="history-item-close" onClick={(e) => {
          // 停止事件向上冒泡，避免选择 ”对应的 history item"
          e.stopPropagation();

          if (selected === index) {
            // 如果要删除的 item 是选中的状态，则将选中 “第0个”
            setSelected(0);
            if (history.length > 0) {
              props.controller.internal.select(history[0]);
            }
          } else if (selected > index) {
            // 调整选中状态
            setSelected(selected - 1);
          }

          // 删除
          setHistory((history) => history.filter(item => item !== barcode));
        }}>×</span>
      </div>
    })}
  </div>
}