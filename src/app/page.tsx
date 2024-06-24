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
import { useState } from "react";
import { currencies } from "./currencies";
import { useLastUpdated } from "@/state/data";
import { useWidgets } from "@/state/widgets";

export default function Home() {
  const lastUpdated = useLastUpdated();

  const [newCurrency, setNewCurrency] = useState<string>();

  const base = useWidgets.use.base();
  const baseCurrency = base.currency;
  const baseAmount = base.amount;
  const setBaseCurrency = useWidgets.use.setBaseCurrency();
  const setBaseAmount = useWidgets.use.setBaseAmount();

  const targets = useWidgets.use.target();
  const addTargetCurrency = useWidgets.use.addTargetCurrency();
  const setTargetCurrency = useWidgets.use.setTargetCurrency();
  const setTargetAmount = useWidgets.use.setTargetAmount();

  return (
    <main className="max-w-7xl mx-auto flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-between mb-12">
        <h1 className="text-4xl font-bold text-center">
          Welcome to the Exchange Rates
        </h1>
        {lastUpdated && (
          <p className="text-center">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
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
              onSelectionChange={(key) => key && setBaseCurrency(key as string)}
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
              value={baseAmount?.toString() ?? ""}
              onChange={(e) => setBaseAmount(e.target.valueAsNumber)}
            />
          </CardBody>
        </Card>

        {targets.map((target, index) => (
          <Card key={index}>
            <CardHeader>
              <h2 className="text-large font-bold">{target.currency}</h2>
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
              <Autocomplete
                label="Select Target Currency"
                selectedKey={target.currency}
                onSelectionChange={(key) =>
                  key && setTargetCurrency(key as string, index)
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
                value={target.amount?.toString() || ""}
                onChange={(e) => setTargetAmount(e.target.valueAsNumber, index)}
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
            <Button
              fullWidth
              onClick={() => newCurrency && addTargetCurrency(newCurrency)}
              isDisabled={!newCurrency}
            >
              Add Currency
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
