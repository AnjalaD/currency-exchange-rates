import { useLastUpdated } from "@/state/data";

export const Header = () => {
  const lastUpdated = useLastUpdated();

  return (
    <div className="flex flex-col items-center mb-12">
      <h1 className="text-5xl font-bold text-center">
        E<span className="text-7xl text-green-500">X</span>CHANGE RATES
      </h1>
      {lastUpdated && (
        <p className="text-center font-mono">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </p>
      )}
    </div>
  );
};
