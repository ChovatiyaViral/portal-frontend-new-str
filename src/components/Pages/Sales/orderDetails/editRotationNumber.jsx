import { CloseOutlined, DeleteOutlined, EditOutlined, InfoCircleOutlined, PlusOutlined, SaveOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, message, Modal, Popconfirm, Row, Select, Spin, Table, Tooltip, Typography } from "antd";
import axios from "axios";
import { cloneDeep, filter, find, get, round, toString } from "lodash";
import React, { useState } from "react";
import { getRequestHeader } from "../../../../helpers/service";
import { openNotificationWithIcon } from "../../../UIComponents/Toast/notification";

const EditableCell = ({ editing, dataIndex, title, is_mandatory, inputType, record, index, children, ...restProps }) => {
  let inputNode = <InputNumber className="w-100" placeholder={title} min={0} />;
  if (inputType === "text") {
    inputNode = <Input className="w-100 ant-input-affix-wrapper" placeholder={title} />;
  }

  if (inputType === "dropdown") {
    const options = dataIndex === "rotation_number" ? get(restProps, "rotationNumberList", []) : get(restProps, "partCaseOptions", []);
    inputNode = <Select placeholder={title} defaultActiveFirstOption={false} allowClear options={options} className="w-100 part-case-field" />;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              // required: dataIndex === "bottles_in_partial_case" ? false : true,
              required: dataIndex === "bottles_in_partial_case" ? false : is_mandatory,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditRotationNumber = (props) => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [partCaseOptions, setPartCaseOptions] = React.useState([]);
  const [rotationNumberOptions, setRotationNumberOptions] = React.useState([]);

  const handlePartCaseOptions = (BPC) => {
    if (BPC) {
      let partCaseOptionsList = [];
      for (let i = 1; i < BPC; i++) {
        partCaseOptionsList.push({
          label: `${i} / ${BPC}`,
          value: `${i}/${BPC}`,
        });
      }
      if (partCaseOptionsList.length === 0) {
        partCaseOptionsList = [{ label: 0, value: 0 }];
        setPartCaseOptions([...partCaseOptionsList]);
      } else {
        setPartCaseOptions([...partCaseOptionsList]);
      }
    }
  };

  React.useEffect(() => {
    handlePartCaseOptions(get(props, "record.bpc", 0));
  }, [props.record.bpc]);

  const isEditing = (record) => record.key === editingKey;

  const handleDelete = (key) => {
    setIsChanged(true);
    setIsDisabled(false);
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      whole_case: "",
      bottles_in_partial_case: undefined,
      rotation_number: undefined,
      available_qty: 0,
      allocated_qty: 0,
    };
    setIsDisabled(true);
    setEditingKey("");
    edit(newData);
    setIsChanged(true);
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const edit = (record) => {
    form.setFieldsValue({
      whole_case: "",
      bottles_in_partial_case: "",
      rotation_number: "",
      available_qty: 0,
      allocated_qty: 0,
      ...record,
    });
    setIsDisabled(true);
    setEditingKey(record.key);
  };

  const cancel = () => {
    setIsDisabled(false);
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const bottles_in_partial_case = getBIPCValue(get(row, "bottles_in_partial_case", "0/0"));
      const sumValue = get(row, "whole_case", 0) + bottles_in_partial_case;

      const BIPC = getPartCaseValue(get(row, "bottles_in_partial_case", "0/0"));
      const allocated_qty = Number(get(row, "whole_case", 0)) + BIPC;

      let newRowData = { ...row };
      newRowData["whole_case"] = get(row, "whole_case") ? get(row, "whole_case") : 0;
      newRowData["bottles_in_partial_case"] = get(row, "bottles_in_partial_case") ? get(row, "bottles_in_partial_case") : undefined;

      const newData = [...dataSource];

      const checkValue = find(newData, function (o) {
        return get(o, "rotation_number") === get(row, "rotation_number");
      });

      if ((sumValue >= 0 && get(props, "record.cased_goods_id")) || (sumValue > 0 && !get(props, "record.cased_goods_id"))) {
        const index = newData.findIndex((item) => key === item.key);
        const item = newData[index];

        if (index > -1) {
          newData.splice(index, 1, { ...item, ...newRowData, allocated_qty });
          setDataSource(newData);
          setEditingKey("");
        } else {
          newData.push(newRowData);
          setDataSource(newData);
          setEditingKey("");
        }
        setIsDisabled(false);
      } else {
        message.warning("Quantity should be greater than 0");
      }
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log("Validate Failed:", errInfo);
    }
  };

  let columns = [
    {
      title: "Rot No.",
      dataIndex: "rotation_number",
      editable: get(props, "record.cased_goods_id") ? false : true,
    },
    {
      title: "Avl Qty",
      dataIndex: "available_qty",
    },
    {
      title: "Net Qty",
      dataIndex: "net_qty",
    },
    {
      title: "Whole Cases",
      dataIndex: "whole_case",
      editable: true,
      className: "custom_column_style",
    },
    {
      title: "Part Cases",
      dataIndex: "bottles_in_partial_case",
      editable: true,
      className: "custom_column_style",
    },
    {
      title: "Allocated Cases",
      dataIndex: "allocated_qty",
      className: "custom_column_style",
    },
    {
      title: "Edit",
      width: "10%",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)}>
              <Tooltip placement="left" title="Save">
                <SaveOutlined />
              </Tooltip>
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a className="pl-3">
                <Tooltip placement="left" title="Cancel">
                  <CloseOutlined />
                </Tooltip>
              </a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)}>
              <Tooltip placement="left" title="Edit">
                <EditOutlined />
              </Tooltip>
            </Typography.Link>
            {!get(props, "record.cased_goods_id") && dataSource.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                <a className="pl-3">
                  <Tooltip placement="left" title="Delete">
                    <DeleteOutlined />
                  </Tooltip>
                </a>
              </Popconfirm>
            ) : null}
          </>
        );
      },
    },
  ];

  const getInputType = (type) => {
    let returnVal = "text";

    switch (type) {
      case "bottles_in_partial_case":
        returnVal = "dropdown";
        break;
      case "rotation_number":
        if (get(props, "record.cased_goods_id")) {
          returnVal = "dropdown";
        } else {
          returnVal = "text";
        }
        break;
      case "whole_case":
        returnVal = "number";
        break;
      default:
        returnVal = "text";
        break;
    }

    return returnVal;
  };

  const getCustomRotationNumberList = (rotationNumberOptionsListing) => {
    // let newDataAvailable = cloneDeep(get(props, "record.rotation_numbers", []));
    let newDataAvailable = cloneDeep(rotationNumberOptionsListing);

    newDataAvailable = newDataAvailable.map((data, index) => {
      data["key"] = index;

      const currentValue = find(get(props, "record.rotation_numbers", []), function (o) {
        return get(o, "rotation_number") === get(data, "rotation_number");
      });

      if (currentValue) {
        const BIPC = getPartCaseValue(get(currentValue, "bottles_in_partial_case", "0/0"));
        const allocated_qty = Number(get(currentValue, "whole_case", 0)) + BIPC;
        data["whole_case"] = get(currentValue, "whole_case", 0);
        data["bottles_in_partial_case"] = get(currentValue, "bottles_in_partial_case", 0) ? `${get(currentValue, "bottles_in_partial_case", 0)}/${get(props, "record.bpc", 0)}` : undefined;
        data["allocated_qty"] = allocated_qty;
      } else {
        data["whole_case"] = 0;
        data["allocated_qty"] = 0;
        data["bottles_in_partial_case"] = undefined;
      }

      return data;
    });

    setCount(newDataAvailable.length);
    setDataSource(newDataAvailable);
  };

  if (!get(props, "record.cased_goods_id")) {
    columns = filter(columns, function (o) {
      return get(o, "dataIndex") !== "available_qty" && get(o, "dataIndex") !== "allocated_qty";
    });
  }

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: getInputType(col.dataIndex),
        dataIndex: col.dataIndex,
        title: col.title,
        rotationNumberList: rotationNumberOptions,
        partCaseOptions,
        is_mandatory: !get(props, "record.cased_goods_id"),
        editing: isEditing(record),
      }),
    };
  });

  const getBIPCValue = (bottles_in_partial_case) => {
    let partCase = bottles_in_partial_case ? bottles_in_partial_case.split("/") : "";
    partCase = partCase ? partCase[0] : 0;
    return round(Number(partCase), 2);
  };

  const handleOk = async () => {
    if (isChanged) {
      let rotation_numbers = dataSource.map((list) => {
        return {
          whole_case: get(list, "whole_case", 0),
          bottles_in_partial_case: getBIPCValue(get(list, "bottles_in_partial_case", "0/0")),
          rotation_number: get(list, "rotation_number", 0),
        };
      });

      // rotation_numbers = rotation_numbers.filter((o) => {
      //   return get(o, "whole_case", 0) + get(o, " bottles_in_partial_case", 0) > 0;
      // });

      const rest = await axios({
        method: "POST",
        data: {
          sales_order_id: get(props, "orderId"),
          cased_goods_id: get(props, "record.cased_goods_id"),
          item_id: get(props, "record.item_id"),
          rotation_numbers,
        },
        url: `${process.env.REACT_APP_API_ENDPOINT}/api/salesorder/edit_item_rotation_numbers`,
        headers: { ...getRequestHeader() },
      }).catch((err) => {
        setLoading(false);
        openNotificationWithIcon("error", "Rotation Number", `${get(err, "response.data.message", "Something Went Wrong")} `);
      });

      if (get(rest, "data.status")) {
        setLoading(false);
        props.handleSubmit();
        openNotificationWithIcon("success", "Rotation Number", get(rest, "data.message", "Rotation Number updated successfully"));
      } else {
        setLoading(false);
        openNotificationWithIcon("error", "Rotation Number", get(rest, "data.message", "Something Went Wrong"));
      }
    } else {
      setLoading(false);
      openNotificationWithIcon("info", "Rotation Number", "Nothing to update");
    }
  };

  const getSumArrayOfObjWithKey = (arr, key) => {
    let sumValue = arr.reduce((prev, cur) => {
      return prev + (key === "bottles_in_partial_case" ? round(Number(getPartCaseValue(cur[key])), 2) : round(Number(cur[key]), 2));
    }, 0);
    return sumValue;
  };

  const getSumArrayOfObjWithKeyCustom = (arr, key) => {
    let sumValue = arr.reduce((prev, cur) => {
      return prev + round(Number(getPartCaseCalValue(cur[key])), 2);
    }, 0);
    return sumValue;
  };

  const getPartCaseValue = (bottles_in_partial_case) => {
    let BPC = get(props, "record.bpc", 0);
    let partCase = bottles_in_partial_case ? toString(bottles_in_partial_case).split("/") : "";
    partCase = partCase ? partCase[0] : 0;
    return round(Number(partCase) / Number(BPC), 2);
  };

  const getPartCaseCalValue = (bottles_in_partial_case) => {
    let partCase = bottles_in_partial_case ? toString(bottles_in_partial_case).split("/") : "";
    partCase = partCase ? partCase[0] : 0;
    return Number(partCase);
  };

  const getWholeTotalCasesSum = () => {
    return round(getSumArrayOfObjWithKey(dataSource, "whole_case"), 2);
  };

  const getCustomPartTotalCasesSum = () => {
    return round(getSumArrayOfObjWithKeyCustom(dataSource, "bottles_in_partial_case"), 2);
  };

  const getPartTotalCasesSum = () => {
    return round(getSumArrayOfObjWithKey(dataSource, "bottles_in_partial_case"), 2);
  };

  const getTotalCasesSum = () => {
    return getWholeTotalCasesSum() + getPartTotalCasesSum();
  };

  const getRevisedBottles = () => {
    return Number(get(props, "record.bpc", 0)) * Number(getWholeTotalCasesSum()) + getCustomPartTotalCasesSum();
  };

  const getTotalAllocations = () => {
    return (getRevisedBottles() / Number(get(props, "record.bpc", 0))).toFixed(2);
  };

  const getAvailableRNList = async () => {
    const rest = await axios({
      method: "POST",
      data: {
        cased_goods_id: get(props, "record.cased_goods_id"),
        exclude_empty: false,
      },
      url: `${process.env.REACT_APP_API_ENDPOINT}/api/inventory/rotation_number_list`,
      headers: { ...getRequestHeader() },
    }).catch((err) => {
      setLoading(false);
      openNotificationWithIcon("error", "Rotation Number", `${get(err, "response.data.message", "Something Went Wrong")} `);
    });
    if (get(rest, "data.status")) {
      getCustomRotationNumberList(get(rest, "data.rotation_numbers", []));
      setLoading(false);
    } else {
      setLoading(false);
      openNotificationWithIcon("error", "Rotation Number", get(rest, "data.message", "Something Went Wrong"));
    }
  };

  React.useEffect(() => {
    if (get(props, "record.cased_goods_id")) {
      getAvailableRNList();
    } else {
      let newDataAvailable = cloneDeep(get(props, "record.rotation_numbers", []));
      newDataAvailable = newDataAvailable.map((list, index) => {
        list["key"] = index;
        list["bottles_in_partial_case"] = get(list, "bottles_in_partial_case", 0) ? `${get(list, "bottles_in_partial_case", 0)}/${get(props, "record.bpc", 0)}` : undefined;
        return list;
      });
      setCount(newDataAvailable.length);
      setDataSource(newDataAvailable);
    }
  }, []);

  const getDisabledValue = () => {
    let returnVal = false;

    if (isDisabled && !get(props, "record.cased_goods_id")) {
      returnVal = true;
    }
    // if (getTotalAllocations() != get(props, "record.quantity", 0)) {
    //   returnVal = true;
    // }
    return returnVal;
  };

  return (
    <Modal
      className="rotation_number__editing"
      title=""
      maskClosable={false}
      closable={false}
      open={get(props, "isModalVisible", false)}
      okText="Save"
      width={900}
      cancelText=""
      okButtonProps={{
        // disabled: getDisabledValue(),
        disabled: false,
      }}
      onOk={() => {
        setLoading(true);
        handleOk();
      }}
      footer={[
        <div className="d-flex align-items-center justify-content-between">
          <span className="float-left">
            {getTotalAllocations() != get(props, "record.quantity", 0) && (
              <i style={{ color: "#F00", fontSize: 14 }}>
                <InfoCircleOutlined className="pr-1" />
                Allocations across rotation numbers must equal to {get(props, "record.quantity", 0)}
              </i>
            )}
            {/* {!getDisabledValue() && (
              <i style={{ color: "#F00", fontSize: 14 }}>
                <InfoCircleOutlined className="pr-1" />
                Your changes will be discarded unless you click on the "Update" button
              </i>
            )} */}
          </span>
          <span>
            <Button key="OK" type="link" icon={<CloseCircleOutlined />} onClick={() => props.handleCancel()}>
              Cancel
            </Button>
            <Button
              key="OK"
              disabled={getDisabledValue()}
              type="primary"
              onClick={() => {
                setLoading(true);
                handleOk();
              }}
              icon={<SaveOutlined />}
            >
              Update
            </Button>
          </span>
        </div>,
      ]}
      centered
      destroyOnClose={true}
      onCancel={() => props.handleCancel()}
    >
      <Spin spinning={loading}>
        <Row gutter={[16, 8]}>
          <Col>
            <span>
              Cased Goods ID:
              <b className="ml-1">{get(props, "record.cased_goods_id") ? get(props, "record.cased_goods_id") : "NIL"}</b>
            </span>
          </Col>
          <Col>
            <span>
              Year: <b> {get(props, "record.year") ? get(props, "record.year") : "NIL"} </b>
            </span>
          </Col>
          <Col>
            <span>
              Brand: <b> {get(props, "record.brand") ? get(props, "record.brand") : "NIL"}</b>
            </span>
          </Col>
          <Col>
            <span>
              Distillery: <b> {get(props, "record.distillery") ? get(props, "record.distillery") : "NIL"}</b>
            </span>
          </Col>
        </Row>
        <hr
          style={{
            borderTop: "1px solid #bfbfbf",
            margin: "10px 0",
          }}
        />
        {!get(props, "record.cased_goods_id") && (
          <div className="float-right edit__rotation_number__label">
            <Tooltip placement="left" title="Add Rotation Number">
              <Button
                onClick={handleAdd}
                type="primary"
                // disabled={getTotalAllocations() >= get(props, "record.cases", 0)}
                className="float-right"
                style={{
                  marginBottom: 16,
                }}
                icon={<PlusOutlined />}
              >
                Add
              </Button>
            </Tooltip>
          </div>
        )}
        <Form
          form={form}
          component={false}
          onValuesChange={(changedValues, allValues) => {
            setIsChanged(true);
          }}
        >
          <Table
            className="mb-2 mt-4"
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            size="small"
            bordered
            dataSource={dataSource}
            scroll={{ y: 300 }}
            pagination={{ position: ["none", "none"], onChange: cancel }}
            columns={mergedColumns}
            rowClassName="editable-row"
          />
        </Form>
      </Spin>
      <Row gutter={[16, 16]} className="mt-3">
        <Col>
          <span>
            Ordered Qty:
            <b className="ml-1">{get(props, "record.quantity") ? get(props, "record.quantity") : 0}</b>
          </span>
        </Col>
        <Col>
          <span>
            Total Allocations:
            <b className="ml-1" style={getTotalAllocations() != get(props, "record.quantity", 0) ? { color: "red" } : { color: "green" }}>
              {getTotalAllocations()}
            </b>
          </span>
        </Col>
      </Row>
    </Modal>
  );
};

export default EditRotationNumber;
