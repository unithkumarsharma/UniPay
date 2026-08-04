'use client';

// Dedicated 3D Realistic Graphic Badges for ALL 36 Fintech Services
export default function ServiceIcon({ id, name, size = 44 }) {
  const renderGraphic = () => {
    switch (id) {
      // 1. UniPay Wallet Plus
      case 'wallet_plus':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_wallet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" /><stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="g_coin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" /><stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
            </defs>
            <rect x="8" y="16" width="48" height="36" rx="6" fill="url(#g_wallet)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
            <path d="M8 24h48v6H8z" fill="rgba(0,0,0,0.2)" />
            <rect x="36" y="26" width="20" height="16" rx="4" fill="#B45309" />
            <circle cx="44" cy="34" r="3.5" fill="url(#g_coin)" />
            <ellipse cx="24" cy="14" rx="7" ry="5" fill="url(#g_coin)" />
            <ellipse cx="36" cy="11" rx="6" ry="4.5" fill="url(#g_coin)" />
          </svg>
        );

      // 2. UPI Remittance
      case 'upi_transfer':
      case 'upi':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_upi" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" /><stop offset="100%" stopColor="#4C1D95" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="44" height="44" rx="10" fill="url(#g_upi)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="18" y="18" width="10" height="10" rx="2" fill="#FFFFFF" />
            <rect x="36" y="18" width="10" height="10" rx="2" fill="#FFFFFF" />
            <rect x="18" y="36" width="10" height="10" rx="2" fill="#FFFFFF" />
            <path d="M34 34l8 8M42 34l-8 8" stroke="#34D399" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      // 3. Indo-Nepal Transfer
      case 'indo_nepal':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_nepal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" /><stop offset="100%" stopColor="#7F1D1D" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="26" fill="url(#g_nepal)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <path d="M6 32h52" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" />
            <path d="M32 6c12 0 16 12 16 26s-4 26-16 26-16-12-16-26 4-26 16-26z" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" />
            <path d="M22 20l10-10 10 10M32 10v26" stroke="#FDE047" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      // 4. Cash Deposit (Wallet)
      case 'cash_deposit_wallet':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_cash" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#064E3B" />
              </linearGradient>
            </defs>
            <rect x="8" y="16" width="48" height="32" rx="5" fill="url(#g_cash)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <circle cx="32" cy="32" r="8" fill="#A7F3D0" opacity="0.4" />
            <text x="27" y="38" fill="#FFFFFF" fontSize="16" fontWeight="900">₹</text>
            <path d="M32 6v10M26 10l6-6 6 6" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // 5. Cash Deposit (AEPS)
      case 'cash_deposit_aeps':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_c_aeps" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" /><stop offset="100%" stopColor="#0C4A6E" />
              </linearGradient>
            </defs>
            <rect x="8" y="18" width="48" height="30" rx="5" fill="url(#g_c_aeps)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <circle cx="32" cy="33" r="7" fill="#38BDF8" opacity="0.4" />
            <path d="M26 10c3 3 9 3 12 0" stroke="#34D399" strokeWidth="3" />
            <path d="M32 6v14" stroke="#34D399" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      // 6. Account Search
      case 'account_search':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_search" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#312E81" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="44" height="44" rx="10" fill="url(#g_search)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <circle cx="28" cy="28" r="11" fill="none" stroke="#FFFFFF" strokeWidth="4" />
            <line x1="36" y1="36" x2="48" y2="48" stroke="#FDE047" strokeWidth="5" strokeLinecap="round" />
          </svg>
        );

      // 7. DMT 1 (IMPS)
      case 'dmt_1':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_dmt1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#064E3B" />
              </linearGradient>
            </defs>
            <polygon points="32,8 52,20 12,20" fill="url(#g_dmt1)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="16" y="22" width="6" height="20" fill="#047857" />
            <rect x="29" y="22" width="6" height="20" fill="#047857" />
            <rect x="42" y="22" width="6" height="20" fill="#047857" />
            <rect x="10" y="42" width="44" height="6" fill="#064E3B" />
            <polygon points="44,14 36,26 42,26 40,36 48,22 42,22" fill="#FDE047" />
          </svg>
        );

      // 8. DMT 2 (NEFT)
      case 'dmt_2':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_dmt2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" /><stop offset="100%" stopColor="#075985" />
              </linearGradient>
            </defs>
            <polygon points="32,8 52,20 12,20" fill="url(#g_dmt2)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="16" y="22" width="6" height="20" fill="#0369A1" />
            <rect x="29" y="22" width="6" height="20" fill="#0369A1" />
            <rect x="42" y="22" width="6" height="20" fill="#0369A1" />
            <rect x="10" y="42" width="44" height="6" fill="#075985" />
            <circle cx="44" cy="24" r="9" fill="#F59E0B" />
            <text x="40" y="28" fill="#FFFFFF" fontSize="11" fontWeight="900">N</text>
          </svg>
        );

      // 9. AEPS Withdrawal
      case 'aeps_withdrawal':
      case 'aeps':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_aeps" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" /><stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="26" fill="url(#g_aeps)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <ellipse cx="32" cy="32" rx="16" ry="20" fill="#1E293B" />
            <path d="M32 16c-7 0-12 5-12 12 0 9 7 15 12 18s12-9 12-18c0-7-5-12-12-12z" fill="none" stroke="#34D399" strokeWidth="3" strokeDasharray="4 2" />
            <circle cx="32" cy="28" r="5" fill="#FFFFFF" />
          </svg>
        );

      // 10. Micro ATM
      case 'micro_atm':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_atm" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            <rect x="14" y="8" width="36" height="48" rx="6" fill="url(#g_atm)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="18" y="14" width="28" height="16" rx="2" fill="#60A5FA" />
            <rect x="18" y="34" width="28" height="4" rx="2" fill="#F59E0B" />
            <rect x="20" y="42" width="24" height="12" rx="2" fill="#E5E7EB" />
          </svg>
        );

      // 11. AEPS Settlement
      case 'aeps_settlement':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_settle" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#4C1D95" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="32" r="26" fill="url(#g_settle)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <path d="M20 32a12 12 0 1 1 4 9" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <polyline points="16,32 20,24 24,32" stroke="#34D399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // 12. UPI ATM
      case 'upi_atm':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_upiatm" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#065F46" />
              </linearGradient>
            </defs>
            <rect x="14" y="8" width="36" height="48" rx="6" fill="url(#g_upiatm)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="20" y="16" width="24" height="24" rx="3" fill="#FFFFFF" />
            <rect x="24" y="20" width="6" height="6" fill="#10B981" />
            <rect x="34" y="20" width="6" height="6" fill="#10B981" />
            <rect x="24" y="30" width="6" height="6" fill="#10B981" />
          </svg>
        );

      // 13. Mobile Prepaid
      case 'mobile_prepaid':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_mobp" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>
            <rect x="16" y="6" width="32" height="52" rx="7" fill="url(#g_mobp)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="19" y="10" width="26" height="40" rx="3" fill="#60A5FA" />
            <path d="M25 24L30 29L39 20" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // 14. Mobile Postpaid
      case 'mobile_postpaid':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_post" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" /><stop offset="100%" stopColor="#312E81" />
              </linearGradient>
            </defs>
            <rect x="12" y="8" width="30" height="48" rx="6" fill="url(#g_post)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="15" y="12" width="24" height="36" rx="3" fill="#6366F1" />
            <rect x="22" y="18" width="22" height="28" rx="3" fill="#FFFFFF" />
            <line x1="26" y1="24" x2="38" y2="24" stroke="#475569" strokeWidth="2.5" />
            <line x1="26" y1="30" x2="34" y2="30" stroke="#94A3B8" strokeWidth="2" />
          </svg>
        );

      // 15. DTH Recharge
      case 'dth':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_dth" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" /><stop offset="100%" stopColor="#581C87" />
              </linearGradient>
            </defs>
            <path d="M12 32C12 20 22 12 34 12C42 12 48 18 48 26C48 36 36 44 24 44C16 44 12 38 12 32Z" fill="url(#g_dth)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <line x1="30" y1="28" x2="44" y2="16" stroke="#E5E7EB" strokeWidth="4" />
            <circle cx="44" cy="16" r="5" fill="#FBBF24" />
          </svg>
        );

      // 16. Data Card
      case 'data_card':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_data" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0D9488" /><stop offset="100%" stopColor="#115E59" />
              </linearGradient>
            </defs>
            <rect x="8" y="20" width="48" height="24" rx="4" fill="url(#g_data)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <circle cx="20" cy="32" r="3" fill="#5EEAD4" />
            <circle cx="32" cy="32" r="3" fill="#5EEAD4" />
            <circle cx="44" cy="32" r="3" fill="#5EEAD4" />
          </svg>
        );

      // 17. Google Play
      case 'google_play':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_play" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" /><stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="44" height="44" rx="10" fill="url(#g_play)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <polygon points="22,16 46,32 22,48" fill="#FFFFFF" />
          </svg>
        );

      // 18. Electricity
      case 'electricity':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_elec" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" /><stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
            </defs>
            <path d="M32 8A16 16 0 0 0 20 34.5V42H44V34.5A16 16 0 0 0 32 8Z" fill="url(#g_elec)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="26" y="46" width="12" height="6" rx="2" fill="#9CA3AF" />
            <polygon points="34,16 26,30 33,30 30,42 40,26 33,26" fill="#FFFFFF" />
          </svg>
        );

      // 19. Gas Bill
      case 'gas':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_gas" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" /><stop offset="100%" stopColor="#7F1D1D" />
              </linearGradient>
            </defs>
            <rect x="18" y="18" width="28" height="38" rx="6" fill="url(#g_gas)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="24" y="10" width="16" height="8" rx="3" fill="#D1D5DB" />
            <path d="M32 2c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10z" fill="#60A5FA" />
          </svg>
        );

      // 20. Water Bill
      case 'water':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_water" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" /><stop offset="100%" stopColor="#075985" />
              </linearGradient>
            </defs>
            <path d="M32 8C20 24 14 31 14 38A18 18 0 1 0 50 38C50 31 44 24 32 8Z" fill="url(#g_water)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
          </svg>
        );

      // 21. Broadband
      case 'broadband':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_bb" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#312E81" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="44" height="44" rx="10" fill="url(#g_bb)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <path d="M20 40a16 16 0 0 1 24 0M25 33a10 10 0 0 1 14 0M30 26a4 4 0 0 1 4 0" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      // 22. Landline
      case 'landline':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_land" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14B8A6" /><stop offset="100%" stopColor="#0F766E" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="44" height="44" rx="10" fill="url(#g_land)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <path d="M20 22h24v8H20z" fill="#FFFFFF" />
            <circle cx="26" cy="38" r="3" fill="#FFFFFF" />
            <circle cx="38" cy="38" r="3" fill="#FFFFFF" />
          </svg>
        );

      // 23. Insurance
      case 'insurance':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_ins" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>
            <path d="M32 8L50 16V30C50 42 32 54 32 54C32 54 14 42 14 30V16L32 8Z" fill="url(#g_ins)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <path d="M26 30l4 4 8-8" stroke="#34D399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // 24. Loan EMI
      case 'loan_emi':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_emi" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" /><stop offset="100%" stopColor="#7F1D1D" />
              </linearGradient>
            </defs>
            <rect x="10" y="14" width="44" height="36" rx="6" fill="url(#g_emi)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <text x="24" y="38" fill="#FDE047" fontSize="22" fontWeight="900">%</text>
          </svg>
        );

      // 25. Fastag
      case 'fastag':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_tag" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16A34A" /><stop offset="100%" stopColor="#14532D" />
              </linearGradient>
            </defs>
            <rect x="8" y="16" width="48" height="32" rx="6" fill="url(#g_tag)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <circle cx="22" cy="32" r="6" fill="#FDE047" />
            <line x1="32" y1="24" x2="48" y2="24" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="32" y1="32" x2="44" y2="32" stroke="#FFFFFF" strokeWidth="3" />
          </svg>
        );

      // 26. Credit Card
      case 'credit_card':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_cc" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" /><stop offset="100%" stopColor="#1E1B4B" />
              </linearGradient>
            </defs>
            <rect x="8" y="14" width="48" height="36" rx="6" fill="url(#g_cc)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="8" y="22" width="48" height="8" fill="#0F172A" />
            <rect x="16" y="34" width="10" height="8" rx="2" fill="#FBBF24" />
            <circle cx="44" cy="38" r="5" fill="#EF4444" opacity="0.85" />
            <circle cx="38" cy="38" r="5" fill="#F59E0B" opacity="0.85" />
          </svg>
        );

      // 27. Municipal Tax
      case 'municipal_tax':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_tax" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D97706" /><stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
            <polygon points="32,10 52,24 12,24" fill="url(#g_tax)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="16" y="26" width="6" height="20" fill="#B45309" />
            <rect x="29" y="26" width="6" height="20" fill="#B45309" />
            <rect x="42" y="26" width="6" height="20" fill="#B45309" />
            <rect x="10" y="46" width="44" height="6" fill="#78350F" />
          </svg>
        );

      // 28. Education Fee
      case 'education':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_edu" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>
            <polygon points="32,12 56,24 32,36 8,24" fill="url(#g_edu)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <path d="M20 31v12c0 4 6 7 12 7s12-3 12-7V31" stroke="#2563EB" strokeWidth="4" fill="none" />
          </svg>
        );

      // 29. IRCTC Rail Booking
      case 'irctc_train':
      case 'train':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_train" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" /><stop offset="100%" stopColor="#991B1B" />
              </linearGradient>
            </defs>
            <path d="M16 10h32v34H16z" fill="url(#g_train)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <path d="M16 10c0-5 7-7 16-7s16 2 16 7v6H16v-6z" fill="#F59E0B" />
            <rect x="22" y="18" width="20" height="12" rx="3" fill="#60A5FA" />
            <circle cx="24" cy="36" r="3.5" fill="#FFFFFF" />
            <circle cx="40" cy="36" r="3.5" fill="#FFFFFF" />
            <path d="M20 48l-6 10M44 48l6 10" stroke="#374151" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      // 30. Flight Ticket
      case 'flight':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_flight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284C7" /><stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>
            <path d="M52 30L34 18L18 6H12L20 22L10 26L5 23L1 24L7 31L12 38L14 34L11 30L20 26L34 42H40L34 30Z" fill="url(#g_flight)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
          </svg>
        );

      // 31. Bus Booking
      case 'bus':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_bus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EA580C" /><stop offset="100%" stopColor="#9A3412" />
              </linearGradient>
            </defs>
            <rect x="14" y="8" width="36" height="42" rx="6" fill="url(#g_bus)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="18" y="14" width="28" height="14" rx="3" fill="#93C5FD" />
            <circle cx="22" cy="40" r="4" fill="#FFFFFF" />
            <circle cx="42" cy="40" r="4" fill="#FFFFFF" />
          </svg>
        );

      // 32. Hotel Booking
      case 'hotel':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_hotel" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9333EA" /><stop offset="100%" stopColor="#581C87" />
              </linearGradient>
            </defs>
            <rect x="14" y="10" width="36" height="46" rx="4" fill="url(#g_hotel)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="20" y="16" width="6" height="8" fill="#FDE047" />
            <rect x="38" y="16" width="6" height="8" fill="#FDE047" />
            <rect x="20" y="30" width="6" height="8" fill="#FDE047" />
            <rect x="38" y="30" width="6" height="8" fill="#FDE047" />
            <rect x="26" y="44" width="12" height="12" fill="#E5E7EB" />
          </svg>
        );

      // 33. Axis CDM Card
      case 'axis_cdm':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_axis" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#991B1B" /><stop offset="100%" stopColor="#450A0A" />
              </linearGradient>
            </defs>
            <rect x="8" y="14" width="48" height="36" rx="6" fill="url(#g_axis)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="8" y="22" width="48" height="8" fill="#18181B" />
            <text x="14" y="42" fill="#FFFFFF" fontSize="11" fontWeight="900">AXIS CDM</text>
          </svg>
        );

      // 34. Mutual Funds
      case 'mutual_fund':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_mf" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16A34A" /><stop offset="100%" stopColor="#14532D" />
              </linearGradient>
            </defs>
            <rect x="10" y="10" width="44" height="44" rx="10" fill="url(#g_mf)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <polyline points="18,40 28,30 36,36 46,20" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="38,20 46,20 46,28" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      // 35. PAN Card (UTI/NSDL)
      case 'pan_card':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_pan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>
            <rect x="8" y="14" width="48" height="36" rx="6" fill="url(#g_pan)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <circle cx="22" cy="30" r="7" fill="#93C5FD" />
            <rect x="34" y="24" width="16" height="4" rx="1.5" fill="#FFFFFF" />
            <rect x="34" y="32" width="16" height="3" rx="1" fill="#93C5FD" />
          </svg>
        );

      // 36. Whitelist Bank Account
      case 'whitelist_account':
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <defs>
              <linearGradient id="g_white" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0D9488" /><stop offset="100%" stopColor="#115E59" />
              </linearGradient>
            </defs>
            <rect x="12" y="10" width="40" height="46" rx="5" fill="url(#g_white)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            <rect x="18" y="18" width="28" height="4" rx="1" fill="#FFFFFF" />
            <rect x="18" y="26" width="20" height="3" rx="1" fill="#99F6E4" />
            <path d="M20 40l5 5 12-12" stroke="#34D399" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      default:
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="26" fill="#3B82F6" />
            <polygon points="32,16 18,38 46,38" fill="#FFFFFF" />
          </svg>
        );
    }
  };

  return (
    <span style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      transition: 'transform 0.2s ease'
    }}>
      {renderGraphic()}
    </span>
  );
}
