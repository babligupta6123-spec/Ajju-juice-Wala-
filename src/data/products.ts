import { PRODUCTS_LIST, SPECIAL_OFFERS_LIST, SHOP_CONFIG } from '../shopConfig';
import { Review } from '../types';

export const PRODUCTS = PRODUCTS_LIST;
export const SPECIAL_OFFERS = SPECIAL_OFFERS_LIST;

export const STORE_INFO = {
  name: SHOP_CONFIG.brandName,
  tagline: SHOP_CONFIG.tagline,
  phone: SHOP_CONFIG.displayPhone,
  whatsappNumber: SHOP_CONFIG.whatsappNumber,
  displayWhatsapp: SHOP_CONFIG.displayPhone,
  address: SHOP_CONFIG.address,
  hours: SHOP_CONFIG.openingHours,
  email: SHOP_CONFIG.email,
  instagram: SHOP_CONFIG.instagram,
  fssaiNumber: SHOP_CONFIG.fssaiLicenseNumber,
};

// Real shop setup: No invented customer reviews. We provide an authentic feedback system.
export const REVIEWS: Review[] = [];
