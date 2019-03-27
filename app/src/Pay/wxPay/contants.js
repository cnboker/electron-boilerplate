export const RECEIVE_WXPAY = 'RECEIVE_WXPAY'
export const RECEIVE_ALL_WXPAY= 'RECEIVE_ALL_PAY'
export const RECEIVE_PENDING_WXPAY = 'RECEIVE_PENDING_WXPAY'
export const PAGE_SIZE = 30;

export const getStatus = (status)=> {
  if (status == 0) 
    return '临时订单'
  if (status == 1) 
    return '已提交'
  if (status == 2) 
    return '已确认'
  if (status == 3) 
    return '已取消'
  return '';
}