import { GetRegistroGiornalieroListProvider } from "../hooks/useDataRegistroGiornalieroList";
import { RegistroGiornalieroList } from "../RegistroGiornalieroList";

export const RegistroGiornalieroLayout = () => (
  <GetRegistroGiornalieroListProvider>
    <RegistroGiornalieroList />
  </GetRegistroGiornalieroListProvider>
);