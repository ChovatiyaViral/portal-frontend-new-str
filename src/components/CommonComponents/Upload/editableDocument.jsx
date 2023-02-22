import { FormOutlined, MoreOutlined } from "@ant-design/icons";
import { Dropdown, Form, Input, Popconfirm, Table, Tooltip } from "antd";
import { get } from "lodash";
import SVGIcon from "../../../constants/svgIndex";

import React, { useContext, useEffect, useRef, useState } from "react";
import { isMobileOrTab } from "../../../constants";
import { getScreenSize } from "../../../helpers/utility";
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // eslint-disable-next-line no-console
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        className="w-100"
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} className="w-100" />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const EditableDocument = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [dropDownVisibleChange, setDropDownVisibleChange] = React.useState(false);

  const handleDelete = (key) => {
    if (getScreenSize() < isMobileOrTab) {
      setDropDownVisibleChange(false);
    }
    const newData = dataSource.filter((item) => item.key !== key);
    const elem = newData.map((list, index) => {
      return { ...list, key: index + 1 };
    });
    setDataSource(elem);
    props.handleDocuments(elem);
  };

  React.useEffect(() => {
    const elem = get(props, "dataSource", []).map((list, index) => {
      return { ...list, key: index + 1 };
    });
    setDataSource(elem);
  }, [props]);

  const menu = (record) => {
    return [
      {
        key: "1",
        label: (
          <div>
            <FormOutlined />
            <span>Rename</span>
          </div>
        ),
      },
      {
        key: "2",
        label: (
          <div onClick={() => handleDelete(record.key)}>
            <Popconfirm title="Are you sure to delete?">
              <img src={SVGIcon.TrashIcon} />
              <span className="delete_text">Delete</span>
            </Popconfirm>
          </div>
        ),
      },
    ];
  };

  const defaultColumns = [
    {
      title: "Item",
      dataIndex: "key",
      width: 50,
    },
    {
      title: "Document Name",
      dataIndex: "document_name",
      editable: true,
      width: 150,
      ellipsis: true,
      className: "document_name_ellipsis",
    },
    {
      title: "",
      dataIndex: "operation",
      ellipsis: true,
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div className="task_operation">
            <div className="pdf_name_ellipsis">
              <img src={SVGIcon.DocumentPdfIcon} style={{ paddingRight: 8 }} />
              <Tooltip placement="topLeft" title={get(record, "file_name")}>
                <div className="pdf_file_name">{get(record, "file_name")}</div>
              </Tooltip>
            </div>
            <Popconfirm title="Are you sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <img src={SVGIcon.TrashIcon} style={{ cursor: "pointer", paddingLeft: 8 }} />
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

  const mobileViewDefaultColumns = [
    {
      dataIndex: "key",
      render: () =>
        dataSource.length >= 1 ? (
          <div className="PDF_icon">
            <img src={SVGIcon.PDFIcon} />
          </div>
        ) : null,
    },
    {
      dataIndex: "document_name",
      ellipsis: true,
      editable: true,
      with: 100,
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div className="document_details">
            <span className="pdf_name_ellipsis">
              <Tooltip placement="topLeft" title={get(record, "file_name")}>
                <span className="document_title">{get(record, "file_name")}</span>
              </Tooltip>
              <div className="document_crate_date">22 July 2021 at 14:00 hrs</div>
            </span>
          </div>
        ) : null,
    },
    {
      dataIndex: "operation",
      ellipsis: true,
      editable: false,
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div className="task_operation">
            <Dropdown
              menu={() => menu(record)}
              trigger={["click"]}
              placement="topRight"
              open={dropDownVisibleChange === record.key}
              onClick={() => setDropDownVisibleChange(dropDownVisibleChange === record.key ? false : record.key)}
            >
              <MoreOutlined />
            </Dropdown>
          </div>
        ) : null,
    },
  ];

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
    props.handleDocuments(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = (getScreenSize() < isMobileOrTab ? mobileViewDefaultColumns : defaultColumns).map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  return (
    <div className="task__uploaded_list">
      <Table
        showHeader={getScreenSize() > isMobileOrTab && true}
        components={components}
        pagination={false}
        size="middle"
        className="mt-2"
        rowClassName={() => `${getScreenSize() > isMobileOrTab && "editable-row"}`}
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

export default EditableDocument;
