import { FC, ReactNode, createContext } from "react";

interface IConfigProviderProps {
  children: ReactNode;
}

export const ConfigContext = createContext<{
  direction: "row" | "col";
} | null>(null);

const ConfigProvider: FC<IConfigProviderProps> = ({ children }) => {
  return (
    <ConfigContext.Provider value={{ direction: "row" }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
