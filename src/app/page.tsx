"use client";

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { currencies } from "./currencies";

export default function Home() {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [baseValue, setBaseValue] = useState(1);

  const [newCurrency, setNewCurrency] = useState<string>();

  const [rates, setRates] = useState<{ [key: string]: number }>({
    USD: 1,
    AUD: 1.4817,
    BGN: 1.7741,
    CAD: 1.3168,
    CHF: 0.9774,
    CNY: 6.9454,
    EGP: 15.7361,
    EUR: 0.9013,
    GBP: 0.7679,
    LKR: 305.02,
  });

  const [targets, setTargets] = useState<{ code: string; value?: number }[]>([
    { code: "LKR" },
  ]);

  const onBaseCurrencyChange = (code: string) => {
    setBaseCurrency(code);
    setTargets((prev) =>
      prev.map((target) => ({ ...target, value: undefined }))
    );
  };
  const onBaseValueChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setBaseValue(Number(e.target.value));
    setTargets((prev) =>
      prev.map((target) => {
        const rate = rates[target.code];
        return {
          ...target,
          value: rate ? rate * Number(e.target.value) : undefined,
        };
      })
    );
  };

  const onTargetCurrencyChange = (code: string, index: number) => {
    const newTargets = [...targets];
    newTargets[index].code = code;
    newTargets[index].value = undefined;
    setTargets(newTargets);
  };

  const onTargetValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const rate = rates[targets[index].code];
    if (!rate) {
      return;
    }
    const baseValue = +Number(e.target.value) / rate;
    setBaseValue(+baseValue.toFixed(4));

    setTargets((prev) =>
      prev.map((target) => {
        if (target.code === targets[index].code) {
          return { ...target, value: +e.target.value };
        }

        const rate = +rates[target.code]?.toFixed(4);
        return { ...target, value: rate ? rate * baseValue : undefined };
      })
    );
  };

  const onAddCurrency = () => {
    if (!newCurrency) return;
    setNewCurrency(undefined);
    setTargets((prev) => [...prev, { code: newCurrency }]);
  };

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);

  const handleFetch = async (currency: string) => {
    setLoading(true);
    const response = await fetchExchangeRates(currency);
    setData(response);
    setLoading(false);
  };

  useEffect(() => {
    handleFetch("USD");
  }, []);

  return (
    <main className="max-w-7xl mx-auto flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-center">
          Welcome to the Exchange Rates
        </h1>
        <p className="text-center">View and compare exchange rates</p>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h2 className="text-large font-bold">
              Base Currency ({baseCurrency})
            </h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <Autocomplete
              color="primary"
              label="Select Base Currency"
              selectedKey={baseCurrency}
              onSelectionChange={(key) =>
                key && onBaseCurrencyChange(key as string)
              }
              defaultItems={currencies}
            >
              {(item) => (
                <AutocompleteItem key={item.code} value={item.code}>
                  {item.code}
                </AutocompleteItem>
              )}
            </Autocomplete>
            <Input
              color="primary"
              label="Amount"
              type="number"
              value={baseValue.toString()}
              onChange={onBaseValueChange}
            />
          </CardBody>
        </Card>

        {targets.map((target, index) => (
          <Card key={index}>
            <CardHeader>
              <h2 className="text-large font-bold">{target.code}</h2>
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
              <Autocomplete
                label="Select Target Currency"
                selectedKey={target.code}
                onSelectionChange={(key) =>
                  key && onTargetCurrencyChange(key as string, index)
                }
                defaultItems={currencies}
              >
                {(item) => (
                  <AutocompleteItem key={item.code} value={item.code}>
                    {item.code}
                  </AutocompleteItem>
                )}
              </Autocomplete>

              <Input
                label="Amount"
                type="number"
                value={target.value?.toString() || ""}
                onChange={(e) => onTargetValueChange(e, index)}
              />
            </CardBody>
          </Card>
        ))}

        <Card shadow="sm">
          <CardHeader>
            <h2 className="text-large font-semibold">Add another currency</h2>
          </CardHeader>

          <CardBody>
            <Autocomplete
              label="Select Currency"
              selectedKey={newCurrency}
              onSelectionChange={(key) => key && setNewCurrency(key as string)}
              defaultItems={currencies}
            >
              {(item) => (
                <AutocompleteItem key={item.code} value={item.code}>
                  {item.code}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </CardBody>
          <CardFooter>
            <Button fullWidth onClick={onAddCurrency} isDisabled={!newCurrency}>
              Add Currency
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

const fetchExchangeRates = async (currency: string) => {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/Key/latest/${currency}`,
    {
      method: "GET",
    }
  );
  return await response.json();
};
