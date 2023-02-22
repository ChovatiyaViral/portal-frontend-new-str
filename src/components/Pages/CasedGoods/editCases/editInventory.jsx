import { Col, Modal, Row, Tag } from "antd";
import { get } from "lodash";
import React from "react";
import { ActionOptions } from "../../../../constants";
import { isBlank } from "../../../../helpers/utility";
import { defaultRequestKey } from "../../../../settings";
import "../index.scss";
import { defaultValue } from "../utility/constants";
import { getYearFromDate } from "../utility/helper";
import EditPriceInventory from "./editPriceInventory";
import EditQuantityInventory from "./editQuantityInventory";

const EditInventory = (props) => {
  const [price, updatePrice] = React.useState({ ...defaultValue.price });

  const [comments, setComments] = React.useState("");

  const [isChanged, setIsChanged] = React.useState(false);
  const [commentsError, updateCommentsError] = React.useState(false);

  const [priceError, updatePriceError] = React.useState({});
  const [rotationNumber, updateRotationNumber] = React.useState([]);
  const [isSaveDisabled, setIsSaveDisabled] = React.useState(false);

  React.useEffect(() => {
    if (get(props, "actionType") === ActionOptions.Price) {
      handleExportPrice("export_price", get(props, "record.export_price"));
    }
  }, []);

  const handleChange = React.useCallback((name, func, value) => {
    setIsChanged(true);

    if (name === "comments" && !isBlank(value)) {
      updateCommentsError(false);
    }

    func(value);
  });

  const handleSave = () => {
    let responseObj = { id: get(props, "record.id") };
    let checkValueChange = isChanged;

    if (get(props, "actionType", ActionOptions.Quantity) === "quantity") {
      let inventoryObj = {
        reason: comments,
        rotation_numbers: rotationNumber,
      };

      if (isBlank(comments)) {
        updateCommentsError(true);
        return false;
      }

      responseObj = { ...responseObj, ...inventoryObj };
    }

    if (get(props, "actionType", ActionOptions.Quantity) === "price") {
      let inventoryObj = { ...price, reason: comments };

      if (isBlank(price["export_price"])) {
        updatePriceError({ export_price: true });
        return false;
      }

      if (isBlank(comments)) {
        updateCommentsError(true);
        return false;
      }

      responseObj = { ...responseObj, ...inventoryObj };
    }

    props.handleSubmit(responseObj, checkValueChange);
  };

  const handlePriceChange = React.useCallback(
    (key, value) => {
      let newPrice = { ...price };
      newPrice[key] = value;
      updatePriceError({ export_price: false });
      updatePrice(newPrice);
    },
    [price]
  );

  const fetchPricingParameters = async (requestOptions) => {
    const pricingParametersResponse = await props.getPricingParameters(requestOptions);
    const exportPrice = get(price, "export_price") || get(price, "export_price") === 0 ? get(price, "export_price") : get(props, "record.export_price");
    const offerPrice = get(props, "record.offer_price");
    setIsChanged(true);
    updatePrice({
      ...price,
      export_price: exportPrice,
      offer_price: offerPrice,
      ...get(pricingParametersResponse, "response.data"),
    });
  };

  const handleExportPrice = React.useCallback(
    (key, value) => {
      if (key && value) {
        if (key === "export_price") {
          updatePriceError({ export_price: false });
          const options = {
            export_price: value,
            abv: get(props, "record.abv", ""),
            volume: get(props, "record.volume", ""),
            bpc: get(props, "record.bpc", ""),
          };
          const requestOptions = { ...options, ...defaultRequestKey };
          fetchPricingParameters(requestOptions);
        }
      }
    },
    [price]
  );

  return (
    <>
      <Modal
        title=""
        centered={true}
        open={get(props, "isOpen", false)}
        onOk={() => handleSave()}
        okButtonProps={{
          disabled: isSaveDisabled,
        }}
        closable={false}
        okText="Update"
        width={900}
        destroyOnClose={true}
        style={{ top: 10 }}
        maskClosable={false}
        onCancel={() => props.handleClose(false)}
        className="view_inventory__edit_inventory"
      >
        <div className="mt-2">
          <Row gutter={[16, 16]}>
            <Col>
              <span>
                Cased Goods ID:
                <b className="ml-1">{get(props, "record.id") ? get(props, "record.id") : "NIL"}</b>
              </span>
            </Col>
            <Col>
              <span>
                Year: <b> {getYearFromDate(get(props, "record.year", ""))} </b>
              </span>
            </Col>
            <Col>
              <span>
                Brand: <b> {get(props, "record.brand", "NIL")}</b>
              </span>
            </Col>
            <Col>
              <span>
                Distillery: <b> {get(props, "record.distillery", "NIL")}</b>
              </span>
            </Col>
            <Col>
              <span>
                BPC:
                <b className="ml-1">{get(props, "record.bpc", 0)}</b>
              </span>
            </Col>
          </Row>
          <Row gutter={[8, 5]} style={{ marginTop: 10 }}>
            <Col>
              <span>
                Available Cases:
                <b className="ml-1">
                  <Tag color="blue">{get(props, "record.cases") ? get(props, "record.cases") : 0}</Tag>
                </b>
              </span>
              <span>
                Bottles:
                <b className="ml-1">
                  <Tag color="blue">{get(props, "record.bottles", 0)}</Tag>
                </b>
              </span>
            </Col>
            <Col>
              <span>
                Ordered:
                <b className="ml-1">
                  <Tag color="orange">{get(props, "record.ordered_cases") ? get(props, "record.ordered_cases") : 0}</Tag>
                </b>
              </span>
            </Col>
            <Col>
              <span>
                Allocations:
                <b className="ml-1">
                  <Tag color="orange">{get(props, "record.allocations_across_rot_nos") ? get(props, "record.allocations_across_rot_nos") : 0}</Tag>
                </b>
              </span>
            </Col>
            <Col>
              <span>
                Net:
                <b className="ml-1">
                  <Tag color="green">{get(props, "record.net_available_cases") ? get(props, "record.net_available_cases") : 0}</Tag>
                </b>
              </span>
            </Col>
            <Col>
              <span>
                Production Gap:
                <b className="ml-1">
                  <Tag color="red">{get(props, "record.production_gap") ? get(props, "record.production_gap") : 0}</Tag>
                </b>
              </span>
            </Col>
            {/* <Col>
              <span>
                Bottles:
                <b className="ml-1">
                  <Tag color="#108ee9">{get(props, "record.bottles", 0)}</Tag>
                </b>
              </span>
            </Col> */}
          </Row>
          <hr
            style={{
              borderTop: "1px solid #bfbfbf",
            }}
          />
          {get(props, "actionType", ActionOptions.Quantity) === ActionOptions.Quantity && (
            <EditQuantityInventory
              record={get(props, "record", {})}
              handleChange={handleChange}
              updateSaveDisabled={(val) => setIsSaveDisabled(val)}
              updateRotationNumber={(rotationList) => {
                setIsSaveDisabled(false);
                updateRotationNumber(rotationList);
              }}
              comments={comments}
              setComments={setComments}
              commentsError={commentsError}
            />
          )}
          {get(props, "actionType", ActionOptions.Quantity) === ActionOptions.Price && (
            <EditPriceInventory
              loading={get(props, "pricingParametersLoading", false)}
              handlePriceChange={handlePriceChange}
              price={price}
              handleChange={handleChange}
              clonedCaseRecord={get(props, "clonedCaseRecord", 0)}
              record={get(props, "record", 0)}
              handleExportPrice={handleExportPrice}
              priceError={priceError}
              comments={comments}
              setComments={setComments}
              commentsError={commentsError}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default EditInventory;
