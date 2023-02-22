import { lazy } from "react";
import { AppRoutes } from "../settings";

export const availableRoutes = [
  {
    name: "home",
    path: AppRoutes.Home,
    component: lazy(() => import("../components/Pages/Overview")),
    default: true,
  },
  {
    name: "dashboard",
    path: AppRoutes.Dashboard,
    component: lazy(() => import("../components/Pages/Dashboard")),
    default: true,
  },
  {
    name: "taxonomy",
    path: AppRoutes.Taxonomy,
    component: lazy(() => import("../components/Pages/Taxonomy")),
  },
  {
    name: "cased_goods",
    path: AppRoutes.CasedGoods,
    component: lazy(() => import("../components/Pages/CasedGoods/inventoryManagement")),
    default: true,
  },
  {
    name: "user_management",
    path: AppRoutes.Users,
    component: lazy(() => import("../components/Pages/Users")),
  },
  {
    name: "live_inventory",
    path: AppRoutes.ViewInventory,
    component: lazy(() => import("../components/Pages/CasedGoods")),
  },
  {
    name: "archived_inventory",
    path: AppRoutes.ViewDeletedInventory,
    component: lazy(() => import("../components/Pages/CasedGoods/archiveCases/deletedCasedGoods")),
  },
  {
    name: "inventory_change_log",
    path: AppRoutes.CasesChangeLog,
    component: lazy(() => import("../components/Pages/CasedGoods/changeLog/changeLog")),
  },
  {
    name: "add_new_cases",
    path: AppRoutes.AddCases,
    component: lazy(() => import("../components/Pages/CasedGoods/addCases")),
  },
  {
    name: "new_sales_order",
    path: AppRoutes.NewSalesOrder,
    component: lazy(() => import("../components/Pages/Sales")),
  },
  {
    name: "track_order",
    path: AppRoutes.TrackOrder,
    component: lazy(() => import("../components/Pages/Sales/trackOrder")),
  },
  {
    name: "manage_orders",
    path: AppRoutes.ManageOrders,
    component: lazy(() => import("../components/Pages/Sales/manageOrders")),
  },
  {
    name: "cancelled_orders",
    path: AppRoutes.CancelledOrders,
    component: lazy(() => import("../components/Pages/Sales/cancelledOrders")),
  },
  {
    name: "completed_orders",
    path: AppRoutes.CompletedOrders,
    component: lazy(() => import("../components/Pages/Sales/completedOrders")),
  },
  {
    name: "mis_reports",
    path: AppRoutes.MisReports,
    component: lazy(() => import("../components/Pages/Sales/misReports")),
  },
  {
    name: "view_order_documents",
    path: `${AppRoutes.TrackOrder}/${AppRoutes.ViewOrderDocuments}`,
    component: lazy(() => import("../components/Pages/Sales/viewDocuments/documentViewWithId")),
    default: true,
  },
  {
    name: "order_details",
    path: `${AppRoutes.OrderDetails}/:id`,
    component: lazy(() => import("../components/Pages/Sales/orderDetails")),
    default: true,
  },
  {
    name: "customer_data",
    path: `${AppRoutes.CustomerData}`,
    component: lazy(() => import("../components/Pages/Leads/leadManagement")),
    default: true,
  },
  {
    name: "active_leads",
    path: AppRoutes.ActiveLeads,
    component: lazy(() => import("../components/Pages/Leads")),
  },
  {
    name: "completed_leads",
    path: AppRoutes.CompletedLeads,
    component: lazy(() => import("../components/Pages/Leads/completedLeads")),
  },
  {
    name: "customer_list",
    path: AppRoutes.CustomerList,
    component: lazy(() => import("../components/Pages/Leads/customerData")),
  },
  {
    name: "lead_details",
    path: `${AppRoutes.LeadDetails}/:id`,
    component: lazy(() => import("../components/Pages/Leads/leadDetails")),
    default: true,
  },
  {
    name: "customer_details",
    path: `${AppRoutes.CustomerDetails}/:id`,
    component: lazy(() => import("../components/Pages/Leads/customerData/customerDetails")),
    default: true,
  },
  {
    name: "cask_master",
    path: AppRoutes.CaskMasterListing,
    component: lazy(() => import("../components/Pages/Masterlists/casks/masterlist")),
  },
  {
    name: "passport_master",
    path: AppRoutes.PassportMasterListing,
    component: lazy(() => import("../components/Pages/Masterlists/passports/masterlist")),
  },
  {
    name: "passport_master",
    path: AppRoutes.AddNewPassport,
    component: lazy(() => import("../components/Pages/Masterlists/passports/addPassport")),
  },
  {
    name: "passport_master",
    path: `${AppRoutes.viewPassportDetails}/:id`,
    component: lazy(() => import("../components/Pages/Masterlists/passports/passportProfile")),
  },
  {
    name: "cask_master",
    path: AppRoutes.AddNewCask,
    component: lazy(() => import("../components/Pages/Masterlists/casks/addCask")),
  },
  {
    name: "cask_master",
    path: `${AppRoutes.viewCaskProfile}/:id`,
    component: lazy(() => import("../components/Pages/Masterlists/casks/caskProfile")),
  },
  {
    name: "add_new_task",
    path: AppRoutes.AddNewTask,
    component: lazy(() => import("../components/Pages/WarehouseJobs/addNew")),
    default: true,
  },
  {
    name: "gate_entry",
    path: AppRoutes.GateEntry,
    component: lazy(() => import("../components/Pages/WarehouseJobs/gateEntry")),
  },
  {
    name: "sampling",
    path: AppRoutes.SamplingData,
    component: lazy(() => import("../components/Pages/WarehouseJobs/sampling")),
  },
  {
    name: "sampling",
    path: `${AppRoutes.CompleteSampling}/:id`,
    component: lazy(() => import("../components/Pages/WarehouseJobs/sampling/add")),
  },
  {
    name: "sampling",
    path: `${AppRoutes.AddSampling}`,
    component: lazy(() => import("../components/Pages/WarehouseJobs/sampling/add/caskDetailsForm")),
  },
  {
    name: "sampling",
    path: `${AppRoutes.ViewSamplingData}/:id`,
    component: lazy(() => import("../components/Pages/WarehouseJobs/sampling/add/samplingJobDetails")),
  },
  {
    name: "regauging",
    path: AppRoutes.Regauging,
    component: lazy(() => import("../components/Pages/WarehouseJobs/regauging")),
  },
  {
    name: "regauging",
    path: AppRoutes.AddNewRegauging,
    component: lazy(() => import("../components/Pages/WarehouseJobs/regauging/add/caskDetailsForm")),
  },
  {
    name: "regauging",
    path: `${AppRoutes.CompleteRegauging}/:id`,
    component: lazy(() => import("../components/Pages/WarehouseJobs/regauging/add")),
  },
  {
    name: "regauging",
    path: `${AppRoutes.ViewRegauging}/:id`,
    component: lazy(() => import("../components/Pages/WarehouseJobs/regauging/add/regaugingJobDetails")),
  },
  {
    name: "log_gate_entry",
    path: AppRoutes.LogGateEntry,
    component: lazy(() => import("../components/Pages/WarehouseJobs/gateEntry/logGateEntry")),
    default: true,
  },
  {
    name: "log_gate_entry_summary",
    path: AppRoutes.LogGateEntrySummary,
    component: lazy(() => import("../components/Pages/WarehouseJobs/gateEntry/logGateEntrySummary")),
  },
  {
    name: "log_gate_entry_summary",
    path: `${AppRoutes.LogGateEntrySummary}/:id`,
    component: lazy(() => import("../components/Pages/WarehouseJobs/gateEntry/logGateEntrySummary")),
  },
  {
    name: "crr_listing",
    path: AppRoutes.CRRListing,
    component: lazy(() => import("../components/Pages/WarehouseJobs/CRRListing")),
  },
  {
    name: "call_in_list",
    path: AppRoutes.CallInList,
    component: lazy(() => import("../components/Pages/MovementJobs/callInList")),
  },
  {
    name: "transport_jobs",
    path: AppRoutes.TransportJobs,
    component: lazy(() => import("../components/Pages/MovementJobs/transportJobs")),
  },
  {
    name: "crr_listing",
    path: `${AppRoutes.CRRDetails}/:id`,
    component: lazy(() => import("../components/Pages/WarehouseJobs/CRRListing/detailsIndex")),
  },
  {
    name: "help_tickets",
    path: AppRoutes.HelpTickets,
    component: lazy(() => import("../components/Pages/Help/helpTickets")),
  },
  {
    name: "add_new_store",
    path: AppRoutes.AddNewStore,
    component: lazy(() => import("../../src/components/Pages/StoreLocator/index")),
  },
  {
    name: "add_new_store",
    path: AppRoutes.EditStore,
    component: lazy(() => import("../../src/components/Pages/StoreLocator/index")),
  },
  {
    name: "view_stores",
    path: AppRoutes.ViewStores,
    component: lazy(() => import("../../src/components/Pages/StoreLocator/storeList")),
  },
  {
    name: "store_locator",
    path: AppRoutes.ViewStoreCategory,
    component: lazy(() => import("../../src/components/Pages/StoreLocator/viewStoreCategory")),
  },
  {
    name: "store_locator",
    path: AppRoutes.ViewProductFilter,
    component: lazy(() => import("../../src/components/Pages/StoreLocator/viewProductFilter")),
  },
  {
    name: "403",
    path: AppRoutes.NoAccess,
    component: lazy(() => import("../components/Pages/403")),
    default: true,
  },
  {
    name: "404",
    path: AppRoutes.NotFound,
    component: lazy(() => import("../components/Pages/404/custom404")),
    default: true,
  },
];
