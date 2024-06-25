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
import { XIcon } from "lucide-react";

export default function Home() {
  const lastUpdated = useLastUpdated();

  const [newCurrency, setNewCurrency] = useState<string>();

  const base = useWidgets.use.base();
  const baseCurrency = base.currency;
  const baseAmount = base.amount;
  const setBaseAmount = useWidgets.use.setBaseAmount();

  const targets = useWidgets.use.target();
  const addTargetCurrency = useWidgets.use.addTargetCurrency();
  const setTargetAmount = useWidgets.use.setTargetAmount();
  const removeTargetCurrency = useWidgets.use.removeTargetCurrency();

  return (
    <main className="max-w-7xl min-h-screen mx-auto flex flex-col items-center justify-between pt-24 px-8">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-green-800 text-4xl font-bold text-center">
          Welcome to the X-Rates
        </h1>
        {lastUpdated && (
          <p className="text-green-950 text-center">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        )}
      </div>

      <div className="w-full grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="gap-2">
            <h2 className="text-5xl font-bold font-mono">{baseCurrency}</h2>
            <div>
              <div className="text-sm">{base.country}</div>
              <div className="text-sm">{base.currencyName}</div>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <Input
              color="secondary"
              label="Amount"
              type="number"
              value={baseAmount?.toString() ?? ""}
              onChange={(e) => setBaseAmount(e.target.valueAsNumber)}
            />
          </CardBody>
        </Card>

        {targets.map((target, index) => (
          <Card key={index}>
            <CardHeader className="gap-2">
              <h2 className="text-5xl font-bold font-mono">
                {target.currency}
              </h2>
              <div>
                <div className="text-sm">{target.country}</div>
                <div className="text-xs">{target.currencyName}</div>
              </div>

              <div className="absolute top-2 right-2">
                <Button
                  isIconOnly
                  radius="full"
                  size="sm"
                  onClick={() => removeTargetCurrency(index)}
                >
                  <XIcon size={20} />
                </Button>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-2">
              <Input
                label="Amount"
                type="number"
                value={target.amount?.toString() || ""}
                onChange={(e) => setTargetAmount(e.target.valueAsNumber, index)}
              />
            </CardBody>
          </Card>
        ))}

        <Card className="!transition-opacity !duration-300 opacity-30 hover:opacity-100 ">
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

                const currency = currencies.find(
                  (c) => c.currency === newCurrency
                );
                if (!currency) return;
                addTargetCurrency(currency);
              }}
              isDisabled={!newCurrency}
            >
              Add Currency
            </Button>
          </CardBody>
        </Card>
      </div>

      <footer className="rounded-t-large bg-white bg-opacity-80 shadow-small text-center text-xs text-gray-500 px-4 py-2">
        <div>
          Made by{" "}
          <a
            href="https://github.com/AnjalaD"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-800"
          >
            AnjalaD
          </a>
        </div>
      </footer>
    </main>
  );
}
