import { Table } from "antd";
import { get } from "lodash";
import DownloadService from "../../../helpers/request/Common/document";
import { capitalizeFirstLetter } from "../../../helpers/utility";
import ErrorBoundary from "../../UIComponents/ErrorBoundary";

const DocumentsListView = (props) => {
  const columns = [
    // {
    //   title: "Date",
    //   dataIndex: "created_at",
    //   key: "created_at",
    //   ellipsis: {
    //     showTitle: false,
    //   },
    // },
    {
      title: "Document Name",
      dataIndex: "document_name",
      key: "document_name",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Document URL",
      dataIndex: "document",
      key: "document",
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => (
        <a onClick={() => DownloadService.downloadDocument({ document_url: get(record, "document"), document_name: get(record, "document_name") })} className="log__gate_entry__link">
          {text}
        </a>
      ),
    },
    // {
    //   title: "From",
    //   dataIndex: "from",
    //   key: "from",
    //   ellipsis: {
    //     showTitle: false,
    //   },
    // },
    {
      title: "Document Type",
      dataIndex: "document_type",
      key: "document_type",
      ellipsis: {
        showTitle: false,
      },
    },
    // {
    //   title: "User",
    //   dataIndex: "created_by",
    //   key: "created_by",
    //   ellipsis: {
    //     showTitle: false,
    //   },
    // },
  ];

  const getDataSource = () => {
    const list = get(props, "docList", []).map((data) => {
      return {
        created_at: new Date().toLocaleString(),
        created_by: "Subramanya Dixit",
        document_type: capitalizeFirstLetter(get(data, "document_type", "")),
        document_url: get(data, "document_url", ""),
        document_name: get(data, "document_name", ""),
        from: "Gate Entry",
        document: get(data, "document_url", ""),
      };
    });
    return list;
  };

  return (
    <>
      <div className="bg-white p-4" style={{ marginTop: 25, borderRadius: 20 }}>
        <ErrorBoundary>
          <div>
            <Table columns={columns} dataSource={getDataSource()} size="small" tableLayout="fixed" pagination={false} />
          </div>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default DocumentsListView;
