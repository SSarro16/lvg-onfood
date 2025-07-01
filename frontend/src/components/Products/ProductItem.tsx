import React, { FormEvent, useEffect, useRef, useState } from "react";
import { DataView } from "primereact/dataview";
import { Product } from "../../store/redux/products-slice";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { fetchDeleteProduct, fetchUpdateProduct } from "../../util/http";
import { Form, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Tag, TagProps } from "primereact/tag";

type ProductItemProps = { product: Product; token?: string };

type NewProductFormFields = {
  title: string;
  image: string;
  price: number;
  description: string;
  quantity: number;
  estimatedCompletedTime: number;
};

type ProntoFormFields = {
  title: string;
  image: string;
  price: number;
  description: string;
  quantity: number;
  estimatedCompletedTime: number;
};

const defaultFormFields: NewProductFormFields = {
  title: "",
  image: "",
  price: 0,
  description: "",
  quantity: 0,
  estimatedCompletedTime: 0,
};

const ProductItem: React.FC<ProductItemProps> = (props) => {
  const toast = useRef<Toast>(null);
  // #PRODUCT DETAIL VISIBLE
  const [visible, setVisible] = useState(false);

  // #PRONTO EDIT VISIBLE
  const [prontoEdit, setProntoEdit] = useState(false);
  // #PRONTO FORM FIELDS
  const [formQty, setFormQty] = useState<ProntoFormFields>(defaultFormFields);

  // #PRODUCT EDIT VISIBLE
  const [visibleEdit, setVisibleEdit] = useState(false);
  // #PRODUCT FORM FIELDS
  const [formFields, setFormFields] =
    useState<NewProductFormFields>(defaultFormFields);
  const { title, image, price, description, quantity, estimatedCompletedTime } =
    formFields;

  // #USE NAVIGATE
  const navigate = useNavigate();

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormFields((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleNumberChange = (event: InputNumberValueChangeEvent) => {
    const { name, value } = event.target;
    setFormFields((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const initEditFormFields = () => {
    const product = props.product;
    setFormFields({
      title: product.title,
      image: product.image,
      price: product.price,
      description: product.description || "",
      quantity: product.quantity,
      estimatedCompletedTime: product.estimatedCompletedTime,
    });
  };

  const successDeleteHandler = () => {
    setVisible(false);
    toast.current?.show({
      severity: "success",
      summary: "Product Deleted",
      detail: "Product deleted successfully",
      life: 1000,
    });
  };

  const errorDeleteHandler = () => {
    setVisible(false);
    toast.current?.show({
      severity: "warn",
      summary: "Product Deletion Interrupted",
      detail: "Product deletion interrupted successfully",
      life: 1000,
    });
  };

  const errorSavingHandler = () => {
    toast.current?.show({
      severity: "error",
      summary: "Edit Product Failed",
      detail: "Edit product failed !!",
      life: 3000,
    });
  };
  const successSavingHandler = () => {
    resetFormFields();
    setVisibleEdit(false);
    setProntoEdit(false);
    setVisible(true);
    navigate("/");
    toast.current?.show({
      severity: "success",
      summary: "Product Updated",
      detail: "Product updated successfully",
      life: 3000,
    });
  };

  const header = (
    <div className="block max-w-30rem">
      <img alt={props.product.title} src={props.product.image} />
    </div>
  );

  const confirm2 = () => {
    confirmDialog({
      tagKey: "deleteProduct",
      message: "Do you want to delete this product?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Delete",
      async accept() {
        setVisible(false);
        if (props.token) {
          fetchDeleteProduct(props.token, props.product.id, {
            errorDeleteHandler,
            successDeleteHandler,
          });
        }
      },
      reject() {
        setVisible(false);
      },
    });
  };

  const editing = () => {
    setVisible(true);
    confirmDialog({
      tagKey: "editProduct",
      message: "Do you want to edit this product?",
      header: "Edit Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-warning",
      acceptLabel: "Go to edit",
      async accept() {
        setVisibleEdit(true);
        setVisible(false);
        initEditFormFields();
      },
      reject() {
        setVisible(false);
      },
    });
  };

  const pronto = () => {
    confirmDialog({
      tagKey: "prontoConfirm",
      message: "Il prodotto è pronto?",
      header: "Conferma Pronto",
      icon: "pi pi-check-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      acceptLabel: "Sì, imposta quantità",
      async accept() {
        // inizializza solo il campo quantità
        setFormQty({
          ...formQty,
          quantity: props.product.quantity,
          title: props.product.title,
          image: props.product.image,
          price: props.product.price,
          description: props.product.description || "",
          estimatedCompletedTime: 0,
        });
        setProntoEdit(true); // mostra il dialog per edit qty
      },
      reject() {
        setVisible(false);
        // Non fare nulla, solo chiudi
      },
    });
  };

  const saving = () => {
    confirmDialog({
      tagKey: "savingProduct",
      message: "Do you want to save this edited product?",
      header: "Save Edit Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Save",
      accept() {
        setVisible(false);
        setVisibleEdit(false);
        if (props.token) {
          const bodyData: NewProductFormFields = {
            title,
            image,
            price,
            description,
            quantity,
            estimatedCompletedTime,
          };
          console.log("New Product form data: ", { bodyData });
          fetchUpdateProduct(props.token, props.product.id, bodyData, {
            errorSavingHandler,
            successSavingHandler,
          });
          resetFormFields();
        }
      },
      reject() {
        setVisible(false);
        resetFormFields();
      },
    });
  };

  let severity: "success" | "info" | "warning" | "danger" | null | undefined;
  let status: string;
  let icon: string;
  let borderItem =
    "p-4 border-1 surface-border hover:border-900 focus:bg-white border-round surface-900";

  if (props.product.quantity > 0) {
    severity = "success";
    status = "Disponibile";
    icon = "pi pi-check";
  } else if (
    props.product.quantity === 0 &&
    props.product.estimatedCompletedTime === 0
  ) {
    severity = "danger";
    status = "Esaurito";
    icon = "pi pi-times";
    borderItem =
      "p-4 border-1 surface-border hover:border-900 focus:bg-white border-round bg-black-alpha-80";
  } else if (
    props.product.quantity === 0 &&
    props.product.estimatedCompletedTime > 0
  ) {
    severity = "warning";
    status = "In Produzione";
    icon = "pi pi-wrench";
    borderItem =
      "p-4 border-1 surface-border hover:border-900 focus:bg-white border-round bg-orange-600";
  }

  const footer = (
    <>
      <Toast ref={toast} />
      <ConfirmDialog tagKey="deleteProduct" />
      <ConfirmDialog tagKey="editProduct" />
      <ConfirmDialog tagKey="savingProduct" />
      <ConfirmDialog tagKey="prontoConfirm" />
      {props.token && (
        <>
          <Button
            label="Save"
            severity="success"
            icon="pi pi-check"
            onClick={saving}
            visible={visibleEdit}
            style={{ marginLeft: "0.5em" }}
          ></Button>
          <Button
            label="Close"
            severity="danger"
            icon="pi pi-times"
            onClick={() => setVisibleEdit(false)}
            visible={visibleEdit}
            style={{ marginLeft: "0.5em" }}
          ></Button>
          <Button
            name="Edit"
            label="Edit"
            icon="pi pi-pencil"
            visible={visible}
            onClick={editing}
            style={{ marginLeft: "0.5em" }}
          ></Button>
          <Button
            name="Delete"
            label="Delete"
            severity="danger"
            icon="pi pi-trash"
            visible={visible}
            style={{ marginLeft: "0.5em" }}
            onClick={confirm2}
          ></Button>
          {props.product.estimatedCompletedTime > 0 && (
            <Button
              name="Pronto"
              label="Pronto"
              severity="success"
              icon="pi pi-check"
              style={{ marginLeft: "0.5em" }}
              onClick={pronto}
            ></Button>
          )}
        </>
      )}
    </>
  );

  const gridItem = () => {
    const shouldShowTag = props.product.quantity > 0;

    return (
      <div
        className="m-2 gap-2 align-items-stretch w-14rem grid "
        key={props.product.id}
      >
        <div className={borderItem}>
          <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="flex align-items-center gap-2"></div>
          </div>
          <div className="text-xl text-100 text-center font-bold">
            {props.product.title}
          </div>
          <div className="flex flex-wrap text-center justify-content-center m-2 pt-1 gap-2">
            <Tag severity={severity} value={status} icon={icon} rounded />
            {props.product.quantity > 0 && props.product.quantity <= 4 && (
              <Tag severity="danger" value="Quasi Terminato" rounded />
            )}
          </div>
          <div className="text-center h-0 py-4">
            <img
              className="max-w-9rem  border-round "
              src={props.product.image}
              alt={props.product.title}
              height={"100vh"}
              width={"120%"}
            />
          </div>
          <div className="flex align-items-center justify-content-between">
            <span className="text-xl text-100 font-semibold">
              €{props.product.price}
            </span>
            <span className="text-xl text-100 font-semibold">
              <Button
                className="bg-white"
                severity="success"
                icon="pi pi-bars"
                aria-label="details"
                onClick={() => setVisible(true)}
                rounded
                text
                raised
              />
              <Dialog
                // maximized
                // modal
                visible={visible}
                onHide={() => setVisible(false)}
              >
                <Card
                  title={props.product.title}
                  header={header}
                  footer={footer}
                  subTitle="Product Detail"
                  className="md:w-25rem"
                  pt={{ root: { style: { boxShadow: "unset" } } }}
                >
                  <p className="m-0 ">{props.product.description}</p>
                  <p className="m-0 ">Quantità: {props.product.quantity} pz</p>
                  <p className="m-0 text-right">{props.product.price}€</p>
                  <div>
                    Disponibilità: <Tag severity={severity} value={status} />
                  </div>
                </Card>
              </Dialog>
              <Dialog
                // maximized
                modal
                visible={visibleEdit}
                onHide={() => setVisibleEdit(false)}
              >
                <Card
                  title="Edit Product Details"
                  footer={footer}
                  className="md:w-30rem w-40rem h-50rem text-center"
                >
                  <Form method="post">
                    <div>
                      <div className="gap-2 m-2">
                        <p className="text-white">Set a new image URL</p>
                        <InputText
                          id="image"
                          type="url"
                          name="image"
                          value={image}
                          onChange={handleChange}
                          required
                          placeholder="Image URL"
                          className="p-inputtext-lg"
                        />
                      </div>
                      <div className="gap-2 m-2">
                        <p className="text-white">Set a new Title</p>
                        <InputText
                          id="title"
                          type="text"
                          name="title"
                          value={title}
                          placeholder={props.product.title}
                          onChange={handleChange}
                          className="p-inputtext-lg"
                        />
                      </div>
                      <div className="gap-2 m-2">
                        <p className="text-white">Set a new Description</p>
                        <InputText
                          id="description"
                          type="textarea"
                          name="description"
                          value={description}
                          onChange={handleChange}
                          placeholder={props.product.description}
                          className="p-inputtext-lg"
                        />
                      </div>
                      <div className="gap-2 m-2">
                        <p className="text-white">Set a new Price</p>
                        <InputNumber
                          id="price"
                          name="price"
                          mode="currency"
                          value={price}
                          currency="EUR"
                          locale="it-IT"
                          placeholder={props.product.price.toString()}
                          required
                          onValueChange={handleNumberChange}
                          className="p-inputtext-lg"
                        />
                      </div>
                      <div className="gap-2 m-2 ">
                        <p className="text-white">Set a new Quantity</p>
                        <InputNumber
                          id="quantity"
                          name="quantity"
                          value={quantity}
                          placeholder={props.product.quantity.toString()}
                          onValueChange={handleNumberChange}
                          className="p-inputtext-lg"
                        />
                      </div>
                      <div className="gap-2 m-2">
                        <p className="text-white">
                          Set a new Estimated Completed Time
                        </p>
                        <InputNumber
                          id="estimatedCompletedTime"
                          name="estimatedCompletedTime"
                          value={estimatedCompletedTime}
                          placeholder={props.product.estimatedCompletedTime.toString()}
                          onValueChange={handleNumberChange}
                          className="p-inputtext-lg"
                        />
                      </div>
                    </div>
                  </Form>
                </Card>
              </Dialog>
              <Dialog
                header="Imposta nuova quantità"
                visible={prontoEdit}
                onHide={() => setProntoEdit(false)}
              >
                <Card
                  title="Prodotto Pronto"
                  footer={
                    <div className="flex justify-content-end gap">
                      <Button
                        label="Annulla"
                        icon="pi pi-times"
                        className="p-button-secondary"
                        onClick={() => setProntoEdit(false)}
                      />
                      <Button
                        label="Salva"
                        icon="pi pi-check"
                        className="p-button-success"
                        onClick={() => {
                          if (props.token) {
                            fetchUpdateProduct(
                              props.token,
                              props.product.id,
                              {
                                ...formQty,
                                estimatedCompletedTime: 0,
                              },
                              { errorSavingHandler, successSavingHandler }
                            );
                            setProntoEdit(false);
                          }
                        }}
                      />
                    </div>
                  }
                >
                  <div className="m-3">
                    <label htmlFor="quantity" className="block text-white mb-2">
                      Nuova quantità disponibile
                    </label>
                    <InputNumber
                      id="quantity"
                      name="quantity"
                      value={formQty.quantity}
                      onValueChange={(e) =>
                        setFormQty((prev) => ({
                          ...prev,
                          quantity: e.value || 0,
                        }))
                      }
                      showButtons
                      className="p-inputtext-lg w-full"
                    />
                  </div>
                </Card>
              </Dialog>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DataView
      className="flex-initial flex align-items-center justify-content-center"
      value={[props.product]}
      itemTemplate={gridItem}
    />
  );
};

export default ProductItem;

export { ProductItem };
