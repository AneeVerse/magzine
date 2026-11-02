export interface FormData {
  name: string;
  phone: string;
  email: string;
  biz: string;
  area: string;
  status: "new" | "visited" | "member";
  consent: boolean;
}

export interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  consent?: string;
}

export interface DeliveryResult {
  preview: boolean;
  delivery: {
    whatsapp: "accepted" | "not_configured";
    email: "accepted" | "not_configured";
  };
}

export interface SpreadDetail {
  id: string;
  pageNumber: string;
  badge: string;
  title: string;
  subtitle: string;
  author?: string;
  image: string;
}
