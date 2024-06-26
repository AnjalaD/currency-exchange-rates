import { useWidgets } from "@/state/widgets";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { XIcon } from "lucide-react";

type CurrencyWidgetProps = {
  currency: string;
  currencyName: string;
  country: string;
  amount: number | undefined;
  isRemovable?: boolean;
  onRemove?: () => void;
  onAmountChange?: (amount: number) => void;
};

const CurrencyWidget: React.FC<CurrencyWidgetProps> = ({
  currency,
  currencyName,
  country,
  amount,
  isRemovable,
  onRemove,
  onAmountChange,
}) => {
  return (
    <Card>
      <CardHeader className="gap-2">
        <h2 className="text-5xl font-bold font-mono">{currency}</h2>
        <div>
          <div className="text-sm">{country}</div>
          <div className="text-xs">{currencyName}</div>
        </div>

        {isRemovable && (
          <div className="absolute top-2 right-2">
            <Button isIconOnly radius="full" size="sm" onClick={onRemove}>
              <XIcon size={20} />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardBody className="flex flex-col gap-2">
        <Input
          label="Amount"
          type="number"
          value={amount?.toString() || ""}
          onChange={(e) => onAmountChange?.(e.target.valueAsNumber)}
        />
      </CardBody>
    </Card>
  );
};

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

  return (
    <CurrencyWidget
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
