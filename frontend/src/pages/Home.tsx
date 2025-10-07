import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../store/redux";
import type { Product } from "../store/redux/products-slice";
import ProductsList from "../components/Products/ProductsList";
import { Fieldset } from "primereact/fieldset";
import { useLang } from "../store/context/lang-context";

export default function HomePage() {
  const products = useSelector((state: RootState) => state.products.products);
  const [wipProducts, setWipProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [unavailableProducts, setUnavailableProducts] = useState<Product[]>([]);
  const { t: translate } = useLang();

  useEffect(() => {
    if (Array.isArray(products)) {
      products.forEach((product) => {
        if (product.quantity > 0) {
          setAvailableProducts((prevState) => {
            const exists = prevState.some((el) => el.id === product.id);
            if (exists) return prevState;
            return [...prevState, product];
          });
        } else if (
          product.estimatedCompletedTime &&
          product.estimatedCompletedTime > 0
        ) {
          setWipProducts((prevState) => {
            const exists = prevState.some((el) => el.id === product.id);
            if (exists) return prevState;
            return [...prevState, product];
          });
        } else {
          setUnavailableProducts((prevState) => {
            const exists = prevState.some((el) => el.id === product.id);
            if (exists) return prevState;
            return [...prevState, product];
          });
        }
      });
    }
  }, [products]);

  return (
    <>
      <div>
        <Header
          title={translate("title_header")}
          message={translate("desc_header")}
        />
      </div>
      <div>
        <section className="product-list">
          <Fieldset legend={translate("product_disponible")} toggleable>
            <ProductsList products={availableProducts} />
          </Fieldset>
        </section>
        <section className="product-list">
          <Fieldset legend={translate("product_wip")} toggleable>
            <ProductsList products={wipProducts} />
          </Fieldset>
        </section>
        <section className="product-list">
          <Fieldset legend={translate("product_undisponible")} toggleable>
            <ProductsList products={unavailableProducts} />
          </Fieldset>
        </section>
      </div>
    </>
  );
}
