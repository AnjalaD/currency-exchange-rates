import { useLastUpdated } from "@/state/data";

export const Header = () => {
  const lastUpdated = useLastUpdated();

  return (
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
  );
};
