import { currencies } from "@/app/currencies";
import { useWidgets } from "@/state/widgets";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";
import { useState } from "react";

type Props = {};

export const AddWidget: React.FC<Props> = ({}) => {
  const addTargetCurrency = useWidgets.use.addTargetCurrency();

  const [newCurrency, setNewCurrency] = useState<string>();

  return (
    <Card className="!transition-opacity !duration-300 opacity-30 hover:opacity-100">
      <CardBody className="gap-2">
        <h2 className="font-semibold">Add another currency</h2>

        <Autocomplete
          label="Select Currency"
          selectedKey={newCurrency}
          onSelectionChange={(key) => key && setNewCurrency(key as string)}
          defaultItems={currencies}
        >
          {(item) => (
            <AutocompleteItem
              key={item.currency}
              value={item.currency}
              textValue={item.currency}
            >
              {item.currency} - {item.country}
            </AutocompleteItem>
          )}
        </Autocomplete>
        <Button
          fullWidth
          onClick={() => {
            if (!newCurrency) return;

            const currency = currencies.find((c) => c.currency === newCurrency);
            if (!currency) return;
            addTargetCurrency(currency);
          }}
          isDisabled={!newCurrency}
        >
          Add Currency
        </Button>
      </CardBody>
    </Card>
  );
};
