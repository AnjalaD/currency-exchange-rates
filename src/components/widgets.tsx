import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  BaseCurrencyWidget,
  TargetCurrencyWidget,
} from "@/components/currency-widget";
import { AddWidget } from "@/components/add-widget";
import { useWidgets } from "@/state/widgets";

const activationConstraint = {
  delay: 250,
  tolerance: 5,
};

export const Widgets = () => {
  const targets = useWidgets.use.target();
  const swapTargetCurrencies = useWidgets.use.swapTargetCurrencies();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint,
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint,
  });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const onDragEnd = (event: DragEndEvent) => {
    if (!event.over || !event.active) return;
    const sourceIndex = Number(event.active.id);
    const targetIndex = Number(event.over.id);
    swapTargetCurrencies(sourceIndex, targetIndex);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="w-full grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <BaseCurrencyWidget />

        {targets.map((target, index) => (
          <TargetCurrencyWidget
            key={index}
            isRemovable
            index={index}
            currency={target.currency}
            currencyName={target.currencyName}
            country={target.country}
            amount={target.amount}
          />
        ))}

        <AddWidget />
      </div>
    </DndContext>
  );
};
