export interface BasicUser {
  _id: string;
  name: string;
  profileImage?: string;
  profession: string | {
    _id: string;
    name: string;
  };
}

export interface ReferralStats {
  me?: BasicUser & {
    referralCode?: {
      code: string;
      link: string;
    }
  };
  referrer?: BasicUser;
  referred?: BasicUser[];
  currentCode?: {
    code: string;
    link: string;
  };
}

export interface ReferralResponse {
  success: boolean;
  message?: string;
  data?: ReferralStats;
}
