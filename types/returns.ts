export type ReturnStatus = 'pending' | 'in_progress' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'expired';
export type RefundStatus = 'pending' | 'partial' | 'complete' | 'denied';

export interface ReturnItem {
  id: string;
  return_id?: string;
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  notes?: string;
  item_img_url?: string;
  refund_amount?: number;
  created_at?: string;
}

export interface ReturnImage {
  id: string;
  return_id: string;
  image_url: string;
  cloudinary_id?: string;
  type?: string;
  notes?: string;
  location?: string;
  created_at?: string;
}

export interface ReturnProduct {
  product_name: string;
  price: number;
  quantity: number;
  order_id?: string;
  sub_vendor?: string;
  product_image_url?: string;
  marketplace_vendor?: string;
  purchase_date?: string;
  return_deadline?: string;
}

export interface Return {
  id: string;
  user_id: string;
  retailer_name: string;
  order_number?: string;
  order_date?: string;
  return_deadline?: string;
  order_items: {
    products: ReturnProduct[];
  };
  status: ReturnStatus;
  tracking_number?: string;
  carrier?: string;
  drop_off_location_id?: string;
  custom_drop_off_notes?: string;
  refund_amount: number;
  refund_status: RefundStatus;
  notes?: string;
  source?: string;
  created_at: string;
  updated_at: string;
  return_items?: ReturnItem[];
  return_images?: ReturnImage[];
}

export interface ReturnStatistics {
  totalSaved: number;
  totalReturns: number;
  completedReturns: number;
  pendingReturns: number;
  inProgressReturns: number;
  expiredReturns: number;
}

export interface FilterTab {
  id: ReturnStatus | 'all';
  label: string;
  count: number;
}