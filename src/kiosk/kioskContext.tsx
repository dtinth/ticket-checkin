import { QrCodeReader } from './QrCodeReader'

import { AttendeeTotpState, AttendeeTotpController } from '../attendee-totp'
import { KioskCheckInState, KioskCheckInController } from '../checkin-kiosk'
import { createContext, ReactNode } from 'react'
import React from 'react'

type ProviderProps<X> = {
  children: (data: X) => ReactNode
}

export interface KioskContext {
  TotpProvider: React.ComponentClass<ProviderProps<AttendeeTotpState>>
  KioskCheckInProvider: React.ComponentClass<ProviderProps<KioskCheckInState>>
  QrCodeReader: React.ComponentClass<{ onScan: (code: string) => any }>
}
export const kioskContext = createContext<KioskContext>({
  TotpProvider: AttendeeTotpController,
  KioskCheckInProvider: KioskCheckInController,
  QrCodeReader: QrCodeReader
})
