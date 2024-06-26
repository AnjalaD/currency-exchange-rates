import { useWidgets } from "@/state/widgets";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Input,
} from "@nextui-org/react";
import { XIcon } from "lucide-react";
import { forwardRef } from "react";

type CurrencyWidgetProps = {
  currency: string;
  currencyName: string;
  country: string;
  amount: number | undefined;
  isRemovable?: boolean;
  onRemove?: () => void;
  onAmountChange?: (amount: number) => void;
} & Omit<CardProps, "ref">;

const CurrencyWidget = forwardRef<HTMLDivElement, CurrencyWidgetProps>(
  (
    {
      currency,
      currencyName,
      country,
      amount,
      isRemovable,
      onRemove,
      onAmountChange,
      ...rest
    },
    ref
  ) => {
    return (
      <Card ref={ref} {...rest}>
        <CardHeader className="gap-2 pb-0">
          <h2 className="text-5xl font-bold font-mono">{currency}</h2>
          <div>
            <div className="text-sm">{country}</div>
            <div className="text-xs">{currencyName}</div>
          </div>

          {isRemovable && (
            <div className="absolute top-2 right-2">
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                onClick={onRemove}
              >
                <XIcon className="text-gray-500" size={20} />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          <Input
            classNames={{
              input: "text-xl font-mono placeholder:text-sm",
            }}
            size="lg"
            aria-label="Amount"
            placeholder="Enter amount"
            type="number"
            value={amount?.toString()}
            onChange={(e) => onAmountChange?.(+e.target.value)}
          />
        </CardBody>
      </Card>
    );
  }
);
CurrencyWidget.displayName = "CurrencyWidget";

type TargetCurrencyWidgetProps = {
  index: number;
  currency: string;
  currencyName: string;
  country: string;
  amount: number | undefined;
  isRemovable: boolean;
};

export const TargetCurrencyWidget: React.FC<TargetCurrencyWidgetProps> = ({
  index,
  currency,
  currencyName,
  country,
  amount,
  isRemovable,
}) => {
  const setTargetAmount = useWidgets.use.setTargetAmount();
  const removeTargetCurrency = useWidgets.use.removeTargetCurrency();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: index.toString(),
    });

  const {
    isOver,
    setNodeRef: droppableSetNodeRef,
    active,
  } = useDroppable({
    id: index.toString(),
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    backgroundColor: isOver
      ? active?.id === index.toString()
        ? "lightgray"
        : "black"
      : undefined,
  };

  const setAllNodeRefs = (node: HTMLElement | null) => {
    setNodeRef(node);
    droppableSetNodeRef(node);
  };

  return (
    <CurrencyWidget
      ref={setAllNodeRefs}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "!z-50" : ""}
      currency={currency}
      currencyName={currencyName}
      country={country}
      amount={amount}
      isRemovable={isRemovable}
      onRemove={() => removeTargetCurrency(index)}
      onAmountChange={(amount) => setTargetAmount(index, amount)}
    />
  );
};

export const BaseCurrencyWidget: React.FC<{}> = ({}) => {
  const base = useWidgets.use.base();
  const setBaseAmount = useWidgets.use.setBaseAmount();

  return (
    <CurrencyWidget
      currency={base.currency}
      currencyName={base.currencyName}
      country={base.country}
      amount={base.amount}
      onAmountChange={(amount) => setBaseAmount(amount)}
    />
  );
};
