import {
  IOrderDetail,
  OrderStatus,
  ServiceType,
  WorkingStatus,
} from "@/interface/order.interface";

export const GetStatusOrderFromOrderDetails = (
  detail: IOrderDetail[]
): WorkingStatus => {
  if (!detail || detail.length === 0) return WorkingStatus.Waiting;
  const isComplete = detail.every(
    (d) => d.order_status === OrderStatus.Completed
  );
  const isCancel = detail.every((d) => d.order_status === OrderStatus.Canceled);
  const isOutOfDelivery = detail.some(
    (d) =>
      d.service_type === ServiceType.Delivery &&
      d.order_status === OrderStatus.Processing
  );
  const isProcessing = detail
    .filter(
      (d) =>
        d.service_type !== ServiceType.Agents &&
        d.service_type !== ServiceType.Pickup
    )
    .some(
      (d) =>
        d.order_status === OrderStatus.Processing ||
        d.order_status === OrderStatus.Completed
    );
  const isPickup = detail.some(
    (d) =>
      d.service_type === ServiceType.Pickup &&
      d.order_status === OrderStatus.Processing
  );
  const isBackToStore = detail.some(
    (d) =>
      d.service_type === ServiceType.Pickup &&
      d.order_status === OrderStatus.Completed
  );
  const isWaiting = detail.every((d) => d.order_status === OrderStatus.Waiting);
  const isExpired = detail.every((d) => d.order_status === OrderStatus.Expired);

  let status: WorkingStatus = WorkingStatus.Waiting;

  if (isComplete) status = WorkingStatus.Completed;
  else if (isCancel) status = WorkingStatus.Canceled;
  else if (isOutOfDelivery) status = WorkingStatus.OutOfDelivery;
  else if (isProcessing) status = WorkingStatus.Processing;
  else if (isPickup) status = WorkingStatus.Pickup;
  else if (isBackToStore) status = WorkingStatus.BackToStore;
  else if (isWaiting) status = WorkingStatus.Waiting;
  else if (isExpired) status = WorkingStatus.Expired;

  return status;
};
