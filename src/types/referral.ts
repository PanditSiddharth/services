export interface ReferralCode {
  code: string;
  link: string;
  createdAt: string;
  progress: number;
  status: 'pending' | 'registered' | 'completed' | 'revoked';
}

export interface ReferralData {
  pendingCodes: ReferralCode[];
  activeCodes: ReferralCode[];
  completedCodes: ReferralCode[];
  revokedCodes: ReferralCode[];
  currentCode: {
    code: string;
    link: string;
    createdAt: string;
  } | null;
  stats: {
    totalReferrals: number;
    successfulReferrals: number;
    pendingReferrals: number;
    revokedReferrals: number;
  };
}

export type FormattedReferralData = ReferralData;
