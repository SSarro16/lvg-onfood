import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/redux";
import ProductsList from "../components/Products/ProductsList";
import { InputText } from "primereact/inputtext";
import {
  getProductStatus,
  getProductStatusLabel,
  ProductStatus,
} from "../util/productStatus";
import lvglogo from "../assets/lvglogo.png";

type ProductFilter = "all" | ProductStatus;

const filters: { key: ProductFilter; label: string }[] = [
  { key: "all", label: "Tutto" },
  { key: "available", label: "Disponibili" },
  { key: "wip", label: "In preparazione" },
  { key: "unavailable", label: "Terminati" },
];

export default function HomePage() {
  const products = useSelector((state: RootState) => state.products.products);
  const [activeFilter, setActiveFilter] = useState<ProductFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const productGroups = useMemo(() => {
    return products.reduce(
      (groups, product) => {
        groups[getProductStatus(product)].push(product);
        return groups;
      },
      { available: [], wip: [], unavailable: [] } as Record<
        ProductStatus,
        typeof products
      >
    );
  }, [products]);

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return products.filter((product) => {
      const status = getProductStatus(product);
      const matchesFilter = activeFilter === "all" || activeFilter === status;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.title.toLowerCase().includes(normalizedSearch) ||
        (product.description ?? "").toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, products, searchTerm]);

  const summary =
    activeFilter === "all"
      ? "Tutti i prodotti del banco"
      : getProductStatusLabel(activeFilter);

  return (
    <div className="lvg-page">
      <section className="lvg-hero">
        <div className="lvg-hero__copy">
          <h1>
            Il banco gastronomia, piu chiaro.
            <br />
            Piu veloce. Piu appetitoso.
          </h1>
          <p>
            Scopri in tempo reale cosa e disponibile, cosa sta arrivando e cosa
            e terminato oggi.
          </p>
          <div className="lvg-stats" aria-label="Riepilogo prodotti">
            <div className="lvg-stat">
              <span>Disponibili</span>
              <strong>{productGroups.available.length}</strong>
            </div>
            <div className="lvg-stat">
              <span>In preparazione</span>
              <strong>{productGroups.wip.length}</strong>
            </div>
            <div className="lvg-stat">
              <span>Terminati</span>
              <strong>{productGroups.unavailable.length}</strong>
            </div>
          </div>
        </div>
        <aside className="lvg-hero__panel" aria-label="Banco LVG OnFood live">
          <img src={lvglogo} alt="Lo Verde Gastronomy" />
          <div className="lvg-hero__panel-body">
            <span className="lvg-status lvg-status--available">
              <i className="pi pi-sparkles" aria-hidden="true" />
              Banco aggiornato live
            </span>
            <p>
              Una lettura rapida per sala, cucina e clienti: disponibilita,
              preparazioni e terminati restano sempre nello stesso posto.
            </p>
          </div>
        </aside>
      </section>

      <section className="lvg-toolbar" aria-label="Ricerca e filtri prodotti">
        <span className="p-input-icon-left">
          <i className="pi pi-search" aria-hidden="true" />
          <InputText
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Cerca per titolo o descrizione"
            aria-label="Cerca prodotti"
          />
        </span>
        <div className="lvg-filter-group" role="group" aria-label="Filtra prodotti">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className="lvg-filter"
              aria-pressed={activeFilter === filter.key}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <section className="lvg-section">
        <div className="lvg-section__header">
          <div>
            <h2>{summary}</h2>
            <p>
              {visibleProducts.length} prodotti trovati su {products.length}
            </p>
          </div>
        </div>
        <ProductsList products={visibleProducts} />
      </section>
    </div>
  );
}
