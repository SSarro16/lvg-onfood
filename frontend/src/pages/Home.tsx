import React, { useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store/redux";
import ProductsList from "../components/Products/ProductsList";
import {
  getProductStatus,
  getProductStatusLabel,
  ProductStatus,
} from "../util/productStatus";
import lvglogo from "../assets/lvglogo.png";
import { AuthContext } from "../store/context/auth-context";

type ProductFilter = "all" | ProductStatus;

const filters: { key: ProductFilter; label: string }[] = [
  { key: "all", label: "Tutto" },
  { key: "available", label: "Disponibili" },
  { key: "wip", label: "In preparazione" },
  { key: "unavailable", label: "Terminati" },
];

const deliCounterImage =
  "https://commons.wikimedia.org/wiki/Special:Redirect/file/Prepared_food_display_in_an_Italian_deli_in_Rome.jpg?width=1600";

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
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
      : filters.find((filter) => filter.key === activeFilter)?.label ||
        getProductStatusLabel(activeFilter);
  const heroImage =
    products.find((product) => Boolean(product.image?.trim()))?.image ||
    deliCounterImage;

  return (
    <>
      <section className="lvg-hero">
        <div className="lvg-hero__copy">
          <span className="lvg-hero__badge">
            <i className="pi pi-star" aria-hidden="true" />
            Menu aggiornato in tempo reale
          </span>
          <h1>
            Il banco gastronomia, piu chiaro.
            <br />
            Piu veloce. Piu appetitoso.
          </h1>
          <p>
            Una home moderna per vedere subito cosa e disponibile, cosa sta
            arrivando e cosa e terminato, con gestione prodotti pronta per chi
            lavora dietro al banco.
          </p>
          <div className="lvg-hero__actions">
            <a className="lvg-cta lvg-cta--primary" href="#prodotti">
              <i className="pi pi-shopping-bag" aria-hidden="true" />
              Sfoglia prodotti
            </a>
            {currentUser && (
              <button
                className="lvg-cta lvg-cta--secondary"
                type="button"
                onClick={() => navigate("/newproduct")}
              >
                <i className="pi pi-plus" aria-hidden="true" />
                Aggiungi prodotto
              </button>
            )}
          </div>
        </div>

        <aside className="lvg-hero-card" aria-label="Statistiche banco LVG OnFood">
          <div className="lvg-hero-card__glow" aria-hidden="true" />
          <div className="lvg-hero-card__inner">
            <img
              src={heroImage}
              alt="Banco gastronomia Lo Verde"
              onError={(event) => {
                event.currentTarget.src = lvglogo;
              }}
            />
            <div className="lvg-hero-card__stats" aria-label="Riepilogo prodotti">
              <div className="lvg-hero-stat">
                <strong>{productGroups.available.length}</strong>
                <span>Disponibili</span>
              </div>
              <div className="lvg-hero-stat">
                <strong>{productGroups.wip.length}</strong>
                <span>In cucina</span>
              </div>
              <div className="lvg-hero-stat">
                <strong>{productGroups.unavailable.length}</strong>
                <span>Terminati</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="lvg-toolbar" aria-label="Ricerca e filtri prodotti">
        <div className="lvg-search-panel">
          <label className="lvg-search" htmlFor="lvg-product-search">
            <i className="pi pi-search" aria-hidden="true" />
            <input
              id="lvg-product-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Cerca prodotti, piatti, descrizioni..."
              aria-label="Cerca prodotti"
            />
          </label>
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
        </div>

        <div className="lvg-feature-panel" aria-label="Qualita banco digitale">
          <div className="lvg-feature lvg-feature--fresh">
            <i className="pi pi-sparkles" aria-hidden="true" />
            <strong>Fresh</strong>
            <span>giornaliero</span>
          </div>
          <div className="lvg-feature lvg-feature--live">
            <i className="pi pi-chart-line" aria-hidden="true" />
            <strong>Live</strong>
            <span>quantita</span>
          </div>
          <div className="lvg-feature lvg-feature--smart">
            <i className="pi pi-filter" aria-hidden="true" />
            <strong>Smart</strong>
            <span>filtri</span>
          </div>
        </div>
      </section>

      <section className="lvg-section" id="prodotti">
        <div className="lvg-section__header">
          <div>
            <h2>{summary}</h2>
            <p>
              {visibleProducts.length} prodotti trovati su {products.length}
            </p>
          </div>
        </div>
        <ProductsList
          products={visibleProducts}
          onResetFilters={() => {
            setActiveFilter("all");
            setSearchTerm("");
          }}
        />
      </section>
    </>
  );
}
